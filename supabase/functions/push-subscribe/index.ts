import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Generate VAPID key pair using Web Crypto API
async function generateVapidKeys(): Promise<{ publicKey: string; privateKey: string }> {
  const keyPair = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"]
  );

  const publicJwk = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
  const privateJwk = await crypto.subtle.exportKey("jwk", keyPair.privateKey);

  // Convert JWK to URL-safe base64 (uncompressed public key for applicationServerKey)
  const x = publicJwk.x!;
  const y = publicJwk.y!;

  // Build uncompressed point: 0x04 || x || y
  const xBytes = base64UrlToBytes(x);
  const yBytes = base64UrlToBytes(y);
  const uncompressed = new Uint8Array(65);
  uncompressed[0] = 0x04;
  uncompressed.set(xBytes, 1);
  uncompressed.set(yBytes, 33);

  const publicKeyBase64 = bytesToBase64Url(uncompressed);

  return {
    publicKey: publicKeyBase64,
    privateKey: JSON.stringify(privateJwk),
  };
}

function base64UrlToBytes(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4));
  const binary = atob(base64 + pad);
  return new Uint8Array([...binary].map((c) => c.charCodeAt(0)));
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getOrCreateVapidKeys(
  supabase: any
): Promise<{ publicKey: string; privateKey: string }> {
  // Try to get existing keys
  const { data: pubRow } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "vapid_public_key")
    .single();

  const { data: privRow } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "vapid_private_key")
    .single();

  if (pubRow && privRow) {
    return { publicKey: pubRow.value, privateKey: privRow.value };
  }

  // Generate new keys
  const keys = await generateVapidKeys();

  await supabase.from("app_settings").upsert([
    { key: "vapid_public_key", value: keys.publicKey },
    { key: "vapid_private_key", value: keys.privateKey },
  ]);

  return keys;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization");

    // Service role client for app_settings
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // User client for auth
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseUser = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader || "" } },
    });

    const {
      data: { user },
    } = await supabaseUser.auth.getUser();

    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "get_vapid_key";

    if (action === "get_vapid_key") {
      // Return VAPID public key (no auth needed for this)
      const keys = await getOrCreateVapidKeys(supabaseAdmin);
      return new Response(JSON.stringify({ vapidPublicKey: keys.publicKey }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "subscribe") {
      const { subscription } = await req.json();
      if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
        return new Response(JSON.stringify({ error: "Invalid subscription" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await supabaseAdmin.from("push_subscriptions").upsert(
        {
          user_id: user.id,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth_key: subscription.keys.auth,
        },
        { onConflict: "user_id,endpoint" }
      );

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "unsubscribe") {
      const { endpoint } = await req.json();
      await supabaseAdmin
        .from("push_subscriptions")
        .delete()
        .eq("user_id", user.id)
        .eq("endpoint", endpoint);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("push-subscribe error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
