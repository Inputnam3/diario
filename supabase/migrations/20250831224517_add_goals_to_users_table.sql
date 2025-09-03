-- Add goal-related columns to the users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS water_liters_goal numeric,
ADD COLUMN IF NOT EXISTS steps_count_goal integer,
ADD COLUMN IF NOT EXISTS activity_minutes_goal integer,
ADD COLUMN IF NOT EXISTS sleep_hours_goal numeric;
