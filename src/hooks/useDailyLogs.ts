import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface DailyLog {
  id: string;
  batch_id: string;
  log_date: string;
  day_number: number;
  mortality_count: number | null;
  feed_consumed_kg: number | null;
  avg_weight_g: number | null;
  notes: string | null;
  logged_via: string | null;
  created_at: string | null;
  fcr_cumulative: number | null;
}

export interface CreateLogInput {
  batch_id: string;
  log_date: string;
  day_number: number;
  mortality_count: number;
  feed_consumed_kg?: number;
  avg_weight_g?: number;
  notes?: string;
}

export function useDailyLogs(batchId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const logsQuery = useQuery({
    queryKey: ["daily_logs", batchId],
    queryFn: async () => {
      if (!batchId) return [];
      const { data, error } = await supabase
        .from("daily_logs")
        .select("*")
        .eq("batch_id", batchId)
        .order("log_date", { ascending: false });

      if (error) throw error;
      return data as DailyLog[];
    },
    enabled: !!batchId,
  });

  const createLog = useMutation({
    mutationFn: async (input: CreateLogInput) => {
      const { data, error } = await supabase
        .from("daily_logs")
        .insert({
          batch_id: input.batch_id,
          log_date: input.log_date,
          day_number: input.day_number,
          mortality_count: input.mortality_count,
          feed_consumed_kg: input.feed_consumed_kg,
          avg_weight_g: input.avg_weight_g,
          notes: input.notes,
          logged_via: "dashboard",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_logs", batchId] });
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      toast({
        title: "Log saved",
        description: "Daily log recorded successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to save log",
        description: error.message,
      });
    },
  });

  const updateLog = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DailyLog> & { id: string }) => {
      const { data, error } = await supabase
        .from("daily_logs")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_logs", batchId] });
      toast({
        title: "Log updated",
        description: "Changes saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update log",
        description: error.message,
      });
    },
  });

  return {
    logs: logsQuery.data || [],
    isLoading: logsQuery.isLoading,
    error: logsQuery.error,
    createLog,
    updateLog,
  };
}
