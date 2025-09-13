-- Fix critical security vulnerability: Restrict access to fieis_veiculos table to authenticated users only

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can view vehicles" ON public.fieis_veiculos;
DROP POLICY IF EXISTS "Anyone can insert vehicles" ON public.fieis_veiculos;
DROP POLICY IF EXISTS "Anyone can delete vehicles" ON public.fieis_veiculos;

-- Create secure policies that require authentication
CREATE POLICY "Authenticated users can view vehicles" 
ON public.fieis_veiculos 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert vehicles" 
ON public.fieis_veiculos 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete vehicles" 
ON public.fieis_veiculos 
FOR DELETE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update vehicles" 
ON public.fieis_veiculos 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);