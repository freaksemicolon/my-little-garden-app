import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, FileText, ArrowUp } from "lucide-react";
import plantSucculent from "@/assets/plant-succulent.png";

interface Message {
  role: "plant" | "user";
  content: string;
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    role: "plant",
    content: "나연 님 저 너무 시들시들해진 것 같아요...ㅠㅠ",
    timestamp: "03:53 PM",
  },
];

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const time = `${String(hours % 12 || 12).padStart(2, "0")}:${minutes} ${ampm}`;

    const userMsg: Message = { role: "user", content: input, timestamp: time };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate plant response
    setTimeout(() => {
      const plantMsg: Message = {
        role: "plant",
        content: "그럼 꼭 돌아와서 저에게 물 주는 거 잊지마세요!",
        timestamp: time,
      };
      setMessages((prev) => [...prev, plantMsg]);
    }, 1000);
  };

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-center h-[56px] px-4 border-b border-border relative">
        <button onClick={() => navigate(-1)} className="absolute left-4 p-2">
          <ChevronLeft size={24} className="text-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[17px] font-semibold text-foreground">몬몬이</span>
          <img src={plantSucculent} alt="plant" className="w-[28px] h-[28px] object-contain" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {messages.map((msg, i) => {
          const isPlant = msg.role === "plant";
          return (
            <div key={i} className={`flex ${isPlant ? "justify-start" : "justify-end"} mb-4`}>
              <div className={`max-w-[75%]`}>
                {isPlant && (
                  <div className="flex items-center gap-2 mb-1">
                    <img src={plantSucculent} alt="plant" className="w-[36px] h-[36px] object-contain" />
                    <span className="text-[14px] font-semibold text-foreground">몬몬이</span>
                  </div>
                )}
                <div
                  className={`px-4 py-3 rounded-[16px] ${
                    isPlant
                      ? "chat-bubble-plant rounded-tl-[4px] ml-[44px]"
                      : "chat-bubble-user rounded-tr-[4px]"
                  }`}
                >
                  <p className="text-[14px] leading-[1.5] text-foreground">{msg.content}</p>
                </div>
                <p className={`text-[11px] text-muted-foreground mt-1 ${isPlant ? "ml-[44px]" : "text-right"}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input bar */}
      <div className="px-4 pb-8 pt-2">
        <div className="flex items-center gap-2 bg-card rounded-full border border-border px-4 h-[48px]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="메세지를 입력해주세요."
            className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button className="p-1">
            <FileText size={20} className="text-primary" />
          </button>
          <button
            onClick={handleSend}
            className="w-[32px] h-[32px] rounded-full bg-primary flex items-center justify-center"
          >
            <ArrowUp size={16} className="text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
