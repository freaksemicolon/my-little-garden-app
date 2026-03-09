import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, ImagePlus } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";

interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: string;
  image?: string;
}

const initialMessages: Message[] = [
  {
    role: "ai",
    content: "안녕하세요! 식물 상담사입니다 🌱\n무엇이든 물어보세요.",
    timestamp: "오전 10:00",
  },
];

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const now = new Date();
    const time = `${now.getHours() < 12 ? "오전" : "오후"} ${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, "0")}`;

    const userMsg: Message = { role: "user", content: input, timestamp: time };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        role: "ai",
        content: "식물 상태를 확인해볼게요. 잎이 노란색으로 변한다면 과습일 수 있어요. 물주기를 조절해보세요! 🌿",
        timestamp: time,
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center h-[56px] px-4 border-b border-border">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-[17px] font-semibold text-foreground ml-2">AI 식물 상담</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {messages.map((msg, i) => (
          <ChatMessage key={i} {...msg} />
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-6 pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          <button className="w-[40px] h-[40px] rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <ImagePlus size={18} className="text-muted-foreground" />
          </button>
          <div className="flex-1 flex items-center bg-muted rounded-[20px] px-4 h-[44px]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="메시지를 입력하세요"
              className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
          <button
            onClick={handleSend}
            className="w-[40px] h-[40px] rounded-full bg-primary flex items-center justify-center flex-shrink-0"
          >
            <Send size={16} className="text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
