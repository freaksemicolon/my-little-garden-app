import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronRight } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { currentUser, plantsData, familyMembers } from "@/data/mockData";
import { useUser } from "@/contexts/UserContext";

type Tab = "together" | "farewell" | "settings";

const departedPlants = [
  { id: "d1", nickname: "올리", species: "올리브나무", image: "🫒" },
  { id: "d2", nickname: "바질이", species: "바질", image: "🌿" },
];

const MyPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useUser();
  const [activeTab, setActiveTab] = useState<Tab | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const renderDefaultContent = () => (
    <>
      {/* 가족 연동 관리 */}
      <button
        className="w-full bg-card rounded-[16px] shadow-card px-4 py-4 flex items-center gap-3 mt-4"
        onClick={() => navigate("/family-link")}
      >
        <span className="text-[28px]">👨‍👩‍👧</span>
        <div className="flex-1 text-left">
          <p className="text-[15px] font-semibold text-foreground">가족 연동 관리</p>
          <p className="text-[12px] text-muted-foreground">현재 {familyMembers.length}명의 가족과 관리하고 있어요</p>
        </div>
        <ChevronRight size={20} className="text-muted-foreground" />
      </button>

      {/* 가드닝 레벨 */}
      <button
        onClick={() => navigate("/gardening-level")}
        className="w-full bg-[hsl(var(--accent))] rounded-[16px] shadow-card p-4 mt-3 flex items-stretch gap-0 overflow-hidden"
      >
        <div className="flex-1 text-left py-1">
          <p className="text-[12px] text-muted-foreground mb-1">가드닝 레벨</p>
          <p className="text-[22px] font-bold text-foreground leading-tight">
            Lv. {currentUser.level}{" "}
            <span className="text-[16px] font-semibold">펼쳐지는 떡잎</span>
          </p>
          <p className="text-[12px] text-muted-foreground mt-1">
            {currentUser.exp}/{currentUser.maxExp} xp (다음 레벨까지{" "}
            {Math.round(((currentUser.maxExp - currentUser.exp) / currentUser.maxExp) * 100)}%)
          </p>
          <div className="w-full h-[6px] bg-border rounded-full mt-2">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(currentUser.exp / currentUser.maxExp) * 100}%` }}
            />
          </div>
        </div>
        <div className="w-[100px] -mr-4 -mb-4 -mt-2 flex items-end justify-center">
          <span className="text-[64px]">🌱</span>
        </div>
      </button>
    </>
  );

  const renderTogetherContent = () => (
    <div className="flex flex-col gap-3 mt-4">
      {plantsData.map((plant) => (
        <button
          key={plant.id}
          onClick={() => navigate(`/plant/${plant.id}`)}
          className="w-full bg-card rounded-[16px] shadow-card p-4 flex items-center gap-3"
        >
          <div className="w-[56px] h-[56px] rounded-[12px] bg-accent overflow-hidden flex items-center justify-center flex-shrink-0">
            <img src={plant.image} alt={plant.nickname} className="w-[44px] h-[44px] object-contain" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[15px] font-semibold text-foreground">{plant.nickname}</p>
            <p className="text-[12px] text-muted-foreground">{plant.species}</p>
          </div>
          <ChevronRight size={20} className="text-muted-foreground" />
        </button>
      ))}
    </div>
  );

  const renderFarewellContent = () => (
    <div className="flex flex-col gap-3 mt-4">
      {departedPlants.map((plant) => (
        <div
          key={plant.id}
          className="w-full bg-card rounded-[16px] shadow-card p-4 flex items-center gap-3"
        >
          <div className="w-[56px] h-[56px] rounded-[12px] bg-accent overflow-hidden flex items-center justify-center flex-shrink-0">
            <span className="text-[28px]">{plant.image}</span>
          </div>
          <div className="flex-1 text-left">
            <p className="text-[15px] font-semibold text-foreground">{plant.nickname}</p>
            <p className="text-[12px] text-muted-foreground">{plant.species}</p>
          </div>
          <ChevronRight size={20} className="text-muted-foreground" />
        </div>
      ))}
    </div>
  );

  const renderSettingsContent = () => (
    <div className="flex flex-col gap-3 mt-4">
      <button
        onClick={() => navigate("/notification-settings")}
        className="w-full bg-card rounded-[16px] shadow-card px-4 py-4 flex items-center gap-3"
      >
        <span className="text-[28px]">🔔</span>
        <div className="flex-1 text-left">
          <p className="text-[15px] font-semibold text-foreground">알림 설정</p>
          <p className="text-[12px] text-muted-foreground">알림이 켜진 상태에요.</p>
        </div>
      </button>
      <button
        onClick={() => setShowDeleteModal(true)}
        className="w-full bg-card rounded-[16px] shadow-card px-4 py-4 flex items-center gap-3"
      >
        <span className="text-[28px]">👤</span>
        <div className="flex-1 text-left">
          <p className="text-[15px] font-semibold text-foreground">계정 탈퇴</p>
          <p className="text-[12px] text-muted-foreground">알림이 켜진 상태에요.</p>
        </div>
      </button>
      <button
        onClick={() => setShowContactModal(true)}
        className="w-full bg-card rounded-[16px] shadow-card px-4 py-4 flex items-center gap-3"
      >
        <span className="text-[28px]">💬</span>
        <div className="flex-1 text-left">
          <p className="text-[15px] font-semibold text-foreground">문의 사항</p>
          <p className="text-[12px] text-muted-foreground">알림이 켜진 상태에요.</p>
        </div>
      </button>
    </div>
  );

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background pb-[90px]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-2">
        <h1 className="text-[20px] font-bold text-primary tracking-tight">MyLittleGarden</h1>
        <button onClick={() => navigate("/notification-settings")} className="p-2">
          <Bell size={22} className="text-foreground" />
        </button>
      </div>

      <div className="flex-1 px-5 overflow-y-auto">
        {/* Profile */}
        <div className="flex flex-col items-center pt-4 pb-2">
          <div className="w-[120px] h-[120px] rounded-full bg-[hsl(160,20%,18%)] flex items-center justify-center mb-3">
            <span className="text-[48px]">{currentUser.avatar}</span>
          </div>
          <h2 className="text-[22px] font-bold text-foreground">김{currentUser.name}</h2>
          <p className="text-[13px] text-muted-foreground mt-1">*****@gmail.com</p>
        </div>

        {/* 3 Tab Buttons */}
        <div className="flex gap-2 mt-4">
          {([
            { key: "together" as Tab, label: "함께하는 중", emoji: "🌱" },
            { key: "farewell" as Tab, label: "작별한 친구들", emoji: "🪴" },
            { key: "settings" as Tab, label: "설정", emoji: "⚙️" },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(activeTab === tab.key ? null : tab.key)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-[14px] border transition-all ${
                activeTab === tab.key
                  ? "bg-accent border-primary/20"
                  : "bg-card border-border shadow-card"
              }`}
            >
              <span className="text-[24px]">{tab.emoji}</span>
              <span className="text-[11px] font-medium text-foreground">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === null && renderDefaultContent()}
        {activeTab === "together" && renderTogetherContent()}
        {activeTab === "farewell" && renderFarewellContent()}
        {activeTab === "settings" && renderSettingsContent()}
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
                onClick={() => { setShowDeleteModal(false); navigate("/login"); }}
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
