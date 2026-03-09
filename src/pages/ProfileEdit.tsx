import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Edit2 } from "lucide-react";
import plantSucculent from "@/assets/plant-succulent.png";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("나연");
  const [style, setStyle] = useState("초보자");
  const [defaultCycle, setDefaultCycle] = useState("7");

  const handleSave = () => {
    navigate(-1);
  };

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background">
      <div className="flex items-center h-[56px] px-4">
        <button onClick={() => navigate(-1)} className="p-2">
          <ChevronLeft size={24} className="text-foreground" />
        </button>
        <h1 className="text-[17px] font-semibold text-foreground ml-1">프로필 수정</h1>
      </div>

      <div className="flex-1 px-5 pt-4">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-[96px] h-[96px] rounded-full bg-accent flex items-center justify-center overflow-hidden">
              <span className="text-[32px]">🌱</span>
            </div>
            <button className="absolute bottom-0 right-0 w-[30px] h-[30px] rounded-full bg-card border border-border flex items-center justify-center">
              <Edit2 size={14} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[13px] font-medium text-foreground mb-1.5 block">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-[48px] px-4 rounded-[12px] bg-accent text-[14px] text-foreground outline-none"
            />
          </div>
          <div>
            <label className="text-[13px] font-medium text-foreground mb-1.5 block">식물 관리 스타일</label>
            <input
              type="text"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full h-[48px] px-4 rounded-[12px] bg-accent text-[14px] text-foreground outline-none"
            />
          </div>
          <div>
            <label className="text-[13px] font-medium text-foreground mb-1.5 block">물주기 기본 주기 (일)</label>
            <input
              type="number"
              value={defaultCycle}
              onChange={(e) => setDefaultCycle(e.target.value)}
              className="w-full h-[48px] px-4 rounded-[12px] bg-accent text-[14px] text-foreground outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full h-[52px] bg-primary text-primary-foreground rounded-[12px] text-[16px] font-semibold mt-8"
        >
          저장하기
        </button>
      </div>
    </div>
  );
};

export default ProfileEdit;
