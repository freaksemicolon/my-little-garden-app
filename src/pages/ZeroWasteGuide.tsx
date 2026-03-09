import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { wasteDisposalItems, reuseSteps } from "@/data/mockData";

const ZeroWasteGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center h-[56px] px-4">
        <button onClick={() => navigate(-1)} className="p-2">
          <ChevronLeft size={24} className="text-foreground" />
        </button>
        <h1 className="text-[17px] font-semibold text-foreground ml-1">제로 웨이스트 가이드</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-2 pb-8">
        {/* Intro */}
        <div className="bg-secondary rounded-[16px] p-5 mb-6">
          <h2 className="text-[18px] font-bold text-foreground mb-2">
            마지막까지 초록빛으로 남고 싶어요 🌿
          </h2>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            함께했던 시간을 소중히 간직하며, 마지막까지 식물과 지구를 생각하는 마음을 담았습니다.
          </p>
        </div>

        {/* 올바른 분리배출 방법 */}
        <h2 className="text-[18px] font-bold text-foreground mb-3">♻️ 올바른 분리배출 방법</h2>
        <div className="flex flex-col gap-3 mb-8">
          {wasteDisposalItems.map((item, i) => (
            <div key={i} className="bg-card rounded-[14px] shadow-card p-4 flex gap-3">
              <span className="text-[28px] flex-shrink-0">{item.icon}</span>
              <div>
                <h3 className="text-[15px] font-semibold text-foreground">{item.title}</h3>
                <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 흙과 화분 재사용 */}
        <h2 className="text-[18px] font-bold text-foreground mb-3">🔄 흙과 화분을 다시 쓰는 방법</h2>
        <div className="flex flex-col gap-3">
          {reuseSteps.map((step) => (
            <div key={step.step} className="bg-card rounded-[14px] shadow-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-[28px] h-[28px] rounded-full bg-primary flex items-center justify-center">
                  <span className="text-[13px] font-bold text-primary-foreground">{step.step}</span>
                </div>
                <h3 className="text-[15px] font-semibold text-foreground">{step.title}</h3>
              </div>
              <p className="text-[12px] text-muted-foreground leading-relaxed ml-[36px]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ZeroWasteGuide;
