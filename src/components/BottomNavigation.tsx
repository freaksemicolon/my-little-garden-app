import { useNavigate, useLocation } from "react-router-dom";
import { Home, Leaf, MessageCircle, User } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Leaf, label: "Plants", path: "/my-plants" },
  { icon: MessageCircle, label: "Chat", path: "/chat" },
  { icon: User, label: "MyPage", path: "/mypage" },
];

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-card shadow-nav z-50">
      <div className="flex items-center justify-around h-[64px]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full"
            >
              <item.icon
                size={22}
                className={isActive ? "text-primary" : "text-garden-gray"}
              />
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-primary" : "text-garden-text-secondary"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
