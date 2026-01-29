
-- Add RLS policy for public batch passport viewing (unauthenticated access to completed batches)
CREATE POLICY "Public can view completed batches for verification"
ON public.batches
FOR SELECT
TO anon
USING (status = 'completed' AND is_available_for_sale = true);

-- Allow public to view daily logs for completed batches
CREATE POLICY "Public can view logs for completed batches"
ON public.daily_logs
FOR SELECT
TO anon
USING (
  EXISTS (
    SELECT 1 FROM batches 
    WHERE batches.id = daily_logs.batch_id 
    AND batches.status = 'completed'
    AND batches.is_available_for_sale = true
  )
);

-- Allow public to view photos for completed batches
CREATE POLICY "Public can view photos for completed batches"
ON public.evidence_photos
FOR SELECT
TO anon
USING (
  EXISTS (
    SELECT 1 FROM daily_logs
    JOIN batches ON batches.id = daily_logs.batch_id
    WHERE daily_logs.id = evidence_photos.log_id 
    AND batches.status = 'completed'
    AND batches.is_available_for_sale = true
  )
);

-- Allow public to view farmer profiles for completed batches
CREATE POLICY "Public can view farmer profiles for verification"
ON public.profiles
FOR SELECT
TO anon
USING (
  EXISTS (
    SELECT 1 FROM batches 
    WHERE batches.farmer_id = profiles.id 
    AND batches.status = 'completed'
    AND batches.is_available_for_sale = true
  )
);
