import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera } from "lucide-react";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("리나");
  const [style, setStyle] = useState("초보자");
  const [defaultCycle, setDefaultCycle] = useState("7");

  const handleSave = () => {
    navigate(-1);
  };

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background">
      <div className="flex items-center h-[56px] px-4">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-[17px] font-semibold text-foreground ml-2">프로필 수정</h1>
      </div>

      <div className="flex-1 px-5 pt-4">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-[96px] h-[96px] rounded-full bg-secondary flex items-center justify-center overflow-hidden">
              <span className="text-[32px]">🌱</span>
            </div>
            <button className="absolute bottom-0 right-0 w-[30px] h-[30px] rounded-full bg-primary flex items-center justify-center">
              <Camera size={14} className="text-primary-foreground" />
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
              className="w-full h-[48px] px-4 rounded-[12px] bg-muted text-[14px] text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-[13px] font-medium text-foreground mb-1.5 block">식물 관리 스타일</label>
            <input
              type="text"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full h-[48px] px-4 rounded-[12px] bg-muted text-[14px] text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-[13px] font-medium text-foreground mb-1.5 block">물주기 기본 주기 (일)</label>
            <input
              type="number"
              value={defaultCycle}
              onChange={(e) => setDefaultCycle(e.target.value)}
              className="w-full h-[48px] px-4 rounded-[12px] bg-muted text-[14px] text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full h-[52px] bg-primary text-primary-foreground rounded-[14px] text-[16px] font-semibold mt-8"
        >
          저장하기
        </button>
      </div>
    </div>
  );
};

export default ProfileEdit;
