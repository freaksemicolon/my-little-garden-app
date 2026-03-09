import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const cycleOptions = [
  { label: "매일", value: 1 },
  { label: "3일", value: 3 },
  { label: "5일", value: 5 },
  { label: "7일", value: 7 },
];

const PlantRegister = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [lastWatered, setLastWatered] = useState<Date>();
  const [cycle, setCycle] = useState<number | null>(null);
  const [customCycle, setCustomCycle] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/my-plants");
  };

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center h-[56px] px-4">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-[17px] font-semibold text-foreground ml-2">식물 등록</h1>
      </div>

      <div className="flex-1 px-5 pt-2 pb-8 overflow-y-auto">
        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          {/* Image Upload */}
          <div className="flex justify-center">
            <button
              type="button"
              className="w-[120px] h-[120px] rounded-[20px] bg-muted flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border"
            >
              <Camera size={28} className="text-muted-foreground" />
              <span className="text-[12px] text-muted-foreground">사진 추가</span>
            </button>
          </div>

          {/* Name */}
          <div>
            <label className="text-[13px] font-medium text-foreground mb-1.5 block">식물 이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="식물 이름을 입력하세요"
              className="w-full h-[48px] px-4 rounded-[12px] bg-muted text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-[13px] font-medium text-foreground mb-1.5 block">식물 종류</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="예: 관엽식물, 다육식물"
              className="w-full h-[48px] px-4 rounded-[12px] bg-muted text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-[13px] font-medium text-foreground mb-1.5 block">식물 위치</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: 거실, 베란다"
              className="w-full h-[48px] px-4 rounded-[12px] bg-muted text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Last Watered - DatePicker */}
          <div>
            <label className="text-[13px] font-medium text-foreground mb-1.5 block">마지막 물 준 날짜</label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-full h-[48px] px-4 rounded-[12px] bg-muted text-[14px] text-left outline-none",
                    !lastWatered && "text-muted-foreground"
                  )}
                >
                  {lastWatered ? format(lastWatered, "yyyy년 MM월 dd일") : "날짜를 선택하세요"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={lastWatered}
                  onSelect={setLastWatered}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Watering Cycle */}
          <div>
            <label className="text-[13px] font-medium text-foreground mb-1.5 block">물주기 주기</label>
            <div className="flex flex-wrap gap-2">
              {cycleOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { setCycle(opt.value); setCustomCycle(""); }}
                  className={`px-4 py-2 rounded-[10px] text-[13px] font-medium transition-colors ${
                    cycle === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCycle(-1)}
                className={`px-4 py-2 rounded-[10px] text-[13px] font-medium transition-colors ${
                  cycle === -1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                직접 입력
              </button>
            </div>
            {cycle === -1 && (
              <input
                type="number"
                value={customCycle}
                onChange={(e) => setCustomCycle(e.target.value)}
                placeholder="일 수를 입력하세요"
                className="w-full h-[48px] px-4 rounded-[12px] bg-muted text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring mt-2"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full h-[52px] bg-primary text-primary-foreground rounded-[14px] text-[16px] font-semibold mt-2"
          >
            식물 등록
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlantRegister;
