import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bell } from "lucide-react";
import { defaultNotificationSettings, type NotificationSetting } from "@/data/mockData";
import BottomNavigation from "@/components/BottomNavigation";

const settingsMeta: Record<string, { emoji: string; group?: string; extra?: string }> = {
  push: { emoji: "🔔" },
  sound: { emoji: "📢", group: "detail" },
  vibrate: { emoji: "😰", group: "detail" },
  dnd: { emoji: "⛔", group: "detail", extra: "22:00 ~ 8:00" },
  marketing: { emoji: "" },
};

const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className={`w-[48px] h-[28px] rounded-full transition-colors relative flex-shrink-0 ${
      enabled ? "bg-primary" : "bg-border"
    }`}
  >
    <div
      className={`w-[24px] h-[24px] rounded-full bg-card shadow-sm absolute top-[2px] transition-transform ${
        enabled ? "translate-x-[22px]" : "translate-x-[2px]"
      }`}
    />
  </button>
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

  const getSetting = (key: string) => settings.find((s) => s.key === key)!;
  const pushSetting = getSetting("push");
  const detailSettings = settings.filter((s) => settingsMeta[s.key]?.group === "detail");
  const marketingSetting = getSetting("marketing");

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background pb-[90px]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-2">
        <h1 className="text-[20px] font-bold text-primary tracking-tight">MyLittleGarden</h1>
        <button className="p-2">
          <Bell size={22} className="text-foreground" />
        </button>
      </div>

      <div className="flex items-center px-4 h-[48px]">
        <button onClick={() => navigate(-1)} className="p-2">
          <ChevronLeft size={22} className="text-foreground" />
        </button>
        <h2 className="text-[17px] font-bold text-foreground flex-1 text-center mr-8">알림 설정</h2>
      </div>

      <div className="px-5 pt-4 flex-1 overflow-y-auto">
        {/* 푸시 알림 */}
        <div className="bg-card rounded-[16px] shadow-card px-4 py-4 flex items-center gap-3">
          <span className="text-[28px]">🔔</span>
          <span className="text-[16px] font-medium text-foreground flex-1">{pushSetting.label}</span>
          <Toggle enabled={pushSetting.enabled} onToggle={() => toggleSetting("push")} />
        </div>

        {/* 소리 / 진동 / 방해 금지 */}
        <div className="bg-card rounded-[16px] shadow-card mt-3 overflow-hidden">
          {detailSettings.map((s, i) => {
            const meta = settingsMeta[s.key];
            return (
              <div key={s.key} className={`px-4 py-4 flex items-center gap-3 ${i < detailSettings.length - 1 ? "border-b border-border" : ""}`}>
                <span className="text-[28px]">{meta.emoji}</span>
                <span className="text-[16px] font-medium text-foreground flex-1">{s.label.replace(" (22:00 ~ 8:00)", "")}</span>
                {meta.extra ? (
                  <span className="text-[13px] text-muted-foreground mr-1">{meta.extra}</span>
                ) : (
                  <Toggle enabled={s.enabled} onToggle={() => toggleSetting(s.key)} />
                )}
              </div>
            );
          })}
        </div>

        {/* 마케팅 */}
        <div className="bg-card rounded-[16px] shadow-card mt-3 px-4 py-4 flex items-center gap-3">
          <span className="text-[16px] font-medium text-foreground flex-1">{marketingSetting.label}</span>
          <Toggle enabled={marketingSetting.enabled} onToggle={() => toggleSetting("marketing")} />
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default NotificationSettings;
