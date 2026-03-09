import { useNavigate } from "react-router-dom";
import { Plant, getNextWaterDate, getWateringStatus, formatDate } from "@/data/plants";
import { Droplets } from "lucide-react";

interface PlantCardProps {
  plant: Plant;
}

const PlantCard = ({ plant }: PlantCardProps) => {
  const navigate = useNavigate();
  const nextWater = getNextWaterDate(plant.lastWatered, plant.wateringCycle);
  const status = getWateringStatus(nextWater);

  const statusColor =
    status === "정상" ? "text-primary" :
    status === "오늘 물주기" ? "text-garden-orange" :
    "text-garden-red";

  const statusBg =
    status === "정상" ? "bg-secondary" :
    status === "오늘 물주기" ? "bg-garden-beige" :
    "bg-destructive/10";

  return (
    <button
      onClick={() => navigate(`/plant/${plant.id}`)}
      className="w-full bg-card rounded-[16px] shadow-card p-4 flex items-center gap-3 text-left"
    >
      <div className="w-[60px] h-[60px] rounded-[12px] bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
        <img src={plant.image} alt={plant.name} className="w-[48px] h-[48px] object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-foreground">{plant.name}</h3>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusBg} ${statusColor}`}>
            {status}
          </span>
        </div>
        <p className="text-[12px] text-muted-foreground mt-0.5">{plant.type} · {plant.location}</p>
        <div className="flex items-center gap-1 mt-1.5">
          <Droplets size={12} className="text-garden-blue" />
          <span className="text-[11px] text-muted-foreground">
            다음 물주기: {formatDate(nextWater)}
          </span>
        </div>
      </div>
    </button>
  );
};

export default PlantCard;
