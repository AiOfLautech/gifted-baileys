-- Create users profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Create bots table
CREATE TABLE IF NOT EXISTS public.bots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  phone_number TEXT,
  status TEXT DEFAULT 'disconnected', -- disconnected, connecting, connected, error
  is_active BOOLEAN DEFAULT TRUE,
  config JSONB NOT NULL DEFAULT '{}',
  session_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bots_select_own" ON public.bots 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "bots_insert_own" ON public.bots 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bots_update_own" ON public.bots 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "bots_delete_own" ON public.bots 
  FOR DELETE USING (auth.uid() = user_id);

-- Create messages table for logging
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES public.bots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_number TEXT NOT NULL,
  to_number TEXT NOT NULL,
  content TEXT,
  message_type TEXT, -- text, image, document, audio, etc
  direction TEXT NOT NULL, -- incoming, outgoing
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_select_own" ON public.messages 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "messages_insert_own" ON public.messages 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create bot rules/automation table
CREATE TABLE IF NOT EXISTS public.bot_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES public.bots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger TEXT NOT NULL, -- keyword, pattern, etc
  trigger_type TEXT, -- exact, contains, regex, etc
  action TEXT NOT NULL, -- response text or action
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bot_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rules_select_own" ON public.bot_rules 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "rules_insert_own" ON public.bot_rules 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "rules_update_own" ON public.bot_rules 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "rules_delete_own" ON public.bot_rules 
  FOR DELETE USING (auth.uid() = user_id);

-- Create contacts/whitelist table
CREATE TABLE IF NOT EXISTS public.bot_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES public.bots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  contact_name TEXT,
  is_whitelisted BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bot_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contacts_select_own" ON public.bot_contacts 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "contacts_insert_own" ON public.bot_contacts 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "contacts_update_own" ON public.bot_contacts 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "contacts_delete_own" ON public.bot_contacts 
  FOR DELETE USING (auth.uid() = user_id);

-- Create analytics table
CREATE TABLE IF NOT EXISTS public.bot_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES public.bots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_messages_received INTEGER DEFAULT 0,
  total_messages_sent INTEGER DEFAULT 0,
  active_conversations INTEGER DEFAULT 0,
  uptime_percentage FLOAT,
  last_activity TIMESTAMPTZ,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bot_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "analytics_select_own" ON public.bot_analytics 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "analytics_insert_own" ON public.bot_analytics 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create file uploads table
CREATE TABLE IF NOT EXISTS public.bot_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES public.bots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  file_path TEXT NOT NULL,
  file_content JSONB, -- For JSON config files
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bot_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "files_select_own" ON public.bot_files 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "files_insert_own" ON public.bot_files 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "files_delete_own" ON public.bot_files 
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for auto-creating profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
