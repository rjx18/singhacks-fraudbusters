import Markdown from "react-markdown";

export type MessageProps = {
  role: "user" | "assistant";
  text: string;
};

const Message = ({ role, text }: MessageProps) => {
  switch (role) {
    case "user":
      return <UserMessage text={text} />;
    case "assistant":
      return <AssistantMessage text={text} />;
    default:
      return null;
  }
};

export const UserMessage = ({ text }: { text: string }) => {
  return <div className="bg-neutral-700 text-white p-3 rounded-xl rounded-br-sm ml-8">{text}</div>;
};

export const AssistantMessage = ({ text }: { text: string }) => {
  console.log(text)
  return (
    <div className="bg-blue-900 text-white px-4 pt-0 rounded-xl rounded-bl-sm mr-8 sm:mr-4 markdown-output">
      <Markdown>{text}</Markdown>
    </div>
  );
};

export default Message