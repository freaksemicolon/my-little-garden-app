import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bell, Share2, Link2, Download } from "lucide-react";
import { currentUser, familyMembers } from "@/data/mockData";
import BottomNavigation from "@/components/BottomNavigation";
import { useUser } from "@/contexts/UserContext";

const FamilyLink = () => {
  const navigate = useNavigate();
  const { userInfo } = useUser();

  const allMembers = [
    { name: userInfo.nickname, email: userInfo.email, level: `Lv. ${currentUser.level} 펼쳐지는 떡잎`, isStar: true },
    ...familyMembers.map((m) => ({
      name: m.name,
      email: "",
      level: "Lv. 1 새싹",
      isStar: false,
    })),
  ];

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background pb-[90px]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-2">
        <h1 className="text-[20px] font-bold text-primary tracking-tight">MyLittleGarden</h1>
        <button className="p-2">
          <Bell size={22} className="text-foreground" />
        </button>
      </div>

      <div className="flex items-center px-4 h-[48px]">
        <button onClick={() => navigate(-1)} className="p-2">
          <ChevronLeft size={22} className="text-foreground" />
        </button>
        <h2 className="text-[17px] font-bold text-foreground flex-1 text-center mr-8">가족 연동</h2>
      </div>

      <div className="flex-1 px-5 pt-4 overflow-y-auto">
        {/* QR Code Card */}
        <div className="bg-accent rounded-[16px] p-5 mb-4">
          <p className="text-[14px] text-muted-foreground mb-3">공유 QR 코드</p>
          <div className="flex justify-center mb-4">
            <div className="w-[160px] h-[160px] bg-card rounded-[12px] flex items-center justify-center">
              {/* QR placeholder */}
              <div className="w-[120px] h-[120px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI2MCIgeT0iNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5Ij5RUjwvdGV4dD48L3N2Zz4=')] bg-contain bg-center bg-no-repeat opacity-30" />
            </div>
          </div>
          <div className="flex justify-center gap-6">
            {[
              { icon: Share2, label: "정원 공유" },
              { icon: Link2, label: "링크 복사" },
              { icon: Download, label: "다운로드" },
            ].map(({ icon: Icon, label }) => (
              <button key={label} className="flex flex-col items-center gap-1">
                <Icon size={20} className="text-foreground" />
                <span className="text-[11px] text-foreground">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Family Members */}
        <h3 className="text-[14px] text-muted-foreground mb-3">연동된 가족 ({allMembers.length}/6)</h3>
        <div className="flex flex-col gap-2">
          {allMembers.map((m, i) => (
            <div key={i} className="bg-card rounded-[14px] shadow-card px-4 py-3 flex items-center gap-3">
              <div className="w-[40px] h-[40px] rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                <span className="text-card text-[16px]">{m.name[0]}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-[14px] font-semibold text-foreground">{m.name}</span>
                  {m.isStar && <span className="text-[14px]">⭐</span>}
                </div>
                {m.email && <p className="text-[11px] text-muted-foreground">{m.email}</p>}
              </div>
              <span className="text-[11px] text-muted-foreground">{m.level}</span>
            </div>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default FamilyLink;
