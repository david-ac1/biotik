import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MarketplaceBatch {
  id: string;
  batch_code: string;
  breed: string;
  farmer_id: string;
  farmer_name: string;
  farm_name: string | null;
  district: string | null;
  initial_count: number;
  current_count: number | null;
  expected_maturity_days: number | null;
  start_date: string;
  price_per_kg: number | null;
  integrity_score: number | null;
  stewardship_grade: string | null;
  total_feed_kg: number | null;
  total_weight_gain_kg: number | null;
}

export interface MarketplaceFilters {
  grades: string[];
  district: string | null;
  maturityRange: [number, number];
  searchQuery: string;
}

export function useMarketplaceBatches(filters: MarketplaceFilters) {
  return useQuery({
    queryKey: ["marketplace-batches", filters],
    queryFn: async () => {
      // Query batches that are available for sale and completed
      let query = supabase
        .from("batches")
        .select(`
          id,
          batch_code,
          breed,
          farmer_id,
          initial_count,
          current_count,
          expected_maturity_days,
          start_date,
          price_per_kg,
          integrity_score,
          stewardship_grade,
          total_feed_kg,
          total_weight_gain_kg
        `)
        .eq("is_available_for_sale", true)
        .eq("status", "completed");

      // Apply grade filter
      if (filters.grades.length > 0) {
        query = query.in("stewardship_grade", filters.grades);
      }

      // Apply maturity range filter
      if (filters.maturityRange) {
        query = query
          .gte("expected_maturity_days", filters.maturityRange[0])
          .lte("expected_maturity_days", filters.maturityRange[1]);
      }

      // Order by integrity score descending
      query = query.order("integrity_score", { ascending: false });

      const { data: batchesData, error: batchesError } = await query;

      if (batchesError) throw batchesError;
      if (!batchesData || batchesData.length === 0) return [];

      // Fetch farmer profiles for all batches
      const farmerIds = [...new Set(batchesData.map((b) => b.farmer_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, farm_name, district")
        .in("id", farmerIds);

      if (profilesError) throw profilesError;

      // Create a map for quick lookup
      const profilesMap = new Map(profilesData?.map((p) => [p.id, p]) || []);

      // Combine batches with farmer info
      let result: MarketplaceBatch[] = batchesData.map((batch) => {
        const profile = profilesMap.get(batch.farmer_id);
        return {
          ...batch,
          farmer_name: profile?.full_name || "Unknown Farmer",
          farm_name: profile?.farm_name || null,
          district: profile?.district || null,
        };
      });

      // Apply district filter (client-side since it comes from profiles)
      if (filters.district && filters.district !== "all") {
        result = result.filter(
          (b) => b.district?.toLowerCase() === filters.district?.toLowerCase()
        );
      }

      // Apply search filter
      if (filters.searchQuery) {
        const search = filters.searchQuery.toLowerCase();
        result = result.filter(
          (b) =>
            b.batch_code.toLowerCase().includes(search) ||
            b.breed.toLowerCase().includes(search) ||
            b.farmer_name.toLowerCase().includes(search) ||
            b.farm_name?.toLowerCase().includes(search)
        );
      }

      return result;
    },
  });
}
