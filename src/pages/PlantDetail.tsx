import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Droplets } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import PlantProfile from "@/components/PlantProfile";
import { samplePlants } from "@/data/plants";
import { cn } from "@/lib/utils";

const PlantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const plant = samplePlants.find((p) => p.id === id);

  if (!plant) {
    return (
      <div className="mobile-container flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">식물을 찾을 수 없습니다</p>
      </div>
    );
  }

  const wateredDates = plant.wateringHistory.map((d) => new Date(d));

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="flex items-center h-[56px] px-4">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-[17px] font-semibold text-foreground ml-2">식물 상세</h1>
      </div>

      <div className="flex-1 px-5 pt-2 overflow-y-auto">
        <PlantProfile plant={plant} />

        {/* Calendar */}
        <div className="mt-6 bg-card rounded-[16px] shadow-card p-4">
          <h3 className="text-[14px] font-semibold text-foreground mb-3">물주기 기록</h3>
          <Calendar
            mode="multiple"
            selected={wateredDates}
            className={cn("p-3 pointer-events-auto w-full")}
            modifiersStyles={{
              selected: {
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
              },
            }}
          />
        </div>

        {/* Water today button */}
        <button className="w-full h-[52px] bg-primary text-primary-foreground rounded-[14px] text-[16px] font-semibold mt-6 flex items-center justify-center gap-2">
          <Droplets size={18} />
          오늘 물주기 완료
        </button>
      </div>
    </div>
  );
};

export default PlantDetail;
