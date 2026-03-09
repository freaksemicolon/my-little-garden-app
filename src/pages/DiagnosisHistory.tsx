import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface DiagnosisRecord {
  id: string;
  plant_id: string;
  problem: string;
  cause: string;
  severity: number;
  solution: string;
  detail: string;
  created_at: string;
  plant_nickname?: string;
}

const DiagnosisHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: records = [], isLoading } = useQuery({
    queryKey: ["diagnosis_records", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("diagnosis_records")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Fetch plant nicknames
      const plantIds = [...new Set((data || []).map((r: any) => r.plant_id))];
      const { data: plants } = await supabase
        .from("user_plants")
        .select("id, nickname")
        .in("id", plantIds);

      const plantMap = new Map((plants || []).map((p: any) => [p.id, p.nickname]));

      return (data || []).map((r: any) => ({
        ...r,
        plant_nickname: plantMap.get(r.plant_id) || "식물",
      })) as DiagnosisRecord[];
    },
    enabled: !!user,
  });

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center h-[56px] px-4">
        <button onClick={() => navigate(-1)} className="p-2">
          <ChevronLeft size={24} className="text-foreground" />
        </button>
        <h1 className="text-[17px] font-semibold text-foreground ml-1">진단 히스토리</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-2">
        {isLoading ? (
          <p className="text-center text-muted-foreground py-10">불러오는 중...</p>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-[48px]">🩺</span>
            <p className="text-muted-foreground text-[14px]">아직 진단 기록이 없어요</p>
            <p className="text-muted-foreground text-[13px]">식물과 대화하면서 진단을 받아보세요!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {records.map((record) => {
              const isExpanded = expandedId === record.id;
              const dateObj = new Date(record.created_at);
              const dateStr = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, "0")}.${String(dateObj.getDate()).padStart(2, "0")}`;

              return (
                <div key={record.id} className="bg-card rounded-[16px] shadow-card overflow-hidden">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : record.id)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[12px] text-muted-foreground">{dateStr}</span>
                          <span className="text-[12px] text-primary font-medium">{record.plant_nickname}</span>
                        </div>
                        <h3 className="text-[15px] font-semibold text-foreground">{record.problem}</h3>
                        <p className="text-[12px] text-muted-foreground mt-0.5">{record.cause}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-[40px] h-[6px] bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${record.severity}%`,
                              backgroundColor:
                                record.severity > 60
                                  ? "hsl(var(--destructive))"
                                  : record.severity > 30
                                  ? "hsl(var(--garden-orange))"
                                  : "hsl(var(--garden-green))",
                            }}
                          />
                        </div>
                        <span className="text-[11px] text-muted-foreground">{record.severity}%</span>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-border pt-3">
                      <div className="bg-accent rounded-[12px] p-3">
                        <p className="text-[13px] font-semibold text-foreground mb-1">조치 방법</p>
                        <p className="text-[13px] text-foreground leading-relaxed">{record.solution}</p>
                      </div>
                      {record.detail && (
                        <div className="bg-accent rounded-[12px] p-3 mt-2">
                          <p className="text-[13px] font-semibold text-foreground mb-1">상세 진단</p>
                          <p className="text-[13px] text-muted-foreground leading-relaxed">{record.detail}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosisHistory;
