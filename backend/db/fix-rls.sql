-- Fix RLS Policies for Backend Service Role
-- This allows the backend service role to manage user data and bank connections

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Users can manage own bank connections" ON public.bank_connections;
DROP POLICY IF EXISTS "Users can manage own bank accounts" ON public.bank_accounts;

-- Create new policies that allow service role access
CREATE POLICY "Users can insert own data or service role" ON public.users
  FOR INSERT WITH CHECK (
    auth.uid() = id OR 
    auth.role() = 'service_role'
  );

CREATE POLICY "Users can manage own bank connections or service role" ON public.bank_connections
  FOR ALL USING (
    auth.uid() = user_id OR 
    auth.role() = 'service_role'
  );

CREATE POLICY "Users can manage own bank accounts or service role" ON public.bank_accounts
  FOR ALL USING (
    auth.uid() = user_id OR 
    auth.role() = 'service_role'
  );

-- Also allow service role to update user data
CREATE POLICY "Users can update own data or service role" ON public.users
  FOR UPDATE USING (
    auth.uid() = id OR 
    auth.role() = 'service_role'
  ); 