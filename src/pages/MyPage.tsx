import { useNavigate } from "react-router-dom";
import { ChevronRight, Edit, Bell, BarChart3 } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import ProfileCard from "@/components/ProfileCard";
import logo from "@/assets/logo.png";

const menuItems = [
  { icon: Edit, label: "프로필 수정", path: "/profile-edit" },
  { icon: Bell, label: "알림 설정", path: "/notification-settings" },
  { icon: BarChart3, label: "식물 통계", path: "/service" },
];

const MyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background pb-[80px]">
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-[22px] font-bold text-foreground">마이페이지</h1>
      </div>

      <div className="px-5">
        <ProfileCard
          avatar={logo}
          name="리나"
          plantCount={3}
          level="초보 가드너"
        />

        <div className="mt-6 flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full bg-card rounded-[14px] shadow-card px-4 py-4 flex items-center gap-3"
            >
              <div className="w-[36px] h-[36px] rounded-[10px] bg-secondary flex items-center justify-center">
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
