'use'

import { ENGAGE_NODE_INFO } from '@/app/info/nodes'
import { classNames, generateYamlFromReactNode, safeAccess } from '@/app/utils'
import { Button } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { InfoContentProps } from './types'
import styles from './index.module.css'
import Link from 'next/link'
import Message, { MessageProps } from '../message-item'
import { AssistantStream } from "openai/lib/AssistantStream";
import Markdown from "react-markdown";
// @ts-expect-error - no types for this yet
import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import { handleReadableStream, sendMessage, submitActionResult } from './handlers'

export const InfoContent = ({title, description, children}: InfoContentProps) => {

  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([] as MessageProps[]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false)
  const [threadId, setThreadId] = useState("");
  const [firstLaunch, setFirstLaunch] = useState(true)

  
  // automatically scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    if (firstLaunch) {
      setFirstLaunch(false)
    } else {
      scrollToBottom();
    }
  }, [messages]);

  // create a new threadID when chat component created
  useEffect(() => {
    const createThread = async () => {
      const res = await fetch(`/api/assistants/threads`, {
        method: "POST",
      });
      const data = await res.json();
      // const data = await openai.beta.threads.create()
      setThreadId(data.threadId);
    };
    
    createThread();
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    doSubmit();
  };

  const doSubmit = () => {
    if (!userInput.trim()) return;

    const inputAndContext = `
    ###########################################
    CONTEXT:
    Current system name: ${title}
    Current system description: ${description}
    Current system context:
    ${generateYamlFromReactNode(children)}

    ###########################################
    ACTION:
    ${userInput}
    `

    sendMessage(threadId, inputAndContext).then((stream) => {
      handleReadableStream(stream, inputStreamHandlers)
    });
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: userInput },
    ]);
    setUserInput("");
    setInputDisabled(true);
    scrollToBottom();
  }

  /*************************/
  /* Stream Event Handlers */
  /*************************/

  // textCreated - create new assistant message
  const handleTextCreated = () => {
    appendMessage("assistant", "");
  };

  // textDelta - append text to last assistant message
  const handleTextDelta = (delta: any) => {
    if (delta.value != null) {
      appendToLastMessage(delta.value);
    };
    if (delta.annotations != null) {
      annotateLastMessage(delta.annotations);
    }
  };

  // imageFileDone - show image in chat
  const handleImageFileDone = (image: any) => {
    appendToLastMessage(`\n![${image.file_id}](/api/files/${image.file_id})\n`);
  }

  // handleRequiresAction - handle function call

  // handleRunCompleted - re-enable the input form
  const handleRunCompleted = () => {
    setInputDisabled(false);
  };

  const inputStreamHandlers = {
    handleTextCreated,
    handleTextDelta,
    handleImageFileDone,
    handleRunCompleted
  }

  /*
    =======================
    === Utility Helpers ===
    =======================
  */

  const appendToLastMessage = (text: string) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
        text: lastMessage.text + text,
      };
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  const appendMessage = (role: any, text: any) => {
    setMessages((prevMessages) => [...prevMessages, { role, text }]);
  };

  const submitOnEnter = (e: any) => {
    if (e.key === "Enter" && e.shiftKey == false) {
      e.preventDefault()
      return doSubmit();
    }
  }

  const annotateLastMessage = (annotations: any) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
      };
      annotations.forEach((annotation: any) => {
        if (annotation.type === 'file_path') {
          updatedLastMessage.text = updatedLastMessage.text.replaceAll(
            annotation.text,
            `/api/files/${annotation.file_path.file_id}`
          );
        }
      })
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  }

  return <>
    <div className="w-full space-y-4 px-4 py-4 mb-20">
      <div>
        <h3 className="text-2xl font-bold text-white">
          {title}
        </h3>
      </div>
      <div className='space-y-6'>
        <div className="space-y-1">
          <h6 className="text-sm font-bold">
            Description
          </h6>
          <p>
            {description}
          </p>
        </div>
        {
          children
        }
        <div className={`${styles.messages} w-full flex items-center`}>
          <div className="w-full max-w-[700px] px-2 flex flex-col space-y-2 sm:space-y-4 justify-end">
            {messages.map((msg, index) => (
              <Message key={index} role={msg.role} text={msg.text} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
    <form
      onSubmit={handleSubmit}
      className={`absolute bottom-[0%] flex w-full max-w-full px-4 pb-4 pt-8 bg-gradient-to-t from-neutral-900 to-transparent`}
    >
      <textarea
        className={`${styles.textarea} grow px-2 py-3 mr-4 rounded-lg shadow-md`}
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Ask me something..."
        onKeyDown={submitOnEnter}
      />
      <div className="h-full flex items-end justify-end">
        <button
          type="submit"
          className="p-3 bg-neutral-600 hover:bg-neutral-700 h-12 rounded-full text-white"
          disabled={inputDisabled}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    </form>
  </>
}

export default InfoContent