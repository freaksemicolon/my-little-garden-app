import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, FileText, ArrowUp, Image, Loader2 } from "lucide-react";
import { plantsData, type ChatMessage } from "@/data/mockData";
import plantSucculent from "@/assets/plant-succulent.png";

const Chat = () => {
  const navigate = useNavigate();
  const { plantId } = useParams();
  const plant = plantsData.find((p) => p.id === plantId) || plantsData[0];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "plant",
      content: "나연 님 저 너무 시들시들해진 것 같아요...ㅠㅠ",
      timestamp: "03:53 PM",
      type: "text",
    },
  ]);
  const [input, setInput] = useState("");
  const [showImageGrid, setShowImageGrid] = useState(false);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getTime = () => {
    const now = new Date();
    const h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    return `${String(h % 12 || 12).padStart(2, "0")}:${m} ${ampm}`;
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const time = getTime();
    const userMsg: ChatMessage = { role: "user", content: input, timestamp: time, type: "text" };
    setMessages((prev) => [...prev, userMsg]);
    const userText = input;
    setInput("");

    // Simulate plant response
    setTimeout(() => {
      if (userText.includes("진단")) {
        setMessages((prev) => [
          ...prev,
          {
            role: "plant",
            content: "사진을 보내주시면 진단해드릴게요! 📸",
            timestamp: getTime(),
            type: "text",
          },
        ]);
        setShowImageGrid(true);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "plant",
            content: "그럼 꼭 돌아와서 저에게 물 주는 거 잊지마세요!",
            timestamp: getTime(),
            type: "text",
          },
        ]);
      }
    }, 1000);
  };

  const handleSelectImage = () => {
    setShowImageGrid(false);
    const time = getTime();

    // Add user image message
    setMessages((prev) => [
      ...prev,
      { role: "user", content: "📷 사진을 보냈습니다", timestamp: time, type: "text" },
    ]);

    // Diagnosis loading
    setIsDiagnosing(true);
    setMessages((prev) => [
      ...prev,
      { role: "plant", content: "진단중입니다.", timestamp: time, type: "diagnosis-loading" },
    ]);

    // Diagnosis result after 2 seconds
    setTimeout(() => {
      setIsDiagnosing(false);
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.type !== "diagnosis-loading");
        return [
          ...filtered,
          {
            role: "plant",
            content: "",
            timestamp: getTime(),
            type: "diagnosis-result",
            diagnosisResult: {
              cause: "뿌리까지 물이 닿지 못한 상태예요.\n저면관수 후 흙이 다시 말라서 그런 것 같아요.",
              solution: "2시간 정도 물에 담궈두면 회복 가능해요!",
            },
          },
        ];
      });
    }, 2500);
  };

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-center h-[56px] px-4 border-b border-border relative">
        <button onClick={() => navigate(-1)} className="absolute left-4 p-2">
          <ChevronLeft size={24} className="text-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[17px] font-semibold text-foreground">{plant.nickname}</span>
          <img src={plant.image} alt="plant" className="w-[28px] h-[28px] object-contain" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {messages.map((msg, i) => {
          const isPlant = msg.role === "plant";

          if (msg.type === "diagnosis-loading") {
            return (
              <div key={i} className="flex justify-start mb-4">
                <div className="max-w-[75%]">
                  <div className="flex items-center gap-2 mb-1">
                    <img src={plant.image} alt="plant" className="w-[36px] h-[36px] object-contain" />
                    <span className="text-[14px] font-semibold text-foreground">{plant.nickname}</span>
                  </div>
                  <div className="chat-bubble-plant rounded-[16px] rounded-tl-[4px] ml-[44px] px-6 py-4 flex flex-col items-center gap-2">
                    <Loader2 size={24} className="text-primary animate-spin" />
                    <p className="text-[13px] text-muted-foreground">진단중입니다.</p>
                  </div>
                </div>
              </div>
            );
          }

          if (msg.type === "diagnosis-result" && msg.diagnosisResult) {
            return (
              <div key={i} className="flex justify-start mb-4">
                <div className="max-w-[85%]">
                  <div className="flex items-center gap-2 mb-1">
                    <img src={plant.image} alt="plant" className="w-[36px] h-[36px] object-contain" />
                    <span className="text-[14px] font-semibold text-foreground">{plant.nickname}</span>
                  </div>
                  <div className="chat-bubble-plant rounded-[16px] rounded-tl-[4px] ml-[44px] px-4 py-3">
                    <p className="text-[14px] font-semibold text-foreground mb-1">진단 결과 📋</p>
                    <p className="text-[13px] text-foreground whitespace-pre-line">{msg.diagnosisResult.cause}</p>
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-[13px] text-primary font-medium">{msg.diagnosisResult.solution}</p>
                    </div>
                    <button
                      onClick={() => navigate("/diagnosis-history")}
                      className="mt-2 text-[12px] text-primary font-semibold"
                    >
                      상세 진단서 보기 &gt;&gt;
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 ml-[44px]">{msg.timestamp}</p>
                </div>
              </div>
            );
          }

          return (
            <div key={i} className={`flex ${isPlant ? "justify-start" : "justify-end"} mb-4`}>
              <div className="max-w-[75%]">
                {isPlant && (
                  <div className="flex items-center gap-2 mb-1">
                    <img src={plant.image} alt="plant" className="w-[36px] h-[36px] object-contain" />
                    <span className="text-[14px] font-semibold text-foreground">{plant.nickname}</span>
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
        <div ref={messagesEndRef} />
      </div>

      {/* Image grid */}
      {showImageGrid && (
        <div className="px-2 pb-2">
          <div className="grid grid-cols-4 gap-1 rounded-[12px] overflow-hidden">
            {/* Camera button */}
            <button
              onClick={handleSelectImage}
              className="aspect-square bg-muted flex items-center justify-center"
            >
              <Image size={24} className="text-muted-foreground" />
            </button>
            {Array.from({ length: 11 }).map((_, i) => (
              <button
                key={i}
                onClick={handleSelectImage}
                className="aspect-square bg-accent"
              >
                <img
                  src={plantSucculent}
                  alt="photo"
                  className="w-full h-full object-cover opacity-60"
                />
              </button>
            ))}
          </div>
          <div className="flex justify-end mt-1">
            <button onClick={handleSelectImage} className="text-[13px] text-primary font-semibold">
              Select
            </button>
          </div>
        </div>
      )}

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
          <button onClick={() => setShowImageGrid(!showImageGrid)} className="p-1">
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
