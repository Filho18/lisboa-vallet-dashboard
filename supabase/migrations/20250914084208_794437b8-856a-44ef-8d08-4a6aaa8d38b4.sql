-- Allow anonymous users to register vehicles but restrict management to obreiros only
-- Drop the restrictive insert policy and create a more permissive one

DROP POLICY IF EXISTS "Only obreiros can insert vehicles" ON public.fieis_veiculos;

-- Create new policy that allows anyone to register vehicles
CREATE POLICY "Anyone can register vehicles" 
ON public.fieis_veiculos 
FOR INSERT 
TO public
WITH CHECK (true);

-- Keep other policies restrictive to obreiros only
-- (SELECT, UPDATE, DELETE policies remain unchanged)