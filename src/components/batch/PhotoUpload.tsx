import { useState, useRef } from "react";
import { Camera, Upload, Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEvidencePhotos, type EvidencePhoto } from "@/hooks/useEvidencePhotos";
import { cn } from "@/lib/utils";

interface PhotoUploadProps {
  logId: string;
}

const PHOTO_TYPES = [
  { value: "flock", label: "Flock Photo", description: "Wide shot of the birds" },
  { value: "feed_bag", label: "Feed Bag", description: "Photo of feed bag label" },
  { value: "environment", label: "Environment", description: "Housing conditions" },
] as const;

export function PhotoUpload({ logId }: PhotoUploadProps) {
  const { photos, uploadPhoto, uploadProgress, isLoading } = useEvidencePhotos(logId);
  const [photoType, setPhotoType] = useState<"flock" | "feed_bag" | "environment">("flock");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    await uploadPhoto.mutateAsync({
      file,
      logId,
      photoType,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "flagged":
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-info" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={photoType} onValueChange={(v) => setPhotoType(v as typeof photoType)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Photo type" />
          </SelectTrigger>
          <SelectContent>
            {PHOTO_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          {PHOTO_TYPES.find((t) => t.value === photoType)?.description}
        </p>
      </div>

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-border",
          uploadPhoto.isPending && "opacity-50 pointer-events-none"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />

        {uploadPhoto.isPending ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Uploading... {uploadProgress}%
            </p>
            <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Camera className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">
                Drag & drop or{" "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG or WebP up to 5MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded photos grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={photo.photo_url}
                  alt={photo.photo_type}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1">
                  {getStatusIcon(photo.verification_status)}
                  <span className="text-xs capitalize">{photo.verification_status}</span>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-xs font-medium capitalize">
                  {photo.photo_type.replace("_", " ")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(photo.created_at).toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
