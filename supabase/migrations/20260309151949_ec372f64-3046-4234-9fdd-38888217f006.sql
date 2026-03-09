
-- Push subscriptions table for Web Push notifications
CREATE TABLE public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  endpoint text NOT NULL,
  p256dh text NOT NULL,
  auth_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own push subscriptions"
ON public.push_subscriptions FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- App settings table for VAPID keys etc
CREATE TABLE public.app_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Only service role can access app_settings (no RLS policy for anon/authenticated)
-- Edge functions use service role key to read these

-- Proactive messages tracking to avoid duplicates
CREATE TABLE public.proactive_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plant_id uuid NOT NULL,
  message_type text NOT NULL, -- 'watering_reminder', 'miss_you', 'morning_greeting'
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.proactive_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own proactive messages"
ON public.proactive_messages FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Index for efficient lookups
CREATE INDEX idx_proactive_messages_lookup 
ON public.proactive_messages (user_id, plant_id, message_type, created_at DESC);
