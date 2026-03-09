import { Plant, getNextWaterDate, getWateringStatus, formatDate } from "@/data/plants";
import { Droplets, Calendar } from "lucide-react";

interface PlantProfileProps {
  plant: Plant;
}

const PlantProfile = ({ plant }: PlantProfileProps) => {
  const nextWater = getNextWaterDate(plant.lastWatered, plant.wateringCycle);
  const status = getWateringStatus(nextWater);

  return (
    <div className="flex flex-col items-center">
      <div className="w-[160px] h-[160px] rounded-full bg-secondary flex items-center justify-center overflow-hidden">
        <img src={plant.image} alt={plant.name} className="w-[120px] h-[120px] object-contain" />
      </div>
      <h2 className="text-[20px] font-bold text-foreground mt-4">{plant.name}</h2>
      <p className="text-[13px] text-muted-foreground mt-1">{plant.type} · {plant.location}</p>
      <p className="text-[12px] text-muted-foreground mt-0.5">등록일: {formatDate(plant.registeredDate)}</p>

      <div className="w-full mt-6 bg-card rounded-[16px] shadow-card p-4">
        <h3 className="text-[14px] font-semibold text-foreground mb-3">물주기 상태</h3>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Droplets size={16} className="text-garden-blue" />
            <div>
              <p className="text-[11px] text-muted-foreground">최근 물 준 날</p>
              <p className="text-[13px] font-medium text-foreground">{formatDate(plant.lastWatered)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-primary" />
            <div>
              <p className="text-[11px] text-muted-foreground">다음 물주기</p>
              <p className={`text-[13px] font-medium ${
                status === "정상" ? "text-primary" :
                status === "오늘 물주기" ? "text-garden-orange" :
                "text-garden-red"
              }`}>{formatDate(nextWater)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantProfile;
