import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ArrowUp, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePlant } from "@/hooks/usePlants";
import { useChat } from "@/hooks/useChat";
import plant3dSucculent from "@/assets/plant-3d-succulent.png";

const Chat = () => {
  const navigate = useNavigate();
  const { plantId } = useParams();
  const { user } = useAuth();
  const { data: plant } = usePlant(plantId);
  const { messages, isLoading, sendMessage, loadHistory, bondLevel } = useChat(plantId);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded && user && plantId) {
      loadHistory().then(() => setLoaded(true));
    }
  }, [user, plantId, loaded, loadHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };

  const plantImage = plant?.image_url || plant3dSucculent;
  const plantName = plant?.nickname || "식물";

  if (!user) {
    return (
      <div className="mobile-container flex flex-col min-h-screen bg-background items-center justify-center">
        <p className="text-muted-foreground mb-4">로그인이 필요합니다</p>
        <button onClick={() => navigate("/login")} className="text-primary font-semibold">
          로그인하기
        </button>
      </div>
    );
  }

  if (!plantId) {
    return (
      <div className="mobile-container flex flex-col min-h-screen bg-background items-center justify-center">
        <p className="text-muted-foreground mb-4">식물을 먼저 등록해주세요</p>
        <button onClick={() => navigate("/plant-register")} className="text-primary font-semibold">
          식물 등록하기
        </button>
      </div>
    );
  }

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-center h-[56px] px-4 border-b border-border relative">
        <button onClick={() => navigate(-1)} className="absolute left-4 p-2">
          <ChevronLeft size={24} className="text-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[17px] font-semibold text-foreground">{plantName}</span>
          <img src={plantImage} alt="plant" className="w-[28px] h-[28px] object-contain" />
        </div>
        <div className="absolute right-4">
          <span className="text-[11px] text-muted-foreground">💚 {Math.round(bondLevel * 100)}%</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <span className="text-[48px]">🌱</span>
            <p className="text-muted-foreground text-[14px]">
              {plantName}에게 말을 걸어보세요!
            </p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isPlant = msg.role === "plant";

          return (
            <div key={i} className={`flex ${isPlant ? "justify-start" : "justify-end"} mb-4`}>
              <div className="max-w-[75%]">
                {isPlant && (
                  <div className="flex items-center gap-2 mb-1">
                    <img src={plantImage} alt="plant" className="w-[36px] h-[36px] object-contain" />
                    <span className="text-[14px] font-semibold text-foreground">{plantName}</span>
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

        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="max-w-[75%]">
              <div className="flex items-center gap-2 mb-1">
                <img src={plantImage} alt="plant" className="w-[36px] h-[36px] object-contain" />
                <span className="text-[14px] font-semibold text-foreground">{plantName}</span>
              </div>
              <div className="chat-bubble-plant rounded-[16px] rounded-tl-[4px] ml-[44px] px-6 py-4 flex items-center gap-2">
                <Loader2 size={18} className="text-primary animate-spin" />
                <p className="text-[13px] text-muted-foreground">생각하는 중...</p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
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
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-[32px] h-[32px] rounded-full bg-primary flex items-center justify-center disabled:opacity-50"
          >
            <ArrowUp size={16} className="text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
