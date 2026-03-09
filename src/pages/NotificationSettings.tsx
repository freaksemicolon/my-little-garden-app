import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bell } from "lucide-react";
import { defaultNotificationSettings, type NotificationSetting } from "@/data/mockData";
import BottomNavigation from "@/components/BottomNavigation";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { toast } from "sonner";

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
  const { isSupported, isSubscribed, permission, subscribe, unsubscribe } = usePushNotifications();
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

  const handlePushToggle = async () => {
    if (isSubscribed) {
      const ok = await unsubscribe();
      if (ok) toast.success("푸시 알림이 해제되었습니다");
    } else {
      const ok = await subscribe();
      if (ok) {
        toast.success("푸시 알림이 활성화되었습니다! 🌱");
      } else if (permission === "denied") {
        toast.error("브라우저 설정에서 알림 권한을 허용해주세요");
      } else {
        toast.error("푸시 알림 설정에 실패했습니다");
      }
    }
  };

  const getSetting = (key: string) => settings.find((s) => s.key === key)!;
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
        {/* 식물 푸시 알림 (Web Push) */}
        <div className="bg-card rounded-[16px] shadow-card px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="text-[28px]">🌱</span>
            <div className="flex-1">
              <span className="text-[16px] font-medium text-foreground">식물 알림 (푸시)</span>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                {isSubscribed
                  ? "식물이 보내는 메시지를 푸시 알림으로 받습니다"
                  : "활성화하면 식물이 먼저 말을 걸어요!"}
              </p>
            </div>
            <Toggle enabled={isSubscribed} onToggle={handlePushToggle} />
          </div>
          {!isSupported && (
            <p className="text-[11px] text-destructive mt-2 ml-[40px]">
              이 브라우저는 푸시 알림을 지원하지 않습니다
            </p>
          )}
          {permission === "denied" && (
            <p className="text-[11px] text-destructive mt-2 ml-[40px]">
              브라우저 설정에서 알림 권한을 허용해주세요
            </p>
          )}
        </div>

        {/* 앱 알림 설정 */}
        <p className="text-[13px] text-muted-foreground mt-4 mb-2 px-1">앱 내 알림</p>

        {/* 소리 / 진동 / 방해 금지 */}
        <div className="bg-card rounded-[16px] shadow-card overflow-hidden">
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
