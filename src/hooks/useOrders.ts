import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface Order {
  id: string;
  batch_id: string;
  buyer_id: string;
  quantity_kg: number;
  unit_price: number;
  premium_percentage: number | null;
  total_amount: number;
  delivery_date: string | null;
  status: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
  // Joined data
  batch?: {
    batch_code: string;
    breed: string;
    stewardship_grade: string | null;
    farmer_id: string;
  };
  farmer?: {
    full_name: string;
    farm_name: string | null;
    district: string | null;
  };
}

export interface CreateOrderInput {
  batch_id: string;
  quantity_kg: number;
  unit_price: number;
  premium_percentage: number;
  total_amount: number;
  delivery_date?: string;
  notes?: string;
}

// Calculate premium percentage based on stewardship grade
export function calculatePremium(grade: string | null): number {
  switch (grade?.toLowerCase()) {
    case "gold":
      return 15;
    case "silver":
      return 8;
    default:
      return 0;
  }
}

// Calculate total price with premium
export function calculateTotalPrice(
  basePrice: number,
  quantity: number,
  premiumPercentage: number
): number {
  const baseTotal = basePrice * quantity;
  const premium = baseTotal * (premiumPercentage / 100);
  return baseTotal + premium;
}

export function useOrders() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(`
          *,
          batch:batches(
            batch_code,
            breed,
            stewardship_grade,
            farmer_id
          )
        `)
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;
      if (!ordersData || ordersData.length === 0) return [];

      // Fetch farmer profiles
      const farmerIds = [...new Set(ordersData.map((o) => o.batch?.farmer_id).filter(Boolean))];
      
      if (farmerIds.length === 0) return ordersData as Order[];

      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, full_name, farm_name, district")
        .in("id", farmerIds);

      const profilesMap = new Map(profilesData?.map((p) => [p.id, p]) || []);

      return ordersData.map((order) => ({
        ...order,
        farmer: order.batch?.farmer_id ? profilesMap.get(order.batch.farmer_id) : undefined,
      })) as Order[];
    },
    enabled: !!user,
  });
}

export function useCreateOrder() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      if (!user) throw new Error("Must be logged in to place an order");

      const { data, error } = await supabase
        .from("orders")
        .insert({
          ...input,
          buyer_id: user.id,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({
        title: "Order Placed",
        description: "Your order has been submitted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({
        title: "Order Updated",
        description: "Order status has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
