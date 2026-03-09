import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import { samplePlants } from "@/data/plants";

const MyPlants = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background pb-[90px]">
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-[22px] font-bold text-foreground">전체 케어</h1>
      </div>

      <div className="px-5 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3">
          {samplePlants.map((plant) => (
            <button
              key={plant.id}
              onClick={() => navigate(`/plant/${plant.id}`)}
              className="w-full bg-card rounded-[16px] shadow-card p-4 flex items-center gap-3 text-left"
            >
              <div className="w-[60px] h-[60px] rounded-full bg-accent flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src={plant.image} alt={plant.name} className="w-[48px] h-[48px] object-contain" />
              </div>
              <div className="flex-1">
                <h3 className="text-[15px] font-semibold text-foreground">{plant.name}</h3>
                <p className="text-[12px] text-muted-foreground mt-0.5">{plant.type}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MyPlants;
