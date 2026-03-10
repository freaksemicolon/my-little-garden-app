import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/BottomNavigation";
import logoMyLittleGarden from "@/assets/logo-mylittlegarden-black.png";
import iconBellActive from "@/assets/icon-bell-active.png";

const menuSections = [
  {
    title: "새로운 식물을 키우고 싶다면?",
    items: [
      {
        emoji: "🔍",
        label: "식물 추천받기",
        desc: "초보 집사도 걱정 없는 식물 맞춤 추천",
        path: "/plant-recommendation",
      },
      {
        emoji: "📷",
        label: "새로운 식물 등록하기",
        desc: "우리 집에 온 새 식구 등록하기",
        path: "/plant-register",
      },
    ],
  },
  {
    title: "오늘의 반려식물 케어 가이드",
    items: [
      {
        emoji: "🌱",
        label: "이번달 돌봄 일정",
        desc: "나만의 반려식물 다이어리",
        path: "/home",
      },
      {
        emoji: "📋",
        label: "진단 히스토리",
        desc: "식물의 진단 기록과 처방전 모아보기",
        path: "/diagnosis-history",
      },
    ],
  },
  {
    title: "마지막 안녕을 돕는 가이드",
    items: [
      {
        emoji: "♻️",
        label: "제로 웨이스트 가이드",
        desc: "친환경 이별 가이드로 마지막 인사하기",
        path: "/zero-waste",
      },
    ],
  },
];

const MyPlants = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background pb-[90px]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-2">
        <img src={logoMyLittleGarden} alt="MyLittleGarden" className="h-[24px] object-contain" />
        <button onClick={() => navigate("/notification-settings")} className="p-2">
          <img src={iconBellActive} alt="알림" className="w-[24px] h-[24px] object-contain" />
        </button>
      </div>

      <div className="flex-1 px-5 overflow-y-auto pt-2">
        {menuSections.map((section) => (
          <div key={section.title} className="mb-5">
            <h2 className="text-[15px] font-bold text-foreground mb-3">• {section.title}</h2>
            <div className="flex flex-col gap-2.5">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="w-full bg-card rounded-[16px] shadow-card px-4 py-4 flex items-center gap-3 text-left"
                >
                  <img src={item.icon} alt={item.label} className="w-[36px] h-[36px] object-contain flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-[15px] font-semibold text-foreground">{item.label}</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MyPlants;
