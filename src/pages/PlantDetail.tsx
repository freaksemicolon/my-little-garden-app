import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Edit } from "lucide-react";
import { samplePlants, formatDate } from "@/data/plants";
import BottomNavigation from "@/components/BottomNavigation";

const activityLog = [
  { action: "아빠 님이 물💧을 주셨어요", time: "05:58 PM" },
  { action: "엄마 님이 영양제💊를 주셨어요", time: "03:20 PM" },
  { action: "엄마 님이 몬몬이를 진단🔍하셨어요", time: "03:14 PM" },
];

const PlantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const plant = samplePlants.find((p) => p.id === id);

  if (!plant) {
    return (
      <div className="mobile-container flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">식물을 찾을 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background pb-[90px]">
      {/* Header */}
      <div className="flex items-center justify-between h-[56px] px-4">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft size={24} className="text-foreground" />
          </button>
          <h1 className="text-[17px] font-semibold text-foreground ml-1">프로필 보기</h1>
        </div>
        <button onClick={() => navigate(`/plant-register`)} className="p-2">
          <Edit size={20} className="text-foreground" />
        </button>
      </div>

      {/* Plant Profile Section with beige bg */}
      <div className="bg-beige-gradient px-5 pt-6 pb-8 flex flex-col items-center">
        <div className="w-[160px] h-[160px] rounded-full bg-accent flex items-center justify-center overflow-hidden">
          <img src={plant.image} alt={plant.name} className="w-[120px] h-[120px] object-contain" />
        </div>
        <h2 className="text-[20px] font-bold text-foreground mt-4">{plant.name === "몬스테라" ? "몬몬이" : plant.name}</h2>
        <p className="text-[14px] text-muted-foreground mt-1">{plant.type}</p>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          {new Date(plant.registeredDate).getFullYear()}년 {String(new Date(plant.registeredDate).getMonth() + 1).padStart(2, '0')}월 {String(new Date(plant.registeredDate).getDate()).padStart(2, '0')}일부터 함께하는 중
        </p>
      </div>

      <div className="px-5 pt-4 flex-1 overflow-y-auto">
        {/* Memo card */}
        <div className="bg-card rounded-[16px] border border-border p-4 flex items-center gap-3 mb-4">
          <div className="w-[44px] h-[44px] rounded-[10px] bg-accent flex items-center justify-center">
            <span className="text-[20px]">📋</span>
          </div>
          <div>
            <p className="text-[14px] font-semibold text-foreground">{plant.name === "몬스테라" ? "몬몬이" : plant.name}를 위한 메모</p>
            <p className="text-[12px] text-muted-foreground mt-0.5">7일~ 10일 주기로 물을 줘야해요</p>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-card rounded-[16px] border border-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-[44px] h-[44px] rounded-[10px] bg-accent flex items-center justify-center">
              <span className="text-[20px]">🌱</span>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-foreground">{plant.name === "몬스테라" ? "몬몬이" : plant.name}의 최근 활동 로그</p>
              <p className="text-[12px] text-muted-foreground">{plant.name === "몬스테라" ? "몬몬이" : plant.name}의 성장과정을 한 눈에 보아요</p>
            </div>
          </div>

          {/* Date selector */}
          <div className="inline-flex items-center gap-2 bg-accent rounded-full px-4 py-2 mb-4">
            <span className="text-[12px]">▼</span>
            <span className="text-[13px] font-medium text-foreground">2026. 02. 21 (Sat)</span>
          </div>

          {/* Activity items */}
          <div className="flex flex-col gap-3">
            {activityLog.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <p className="text-[13px] text-foreground">{item.action}</p>
                <span className="text-[12px] text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PlantDetail;
