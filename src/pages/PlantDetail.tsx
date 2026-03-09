import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Edit3, ChevronDown, ChevronUp } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { plantsData } from "@/data/mockData";

const PlantDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const plant = plantsData.find((p) => p.id === id) || plantsData[0];
  const [expandedLog, setExpandedLog] = useState(0);

  const adoptionDate = new Date(plant.adoptionDate);
  const dateStr = `${adoptionDate.getFullYear()}년 ${String(adoptionDate.getMonth() + 1).padStart(2, "0")}월 ${String(adoptionDate.getDate()).padStart(2, "0")}일부터 함께하는 중`;

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background pb-[90px]">
      {/* Header */}
      <div className="flex items-center justify-between h-[56px] px-4">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft size={24} className="text-foreground" />
          </button>
          <span className="text-[17px] font-semibold text-foreground ml-1">프로필 보기</span>
        </div>
        <button onClick={() => navigate(`/plant/${plant.id}/edit`)} className="p-2">
          <Edit3 size={20} className="text-foreground" />
        </button>
      </div>

      {/* Plant Hero */}
      <div className="bg-beige-gradient px-5 pt-4 pb-6 flex flex-col items-center">
        <div className="w-[180px] h-[180px] rounded-full bg-accent/50 flex items-center justify-center">
          <img src={plant.image} alt={plant.nickname} className="w-[140px] h-[140px] object-contain" />
        </div>
        <h2 className="text-[22px] font-bold text-foreground mt-4">{plant.nickname}</h2>
        <p className="text-[14px] text-muted-foreground mt-1">{plant.species}</p>
        <p className="text-[12px] text-muted-foreground mt-1">{dateStr}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-4">
        {/* Memo Card */}
        <div className="bg-card rounded-[16px] shadow-card p-4 mb-4 flex items-start gap-3">
          <span className="text-[28px]">📋</span>
          <div>
            <h3 className="text-[15px] font-bold text-foreground">{plant.nickname}를 위한 메모</h3>
            <p className="text-[13px] text-muted-foreground mt-1">{plant.memo}</p>
          </div>
        </div>

        {/* Activity Log Card */}
        <div className="bg-card rounded-[16px] shadow-card p-4">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-[28px]">🌱</span>
            <div>
              <h3 className="text-[15px] font-bold text-foreground">{plant.nickname}의 최근 활동 로그</h3>
              <p className="text-[12px] text-muted-foreground">{plant.nickname}의 성장과정을 한 눈에 보아요</p>
            </div>
          </div>

          {plant.activityLogs.map((log, logIdx) => (
            <div key={logIdx} className="mb-3">
              <button
                onClick={() => setExpandedLog(expandedLog === logIdx ? -1 : logIdx)}
                className="flex items-center gap-2 bg-accent rounded-full px-3 py-1.5 mb-2"
              >
                {expandedLog === logIdx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                <span className="text-[13px] font-medium text-foreground">{log.date}</span>
              </button>
              {expandedLog === logIdx && (
                <div className="flex flex-col gap-2 ml-2">
                  {log.entries.map((entry, entryIdx) => (
                    <div key={entryIdx} className="flex items-center justify-between">
                      <span className="text-[13px] text-foreground">
                        {entry.person} 님이 {entry.action}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{entry.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chat with plant */}
        <button
          onClick={() => navigate(`/chat/${plant.id}`)}
          className="w-full bg-primary text-primary-foreground rounded-[14px] h-[48px] text-[15px] font-semibold mt-4 mb-4"
        >
          {plant.nickname}와 대화하기
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PlantDetail;
