-- Fix security vulnerability: Implement role-based access control for fieis_veiculos
-- Only users with 'obreiro' role should be able to access vehicle data

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

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view vehicles" ON public.fieis_veiculos;
DROP POLICY IF EXISTS "Authenticated users can insert vehicles" ON public.fieis_veiculos;
DROP POLICY IF EXISTS "Authenticated users can delete vehicles" ON public.fieis_veiculos;
DROP POLICY IF EXISTS "Authenticated users can update vehicles" ON public.fieis_veiculos;

-- Create secure role-based policies
CREATE POLICY "Only obreiros can view vehicles" 
ON public.fieis_veiculos 
FOR SELECT 
TO authenticated
USING (public.is_obreiro());

CREATE POLICY "Only obreiros can insert vehicles" 
ON public.fieis_veiculos 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_obreiro());

CREATE POLICY "Only obreiros can update vehicles" 
ON public.fieis_veiculos 
FOR UPDATE 
TO authenticated
USING (public.is_obreiro())
WITH CHECK (public.is_obreiro());

CREATE POLICY "Only obreiros can delete vehicles" 
ON public.fieis_veiculos 
FOR DELETE 
TO authenticated
USING (public.is_obreiro());