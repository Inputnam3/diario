-- Migration script to create all necessary tables for Natuzap

-- Create users/profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at timestamp with time zone,
  name text,
  phone_number text UNIQUE,
  weight_kg numeric,
  height_cm numeric,
  daily_calorie_goal integer,
  water_liters_goal numeric,
  steps_count_goal integer,
  activity_minutes_goal integer,
  sleep_hours_goal numeric,
  created_at timestamp with time zone DEFAULT now()
);

-- Create foods table
CREATE TABLE IF NOT EXISTS public.foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  calories_per_100g numeric NOT NULL,
  protein_g numeric,
  carbs_g numeric,
  fat_g numeric,
  fiber_g numeric,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create consumptions table
CREATE TABLE IF NOT EXISTS public.consumptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  item text NOT NULL,
  consumed_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Create nutrition_goals table
CREATE TABLE IF NOT EXISTS public.nutrition_goals (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  calories_target numeric,
  protein_target numeric,
  carbs_target numeric,
  fat_target numeric,
  fiber_target numeric,
  created_at timestamptz DEFAULT now()
);

-- Create registros_alimentares table
CREATE TABLE IF NOT EXISTS public.registros_alimentares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  alimento text NOT NULL,
  quantidade_g numeric NOT NULL,
  tipo_refeicao text,
  data_registro timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Add RLS policies for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Add RLS policies for foods
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view foods" ON public.foods FOR SELECT USING (true);
CREATE POLICY "Only admins can insert foods" ON public.foods FOR INSERT WITH CHECK (false); -- Adjust as needed
CREATE POLICY "Only admins can update foods" ON public.foods FOR UPDATE USING (false); -- Adjust as needed
CREATE POLICY "Only admins can delete foods" ON public.foods FOR DELETE USING (false); -- Adjust as needed

-- Add RLS policies for consumptions
ALTER TABLE public.consumptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own consumptions" ON public.consumptions FOR SELECT USING (user_id = auth.jwt() ->> 'sub');
CREATE POLICY "Users can insert their own consumptions" ON public.consumptions FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'sub');
CREATE POLICY "Users can update their own consumptions" ON public.consumptions FOR UPDATE USING (user_id = auth.jwt() ->> 'sub');
CREATE POLICY "Users can delete their own consumptions" ON public.consumptions FOR DELETE USING (user_id = auth.jwt() ->> 'sub');

-- Add RLS policies for nutrition_goals
ALTER TABLE public.nutrition_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own nutrition goals" ON public.nutrition_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own nutrition goals" ON public.nutrition_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own nutrition goals" ON public.nutrition_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own nutrition goals" ON public.nutrition_goals FOR DELETE USING (auth.uid() = user_id);

-- Add RLS policies for registros_alimentares
ALTER TABLE public.registros_alimentares ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own food records" ON public.registros_alimentares FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own food records" ON public.registros_alimentares FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own food records" ON public.registros_alimentares FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own food records" ON public.registros_alimentares FOR DELETE USING (user_id = auth.uid());

-- Add goal-related columns to the users table (if not already added)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS water_liters_goal numeric,
ADD COLUMN IF NOT EXISTS steps_count_goal integer,
ADD COLUMN IF NOT EXISTS activity_minutes_goal integer,
ADD COLUMN IF NOT EXISTS sleep_hours_goal numeric;