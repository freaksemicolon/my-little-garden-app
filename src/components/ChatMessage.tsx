interface ChatMessageProps {
  role: "user" | "ai";
  content: string;
  timestamp: string;
  image?: string;
}

const ChatMessage = ({ role, content, timestamp, image }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`max-w-[75%] ${isUser ? "order-1" : "order-1"}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <span className="text-[10px] text-primary-foreground font-bold">AI</span>
            </div>
            <span className="text-[11px] text-muted-foreground">식물 상담사</span>
          </div>
        )}
        {image && (
          <div className={`rounded-[12px] overflow-hidden mb-1 ${isUser ? "ml-auto" : ""}`}>
            <img src={image} alt="uploaded" className="w-full max-w-[200px] rounded-[12px]" />
          </div>
        )}
        <div
          className={`px-3 py-2.5 rounded-[16px] ${
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-[4px]"
              : "bg-secondary text-foreground rounded-tl-[4px]"
          }`}
        >
          <p className="text-[13px] leading-[1.5]">{content}</p>
        </div>
        <p className={`text-[10px] text-muted-foreground mt-1 ${isUser ? "text-right" : "text-left"}`}>
          {timestamp}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
