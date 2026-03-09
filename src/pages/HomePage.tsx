import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-beige-gradient pb-[90px]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-2">
        <h1 className="text-[20px] font-bold text-primary tracking-tight">
          MyLittleGarden
        </h1>
        <button onClick={() => navigate("/notification-settings")} className="p-2">
          <Bell size={22} className="text-foreground" />
        </button>
      </div>

      <div className="flex-1 px-5 overflow-y-auto">
        {/* Section 1: 새로운 식물 */}
        <div className="mb-6">
          <h2 className="text-[18px] font-bold text-foreground mb-3">
            새로운 식물을 키우고 싶다면?
          </h2>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate("/plant-recommendation")}
              className="w-full bg-card rounded-[14px] shadow-card px-4 py-4 text-left"
            >
              <span className="text-[14px] font-medium text-foreground">🌿 식물 추천받기</span>
            </button>
            <button
              onClick={() => navigate("/plant-register")}
              className="w-full bg-card rounded-[14px] shadow-card px-4 py-4 text-left"
            >
              <span className="text-[14px] font-medium text-foreground">🪴 새로운 식물 등록하기</span>
            </button>
          </div>
        </div>

        {/* Section 2: 오늘의 케어 가이드 */}
        <div className="mb-6">
          <h2 className="text-[18px] font-bold text-foreground mb-3">
            오늘의 반려식물 케어 가이드
          </h2>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate("/my-plants")}
              className="w-full bg-card rounded-[14px] shadow-card px-4 py-4 text-left"
            >
              <span className="text-[14px] font-medium text-foreground">📅 이번달 물봄 일정</span>
            </button>
            <button
              onClick={() => navigate("/diagnosis-history")}
              className="w-full bg-card rounded-[14px] shadow-card px-4 py-4 text-left"
            >
              <span className="text-[14px] font-medium text-foreground">🔍 진단 히스토리</span>
            </button>
          </div>
        </div>

        {/* Section 3: 제로 웨이스트 */}
        <div className="mb-6">
          <h2 className="text-[18px] font-bold text-foreground mb-3">
            마지막 안녕을 돕는 가이드
          </h2>
          <button
            onClick={() => navigate("/zero-waste")}
            className="w-full bg-card rounded-[14px] shadow-card px-4 py-4 text-left"
          >
            <span className="text-[14px] font-medium text-foreground">♻️ 제로 웨이스트 가이드</span>
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default HomePage;
