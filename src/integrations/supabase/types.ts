export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      batches: {
        Row: {
          anomaly_flags: Json | null
          batch_code: string
          breed: string
          created_at: string | null
          current_count: number | null
          expected_maturity_days: number | null
          farmer_id: string
          id: string
          initial_count: number
          integrity_score: number | null
          is_available_for_sale: boolean | null
          last_audit_at: string | null
          price_per_kg: number | null
          start_date: string
          status: string | null
          stewardship_grade: string | null
          total_feed_kg: number | null
          total_weight_gain_kg: number | null
          updated_at: string | null
        }
        Insert: {
          anomaly_flags?: Json | null
          batch_code: string
          breed: string
          created_at?: string | null
          current_count?: number | null
          expected_maturity_days?: number | null
          farmer_id: string
          id?: string
          initial_count: number
          integrity_score?: number | null
          is_available_for_sale?: boolean | null
          last_audit_at?: string | null
          price_per_kg?: number | null
          start_date: string
          status?: string | null
          stewardship_grade?: string | null
          total_feed_kg?: number | null
          total_weight_gain_kg?: number | null
          updated_at?: string | null
        }
        Update: {
          anomaly_flags?: Json | null
          batch_code?: string
          breed?: string
          created_at?: string | null
          current_count?: number | null
          expected_maturity_days?: number | null
          farmer_id?: string
          id?: string
          initial_count?: number
          integrity_score?: number | null
          is_available_for_sale?: boolean | null
          last_audit_at?: string | null
          price_per_kg?: number | null
          start_date?: string
          status?: string | null
          stewardship_grade?: string | null
          total_feed_kg?: number | null
          total_weight_gain_kg?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "batches_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_logs: {
        Row: {
          avg_weight_g: number | null
          batch_id: string
          created_at: string | null
          day_number: number
          fcr_cumulative: number | null
          feed_consumed_kg: number | null
          id: string
          log_date: string
          logged_via: string | null
          mortality_count: number | null
          notes: string | null
        }
        Insert: {
          avg_weight_g?: number | null
          batch_id: string
          created_at?: string | null
          day_number: number
          fcr_cumulative?: number | null
          feed_consumed_kg?: number | null
          id?: string
          log_date: string
          logged_via?: string | null
          mortality_count?: number | null
          notes?: string | null
        }
        Update: {
          avg_weight_g?: number | null
          batch_id?: string
          created_at?: string | null
          day_number?: number
          fcr_cumulative?: number | null
          feed_consumed_kg?: number | null
          id?: string
          log_date?: string
          logged_via?: string | null
          mortality_count?: number | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_logs_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence_photos: {
        Row: {
          ai_analysis: Json | null
          created_at: string | null
          exif_gps_lat: number | null
          exif_gps_lng: number | null
          exif_timestamp: string | null
          id: string
          log_id: string
          photo_type: string
          photo_url: string
          verification_status: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          created_at?: string | null
          exif_gps_lat?: number | null
          exif_gps_lng?: number | null
          exif_timestamp?: string | null
          id?: string
          log_id: string
          photo_type: string
          photo_url: string
          verification_status?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          created_at?: string | null
          exif_gps_lat?: number | null
          exif_gps_lng?: number | null
          exif_timestamp?: string | null
          id?: string
          log_id?: string
          photo_type?: string
          photo_url?: string
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evidence_photos_log_id_fkey"
            columns: ["log_id"]
            isOneToOne: false
            referencedRelation: "daily_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          batch_id: string
          buyer_id: string
          created_at: string | null
          delivery_date: string | null
          id: string
          notes: string | null
          premium_percentage: number | null
          quantity_kg: number
          status: string | null
          total_amount: number
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          batch_id: string
          buyer_id: string
          created_at?: string | null
          delivery_date?: string | null
          id?: string
          notes?: string | null
          premium_percentage?: number | null
          quantity_kg: number
          status?: string | null
          total_amount: number
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          batch_id?: string
          buyer_id?: string
          created_at?: string | null
          delivery_date?: string | null
          id?: string
          notes?: string | null
          premium_percentage?: number | null
          quantity_kg?: number
          status?: string | null
          total_amount?: number
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          district: string | null
          farm_name: string | null
          full_name: string
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          district?: string | null
          farm_name?: string | null
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          district?: string | null
          farm_name?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "farmer" | "buyer" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["farmer", "buyer", "admin"],
    },
  },
} as const
