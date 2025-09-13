-- Create security definer function to check if user has obreiro role
-- This prevents RLS recursion issues
CREATE OR REPLACE FUNCTION public.is_obreiro()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE user_id = auth.uid() 
      AND cargo = 'obreiro'
  );
$$;