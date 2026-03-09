import { ArrowLeft, Leaf, BookOpen, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import plantMonstera from "@/assets/plant-monstera.png";
import plantSucculent from "@/assets/plant-succulent.png";
import plantCactus from "@/assets/plant-cactus.png";

const recommendedPlants = [
  { name: "몬스테라", desc: "초보자도 키우기 쉬운 관엽식물", image: plantMonstera },
  { name: "다육이", desc: "물을 적게 줘도 잘 자라요", image: plantSucculent },
  { name: "선인장", desc: "관리가 거의 필요 없어요", image: plantCactus },
];

const guides = [
  { title: "식물 관리 기초", desc: "빛, 물, 온도의 기본" },
  { title: "계절별 관리 팁", desc: "사계절 식물 관리법" },
  { title: "병충해 대처법", desc: "초기 대응이 중요해요" },
];

const tips = [
  "잎에 물을 뿌리지 말고 화분에 직접 주세요",
  "통풍이 잘 되는 곳에 식물을 두세요",
  "직사광선은 대부분의 관엽식물에게 해로워요",
];

const ServicePage = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background pb-[80px]">
      <div className="flex items-center h-[56px] px-4">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-[17px] font-semibold text-foreground ml-2">식물 정보</h1>
      </div>

      <div className="flex-1 px-5 pt-2 overflow-y-auto">
        {/* Recommended Plants */}
        <h2 className="text-[16px] font-semibold text-foreground mb-3 flex items-center gap-2">
          <Leaf size={16} className="text-primary" /> 추천 식물
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {recommendedPlants.map((p) => (
            <div key={p.name} className="min-w-[140px] bg-card rounded-[16px] shadow-card p-3 flex flex-col items-center">
              <div className="w-[80px] h-[80px] rounded-[12px] bg-secondary flex items-center justify-center">
                <img src={p.image} alt={p.name} className="w-[60px] h-[60px] object-contain" />
              </div>
              <h3 className="text-[13px] font-semibold text-foreground mt-2">{p.name}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5 text-center">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Guides */}
        <h2 className="text-[16px] font-semibold text-foreground mb-3 mt-4 flex items-center gap-2">
          <BookOpen size={16} className="text-primary" /> 식물 관리 가이드
        </h2>
        <div className="flex flex-col gap-3 mb-6">
          {guides.map((g) => (
            <div key={g.title} className="bg-card rounded-[16px] shadow-card p-4">
              <h3 className="text-[14px] font-semibold text-foreground">{g.title}</h3>
              <p className="text-[12px] text-muted-foreground mt-0.5">{g.desc}</p>
            </div>
          ))}
        </div>

        {/* Tips */}
        <h2 className="text-[16px] font-semibold text-foreground mb-3 flex items-center gap-2">
          <Lightbulb size={16} className="text-garden-yellow" /> 관리 팁
        </h2>
        <div className="flex flex-col gap-2 mb-6">
          {tips.map((tip, i) => (
            <div key={i} className="bg-garden-beige rounded-[12px] px-4 py-3">
              <p className="text-[13px] text-foreground">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ServicePage;
