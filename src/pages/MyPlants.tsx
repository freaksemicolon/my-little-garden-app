import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import PlantList from "@/components/PlantList";
import { samplePlants } from "@/data/plants";

const MyPlants = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background pb-[80px]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <h1 className="text-[22px] font-bold text-foreground">내 식물</h1>
        <button
          onClick={() => navigate("/plant-register")}
          className="w-[36px] h-[36px] rounded-full bg-primary flex items-center justify-center"
        >
          <Plus size={18} className="text-primary-foreground" />
        </button>
      </div>

      <div className="px-5 flex-1">
        <PlantList plants={samplePlants} />
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MyPlants;
