-- Add DELETE policy for fieis_veiculos table
CREATE POLICY "Anyone can delete vehicles" 
ON public.fieis_veiculos 
FOR DELETE 
USING (true);