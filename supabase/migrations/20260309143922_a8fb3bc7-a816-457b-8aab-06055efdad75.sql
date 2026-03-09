
-- User plants table
CREATE TABLE public.user_plants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  species TEXT NOT NULL DEFAULT '',
  plant_type TEXT NOT NULL DEFAULT 'generic',
  image_url TEXT,
  adoption_date DATE,
  watering_cycle INTEGER NOT NULL DEFAULT 7,
  watering_unit TEXT NOT NULL DEFAULT '일',
  memo TEXT DEFAULT '',
  last_watered TIMESTAMPTZ,
  health_status TEXT NOT NULL DEFAULT '좋음',
  persona TEXT NOT NULL DEFAULT '다정하고 귀여운 성격',
  speech_style TEXT NOT NULL DEFAULT '반말',
  bond_level REAL NOT NULL DEFAULT 0.3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_plants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own plants" ON public.user_plants
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Chat sessions table
CREATE TABLE public.chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plant_id UUID NOT NULL REFERENCES public.user_plants(id) ON DELETE CASCADE,
  bond_level REAL NOT NULL DEFAULT 0.3,
  inner_state JSONB NOT NULL DEFAULT '{"mood":"calm","need":"none","energy":"stable","physical_state":"comfortable","short_reason":"지금은 비교적 편안한 상태예요."}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own chat sessions" ON public.chat_sessions
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'plant')),
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text',
  diagnosis_result JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own chat messages" ON public.chat_messages
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Activity logs table
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plant_id UUID NOT NULL REFERENCES public.user_plants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  emoji TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own activity logs" ON public.activity_logs
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Diagnosis records table
CREATE TABLE public.diagnosis_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plant_id UUID NOT NULL REFERENCES public.user_plants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem TEXT NOT NULL,
  cause TEXT NOT NULL,
  severity INTEGER NOT NULL DEFAULT 50,
  solution TEXT NOT NULL,
  detail TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.diagnosis_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own diagnosis records" ON public.diagnosis_records
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_user_plants_updated_at BEFORE UPDATE ON public.user_plants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
