import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { samplePlants } from "@/data/plants";
import plantSucculent from "@/assets/plant-succulent.png";

const tags = [
  { label: "#초보식집사_추천", active: true },
  { label: "#햇빛이_부족한_방", active: false },
  { label: "#반려동물_안전", active: false },
  { label: "#물주기_깜빡해도_거뜬", active: false },
  { label: "#프로 식물킬러_졸업", active: false },
  { label: "#알레르기", active: false },
];

const recommendedPlants = [
  { name: "스킨답서스", nameEn: "Pothos", image: plantSucculent },
  { name: "산세베리아", nameEn: "Snake Plant", image: plantSucculent },
  { name: "테이블 야자", nameEn: "Parlor Palm", image: plantSucculent },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background pb-[90px]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-2">
        <h1 className="text-[20px] font-bold text-primary tracking-tight">
          MyLittleGarden
        </h1>
        <button className="p-2">
          <Bell size={22} className="text-foreground" />
        </button>
      </div>

      <div className="flex-1 px-5 overflow-y-auto">
        {/* 식물 추천 */}
        <h2 className="text-[20px] font-bold text-foreground mb-3">식물 추천</h2>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <button
              key={tag.label}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium ${
                tag.active
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-foreground"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Scrollbar indicator */}
        <div className="w-1/3 h-[3px] bg-border rounded-full mb-6" />

        {/* 검색 결과 */}
        <h2 className="text-[20px] font-bold text-foreground mb-4">검색 결과</h2>

        {/* Plant cards grid */}
        <div className="grid grid-cols-2 gap-3">
          {recommendedPlants.map((plant) => (
            <button
              key={plant.name}
              onClick={() => navigate("/plant/1")}
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

export default HomePage;
