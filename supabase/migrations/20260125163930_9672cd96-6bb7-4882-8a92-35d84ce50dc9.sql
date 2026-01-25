-- Add FCR tracking columns to daily_logs
ALTER TABLE public.daily_logs 
ADD COLUMN IF NOT EXISTS fcr_cumulative numeric;

-- Add aggregate tracking columns to batches
ALTER TABLE public.batches 
ADD COLUMN IF NOT EXISTS total_feed_kg numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_weight_gain_kg numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_audit_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS anomaly_flags jsonb DEFAULT '[]'::jsonb;