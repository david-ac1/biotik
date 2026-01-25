import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface EvidencePhoto {
  id: string;
  log_id: string;
  photo_url: string;
  photo_type: "flock" | "feed_bag" | "environment";
  exif_gps_lat: number | null;
  exif_gps_lng: number | null;
  exif_timestamp: string | null;
  verification_status: string;
  ai_analysis: Record<string, unknown> | null;
  created_at: string;
}

export function useEvidencePhotos(logId: string | undefined) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);

  const photosQuery = useQuery({
    queryKey: ["evidence_photos", logId],
    queryFn: async () => {
      if (!logId) return [];
      const { data, error } = await supabase
        .from("evidence_photos")
        .select("*")
        .eq("log_id", logId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as EvidencePhoto[];
    },
    enabled: !!logId,
  });

  const uploadPhoto = useMutation({
    mutationFn: async ({
      file,
      logId,
      photoType,
    }: {
      file: File;
      logId: string;
      photoType: "flock" | "feed_bag" | "environment";
    }) => {
      if (!user) throw new Error("Not authenticated");

      setUploadProgress(0);

      // Generate unique file path
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${logId}/${Date.now()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("evidence-photos")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      setUploadProgress(50);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("evidence-photos")
        .getPublicUrl(fileName);

      // Save to database
      const { data, error: dbError } = await supabase
        .from("evidence_photos")
        .insert({
          log_id: logId,
          photo_url: urlData.publicUrl,
          photo_type: photoType,
          verification_status: "pending",
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setUploadProgress(100);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evidence_photos", logId] });
      toast({
        title: "Photo uploaded",
        description: "Evidence photo saved successfully.",
      });
      setUploadProgress(0);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
      setUploadProgress(0);
    },
  });

  return {
    photos: photosQuery.data || [],
    isLoading: photosQuery.isLoading,
    error: photosQuery.error,
    uploadPhoto,
    uploadProgress,
  };
}
