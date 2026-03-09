import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ChevronDown } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { plantsData, getWateringStatus } from "@/data/mockData";

const MyPlants = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("이름순");

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
        <button className="flex items-center gap-1 text-[12px] text-muted-foreground">
          {sortBy}
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="px-5 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3">
          {plantsData.map((plant) => {
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
