import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bell, Droplets } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import BottomNavigation from "@/components/BottomNavigation";

const getLevelTitle = (level: number) => {
  if (level <= 1) return "새싹";
  if (level <= 2) return "떡잎";
  if (level <= 3) return "펼쳐지는 떡잎";
  if (level <= 5) return "활짝 펴진 떡잎";
  if (level <= 7) return "초록 가드너";
  return "마스터 가드너";
};

const getNextTitle = (level: number) => {
  if (level <= 1) return "떡잎";
  if (level <= 2) return "펼쳐지는 떡잎";
  if (level <= 3) return "활짝 펴진 떡잎";
  if (level <= 5) return "초록 가드너";
  return "마스터 가드너";
};

const GardeningLevel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [levelInfo, setLevelInfo] = useState({ level: 1, exp: 0 });
  const [plants, setPlants] = useState<any[]>([]);
  const [completedQuests, setCompletedQuests] = useState<Set<string>>(new Set());

  const maxExp = levelInfo.level * 300;
  const progress = Math.min((levelInfo.exp / maxExp) * 100, 100);
  const remaining = Math.round(((maxExp - levelInfo.exp) / maxExp) * 100);

  useEffect(() => {
    if (!user) return;
    
    supabase
      .from("profiles")
      .select("level, exp")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setLevelInfo({ level: data.level ?? 1, exp: data.exp ?? 0 });
      });

    supabase
      .from("user_plants")
      .select("id, nickname")
      .eq("user_id", user.id)
      .neq("health_status", "죽음")
      .then(({ data }) => setPlants(data || []));
  }, [user]);

  const completeQuest = async (plantId: string, exp: number) => {
    if (completedQuests.has(plantId) || !user) return;
    
    setCompletedQuests((prev) => new Set(prev).add(plantId));
    
    const newExp = levelInfo.exp + exp;
    let newLevel = levelInfo.level;
    let remainingExp = newExp;
    
    while (remainingExp >= newLevel * 300) {
      remainingExp -= newLevel * 300;
      newLevel++;
    }
    
    setLevelInfo({ level: newLevel, exp: remainingExp });
    
    await supabase
      .from("profiles")
      .update({ level: newLevel, exp: remainingExp })
      .eq("user_id", user.id);
  };

  // Semicircle gauge
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
              <path d={describeArc(startAngle, endAngle)} fill="none" stroke="hsl(var(--border))" strokeWidth="14" strokeLinecap="round" />
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
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
              <span className="text-[13px] text-muted-foreground">나의 레벨</span>
              <span className="text-[44px] font-bold text-foreground leading-none">Lv {levelInfo.level}</span>
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2">
              <span className="text-[11px] text-muted-foreground italic">
                {levelInfo.exp}/{maxExp} exp(다음 레벨까지 {remaining}%)
              </span>
            </div>
          </div>
        </div>

        {/* Level Info Card */}
        <div className="bg-card rounded-[16px] shadow-card p-4 flex items-center gap-3 mb-6">
          <span className="text-[40px]">🌱</span>
          <div className="flex-1">
            <p className="text-[16px] font-bold text-foreground">Lv. {levelInfo.level} {getLevelTitle(levelInfo.level)}</p>
            <p className="text-[13px] text-muted-foreground">다음 칭호 : {getNextTitle(levelInfo.level)}</p>
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
          {plants.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">등록된 식물이 없어요</p>
          ) : (
            plants.map((plant) => {
              const done = completedQuests.has(plant.id);
              return (
                <button
                  key={plant.id}
                  onClick={() => completeQuest(plant.id, 100)}
                  className={`w-full bg-card rounded-[14px] shadow-card px-4 py-4 flex items-center justify-between transition-all ${
                    done ? "bg-accent" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Droplets size={20} className="text-muted-foreground" />
                    <span className={`text-[14px] font-medium ${done ? "text-muted-foreground" : "text-foreground"}`}>
                      {plant.nickname} 물주기
                    </span>
                  </div>
                  <span className={`text-[13px] font-semibold ${done ? "text-muted-foreground" : "text-primary"}`}>
                    {done ? "완료" : "100 exp"}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default GardeningLevel;
