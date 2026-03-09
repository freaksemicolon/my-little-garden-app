import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Edit2, Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import plantSucculent from "@/assets/plant-succulent.png";

const PlantRegister = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [adoptionDate, setAdoptionDate] = useState<Date>();
  const [cycleNumber, setCycleNumber] = useState("");
  const [cycleUnit, setCycleUnit] = useState("일");
  const [memo, setMemo] = useState("");
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center h-[56px] px-4">
        <button onClick={() => navigate(-1)} className="p-2">
          <ChevronLeft size={24} className="text-foreground" />
        </button>
        <h1 className="text-[17px] font-semibold text-foreground ml-1">프로필 수정</h1>
      </div>

      <div className="flex-1 px-5 pt-2 pb-8 overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Plant photo */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-[160px] h-[160px] rounded-full bg-accent flex items-center justify-center overflow-hidden">
                <img src={plantSucculent} alt="plant" className="w-[120px] h-[120px] object-contain" />
              </div>
              <button
                type="button"
                className="absolute bottom-2 right-2 w-[36px] h-[36px] rounded-full bg-card border border-border flex items-center justify-center shadow-sm"
              >
                <Edit2 size={16} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* 식물 별명 입력 */}
          <div className="mb-5">
            <h3 className="text-[16px] font-bold text-foreground mb-1">식물 별명 입력</h3>
            <p className="text-[13px] text-muted-foreground mb-2">식물의 이름(애칭)이 뭔가요?</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예) 몬몬이"
              className="w-full h-[48px] px-4 rounded-[12px] bg-accent text-[14px] text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>

          {/* 식물 종 선택 */}
          <div className="mb-5">
            <h3 className="text-[16px] font-bold text-foreground mb-1">식물 종 선택</h3>
            <p className="text-[13px] text-muted-foreground mb-2">식물은 무슨 종 인가요?</p>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="예) 몬스테라"
              className="w-full h-[48px] px-4 rounded-[12px] bg-accent text-[14px] text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>

          {/* 입양일 설정 */}
          <div className="mb-5">
            <h3 className="text-[16px] font-bold text-foreground mb-1">입양일 설정</h3>
            <p className="text-[13px] text-muted-foreground mb-2">언제 처음 가족이 되었나요?</p>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-full h-[48px] px-4 rounded-[12px] bg-accent text-[14px] text-left outline-none flex items-center justify-between",
                    !adoptionDate && "text-muted-foreground"
                  )}
                >
                  <span>{adoptionDate ? format(adoptionDate, "yyyy년 M월 d일 EEEE") : "입양일 설정"}</span>
                  <CalendarIcon size={18} className="text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={adoptionDate}
                  onSelect={setAdoptionDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* 물 주는 주기 설정 */}
          <div className="mb-5">
            <h3 className="text-[16px] font-bold text-foreground mb-1">물 주는 주기 설정</h3>
            <p className="text-[13px] text-muted-foreground mb-2">식물의 물 주는 주기는 보통 어떻게 되나요?</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={cycleNumber}
                onChange={(e) => setCycleNumber(e.target.value)}
                placeholder="숫자"
                className="w-[70px] h-[40px] px-3 rounded-[10px] bg-accent text-[14px] text-foreground text-center outline-none"
              />
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUnitDropdown(!showUnitDropdown)}
                  className="h-[40px] px-4 rounded-[10px] bg-accent text-[14px] text-foreground flex items-center gap-1"
                >
                  <ChevronDown size={14} />
                  <span>{cycleUnit}</span>
                </button>
                {showUnitDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-[8px] shadow-lg z-10">
                    {["시간", "일", "주", "개월", "년"].map((unit) => (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => { setCycleUnit(unit); setShowUnitDropdown(false); }}
                        className="block w-full px-4 py-2 text-[13px] text-foreground hover:bg-accent text-left"
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[14px] text-foreground">에 한 번 물주기</span>
            </div>
          </div>

          {/* 식물 메모 설정 */}
          <div className="mb-6">
            <h3 className="text-[16px] font-bold text-foreground mb-1">식물 메모 설정</h3>
            <p className="text-[13px] text-muted-foreground mb-2">따로 메모해 둘 사항이 있나요?</p>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="예) 햇볕을 좋아해서 직사광선이 가지 말 것"
              className="w-full h-[48px] px-4 rounded-[12px] bg-accent text-[14px] text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full h-[52px] bg-primary text-primary-foreground rounded-[12px] text-[16px] font-semibold"
          >
            수정하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlantRegister;
