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

-- Add RLS policies
ALTER TABLE public.nutrition_goals ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own nutrition goals
CREATE POLICY "Users can view their own nutrition goals" 
  ON public.nutrition_goals 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own nutrition goals
CREATE POLICY "Users can insert their own nutrition goals" 
  ON public.nutrition_goals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own nutrition goals
CREATE POLICY "Users can update their own nutrition goals" 
  ON public.nutrition_goals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own nutrition goals
CREATE POLICY "Users can delete their own nutrition goals" 
  ON public.nutrition_goals 
  FOR DELETE 
  USING (auth.uid() = user_id);