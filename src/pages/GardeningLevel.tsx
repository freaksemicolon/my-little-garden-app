import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bell, Droplets } from "lucide-react";
import { currentUser, dailyQuests as initialQuests } from "@/data/mockData";
import BottomNavigation from "@/components/BottomNavigation";

const GardeningLevel = () => {
  const navigate = useNavigate();
  const [quests, setQuests] = useState(initialQuests);
  const completedExp = quests.filter((q) => q.completed).reduce((sum, q) => sum + q.exp, 0);
  const totalExp = currentUser.exp + completedExp;
  const maxExp = 1000;
  const progress = (totalExp / maxExp) * 100;
  const remaining = Math.round(((maxExp - totalExp) / maxExp) * 100);

  const toggleQuest = (id: string) => {
    setQuests((prev) => prev.map((q) => (q.id === id ? { ...q, completed: !q.completed } : q)));
  };

  // Semicircle gauge: arc from 150° to 390° (240° sweep)
  const radius = 100;
  const cx = 120;
  const cy = 120;
  const startAngle = 150;
  const sweepAngle = 240;
  const endAngle = startAngle + sweepAngle;
  const progressAngle = startAngle + (sweepAngle * Math.min(progress, 100)) / 100;

  const polarToCartesian = (angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const describeArc = (start: number, end: number) => {
    const s = polarToCartesian(start);
    const e = polarToCartesian(end);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  };

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
        <h2 className="text-[17px] font-bold text-foreground flex-1 text-center mr-8">가드닝 레벨</h2>
      </div>

      <div className="flex-1 px-5 pt-4 overflow-y-auto">
        {/* Semicircle Gauge */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-[240px] h-[180px]">
            <svg viewBox="0 0 240 240" className="w-full h-full">
              {/* Background arc */}
              <path d={describeArc(startAngle, endAngle)} fill="none" stroke="hsl(var(--border))" strokeWidth="14" strokeLinecap="round" />
              {/* Progress arc - gradient from yellow-green to green */}
              {progress > 0 && (
                <path
                  d={describeArc(startAngle, progressAngle)}
                  fill="none"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              )}
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(65, 60%, 65%)" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" />
                </linearGradient>
              </defs>
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
              <span className="text-[13px] text-muted-foreground">나의 레벨</span>
              <span className="text-[44px] font-bold text-foreground leading-none">Lv {currentUser.level}</span>
            </div>
            {/* Top label */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2">
              <span className="text-[11px] text-muted-foreground italic">
                {totalExp}/{maxExp} exp(다음 레벨까지 {remaining}%)
              </span>
            </div>
          </div>
        </div>

        {/* Level Info Card */}
        <div className="bg-card rounded-[16px] shadow-card p-4 flex items-center gap-3 mb-6">
          <span className="text-[40px]">🌱</span>
          <div className="flex-1">
            <p className="text-[16px] font-bold text-foreground">Lv. {currentUser.level} 펼쳐지는 떡잎</p>
            <p className="text-[13px] text-muted-foreground">다음 칭호 : 활짝 펴진 떡잎</p>
            <div className="w-full h-[6px] bg-border rounded-full mt-2">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quests */}
        <h3 className="text-[18px] font-bold text-foreground mb-3">오늘의 퀘스트</h3>
        <div className="flex flex-col gap-2">
          {quests.map((quest) => (
            <button
              key={quest.id}
              onClick={() => toggleQuest(quest.id)}
              className={`w-full bg-card rounded-[14px] shadow-card px-4 py-4 flex items-center justify-between transition-all ${
                quest.completed ? "bg-accent" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <Droplets size={20} className="text-muted-foreground" />
                <span className={`text-[14px] font-medium ${quest.completed ? "text-muted-foreground" : "text-foreground"}`}>
                  {quest.title}
                </span>
              </div>
              <span className={`text-[13px] font-semibold ${quest.completed ? "text-muted-foreground" : "text-primary"}`}>
                {quest.completed ? "완료" : `${quest.exp} exp`}
              </span>
            </button>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default GardeningLevel;
