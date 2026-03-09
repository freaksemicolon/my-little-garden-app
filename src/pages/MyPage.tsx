import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Edit, Bell, BarChart3, Users, Settings, LogOut, MessageCircle } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { currentUser } from "@/data/mockData";

const MyPage = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background pb-[90px]">
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-[22px] font-bold text-foreground">마이페이지</h1>
      </div>

      <div className="px-5 flex-1 overflow-y-auto">
        {/* Profile card */}
        <div className="bg-card rounded-[16px] shadow-card p-5 flex items-center gap-4">
          <div className="w-[64px] h-[64px] rounded-full bg-accent overflow-hidden flex-shrink-0 flex items-center justify-center">
            <span className="text-[28px]">{currentUser.avatar}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-[17px] font-bold text-foreground">{currentUser.name}</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">{currentUser.email}</p>
          </div>
          <ChevronRight size={20} className="text-muted-foreground" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={() => navigate("/my-plants")}
            className="bg-card rounded-[14px] shadow-card p-4 text-left"
          >
            <p className="text-[24px] font-bold text-primary">{currentUser.plantCount}</p>
            <p className="text-[12px] text-muted-foreground mt-0.5">함께하는 중</p>
          </button>
          <div className="bg-card rounded-[14px] shadow-card p-4 text-left">
            <p className="text-[24px] font-bold text-primary">{currentUser.friendCount}</p>
            <p className="text-[12px] text-muted-foreground mt-0.5">초대한 친구들</p>
          </div>
        </div>

        {/* Menu items */}
        <div className="mt-6 flex flex-col gap-2">
          {[
            { icon: Edit, label: "프로필 수정", action: () => navigate("/profile-edit") },
            { icon: Bell, label: "알림 설정", action: () => navigate("/notification-settings") },
            { icon: BarChart3, label: "가드닝 레벨", action: () => navigate("/gardening-level") },
            { icon: MessageCircle, label: "문의 사항", action: () => setShowContactModal(true) },
            { icon: LogOut, label: "계정 탈퇴", action: () => setShowDeleteModal(true), destructive: true },
          ].map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              className="w-full bg-card rounded-[14px] shadow-card px-4 py-4 flex items-center gap-3"
            >
              <div className="w-[36px] h-[36px] rounded-[10px] bg-accent flex items-center justify-center">
                <item.icon
                  size={18}
                  className={(item as any).destructive ? "text-destructive" : "text-primary"}
                />
              </div>
              <span
                className={`flex-1 text-[14px] font-medium text-left ${
                  (item as any).destructive ? "text-destructive" : "text-foreground"
                }`}
              >
                {item.label}
              </span>
              <ChevronRight size={18} className="text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-card rounded-[20px] w-[320px] p-6 text-center">
            <h3 className="text-[18px] font-bold text-foreground mb-2">계정 탈퇴</h3>
            <p className="text-[14px] text-muted-foreground mb-6">
              정말 탈퇴하시겠습니까?{"\n"}모든 식물 데이터가 삭제됩니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 h-[44px] rounded-[12px] border border-border text-[14px] font-medium text-foreground"
              >
                취소
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  navigate("/login");
                }}
                className="flex-1 h-[44px] rounded-[12px] bg-destructive text-destructive-foreground text-[14px] font-medium"
              >
                진행
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setShowContactModal(false)} />
          <div className="relative bg-card rounded-[20px] w-[320px] p-6">
            <h3 className="text-[18px] font-bold text-foreground mb-4">문의 사항</h3>
            <textarea
              placeholder="문의 내용을 입력해주세요"
              className="w-full h-[120px] px-4 py-3 rounded-[12px] bg-accent text-[14px] text-foreground placeholder:text-muted-foreground outline-none resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowContactModal(false)}
                className="flex-1 h-[44px] rounded-[12px] border border-border text-[14px] font-medium text-foreground"
              >
                취소
              </button>
              <button
                onClick={() => setShowContactModal(false)}
                className="flex-1 h-[44px] rounded-[12px] bg-primary text-primary-foreground text-[14px] font-medium"
              >
                보내기
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default MyPage;
