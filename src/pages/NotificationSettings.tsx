import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface ToggleItemProps {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}

const ToggleItem = ({ label, enabled, onToggle }: ToggleItemProps) => (
  <div className="flex items-center justify-between py-4 border-b border-border">
    <span className="text-[14px] font-medium text-foreground">{label}</span>
    <button
      onClick={onToggle}
      className={`w-[48px] h-[28px] rounded-full transition-colors relative ${
        enabled ? "bg-primary" : "bg-border"
      }`}
    >
      <div
        className={`w-[24px] h-[24px] rounded-full bg-card shadow-sm absolute top-[2px] transition-transform ${
          enabled ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  </div>
);

const NotificationSettings = () => {
  const navigate = useNavigate();
  const [watering, setWatering] = useState(true);
  const [aiChat, setAiChat] = useState(true);
  const [service, setService] = useState(false);

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background">
      <div className="flex items-center h-[56px] px-4">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-[17px] font-semibold text-foreground ml-2">알림 설정</h1>
      </div>

      <div className="px-5 pt-2">
        <ToggleItem label="물주기 알림" enabled={watering} onToggle={() => setWatering(!watering)} />
        <ToggleItem label="AI 상담 알림" enabled={aiChat} onToggle={() => setAiChat(!aiChat)} />
        <ToggleItem label="서비스 알림" enabled={service} onToggle={() => setService(!service)} />
      </div>
    </div>
  );
};

export default NotificationSettings;
