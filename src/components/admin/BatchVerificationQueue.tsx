import { format } from "date-fns";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Shield,
  ChevronRight,
  Award
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminBatch, AnomalyFlag } from "@/hooks/useAdminData";

interface BatchVerificationQueueProps {
  batches: AdminBatch[];
  isLoading: boolean;
  onAuditBatch?: (batchId: string) => void;
}

export function BatchVerificationQueue({ batches, isLoading, onAuditBatch }: BatchVerificationQueueProps) {
  const getGradeStyles = (grade: string | null) => {
    switch (grade) {
      case "gold":
        return "bg-amber-500/10 text-amber-600 border-amber-500/30";
      case "silver":
        return "bg-slate-400/10 text-slate-500 border-slate-400/30";
      case "standard":
        return "bg-orange-600/10 text-orange-600 border-orange-600/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusIcon = (batch: AdminBatch) => {
    const flags = batch.anomaly_flags as AnomalyFlag[] | null;
    const hasCritical = flags?.some((f) => f.severity === "critical");
    
    if (hasCritical) return <AlertTriangle className="w-4 h-4 text-destructive" />;
    if (batch.last_audit_at) return <CheckCircle2 className="w-4 h-4 text-success" />;
    return <Clock className="w-4 h-4 text-info" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-info" />
            <CardTitle className="text-sm uppercase tracking-wider">Verification Queue</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Sort: pending audits first, then by anomaly count, then by date
  const sortedBatches = [...batches].sort((a, b) => {
    // Pending audits first
    if (!a.last_audit_at && b.last_audit_at) return -1;
    if (a.last_audit_at && !b.last_audit_at) return 1;
    
    // Then by critical anomalies
    const aFlags = (a.anomaly_flags as AnomalyFlag[] | null) || [];
    const bFlags = (b.anomaly_flags as AnomalyFlag[] | null) || [];
    const aCritical = aFlags.filter((f) => f.severity === "critical").length;
    const bCritical = bFlags.filter((f) => f.severity === "critical").length;
    if (aCritical !== bCritical) return bCritical - aCritical;
    
    // Then by date
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-info" />
            <CardTitle className="text-sm uppercase tracking-wider">Verification Queue</CardTitle>
          </div>
          <Badge variant="outline">{batches.length} batches</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin">
        {sortedBatches.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No batches to verify</p>
          </div>
        ) : (
          sortedBatches.map((batch) => {
            const flags = (batch.anomaly_flags as AnomalyFlag[] | null) || [];
            const criticalCount = flags.filter((f) => f.severity === "critical").length;
            const warningCount = flags.filter((f) => f.severity === "warning").length;

            return (
              <div
                key={batch.id}
                className={`flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors ${
                  criticalCount > 0 ? "border-destructive/30 bg-destructive/5" : ""
                }`}
              >
                <div className="flex-shrink-0">{getStatusIcon(batch)}</div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium truncate">
                      {batch.batch_code}
                    </span>
                    {batch.stewardship_grade && batch.stewardship_grade !== "pending" && (
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${getGradeStyles(batch.stewardship_grade)}`}
                      >
                        <Award className="w-3 h-3 mr-1" />
                        {batch.stewardship_grade}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {batch.farmer?.full_name || "Unknown"} • {batch.breed}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {criticalCount > 0 && (
                    <Badge variant="destructive" className="text-[10px]">
                      {criticalCount} critical
                    </Badge>
                  )}
                  {warningCount > 0 && (
                    <Badge variant="outline" className="text-[10px] bg-warning/10 text-warning border-warning/30">
                      {warningCount} warn
                    </Badge>
                  )}
                  {!batch.last_audit_at && (
                    <Badge variant="outline" className="text-[10px]">
                      Pending
                    </Badge>
                  )}
                </div>

                {onAuditBatch && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0"
                    onClick={() => onAuditBatch(batch.id)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
