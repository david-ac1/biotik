import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Batch {
  id: string;
  farmer_id: string;
  batch_code: string;
  breed: string;
  start_date: string;
  expected_maturity_days: number | null;
  initial_count: number;
  current_count: number | null;
  status: string | null;
  stewardship_grade: string | null;
  integrity_score: number | null;
  is_available_for_sale: boolean | null;
  price_per_kg: number | null;
  created_at: string | null;
  updated_at: string | null;
  // New audit fields
  total_feed_kg: number | null;
  total_weight_gain_kg: number | null;
  last_audit_at: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  anomaly_flags: any[] | null;
}

export interface CreateBatchInput {
  breed: string;
  start_date: string;
  initial_count: number;
  expected_maturity_days?: number;
}

export function useBatches() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const batchesQuery = useQuery({
    queryKey: ["batches", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("batches")
        .select("*")
        .eq("farmer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Batch[];
    },
    enabled: !!user,
  });

  const createBatch = useMutation({
    mutationFn: async (input: CreateBatchInput) => {
      if (!user) throw new Error("Not authenticated");
      
      // Generate batch code
      const timestamp = Date.now().toString(36).toUpperCase();
      const breedCode = input.breed.split(" ")[0].substring(0, 3).toUpperCase();
      const batch_code = `#${timestamp}-${breedCode}`;

      const { data, error } = await supabase
        .from("batches")
        .insert({
          farmer_id: user.id,
          batch_code,
          breed: input.breed,
          start_date: input.start_date,
          initial_count: input.initial_count,
          current_count: input.initial_count,
          expected_maturity_days: input.expected_maturity_days || 42,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      toast({
        title: "Batch created",
        description: "Your new batch has been registered successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to create batch",
        description: error.message,
      });
    },
  });

  const updateBatch = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Batch> & { id: string }) => {
      const { data, error } = await supabase
        .from("batches")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      toast({
        title: "Batch updated",
        description: "Changes saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update batch",
        description: error.message,
      });
    },
  });

  return {
    batches: batchesQuery.data || [],
    isLoading: batchesQuery.isLoading,
    error: batchesQuery.error,
    createBatch,
    updateBatch,
  };
}

export function useBatch(batchId: string | undefined) {
  return useQuery({
    queryKey: ["batch", batchId],
    queryFn: async () => {
      if (!batchId) return null;
      const { data, error } = await supabase
        .from("batches")
        .select("*")
        .eq("id", batchId)
        .maybeSingle();

      if (error) throw error;
      return data as Batch | null;
    },
    enabled: !!batchId,
  });
}
