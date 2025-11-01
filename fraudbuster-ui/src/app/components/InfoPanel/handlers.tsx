import { AssistantStream } from "openai/lib/AssistantStream";
import { AssistantStreamEvent } from "openai/resources/beta/assistants";

export const submitActionResult = async (threadId: any, runId: any, toolCallOutputs: any) => {
  const response = await fetch(
    `/api/assistants/threads/${threadId}/actions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        runId: runId,
        toolCallOutputs: toolCallOutputs,
      }),
    }
  );
  const stream = AssistantStream.fromReadableStream(response!.body!);
  return stream
};

export interface InputStreamHandlers {
  handleTextCreated: () => void
  handleTextDelta: (delta: any) => void
  handleImageFileDone: (image: any) => void
  handleRunCompleted: () => void
}

export const handleReadableStream = (stream: any, inputStreamHandlers: InputStreamHandlers) => {
  // messages
  stream.on("textCreated", inputStreamHandlers.handleTextCreated);
  stream.on("textDelta", inputStreamHandlers.handleTextDelta);

  // image
  stream.on("imageFileDone", inputStreamHandlers.handleImageFileDone);

  // code interpreter
  // stream.on("toolCallCreated", toolCallCreated);
  // stream.on("toolCallDelta", toolCallDelta);

  // events without helpers yet (e.g. requires_action and run.done)
  stream.on("event", (event: any) => {
    if (event.event === "thread.run.completed") inputStreamHandlers.handleRunCompleted();
  });
};

export const sendMessage = async (threadId: any, text: any) => {
  const response = await fetch(
    `/api/assistants/threads/${threadId}/messages`,
    {
      method: "POST",
      body: JSON.stringify({
        role: "user",
        content: text,
      }),
    }
  );

  const stream = AssistantStream.fromReadableStream(response!.body!);
  return stream
};
