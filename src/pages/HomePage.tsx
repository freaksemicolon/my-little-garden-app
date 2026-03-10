import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, X } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { usePlants, getWateringStatusFromPlant } from "@/hooks/usePlants";
import { supabase } from "@/integrations/supabase/client";
import logoMyLittleGarden from "@/assets/logo-mylittlegarden-black.png";
import iconBellActive from "@/assets/icon-bell-active.png";
import iconTree from "@/assets/icon-tree.png";
import iconSearch3d from "@/assets/icon-search-3d.png";
import iconCamera3d from "@/assets/icon-camera-3d.png";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { data: plants = [], isLoading } = usePlants();
  const displayName = profile?.nickname || "사용자";
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [proactiveMessages, setProactiveMessages] = useState<any[]>([]);
  const touchStartX = useRef(0);

  const hasPlants = plants.length > 0;

  useEffect(() => {
    if (!user) return;
    const loadNotifications = async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("content, created_at, session_id, message_type")
        .eq("user_id", user.id)
        .eq("role", "plant")
        .neq("message_type", "text")
        .order("created_at", { ascending: false })
        .limit(10);
      if (data) setProactiveMessages(data);
    };
    loadNotifications();
  }, [user]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentSlide < plants.length - 1) setCurrentSlide(currentSlide + 1);
      else if (diff < 0 && currentSlide > 0) setCurrentSlide(currentSlide - 1);
    }
  };

  const plant = hasPlants ? plants[currentSlide] : null;
  const daysTogether = plant?.adoption_date
    ? Math.floor((Date.now() - new Date(plant.adoption_date).getTime()) / 86400000)
    : 0;

  const unreadCount = proactiveMessages.length;

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`;
    return `${Math.floor(diff / 86400000)}일 전`;
  };

  const getTypeEmoji = (type: string) => {
    if (type === "watering_reminder") return "💧";
    if (type === "miss_you") return "💚";
    if (type === "morning_greeting") return "🌅";
    return "🌱";
  };

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-white pb-[90px]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-2">
        <img src={logoMyLittleGarden} alt="MyLittleGarden" className="h-[24px] object-contain" />
        <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 relative">
          <img src={iconBellActive} alt="알림" className="w-[24px] h-[24px] object-contain" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-[16px] h-[16px] rounded-full bg-destructive text-[10px] text-destructive-foreground flex items-center justify-center font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="mx-5 mb-4 bg-card rounded-[16px] shadow-card p-4 relative z-10 max-h-[300px] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[16px] font-bold text-foreground">식물 알림</h3>
            <button onClick={() => setShowNotifications(false)}>
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>
          {proactiveMessages.length === 0 ? (
            <p className="text-[13px] text-muted-foreground py-4 text-center">알림이 없습니다</p>
          ) : (
            <div className="flex flex-col gap-2">
              {proactiveMessages.map((msg, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-2 rounded-[10px] bg-muted/50 cursor-pointer hover:bg-muted"
                  onClick={() => setShowNotifications(false)}
                >
                  <span className="text-[18px] mt-0.5">{getTypeEmoji(msg.message_type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-foreground line-clamp-2">{msg.content}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{formatTime(msg.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex-1 px-5 overflow-y-auto">
        {/* Greeting */}
        <div className="flex items-center gap-2 mt-2">
          <img src={iconTree} alt="tree" className="w-[32px] h-[32px] object-contain" />
          <h2 className="text-[20px] font-bold text-primary">
            {`안녕하세요, ${displayName} 님!`}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">불러오는 중...</p>
          </div>
        ) : hasPlants ? (
          <>
            <p className="text-[14px] text-muted-foreground mt-1 leading-relaxed">
              {`오늘도 싱그러운 초록빛 식물들과 함께하며`}
              {"\n"}
              {`교감하는 ${displayName}님만의 소중한 시간을 응원할게요.`}
            </p>

            {/* Plant Card Carousel */}
            <div
              className="mt-5 bg-[hsl(80,30%,92%)] rounded-[20px] p-5 min-h-[320px]"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {plant && (
                <>
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="text-[24px] font-bold text-foreground">{plant.nickname}</h3>
                    <span className="text-[14px] text-muted-foreground">{plant.species}</span>
                  </div>
                  <p className="text-[13px] text-muted-foreground mb-4">
                    {plant.adoption_date ? `${daysTogether}일째 함께하는 중` : "함께하는 중"}
                  </p>

                  <div className="flex flex-col gap-2">
                    <div className="bg-card/80 rounded-[12px] px-4 py-3 flex items-center gap-2">
                      <span className="text-[18px]">📋</span>
                      <span className="text-[14px] text-foreground">{plant.watering_cycle}{plant.watering_unit} 주기로 물주기</span>
                    </div>
                    <div className="bg-card/80 rounded-[12px] px-4 py-3 flex items-center gap-2">
                      <span className="text-[18px]">💧</span>
                      <span className="text-[14px] text-foreground">
                        {(() => {
                          const ws = getWateringStatusFromPlant(plant);
                          return `물주기 상태: ${ws.status}`;
                        })()}
                      </span>
                    </div>
                    {plant.memo && (
                      <div className="bg-card/80 rounded-[12px] px-4 py-3 flex items-center gap-2">
                        <span className="text-[18px]">📝</span>
                        <span className="text-[14px] text-foreground">{plant.memo}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => navigate(`/plant/${plant.id}`)}
                      className="flex-1 h-[44px] rounded-[12px] border border-border bg-card text-[14px] font-medium text-foreground"
                    >
                      프로필 보기
                    </button>
                    <button
                      onClick={() => navigate(`/chat/${plant.id}`)}
                      className="flex-1 h-[44px] rounded-[12px] bg-primary text-primary-foreground text-[14px] font-medium"
                    >
                      채팅하기
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Dot Indicators */}
            {plants.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-3">
                {plants.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`rounded-full transition-all ${
                      i === currentSlide ? "w-[16px] h-[6px] bg-foreground" : "w-[6px] h-[6px] bg-muted-foreground/40"
                    }`}
                  />
                ))}
              </div>
            )}

            <div className="flex justify-center mt-4">
              <button
                onClick={() => navigate("/my-plants")}
                className="px-8 py-3 rounded-full border border-border bg-card text-[14px] font-medium text-foreground shadow-card"
              >
                나의 식물
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-[14px] text-muted-foreground mt-2 text-center leading-relaxed">
              {`아직 등록된 식물이 없어요!`}
              {"\n"}
              {`식물을 등록하고, 나만의 정원을 가꿔보세요.`}
            </p>

            <div className="flex flex-col gap-4 mt-8">
              <button
                onClick={() => navigate("/plant-recommendation")}
                className="bg-card rounded-[20px] shadow-card py-10 flex flex-col items-center gap-3"
              >
                <img src={iconSearch3d} alt="식물 추천" className="w-[64px] h-[64px] object-contain" />
                <span className="text-[16px] font-bold text-foreground">
                  {`나에게 맞는 식물`}{"\n"}{`추천받기`}
                </span>
              </button>
              <button
                onClick={() => navigate("/plant-register")}
                className="bg-card rounded-[20px] shadow-card py-10 flex flex-col items-center gap-3"
              >
                <img src={iconCamera3d} alt="식물 등록" className="w-[64px] h-[64px] object-contain" />
                <span className="text-[16px] font-bold text-foreground">
                  {`이미 키우는 식물`}{"\n"}{`등록하기`}
                </span>
              </button>
            </div>
          </>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default HomePage;
