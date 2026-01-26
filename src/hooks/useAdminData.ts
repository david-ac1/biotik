import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface AdminBatch {
  id: string;
  batch_code: string;
  breed: string;
  farmer_id: string;
  initial_count: number;
  current_count: number | null;
  expected_maturity_days: number | null;
  start_date: string;
  status: string | null;
  stewardship_grade: string | null;
  integrity_score: number | null;
  total_feed_kg: number | null;
  total_weight_gain_kg: number | null;
  last_audit_at: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  anomaly_flags: any;
  created_at: string | null;
  is_available_for_sale: boolean | null;
  farmer?: {
    full_name: string;
    farm_name: string | null;
    district: string | null;
  } | null;
}

export interface AnomalyFlag {
  type: string;
  severity: "critical" | "warning" | "info";
  message: string;
}

export interface AdminEvidencePhoto {
  id: string;
  log_id: string;
  photo_url: string;
  photo_type: string;
  verification_status: string | null;
  ai_analysis: Record<string, unknown> | null;
  created_at: string | null;
  batch_code?: string;
  farmer_name?: string;
}

export interface AdminDailyLog {
  id: string;
  batch_id: string;
  log_date: string;
  day_number: number;
  mortality_count: number | null;
  feed_consumed_kg: number | null;
  avg_weight_g: number | null;
  fcr_cumulative: number | null;
  created_at: string | null;
}

export interface AdminStats {
  totalBatches: number;
  activeBatches: number;
  completedBatches: number;
  pendingAudits: number;
  totalAnomalies: number;
  criticalAnomalies: number;
  averageIntegrity: number;
  goldGraded: number;
  silverGraded: number;
  standardGraded: number;
}

export function useAdminBatches() {
  const { role } = useAuth();

  return useQuery({
    queryKey: ["admin_batches"],
    queryFn: async () => {
      // Fetch all batches with farmer profiles
      const { data: batches, error } = await supabase
        .from("batches")
        .select(`
          *,
          farmer:profiles!batches_farmer_id_fkey(full_name, farm_name, district)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (batches || []) as unknown as AdminBatch[];
    },
    enabled: role === "admin",
  });
}

export function useAdminEvidenceStream() {
  const { role } = useAuth();

  return useQuery({
    queryKey: ["admin_evidence_stream"],
    queryFn: async () => {
      // Fetch recent evidence photos with log and batch info
      const { data: photos, error } = await supabase
        .from("evidence_photos")
        .select(`
          *,
          log:daily_logs!evidence_photos_log_id_fkey(
            batch_id,
            log_date,
            day_number,
            batch:batches!daily_logs_batch_id_fkey(
              batch_code,
              farmer:profiles!batches_farmer_id_fkey(full_name)
            )
          )
        `)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      // Transform to flat structure for easier rendering
      return (photos || []).map((photo) => ({
        ...photo,
        batch_code: photo.log?.batch?.batch_code,
        farmer_name: photo.log?.batch?.farmer?.full_name,
        day_number: photo.log?.day_number,
        log_date: photo.log?.log_date,
      }));
    },
    enabled: role === "admin",
    refetchInterval: 30000, // Refresh every 30 seconds for "live" feel
  });
}

export function useAdminStats() {
  const { role } = useAuth();

  return useQuery({
    queryKey: ["admin_stats"],
    queryFn: async () => {
      const { data: batches, error } = await supabase
        .from("batches")
        .select("id, status, stewardship_grade, integrity_score, anomaly_flags, last_audit_at");

      if (error) throw error;

      const stats: AdminStats = {
        totalBatches: batches?.length || 0,
        activeBatches: batches?.filter((b) => b.status === "active").length || 0,
        completedBatches: batches?.filter((b) => b.status === "completed").length || 0,
        pendingAudits: batches?.filter((b) => !b.last_audit_at).length || 0,
        totalAnomalies: 0,
        criticalAnomalies: 0,
        averageIntegrity: 0,
        goldGraded: batches?.filter((b) => b.stewardship_grade === "gold").length || 0,
        silverGraded: batches?.filter((b) => b.stewardship_grade === "silver").length || 0,
        standardGraded: batches?.filter((b) => b.stewardship_grade === "standard").length || 0,
      };

      // Calculate anomaly counts
      batches?.forEach((batch) => {
        const flags = batch.anomaly_flags;
        if (flags && Array.isArray(flags)) {
          stats.totalAnomalies += flags.length;
          stats.criticalAnomalies += flags.filter((f: unknown) => {
            const flag = f as AnomalyFlag;
            return flag?.severity === "critical";
          }).length;
        }
      });

      // Calculate average integrity
      const scoredBatches = batches?.filter((b) => b.integrity_score !== null) || [];
      if (scoredBatches.length > 0) {
        stats.averageIntegrity =
          scoredBatches.reduce((sum, b) => sum + (b.integrity_score || 0), 0) / scoredBatches.length;
      }

      return stats;
    },
    enabled: role === "admin",
  });
}

export function useAdminBatchesWithAnomalies() {
  const { role } = useAuth();

  return useQuery({
    queryKey: ["admin_batches_anomalies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("batches")
        .select(`
          *,
          farmer:profiles!batches_farmer_id_fkey(full_name, farm_name, district)
        `)
        .not("anomaly_flags", "eq", "[]")
        .order("last_audit_at", { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as AdminBatch[];
    },
    enabled: role === "admin",
  });
}
