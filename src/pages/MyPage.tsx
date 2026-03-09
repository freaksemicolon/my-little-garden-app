import { useNavigate } from "react-router-dom";
import { ChevronRight, Edit, Bell, BarChart3 } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";

const menuItems = [
  { icon: Edit, label: "프로필 수정", path: "/profile-edit" },
  { icon: Bell, label: "알림 설정", path: "/notification-settings" },
  { icon: BarChart3, label: "식물 통계", path: "/service" },
];

const MyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background pb-[90px]">
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-[22px] font-bold text-foreground">마이페이지</h1>
      </div>

      <div className="px-5">
        {/* Profile card */}
        <div className="bg-card rounded-[16px] shadow-card p-5 flex items-center gap-4">
          <div className="w-[64px] h-[64px] rounded-full bg-accent overflow-hidden flex-shrink-0 flex items-center justify-center">
            <span className="text-[28px]">🌱</span>
          </div>
          <div className="flex-1">
            <h2 className="text-[17px] font-bold text-foreground">나연</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              관리 식물 3개 · 초보 가드너
            </p>
          </div>
          <ChevronRight size={20} className="text-muted-foreground" />
        </div>

        <div className="mt-6 flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full bg-card rounded-[14px] shadow-card px-4 py-4 flex items-center gap-3"
            >
              <div className="w-[36px] h-[36px] rounded-[10px] bg-accent flex items-center justify-center">
                <item.icon size={18} className="text-primary" />
              </div>
              <span className="flex-1 text-[14px] font-medium text-foreground text-left">{item.label}</span>
              <ChevronRight size={18} className="text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MyPage;
