import { useNavigate, useLocation } from "react-router-dom";
import { LayoutGrid, Home, User } from "lucide-react";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-card shadow-nav z-50">
      <div className="flex items-end justify-around h-[80px] pb-4">
        {/* 전체 케어 */}
        <button
          onClick={() => navigate("/home")}
          className="flex flex-col items-center justify-center gap-1 flex-1"
        >
          <LayoutGrid
            size={24}
            className={isActive("/home") ? "text-primary" : "text-muted-foreground"}
          />
          <span
            className={`text-[11px] font-medium ${
              isActive("/home") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            전체 케어
          </span>
        </button>

        {/* 홈 - Center green circle button */}
        <button
          onClick={() => navigate("/home")}
          className="flex flex-col items-center justify-center -mt-6"
        >
          <div className={`w-[60px] h-[60px] rounded-full flex items-center justify-center shadow-lg ${
            isActive("/home") ? "bg-primary" : "bg-primary"
          }`}>
            <Home size={26} className="text-primary-foreground" />
          </div>
          <span className="text-[11px] font-medium text-primary mt-1">홈</span>
        </button>

        {/* 마이페이지 */}
        <button
          onClick={() => navigate("/mypage")}
          className="flex flex-col items-center justify-center gap-1 flex-1"
        >
          <User
            size={24}
            className={isActive("/mypage") ? "text-primary" : "text-muted-foreground"}
          />
          <span
            className={`text-[11px] font-medium ${
              isActive("/mypage") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            마이페이지
          </span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNavigation;
