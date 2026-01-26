import { format, formatDistanceToNow } from "date-fns";
import { CheckCircle2, Clock, AlertTriangle, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface EvidenceItem {
  id: string;
  photo_url: string;
  photo_type: string;
  verification_status: string | null;
  created_at: string | null;
  batch_code?: string;
  farmer_name?: string;
  day_number?: number;
}

interface EvidenceStreamCardProps {
  evidence: EvidenceItem[];
  isLoading: boolean;
}

export function EvidenceStreamCard({ evidence, isLoading }: EvidenceStreamCardProps) {
  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="w-3 h-3" />;
      case "flagged":
        return <AlertTriangle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "verified":
        return "bg-success/10 text-success border-success/30";
      case "flagged":
        return "bg-destructive/10 text-destructive border-destructive/30";
      default:
        return "bg-info/10 text-info border-info/30";
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-sm uppercase tracking-wider">Evidence Stream</CardTitle>
          </div>
          <Badge variant="outline" className="bg-success/10 text-success border-success/30">
            Live
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-l-4 border-muted pl-4 py-2">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-3 w-full mb-3" />
              <Skeleton className="h-16 w-16 rounded-lg" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-muted-foreground" />
          <CardTitle className="text-sm uppercase tracking-wider">Evidence Stream</CardTitle>
        </div>
        <Badge variant="outline" className="bg-success/10 text-success border-success/30 animate-pulse">
          Live
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin">
        {evidence.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No evidence photos yet</p>
            <p className="text-xs opacity-70">Photos will appear here as farmers upload them</p>
          </div>
        ) : (
          evidence.map((item) => (
            <div
              key={item.id}
              className={`border-l-4 ${
                item.verification_status === "verified"
                  ? "border-success"
                  : item.verification_status === "flagged"
                  ? "border-destructive"
                  : "border-info"
              } pl-4 py-2`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{item.farmer_name || "Unknown Farmer"}</span>
                <span className="text-xs text-muted-foreground">
                  {item.created_at
                    ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true })
                    : "Recently"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {item.batch_code}: Day {item.day_number || "?"} - {item.photo_type} photo
              </p>

              <div className="flex gap-2 mb-3">
                <img
                  src={item.photo_url}
                  alt={`${item.photo_type} evidence`}
                  className="w-16 h-16 object-cover rounded-lg border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>

              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded border ${getStatusColor(
                  item.verification_status
                )}`}
              >
                {getStatusIcon(item.verification_status)}
                {item.verification_status || "Pending"}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
