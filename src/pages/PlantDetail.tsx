import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Edit3, Droplets } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { usePlant, useWaterPlant, getWateringStatusFromPlant } from "@/hooks/usePlants";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import plant3dSucculent from "@/assets/plant-3d-succulent.png";

const PlantDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { data: plant, isLoading } = usePlant(id);
  const waterPlant = useWaterPlant();

  if (isLoading) {
    return (
      <div className="mobile-container flex flex-col min-h-screen bg-background items-center justify-center">
        <p className="text-muted-foreground">불러오는 중...</p>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="mobile-container flex flex-col min-h-screen bg-background items-center justify-center">
        <p className="text-muted-foreground mb-4">식물을 찾을 수 없습니다</p>
        <button onClick={() => navigate("/home")} className="text-primary font-semibold">
          홈으로 가기
        </button>
      </div>
    );
  }

  const plantImage = plant.image_url || plant3dSucculent;
  const adoptionDate = plant.adoption_date ? new Date(plant.adoption_date) : null;
  const dateStr = adoptionDate
    ? `${adoptionDate.getFullYear()}년 ${String(adoptionDate.getMonth() + 1).padStart(2, "0")}월 ${String(adoptionDate.getDate()).padStart(2, "0")}일부터 함께하는 중`
    : "함께하는 중";
  const waterStatus = getWateringStatusFromPlant(plant);

  const handleWater = async () => {
    try {
      await waterPlant.mutateAsync(plant.id);
      toast({ title: `${plant.nickname}에게 물을 주었어요! 💧` });
    } catch (e: any) {
      toast({ title: "물주기 실패", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background pb-[90px]">
      {/* Header */}
      <div className="flex items-center justify-between h-[56px] px-4">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft size={24} className="text-foreground" />
          </button>
          <span className="text-[17px] font-semibold text-foreground ml-1">프로필 보기</span>
        </div>
        <button onClick={() => navigate(`/plant/${plant.id}/edit`)} className="p-2">
          <Edit3 size={20} className="text-foreground" />
        </button>
      </div>

      {/* Plant Hero */}
      <div className="bg-beige-gradient px-5 pt-4 pb-6 flex flex-col items-center">
        <div className="w-[180px] h-[180px] rounded-full bg-accent/50 flex items-center justify-center overflow-hidden">
          <img src={plantImage} alt={plant.nickname} className={plant.image_url ? "w-full h-full object-cover" : "w-[140px] h-[140px] object-contain"} />
        </div>
        <h2 className="text-[22px] font-bold text-foreground mt-4">{plant.nickname}</h2>
        <p className="text-[14px] text-muted-foreground mt-1">{plant.species}</p>
        <p className="text-[12px] text-muted-foreground mt-1">{dateStr}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-4">
        {/* Water Status */}
        <div className="bg-card rounded-[16px] shadow-card p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[28px]">💧</span>
            <div>
              <h3 className="text-[15px] font-bold text-foreground">물주기 상태</h3>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                {plant.watering_cycle}{plant.watering_unit} 주기 · {waterStatus.status}
              </p>
            </div>
          </div>
          <button
            onClick={handleWater}
            disabled={waterPlant.isPending}
            className="flex items-center gap-1 px-4 py-2 rounded-[12px] bg-primary text-primary-foreground text-[13px] font-medium disabled:opacity-50"
          >
            <Droplets size={14} />
            물주기
          </button>
        </div>

        {/* Memo Card */}
        {plant.memo && (
          <div className="bg-card rounded-[16px] shadow-card p-4 mb-4 flex items-start gap-3">
            <span className="text-[28px]">📋</span>
            <div>
              <h3 className="text-[15px] font-bold text-foreground">{plant.nickname}를 위한 메모</h3>
              <p className="text-[13px] text-muted-foreground mt-1">{plant.memo}</p>
            </div>
          </div>
        )}

        {/* Bond Level */}
        <div className="bg-card rounded-[16px] shadow-card p-4 mb-4 flex items-start gap-3">
          <span className="text-[28px]">💚</span>
          <div className="flex-1">
            <h3 className="text-[15px] font-bold text-foreground">친밀도</h3>
            <div className="mt-2 w-full h-[8px] bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.round(plant.bond_level * 100)}%` }}
              />
            </div>
            <p className="text-[12px] text-muted-foreground mt-1">
              {plant.bond_level < 0.2
                ? "낯가림"
                : plant.bond_level < 0.5
                ? "조금 친해짐"
                : plant.bond_level < 0.8
                ? "많이 친해짐"
                : "아주 가까움"}{" "}
              ({Math.round(plant.bond_level * 100)}%)
            </p>
          </div>
        </div>

        {/* Chat with plant */}
        <button
          onClick={() => navigate(`/chat/${plant.id}`)}
          className="w-full bg-primary text-primary-foreground rounded-[14px] h-[48px] text-[15px] font-semibold mt-2 mb-4"
        >
          {plant.nickname}와 대화하기
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PlantDetail;
