import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Calendar, ChevronDown, Camera, Image, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCreatePlant, useUpdatePlant, usePlant } from "@/hooks/usePlants";
import { supabase } from "@/integrations/supabase/client";

const unitOptions = ["시간", "일", "주", "개월", "년"];

const PlantRegister = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { user } = useAuth();
  const { data: existingPlant } = usePlant(isEdit ? id : undefined);
  const createPlant = useCreatePlant();
  const updatePlant = useUpdatePlant();

  const [nickname, setNickname] = useState(existingPlant?.nickname || "");
  const [species, setSpecies] = useState(existingPlant?.species || "");
  const [adoptionDate, setAdoptionDate] = useState(existingPlant?.adoption_date || "");
  const [cycleNum, setCycleNum] = useState(existingPlant?.watering_cycle?.toString() || "7");
  const [cycleUnit, setCycleUnit] = useState(existingPlant?.watering_unit || "일");
  const [memo, setMemo] = useState(existingPlant?.memo || "");
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(existingPlant?.image_url || null);
  const [uploading, setUploading] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const albumInputRef = useRef<HTMLInputElement>(null);

  // Sync form when existingPlant loads
  useState(() => {
    if (existingPlant) {
      setNickname(existingPlant.nickname);
      setSpecies(existingPlant.species);
      setAdoptionDate(existingPlant.adoption_date || "");
      setCycleNum(existingPlant.watering_cycle.toString());
      setCycleUnit(existingPlant.watering_unit);
      setMemo(existingPlant.memo || "");
      if (existingPlant.image_url) setImagePreview(existingPlant.image_url);
    }
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "5MB 이하의 이미지만 업로드 가능합니다", variant: "destructive" });
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setShowImagePicker(false);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile || !user) return existingPlant?.image_url || null;
    const ext = imageFile.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    setUploading(true);
    const { error } = await supabase.storage.from("plant-images").upload(path, imageFile);
    setUploading(false);
    if (error) throw error;
    const { data } = supabase.storage.from("plant-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const formatKoreanDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}`;
  };

  const handleSave = async () => {
    if (!user) {
      toast({ title: "로그인이 필요합니다", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (!nickname.trim()) {
      toast({ title: "식물 별명을 입력해주세요", variant: "destructive" });
      return;
    }

    try {
      const imageUrl = await uploadImage();

      if (isEdit && id) {
        await updatePlant.mutateAsync({
          id,
          nickname: nickname.trim(),
          species: species.trim(),
          adoption_date: adoptionDate || null,
          watering_cycle: parseInt(cycleNum) || 7,
          watering_unit: cycleUnit,
          memo: memo.trim(),
          ...(imageUrl !== undefined && { image_url: imageUrl }),
        });
        toast({ title: "수정이 완료되었습니다" });
        navigate(`/plant/${id}`);
      } else {
        const data = await createPlant.mutateAsync({
          nickname: nickname.trim(),
          species: species.trim(),
          adoption_date: adoptionDate || undefined,
          watering_cycle: parseInt(cycleNum) || 7,
          watering_unit: cycleUnit,
          memo: memo.trim(),
          image_url: imageUrl || undefined,
        });
        toast({ title: "등록이 완료되었습니다! 🌱" });
        navigate(`/plant/${data.id}`);
      }
    } catch (e: any) {
      toast({ title: "저장 실패", description: e.message, variant: "destructive" });
    }
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
        {/* Photo placeholder */}
        <div className="flex justify-center pt-4 pb-6">
          <button
            type="button"
            onClick={() => setShowImagePicker(true)}
            className="relative w-[160px] h-[160px] rounded-full bg-accent flex items-center justify-center overflow-hidden group"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="식물 사진" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Camera size={32} className="text-muted-foreground" />
                <span className="text-[12px] text-muted-foreground">사진 추가</span>
              </div>
            )}
            <div className="absolute inset-0 bg-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
              <Camera size={28} className="text-background" />
            </div>
          </button>
          {/* Hidden file inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageSelect}
            className="hidden"
          />
          <input
            ref={albumInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

        {/* Image Picker Bottom Sheet */}
        {showImagePicker && (
          <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setShowImagePicker(false)}>
            <div className="absolute inset-0 bg-foreground/40" />
            <div
              className="relative w-full max-w-[393px] bg-card rounded-t-[20px] p-5 pb-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[17px] font-bold text-foreground">사진 선택</h3>
                <button onClick={() => setShowImagePicker(false)}>
                  <X size={22} className="text-muted-foreground" />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center gap-3 w-full h-[52px] px-4 rounded-[14px] bg-accent text-foreground text-[15px] font-medium"
                >
                  <Camera size={22} className="text-primary" />
                  카메라로 촬영
                </button>
                <button
                  onClick={() => albumInputRef.current?.click()}
                  className="flex items-center gap-3 w-full h-[52px] px-4 rounded-[14px] bg-accent text-foreground text-[15px] font-medium"
                >
                  <Image size={22} className="text-primary" />
                  앨범에서 선택
                </button>
                {imagePreview && (
                  <button
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                      setShowImagePicker(false);
                    }}
                    className="flex items-center gap-3 w-full h-[52px] px-4 rounded-[14px] bg-destructive/10 text-destructive text-[15px] font-medium"
                  >
                    <X size={22} />
                    사진 삭제
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

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
                      onClick={() => { setCycleUnit(unit); setShowUnitDropdown(false); }}
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
          disabled={createPlant.isPending || updatePlant.isPending || uploading}
          className="w-full h-[52px] bg-primary text-primary-foreground rounded-[14px] text-[16px] font-semibold disabled:opacity-50"
        >
          {uploading ? "사진 업로드 중..." : createPlant.isPending || updatePlant.isPending ? "저장 중..." : isEdit ? "수정하기" : "등록하기"}
        </button>
      </div>
    </div>
  );
};

export default PlantRegister;
