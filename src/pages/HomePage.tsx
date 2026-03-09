import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, X } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { currentUser, plantsData } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

const notifications = [
  { id: 1, type: "메세지 1건", text: "몬몬이 : 이제 물을 줄 시간이에요!", time: "11:54 AM", unread: true },
  { id: 2, type: "물주기💧", text: "아빠 님이 몬몬이에게 물을 주었어요!", time: "2:33 PM", unread: true },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const displayName = profile?.nickname || currentUser.name;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const touchStartX = useRef(0);

  const hasPlants = plantsData.length > 0;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentSlide < plantsData.length - 1) setCurrentSlide(currentSlide + 1);
      else if (diff < 0 && currentSlide > 0) setCurrentSlide(currentSlide - 1);
    }
  };

  const plant = hasPlants ? plantsData[currentSlide] : null;
  const daysTogether = plant
    ? Math.floor((Date.now() - new Date(plant.adoptionDate).getTime()) / 86400000)
    : 0;

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-beige-gradient pb-[90px]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-2">
        <h1 className="text-[20px] font-bold text-primary tracking-tight">MyLittleGarden</h1>
        <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 relative">
          <Bell size={22} className="text-foreground" />
          {notifications.some((n) => n.unread) && (
            <div className="absolute top-1.5 right-1.5 w-[8px] h-[8px] rounded-full bg-destructive" />
          )}
        </button>
      </div>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="mx-5 mb-4 bg-card rounded-[16px] shadow-card p-4 relative z-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[16px] font-bold text-foreground">최근 알림</h3>
            <button onClick={() => setShowNotifications(false)}>
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>
          {notifications.map((n) => (
            <div key={n.id} className="py-3 border-b border-border last:border-0">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  {n.unread && <div className="w-[6px] h-[6px] rounded-full bg-destructive mt-1.5 flex-shrink-0" />}
                  <div>
                    <p className="text-[14px] font-semibold text-foreground">{n.type}</p>
                    <p className="text-[13px] text-muted-foreground mt-0.5">{n.text}</p>
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground flex-shrink-0 ml-2">{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 px-5 overflow-y-auto">
        {/* Greeting */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[28px]">🌳</span>
          <h2 className="text-[20px] font-bold text-primary">안녕하세요, {displayN님!</h2>
        </div>

        {hasPlants ? (
          <>
            <p className="text-[14px] text-muted-foreground mt-1 leading-relaxed">
              오늘도 싱그러운 초록빛 식물들과 함께하며{"\n"}
              교감하는 {curredisplayN��만의 소중한 시간을 응원할게요.
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
                  <p className="text-[13px] text-muted-foreground mb-4">{daysTogether}일째 함께하는 중</p>

                  <div className="flex flex-col gap-2">
                    <div className="bg-card/80 rounded-[12px] px-4 py-3 flex items-center gap-2">
                      <span className="text-[18px]">📋</span>
                      <span className="text-[14px] text-foreground">{plant.wateringCycle}일 주기로 물주기</span>
                    </div>
                    <div className="bg-card/80 rounded-[12px] px-4 py-3 flex items-center gap-2">
                      <span className="text-[18px]">🌱</span>
                      <span className="text-[14px] text-foreground">성장 단계 Lv 5</span>
                    </div>
                    <div className="bg-card/80 rounded-[12px] px-4 py-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[18px]">🔔</span>
                        <span className="text-[14px] font-semibold text-foreground">최근 활동 로그</span>
                      </div>
                      {plant.activityLogs[0]?.entries.slice(0, 2).map((entry, i) => (
                        <p key={i} className="text-[13px] text-muted-foreground ml-7">
                          {entry.time === "05:58 PM" ? "30분 전" : "1시간 전"} {entry.person} 님이 {entry.action}
                        </p>
                      ))}
                    </div>
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
            <div className="flex justify-center gap-1.5 mt-3">
              {plantsData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`rounded-full transition-all ${
                    i === currentSlide ? "w-[16px] h-[6px] bg-foreground" : "w-[6px] h-[6px] bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>

            {/* 나의 식물 Button */}
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
          /* Empty State */
          <>
            <p className="text-[14px] text-muted-foreground mt-2 text-center leading-relaxed">
              아직 등록된 식물이 없어요!{"\n"}
              식물을 등록하고, 나만의 정원을 가꿔보세요.
            </p>

            <div className="flex flex-col gap-4 mt-8">
              <button
                onClick={() => navigate("/plant-recommendation")}
                className="bg-card rounded-[20px] shadow-card py-10 flex flex-col items-center gap-3"
              >
                <span className="text-[48px]">🔍</span>
                <span className="text-[16px] font-bold text-foreground">나에게 맞는 식물{"\n"}추천받기</span>
              </button>
              <button
                onClick={() => navigate("/plant-register")}
                className="bg-card rounded-[20px] shadow-card py-10 flex flex-col items-center gap-3"
              >
                <span className="text-[48px]">📷</span>
                <span className="text-[16px] font-bold text-foreground">이미 키우는 식물{"\n"}등록하기</span>
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
