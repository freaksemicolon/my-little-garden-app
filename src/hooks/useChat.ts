import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ChatMsg {
  role: "plant" | "user";
  content: string;
  timestamp: string;
  type: "text" | "diagnosis-loading" | "diagnosis-result";
  diagnosisResult?: { cause: string; solution: string };
}

function getTime() {
  const now = new Date();
  const h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  return `${String(h % 12 || 12).padStart(2, "0")}:${m} ${ampm}`;
}

export function useChat(plantId: string | undefined) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [bondLevel, setBondLevel] = useState(0.3);

  const loadHistory = useCallback(async () => {
    if (!user || !plantId) return;

    // Find existing session
    const { data: sessions } = await supabase
      .from("chat_sessions")
      .select("id, bond_level")
      .eq("plant_id", plantId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (sessions && sessions.length > 0) {
      const sid = sessions[0].id;
      setSessionId(sid);
      setBondLevel(sessions[0].bond_level);

      const { data: msgs } = await supabase
        .from("chat_messages")
        .select("role, content, created_at")
        .eq("session_id", sid)
        .order("created_at", { ascending: true })
        .limit(50);

      if (msgs) {
        setMessages(
          msgs.map((m: any) => ({
            role: m.role as "plant" | "user",
            content: m.content,
            timestamp: new Date(m.created_at).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            type: "text" as const,
          }))
        );
      }
    }
  }, [user, plantId]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !plantId || isLoading) return;

      const time = getTime();
      const userMsg: ChatMsg = { role: "user", content: text, timestamp: time, type: "text" };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const { data, error } = await supabase.functions.invoke("plant-chat", {
          body: { plant_id: plantId, message: text, session_id: sessionId },
        });

        if (error) throw error;

        if (data?.session_id) setSessionId(data.session_id);
        if (data?.bond_level !== undefined) setBondLevel(data.bond_level);

        const plantMsg: ChatMsg = {
          role: "plant",
          content: data?.reply || "...",
          timestamp: getTime(),
          type: "text",
        };
        setMessages((prev) => [...prev, plantMsg]);
      } catch (e: any) {
        console.error("Chat error:", e);
        const errorMsg: ChatMsg = {
          role: "plant",
          content: "미안, 지금 좀 기운이 없어서 말을 못하겠어... 잠시 후 다시 말걸어줘! 🥺",
          timestamp: getTime(),
          type: "text",
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [plantId, sessionId, isLoading]
  );

  return { messages, isLoading, sendMessage, loadHistory, bondLevel, sessionId };
}
