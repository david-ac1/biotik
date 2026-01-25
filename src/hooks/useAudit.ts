import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuditMetrics {
  fcr: number;
  mortalityRate: number;
  dataCompleteness: number;
  photoCoverage: number;
  totalFeedKg: number;
  totalWeightGainKg: number;
  currentCount: number;
}

interface AnomalyFlag {
  type: "warning" | "critical";
  message: string;
  day_number?: number;
  field?: string;
}

interface AuditResult {
  success: boolean;
  batchId: string;
  metrics: AuditMetrics;
  integrityScore: number;
  stewardshipGrade: string;
  anomalyFlags: AnomalyFlag[];
  aiAnalysis: {
    risk_level: "low" | "medium" | "high";
    summary: string;
  } | null;
}

interface PhotoAnalysisResult {
  success: boolean;
  photoId: string;
  analysis: {
    photo_type: "flock" | "feed_bag" | "environment";
    estimated_count?: number;
    health_score?: number;
    feed_brand?: string;
    feed_type?: string;
    environment_score?: number;
    observations: string[];
    red_flags: string[];
    confidence: number;
    is_authentic: boolean;
  };
  verificationStatus: string;
}

export function useAudit() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const auditBatch = useMutation({
    mutationFn: async (batchId: string): Promise<AuditResult> => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/audit-batch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ batchId }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Audit failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      queryClient.invalidateQueries({ queryKey: ["batch", data.batchId] });

      const gradeEmoji =
        data.stewardshipGrade === "gold"
          ? "🥇"
          : data.stewardshipGrade === "silver"
          ? "🥈"
          : "🏅";

      toast({
        title: `Audit Complete ${gradeEmoji}`,
        description: `Integrity Score: ${data.integrityScore}/100 | Grade: ${data.stewardshipGrade.toUpperCase()}`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Audit Failed",
        description: error.message,
      });
    },
  });

  const analyzePhoto = useMutation({
    mutationFn: async (photoId: string): Promise<PhotoAnalysisResult> => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-photo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ photoId }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        if (response.status === 402) {
          throw new Error("AI credits exhausted. Please add credits.");
        }
        throw new Error(error.error || "Photo analysis failed");
      }

      return response.json();
    },
    onSuccess: (data, photoId) => {
      queryClient.invalidateQueries({ queryKey: ["evidence_photos"] });

      const statusEmoji =
        data.verificationStatus === "verified"
          ? "✅"
          : data.verificationStatus === "flagged"
          ? "⚠️"
          : data.verificationStatus === "rejected"
          ? "❌"
          : "🔄";

      toast({
        title: `Photo Analyzed ${statusEmoji}`,
        description: `Status: ${data.verificationStatus} | Confidence: ${Math.round(
          data.analysis.confidence * 100
        )}%`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message,
      });
    },
  });

  return {
    auditBatch,
    analyzePhoto,
    isAuditing: auditBatch.isPending,
    isAnalyzing: analyzePhoto.isPending,
  };
}
