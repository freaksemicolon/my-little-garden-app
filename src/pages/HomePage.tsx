import { useNavigate } from "react-router-dom";
import { Plus, Camera } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import PlantCard from "@/components/PlantCard";
import NotificationCard from "@/components/NotificationCard";
import { samplePlants, getNextWaterDate, getWateringStatus } from "@/data/plants";

const HomePage = () => {
  const navigate = useNavigate();

  const todayPlants = samplePlants.filter((p) => {
    const next = getNextWaterDate(p.lastWatered, p.wateringCycle);
    const status = getWateringStatus(next);
    return status === "오늘 물주기" || status === "지연";
  });

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background pb-[80px]">
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-[22px] font-bold text-foreground">안녕하세요, 리나님 👋</h1>
        <p className="text-[14px] text-muted-foreground mt-1">오늘도 식물을 잘 돌봐주세요</p>
      </div>

      {/* Notification */}
      {todayPlants.length > 0 && (
        <div className="px-5 mb-4">
          {todayPlants.map((p) => (
            <NotificationCard
              key={p.id}
              plantName={p.name}
              message={`${p.name} 물 줄 시간입니다`}
              image={p.image}
            />
          ))}
        </div>
      )}

      {/* Today's Plants */}
      <div className="px-5 mb-6">
        <h2 className="text-[16px] font-semibold text-foreground mb-3">오늘의 식물</h2>
        <div className="flex flex-col gap-3">
          {samplePlants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mb-6">
        <h2 className="text-[16px] font-semibold text-foreground mb-3">빠른 기능</h2>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/plant-register")}
            className="flex-1 bg-card rounded-[16px] shadow-card p-4 flex flex-col items-center gap-2"
          >
            <div className="w-[44px] h-[44px] rounded-full bg-secondary flex items-center justify-center">
              <Plus size={20} className="text-primary" />
            </div>
            <span className="text-[13px] font-medium text-foreground">내 식물 등록</span>
          </button>
          <button
            onClick={() => navigate("/chat")}
            className="flex-1 bg-card rounded-[16px] shadow-card p-4 flex flex-col items-center gap-2"
          >
            <div className="w-[44px] h-[44px] rounded-full bg-secondary flex items-center justify-center">
              <Camera size={20} className="text-primary" />
            </div>
            <span className="text-[13px] font-medium text-foreground">이미지로 식물 진단</span>
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default HomePage;
