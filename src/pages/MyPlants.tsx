import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ChevronDown } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { plantsData, getWateringStatus } from "@/data/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sortOptions = [
  { value: "name", label: "이름순" },
  { value: "recent", label: "최근 등록순" },
  { value: "watering", label: "물주기 급한순" },
  { value: "health", label: "건강 상태순" },
];

const healthOrder: Record<string, number> = { "주의": 0, "보통": 1, "좋음": 2 };

const MyPlants = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("name");

  const sortedPlants = useMemo(() => {
    const plants = [...plantsData];
    switch (sortBy) {
      case "name":
        return plants.sort((a, b) => a.nickname.localeCompare(b.nickname, "ko"));
      case "recent":
        return plants.sort((a, b) => new Date(b.adoptionDate).getTime() - new Date(a.adoptionDate).getTime());
      case "watering": {
        return plants.sort((a, b) => {
          const daysA = Math.floor((Date.now() - new Date(a.lastWatered).getTime()) / 86400000) - a.wateringCycle;
          const daysB = Math.floor((Date.now() - new Date(b.lastWatered).getTime()) / 86400000) - b.wateringCycle;
          return daysB - daysA; // most overdue first
        });
      }
      case "health":
        return plants.sort((a, b) => (healthOrder[a.healthStatus] ?? 1) - (healthOrder[b.healthStatus] ?? 1));
      default:
        return plants;
    }
  }, [sortBy]);

  const sortLabel = sortOptions.find((o) => o.value === sortBy)?.label ?? "이름순";

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background pb-[90px]">
      {/* Header */}
      <div className="px-5 pt-14 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-foreground">나의 식물</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">총 {plantsData.length}개</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/plant-register")}
            className="w-[36px] h-[36px] rounded-full bg-primary flex items-center justify-center"
          >
            <Plus size={20} className="text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* Sort dropdown */}
      <div className="px-5 pb-2 flex justify-end">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-auto h-auto border-none shadow-none bg-transparent p-0 gap-1 text-[12px] text-muted-foreground focus:ring-0">
            <SelectValue>{sortLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-[13px]">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="px-5 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3">
          {sortedPlants.map((plant) => {
            const { status, badge } = getWateringStatus(plant);
            return (
              <button
                key={plant.id}
                onClick={() => navigate(`/plant/${plant.id}`)}
                className="w-full bg-card rounded-[16px] shadow-card p-4 flex items-center gap-3 text-left"
              >
                <div className="w-[60px] h-[60px] rounded-full bg-accent flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img src={plant.image} alt={plant.nickname} className="w-[48px] h-[48px] object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[15px] font-semibold text-foreground">{plant.nickname}</h3>
                  <p className="text-[12px] text-muted-foreground mt-0.5">{plant.species}</p>
                </div>
                <span
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                    badge === "destructive"
                      ? "bg-destructive/10 text-destructive"
                      : badge === "warning"
                      ? "bg-garden-yellow/30 text-garden-brown"
                      : badge === "success"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {status}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MyPlants;
