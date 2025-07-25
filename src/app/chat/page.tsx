import { ChatInterface } from "./chat-interface";

export default function ChatPage() {
  return (
    <div className="flex h-[calc(100vh-60px)] flex-col">
      <ChatInterface />
    </div>
  );
}
