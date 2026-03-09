import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { defaultNotificationSettings, type NotificationSetting } from "@/data/mockData";

const ToggleItem = ({
  setting,
  onToggle,
}: {
  setting: NotificationSetting;
  onToggle: () => void;
}) => (
  <div className="flex items-center justify-between py-4 border-b border-border">
    <span className="text-[14px] font-medium text-foreground">{setting.label}</span>
    <button
      onClick={onToggle}
      className={`w-[48px] h-[28px] rounded-full transition-colors relative ${
        setting.enabled ? "bg-primary" : "bg-border"
      }`}
    >
      <div
        className={`w-[24px] h-[24px] rounded-full bg-card shadow-sm absolute top-[2px] transition-transform ${
          setting.enabled ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  </div>
);

const NotificationSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<NotificationSetting[]>(() => {
    const saved = localStorage.getItem("notificationSettings");
    return saved ? JSON.parse(saved) : defaultNotificationSettings;
  });

  useEffect(() => {
    localStorage.setItem("notificationSettings", JSON.stringify(settings));
  }, [settings]);

  const toggleSetting = (key: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background">
      <div className="flex items-center h-[56px] px-4">
        <button onClick={() => navigate(-1)} className="p-2">
          <ChevronLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-[17px] font-semibold text-foreground ml-2">알림 설정</h1>
      </div>

      <div className="px-5 pt-2">
        {settings.map((setting) => (
          <ToggleItem
            key={setting.key}
            setting={setting}
            onToggle={() => toggleSetting(setting.key)}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationSettings;
