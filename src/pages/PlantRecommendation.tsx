import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { recommendedPlants, recommendTags } from "@/data/mockData";

const PlantRecommendation = () => {
  const navigate = useNavigate();
  const [activeTags, setActiveTags] = useState<string[]>(["#초보식집사_추천"]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredPlants = activeTags.length === 0
    ? recommendedPlants
    : recommendedPlants.filter((p) => p.tags.some((t) => activeTags.includes(t)));

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background pb-[90px]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-2">
        <h1 className="text-[20px] font-bold text-primary tracking-tight">MyLittleGarden</h1>
        <button onClick={() => navigate("/notification-settings")} className="p-2">
          <Bell size={22} className="text-foreground" />
        </button>
      </div>

      <div className="flex-1 px-5 overflow-y-auto">
        <h2 className="text-[20px] font-bold text-foreground mb-3">식물 추천</h2>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {recommendTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                activeTags.includes(tag)
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="w-1/3 h-[3px] bg-border rounded-full mb-6" />

        <h2 className="text-[20px] font-bold text-foreground mb-4">검색 결과</h2>

        {/* Plant cards grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredPlants.map((plant) => (
            <button
              key={plant.id}
              onClick={() => navigate("/plant-register")}
              className="bg-card rounded-[16px] shadow-card overflow-hidden text-left"
            >
              <div className="w-full aspect-square bg-accent flex items-center justify-center p-4">
                <img src={plant.image} alt={plant.name} className="w-full h-full object-contain" />
              </div>
              <div className="p-3">
                <h3 className="text-[15px] font-semibold text-foreground">{plant.name}</h3>
                <p className="text-[12px] text-muted-foreground">{plant.nameEn}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PlantRecommendation;
