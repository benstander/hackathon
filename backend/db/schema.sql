-- Users table (extended from Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  mobile_number TEXT,
  basiq_user_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bank connections table
CREATE TABLE IF NOT EXISTS public.bank_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  basiq_user_id TEXT NOT NULL,
  connection_id TEXT,
  institution_id TEXT,
  institution_name TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'connected', 'disconnected', 'error'
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bank accounts table
CREATE TABLE IF NOT EXISTS public.bank_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  connection_id UUID REFERENCES public.bank_connections(id) ON DELETE CASCADE,
  basiq_account_id TEXT UNIQUE NOT NULL,
  account_number TEXT,
  account_name TEXT,
  account_type TEXT,
  institution_name TEXT,
  balance DECIMAL(15,2),
  available_balance DECIMAL(15,2),
  currency TEXT DEFAULT 'AUD',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_basiq_user_id ON public.users(basiq_user_id);
CREATE INDEX IF NOT EXISTS idx_bank_connections_user_id ON public.bank_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_connections_status ON public.bank_connections(status);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_user_id ON public.bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_basiq_id ON public.bank_accounts(basiq_account_id);

-- Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own bank connections" ON public.bank_connections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own bank connections" ON public.bank_connections
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own bank accounts" ON public.bank_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own bank accounts" ON public.bank_accounts
  FOR ALL USING (auth.uid() = user_id);