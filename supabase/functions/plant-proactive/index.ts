import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ─── Web Push helpers ───

function base64UrlToBytes(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  const bin = atob(b64 + pad);
  return new Uint8Array([...bin].map((c) => c.charCodeAt(0)));
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sendWebPush(
  sub: { endpoint: string; p256dh: string; auth_key: string },
  payload: string,
  vapidPrivateJwk: JsonWebKey,
  vapidPublicKey: string
): Promise<boolean> {
  try {
    // For Web Push, we need to:
    // 1. Create VAPID JWT
    // 2. Encrypt payload with subscription keys
    // 3. Send to push endpoint
    // This is a simplified version - sends without encryption for basic notification

    const url = new URL(sub.endpoint);
    const audience = `${url.protocol}//${url.host}`;

    // Create VAPID JWT
    const privateKey = await crypto.subtle.importKey(
      "jwk",
      vapidPrivateJwk,
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["sign"]
    );

    const header = { typ: "JWT", alg: "ES256" };
    const now = Math.floor(Date.now() / 1000);
    const claims = {
      aud: audience,
      exp: now + 86400,
      sub: "mailto:noreply@lovable.app",
    };

    const headerB64 = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(header)));
    const claimsB64 = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(claims)));
    const signingInput = new TextEncoder().encode(`${headerB64}.${claimsB64}`);

    const signature = await crypto.subtle.sign(
      { name: "ECDSA", hash: "SHA-256" },
      privateKey,
      signingInput
    );

    // Convert DER signature to raw r||s
    const sigBytes = new Uint8Array(signature);
    let r: Uint8Array, s: Uint8Array;
    if (sigBytes.length === 64) {
      r = sigBytes.slice(0, 32);
      s = sigBytes.slice(32, 64);
    } else {
      // DER format
      const rLen = sigBytes[3];
      const rStart = 4;
      r = sigBytes.slice(rStart, rStart + rLen);
      const sLen = sigBytes[rStart + rLen + 1];
      const sStart = rStart + rLen + 2;
      s = sigBytes.slice(sStart, sStart + sLen);
      // Pad/trim to 32 bytes
      if (r.length > 32) r = r.slice(r.length - 32);
      if (s.length > 32) s = s.slice(s.length - 32);
      if (r.length < 32) { const tmp = new Uint8Array(32); tmp.set(r, 32 - r.length); r = tmp; }
      if (s.length < 32) { const tmp = new Uint8Array(32); tmp.set(s, 32 - s.length); s = tmp; }
    }
    const rawSig = new Uint8Array(64);
    rawSig.set(r, 0);
    rawSig.set(s, 32);

    const jwt = `${headerB64}.${claimsB64}.${bytesToBase64Url(rawSig)}`;

    // Send push (without payload encryption for TTL=0 notification)
    const resp = await fetch(sub.endpoint, {
      method: "POST",
      headers: {
        Authorization: `vapid t=${jwt}, k=${vapidPublicKey}`,
        "Content-Type": "application/octet-stream",
        "Content-Length": "0",
        TTL: "86400",
        Urgency: "normal",
      },
    });

    if (resp.status === 201 || resp.status === 200) return true;
    console.error(`Push failed: ${resp.status} ${await resp.text()}`);
    return false;
  } catch (e) {
    console.error("sendWebPush error:", e);
    return false;
  }
}

// ─── Proactive message conditions ───

interface PlantData {
  id: string;
  user_id: string;
  nickname: string;
  species: string;
  persona: string;
  speech_style: string;
  watering_cycle: number;
  watering_unit: string;
  last_watered: string | null;
  plant_type: string;
}

function needsWatering(plant: PlantData): boolean {
  if (!plant.last_watered) return true;
  const lastWatered = new Date(plant.last_watered);
  const now = new Date();
  const hoursDiff = (now.getTime() - lastWatered.getTime()) / 3600000;

  let cycleHours = plant.watering_cycle;
  if (plant.watering_unit === "일") cycleHours *= 24;
  else if (plant.watering_unit === "주") cycleHours *= 168;

  return hoursDiff >= cycleHours;
}

function hasRecentProactive(
  records: any[],
  plantId: string,
  type: string,
  hoursAgo: number
): boolean {
  const cutoff = new Date(Date.now() - hoursAgo * 3600000).toISOString();
  return records.some(
    (r: any) => r.plant_id === plantId && r.message_type === type && r.created_at > cutoff
  );
}

// ─── Main ───

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get all plants
    const { data: plants, error: plantsErr } = await supabase
      .from("user_plants")
      .select("*");
    if (plantsErr) throw plantsErr;
    if (!plants || plants.length === 0) {
      return new Response(JSON.stringify({ message: "No plants" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get VAPID keys
    const { data: vapidPubRow } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "vapid_public_key")
      .single();
    const { data: vapidPrivRow } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "vapid_private_key")
      .single();

    const vapidPublicKey = vapidPubRow?.value;
    const vapidPrivateJwk = vapidPrivRow ? JSON.parse(vapidPrivRow.value) : null;

    // Group plants by user
    const plantsByUser: Record<string, PlantData[]> = {};
    for (const p of plants) {
      if (!plantsByUser[p.user_id]) plantsByUser[p.user_id] = [];
      plantsByUser[p.user_id].push(p);
    }

    const now = new Date();
    const currentHour = now.getUTCHours() + 9; // KST approximation
    const isMorning = currentHour >= 7 && currentHour <= 10;

    let totalMessages = 0;

    for (const [userId, userPlants] of Object.entries(plantsByUser)) {
      // Get recent proactive message records for this user (last 24h)
      const { data: recentProactive } = await supabase
        .from("proactive_messages")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", new Date(Date.now() - 86400000).toISOString());

      const records = recentProactive || [];

      // Get user's last chat activity
      const { data: lastChat } = await supabase
        .from("chat_messages")
        .select("created_at")
        .eq("user_id", userId)
        .eq("role", "user")
        .order("created_at", { ascending: false })
        .limit(1);

      const lastChatTime = lastChat?.[0]?.created_at;
      const hoursSinceLastChat = lastChatTime
        ? (Date.now() - new Date(lastChatTime).getTime()) / 3600000
        : 999;

      // Get user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("user_id", userId)
        .single();
      const userName = profile?.nickname || "주인";

      for (const plant of userPlants) {
        const messagesToSend: { type: string; prompt: string }[] = [];

        // 1. Watering reminder
        if (needsWatering(plant) && !hasRecentProactive(records, plant.id, "watering_reminder", 12)) {
          messagesToSend.push({
            type: "watering_reminder",
            prompt: `너는 ${plant.nickname}이야. 물이 필요한 상태야. ${userName}에게 목마르다고 자연스럽게 말해줘. 1~2문장으로 짧게.`,
          });
        }

        // 2. Miss you (inactive > 48h)
        if (hoursSinceLastChat > 48 && !hasRecentProactive(records, plant.id, "miss_you", 24)) {
          messagesToSend.push({
            type: "miss_you",
            prompt: `너는 ${plant.nickname}이야. ${userName}이(가) ${Math.floor(hoursSinceLastChat)}시간 동안 안 왔어. 보고싶다고 자연스럽게 말해줘. 1~2문장으로 짧게.`,
          });
        }

        // 3. Morning greeting
        if (isMorning && !hasRecentProactive(records, plant.id, "morning_greeting", 20)) {
          messagesToSend.push({
            type: "morning_greeting",
            prompt: `너는 ${plant.nickname}이야. ${userName}에게 좋은 아침 인사를 해줘. 식물답게 자연스럽게. 1~2문장으로 짧게.`,
          });
        }

        for (const msg of messagesToSend) {
          try {
            // Generate AI message
            const systemPrompt = `너는 사용자의 반려식물 "${plant.nickname}"이다. 성격: ${plant.persona}. 말투: ${plant.speech_style}. 식물 종류: ${plant.species || plant.plant_type}. 식물의 1인칭으로 말해라. 한국어로만 답해라. JSON 금지.`;

            const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${LOVABLE_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "google/gemini-2.5-flash-lite",
                messages: [
                  { role: "system", content: systemPrompt },
                  { role: "user", content: msg.prompt },
                ],
                temperature: 0.9,
              }),
            });

            if (!aiResp.ok) {
              console.error(`AI error for ${plant.nickname}: ${aiResp.status}`);
              continue;
            }

            const aiData = await aiResp.json();
            const reply = aiData.choices?.[0]?.message?.content || "";
            if (!reply) continue;

            // Get or create chat session
            let sessionId: string;
            const { data: existingSession } = await supabase
              .from("chat_sessions")
              .select("id")
              .eq("plant_id", plant.id)
              .eq("user_id", userId)
              .order("created_at", { ascending: false })
              .limit(1);

            if (existingSession && existingSession.length > 0) {
              sessionId = existingSession[0].id;
            } else {
              const { data: newSession } = await supabase
                .from("chat_sessions")
                .insert({ user_id: userId, plant_id: plant.id })
                .select("id")
                .single();
              if (!newSession) continue;
              sessionId = newSession.id;
            }

            // Save message
            await supabase.from("chat_messages").insert({
              session_id: sessionId,
              user_id: userId,
              role: "plant",
              content: reply,
              message_type: msg.type,
            });

            // Record proactive message
            await supabase.from("proactive_messages").insert({
              user_id: userId,
              plant_id: plant.id,
              message_type: msg.type,
            });

            totalMessages++;

            // Send push notification
            if (vapidPublicKey && vapidPrivateJwk) {
              const { data: subs } = await supabase
                .from("push_subscriptions")
                .select("*")
                .eq("user_id", userId);

              if (subs) {
                for (const sub of subs) {
                  await sendWebPush(sub, reply, vapidPrivateJwk, vapidPublicKey);
                }
              }
            }
          } catch (e) {
            console.error(`Error processing ${msg.type} for ${plant.nickname}:`, e);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, messages_sent: totalMessages }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("plant-proactive error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
