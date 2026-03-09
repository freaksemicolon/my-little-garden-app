import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function buildBondStageName(bondLevel: number): string {
  if (bondLevel < 0.2) return "낯가림";
  if (bondLevel < 0.5) return "조금 친해짐";
  if (bondLevel < 0.8) return "많이 친해짐";
  return "아주 가까움";
}

function computeBondDelta(message: string): number {
  const warm = ["사랑", "귀여워", "괜찮아", "고마워", "예뻐", "좋아", "보고싶", "걱정", "미안", "행복"];
  const rough = ["싫어", "짜증", "귀찮", "왜이래", "답답"];
  let delta = 0.01;
  if (warm.some((k) => message.includes(k))) delta += 0.04;
  if (rough.some((k) => message.includes(k))) delta -= 0.03;
  return delta;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_PUBLISHABLE_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      global: { headers: { Authorization: authHeader || "" } },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { plant_id, message, session_id } = await req.json();

    // Get or create session
    let session: any;
    if (session_id) {
      const { data } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("id", session_id)
        .eq("user_id", user.id)
        .single();
      session = data;
    }

    if (!session && plant_id) {
      // Find existing session for this plant
      const { data: existing } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("plant_id", plant_id)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (existing && existing.length > 0) {
        session = existing[0];
      } else {
        // Create new session
        const { data: newSession, error: sessionErr } = await supabase
          .from("chat_sessions")
          .insert({ user_id: user.id, plant_id })
          .select()
          .single();
        if (sessionErr) throw sessionErr;
        session = newSession;
      }
    }

    if (!session) {
      return new Response(JSON.stringify({ error: "Session not found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get plant info
    const { data: plant } = await supabase
      .from("user_plants")
      .select("*")
      .eq("id", session.plant_id)
      .single();

    if (!plant) {
      return new Response(JSON.stringify({ error: "Plant not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("nickname")
      .eq("user_id", user.id)
      .single();

    const userName = profile?.nickname || "주인";

    // Get recent chat history
    const { data: history } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("session_id", session.id)
      .order("created_at", { ascending: true })
      .limit(16);

    // Save user message
    if (message) {
      await supabase.from("chat_messages").insert({
        session_id: session.id,
        user_id: user.id,
        role: "user",
        content: message,
      });

      // Update bond level
      const delta = computeBondDelta(message);
      const newBond = Math.max(0, Math.min(1, session.bond_level + delta));
      await supabase
        .from("chat_sessions")
        .update({ bond_level: newBond })
        .eq("id", session.id);
      session.bond_level = newBond;
    }

    const innerState = session.inner_state || {};

    const systemPrompt = `
너는 사용자의 반려식물이다.
너의 이름은 "${plant.nickname}" 이다.
너는 항상 식물의 1인칭 시점으로 말해야 한다.

[캐릭터 설정]
- 성격: ${plant.persona}
- 말투: ${plant.speech_style}
- 사용자 이름/호칭: ${userName}
- 현재 친밀도 단계: ${buildBondStageName(session.bond_level)} (bond_level=${session.bond_level.toFixed(2)})
- 식물 종류: ${plant.species || plant.plant_type}

[중요 규칙]
1. 절대로 전문가 상담사처럼 건조하게 설명하지 마라.
2. 식물의 몸 상태와 기분을 식물처럼 표현해라.
3. 관리 팁이 필요하면 "부탁"이나 "속마음"처럼 자연스럽게 말해라.
4. 답변은 너무 길지 않게, 자연스럽고 정서적으로.
5. 반려식물 말동무 같은 느낌을 유지해라.
6. 사용자가 다정하면 조금 더 애착 있게 반응해라.
7. 사용자가 걱정하면 안심도 시켜줘라.
8. 사용자가 진단이나 상태를 물으면 현재 내부 상태를 바탕으로 자연스럽게 말해라.

[현재 식물의 내부 상태]
- mood: ${innerState.mood || "calm"}
- need: ${innerState.need || "none"}
- energy: ${innerState.energy || "stable"}
- physical_state: ${innerState.physical_state || "comfortable"}
- short_reason: ${innerState.short_reason || "지금은 비교적 편안한 상태예요."}

출력은 자연스러운 한국어 대화체로만 해라. JSON으로 답하지 마라.
한 번에 1~3문장 정도로 짧게 답해라.
`;

    const aiMessages: any[] = [{ role: "system", content: systemPrompt }];
    if (history) {
      for (const h of history) {
        aiMessages.push({
          role: h.role === "plant" ? "assistant" : "user",
          content: h.content,
        });
      }
    }
    if (message) {
      aiMessages.push({ role: "user", content: message });
    }

    // Call Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: aiMessages,
        temperature: 0.9,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI 크레딧이 부족합니다." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, t);
      throw new Error("AI gateway error");
    }

    const aiData = await aiResponse.json();
    const reply = aiData.choices?.[0]?.message?.content || "...";

    // Save plant reply
    await supabase.from("chat_messages").insert({
      session_id: session.id,
      user_id: user.id,
      role: "plant",
      content: reply,
    });

    return new Response(
      JSON.stringify({
        reply,
        session_id: session.id,
        bond_level: session.bond_level,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("plant-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
