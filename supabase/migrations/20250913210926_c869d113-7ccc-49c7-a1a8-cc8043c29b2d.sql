-- Update RLS policies to use role-based access control
-- Drop existing policies and create secure role-based ones

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