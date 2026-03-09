import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Check } from "lucide-react";
import { currentUser, dailyQuests as initialQuests } from "@/data/mockData";

const GardeningLevel = () => {
  const navigate = useNavigate();
  const [quests, setQuests] = useState(initialQuests);
  const completedExp = quests.filter((q) => q.completed).reduce((sum, q) => sum + q.exp, 0);
  const totalExp = currentUser.exp + completedExp;
  const progress = Math.min((totalExp / currentUser.maxExp) * 100, 100);

  const toggleQuest = (id: string) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, completed: !q.completed } : q))
    );
  };

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center h-[56px] px-4">
        <button onClick={() => navigate(-1)} className="p-2">
          <ChevronLeft size={24} className="text-foreground" />
        </button>
        <h1 className="text-[17px] font-semibold text-foreground ml-1">가드닝 레벨</h1>
      </div>

      <div className="flex-1 px-5 pt-6">
        {/* Level circle */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-[180px] h-[180px]">
            <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
              <circle cx="90" cy="90" r="80" fill="none" stroke="hsl(var(--border))" strokeWidth="12" />
              <circle
                cx="90"
                cy="90"
                r="80"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${progress * 5.024} ${502.4 - progress * 5.024}`}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[14px] text-muted-foreground">Lv</span>
              <span className="text-[40px] font-bold text-foreground">{currentUser.level}</span>
            </div>
          </div>
          <p className="text-[16px] font-semibold text-foreground mt-3">{currentUser.levelTitle}</p>
          <p className="text-[13px] text-muted-foreground mt-1">
            {totalExp} / {currentUser.maxExp} EXP
          </p>
        </div>

        {/* Quests */}
        <h2 className="text-[18px] font-bold text-foreground mb-3">오늘의 퀘스트</h2>
        <div className="flex flex-col gap-2">
          {quests.map((quest) => (
            <button
              key={quest.id}
              onClick={() => toggleQuest(quest.id)}
              className={`w-full bg-card rounded-[14px] shadow-card p-4 flex items-center justify-between transition-opacity ${
                quest.completed ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-[28px] h-[28px] rounded-full border-2 flex items-center justify-center transition-colors ${
                    quest.completed
                      ? "bg-primary border-primary"
                      : "border-border"
                  }`}
                >
                  {quest.completed && <Check size={16} className="text-primary-foreground" />}
                </div>
                <span
                  className={`text-[14px] font-medium ${
                    quest.completed ? "line-through text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {quest.title}
                </span>
              </div>
              <span className="text-[13px] font-semibold text-primary">{quest.exp} exp</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GardeningLevel;
