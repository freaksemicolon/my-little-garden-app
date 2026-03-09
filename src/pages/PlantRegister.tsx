import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Calendar, ChevronDown, Edit2 } from "lucide-react";
import { plantsData } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

const unitOptions = ["시간", "일", "주", "개월", "년"];

const PlantRegister = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const existingPlant = isEdit ? plantsData.find((p) => p.id === id) : null;

  const [nickname, setNickname] = useState(existingPlant?.nickname || "");
  const [species, setSpecies] = useState(existingPlant?.species || "");
  const [adoptionDate, setAdoptionDate] = useState(existingPlant?.adoptionDate || "");
  const [cycleNum, setCycleNum] = useState(existingPlant?.wateringCycle?.toString() || "");
  const [cycleUnit, setCycleUnit] = useState(existingPlant?.wateringUnit || "일");
  const [memo, setMemo] = useState(existingPlant?.memo || "");
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [showPhotoSheet, setShowPhotoSheet] = useState(false);
  const [photoPreview] = useState(existingPlant?.image || "");

  const formatKoreanDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}`;
  };

  const handleSave = () => {
    if (!nickname.trim()) {
      toast({ title: "식물 별명을 입력해주세요", variant: "destructive" });
      return;
    }
    toast({ title: isEdit ? "수정이 완료되었습니다" : "등록이 완료되었습니다" });
    navigate(isEdit ? `/plant/${id}` : "/my-plants");
  };

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background relative">
      {/* Header */}
      <div className="flex items-center h-[56px] px-4">
        <button onClick={() => navigate(-1)} className="p-2">
          <ChevronLeft size={24} className="text-foreground" />
        </button>
        <span className="text-[17px] font-semibold text-foreground ml-1">
          프로필 {isEdit ? "수정" : "등록"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-32">
        {/* Photo */}
        <div className="flex justify-center pt-4 pb-6">
          <div className="relative">
            <div
              onClick={() => setShowPhotoSheet(true)}
              className="w-[160px] h-[160px] rounded-full bg-accent flex items-center justify-center overflow-hidden cursor-pointer"
            >
              {photoPreview ? (
                <img src={photoPreview} alt="" className="w-[120px] h-[120px] object-contain" />
              ) : (
                <div className="w-full h-full bg-muted" />
              )}
            </div>
            <button
              onClick={() => setShowPhotoSheet(true)}
              className="absolute bottom-1 right-1 w-[34px] h-[34px] rounded-full bg-card border border-border flex items-center justify-center shadow-sm"
            >
              <Edit2 size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Nickname */}
        <div className="mb-5">
          <h3 className="text-[16px] font-bold text-foreground">식물 별명 입력</h3>
          <p className="text-[13px] text-muted-foreground mt-0.5">식물의 이름(애칭)이 뭔가요?</p>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="예) 몬몬이"
            className="w-full h-[48px] px-4 rounded-[12px] bg-accent text-[14px] text-foreground placeholder:text-muted-foreground outline-none mt-2"
          />
        </div>

        {/* Species */}
        <div className="mb-5">
          <h3 className="text-[16px] font-bold text-foreground">식물 종 선택</h3>
          <p className="text-[13px] text-muted-foreground mt-0.5">식물은 무슨 종 인가요?</p>
          <input
            type="text"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            placeholder="예) 몬스테라"
            className="w-full h-[48px] px-4 rounded-[12px] bg-accent text-[14px] text-foreground placeholder:text-muted-foreground outline-none mt-2"
          />
        </div>

        {/* Adoption Date */}
        <div className="mb-5">
          <h3 className="text-[16px] font-bold text-foreground">입양일 설정</h3>
          <p className="text-[13px] text-muted-foreground mt-0.5">언제 처음 가족이 되었나요?</p>
          <div className="relative mt-2">
            <input
              type="date"
              value={adoptionDate}
              onChange={(e) => setAdoptionDate(e.target.value)}
              className="w-full h-[48px] px-4 rounded-[12px] bg-accent text-[14px] text-foreground outline-none appearance-none opacity-0 absolute inset-0 z-10"
            />
            <div className="w-full h-[48px] px-4 rounded-[12px] bg-accent flex items-center justify-between">
              <span className={`text-[14px] ${adoptionDate ? "text-foreground" : "text-muted-foreground"}`}>
                {adoptionDate ? formatKoreanDate(adoptionDate) : "입양일 설정"}
              </span>
              <Calendar size={18} className="text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Watering Cycle */}
        <div className="mb-5">
          <h3 className="text-[16px] font-bold text-foreground">물 주는 주기 설정</h3>
          <p className="text-[13px] text-muted-foreground mt-0.5">식물의 물 주는 주기는 보통 어떻게 되나요?</p>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="number"
              value={cycleNum}
              onChange={(e) => setCycleNum(e.target.value)}
              placeholder="숫자"
              className="w-[70px] h-[44px] px-3 rounded-[12px] bg-accent text-[14px] text-foreground text-center outline-none"
            />
            <div className="relative">
              <button
                onClick={() => setShowUnitDropdown(!showUnitDropdown)}
                className="flex items-center gap-1 h-[44px] px-4 rounded-[12px] bg-accent text-[14px] text-foreground"
              >
                <ChevronDown size={14} />
                <span>{cycleUnit}</span>
              </button>
              {showUnitDropdown && (
                <div className="absolute top-[48px] left-0 bg-card rounded-[12px] shadow-lg border border-border z-10 min-w-[100px]">
                  {unitOptions.map((unit) => (
                    <button
                      key={unit}
                      onClick={() => {
                        setCycleUnit(unit);
                        setShowUnitDropdown(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-[14px] text-foreground hover:bg-accent first:rounded-t-[12px] last:rounded-b-[12px]"
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

        {/* Memo */}
        <div className="mb-5">
          <h3 className="text-[16px] font-bold text-foreground">식물 메모 설정</h3>
          <p className="text-[13px] text-muted-foreground mt-0.5">따로 메모해 둘 사항이 있나요?</p>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="예) 햇빛에 절대 가까이 가지 말 것"
            className="w-full h-[48px] px-4 rounded-[12px] bg-accent text-[14px] text-foreground placeholder:text-muted-foreground outline-none mt-2"
          />
        </div>
      </div>

      {/* Save button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] px-5 pb-8 pt-3 bg-background">
        <button
          onClick={handleSave}
          className="w-full h-[52px] bg-primary text-primary-foreground rounded-[14px] text-[16px] font-semibold"
        >
          {isEdit ? "수정하기" : "등록하기"}
        </button>
      </div>

      {/* Photo Action Sheet */}
      {showPhotoSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-foreground/30" onClick={() => setShowPhotoSheet(false)} />
          <div className="relative w-full max-w-[393px] pb-6 px-3">
            <div className="bg-card rounded-[14px] overflow-hidden mb-2">
              <button
                onClick={() => { toast({ title: "사진 업로드 (mock)" }); setShowPhotoSheet(false); }}
                className="w-full py-4 text-[16px] text-foreground border-b border-border"
              >
                사진 업로드
              </button>
              <button
                onClick={() => { toast({ title: "사진 촬영 (mock)" }); setShowPhotoSheet(false); }}
                className="w-full py-4 text-[16px] text-primary border-b border-border"
              >
                사진 촬영
              </button>
              <button
                onClick={() => { toast({ title: "앨범에서 선택 (mock)" }); setShowPhotoSheet(false); }}
                className="w-full py-4 text-[16px] text-primary"
              >
                앨범에서 선택
              </button>
            </div>
            <button
              onClick={() => setShowPhotoSheet(false)}
              className="w-full py-4 bg-card rounded-[14px] text-[16px] font-semibold text-primary"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantRegister;
