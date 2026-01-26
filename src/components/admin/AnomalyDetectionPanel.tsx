import { AlertTriangle, CheckCircle2, Info, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminBatch, AnomalyFlag } from "@/hooks/useAdminData";

interface AnomalyDetectionPanelProps {
  batches: AdminBatch[];
  isLoading: boolean;
}

interface AggregatedAnomaly {
  type: string;
  severity: "critical" | "warning" | "info";
  count: number;
  examples: string[];
}

export function AnomalyDetectionPanel({ batches, isLoading }: AnomalyDetectionPanelProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <CardTitle className="text-sm uppercase tracking-wider">Fraud Detection & Anomalies</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-lg border">
                <Skeleton className="h-3 w-20 mb-2" />
                <Skeleton className="h-8 w-12 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Aggregate all anomalies across batches
  const anomalyMap = new Map<string, AggregatedAnomaly>();
  
  batches.forEach((batch) => {
    const flags = batch.anomaly_flags as AnomalyFlag[] | null;
    if (!flags) return;
    
    flags.forEach((flag) => {
      const key = `${flag.type}-${flag.severity}`;
      const existing = anomalyMap.get(key);
      if (existing) {
        existing.count++;
        if (existing.examples.length < 3) {
          existing.examples.push(batch.batch_code);
        }
      } else {
        anomalyMap.set(key, {
          type: flag.type,
          severity: flag.severity,
          count: 1,
          examples: [batch.batch_code],
        });
      }
    });
  });

  // Sort by severity and count
  const sortedAnomalies = Array.from(anomalyMap.values()).sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return b.count - a.count;
  });

  const getIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      default:
        return <Info className="w-4 h-4 text-info" />;
    }
  };

  const getStyles = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-destructive/30 bg-destructive/5";
      case "warning":
        return "border-warning/30 bg-warning/5";
      default:
        return "border-border";
    }
  };

  // Calculate summary stats
  const totalAnomalies = sortedAnomalies.reduce((sum, a) => sum + a.count, 0);
  const criticalCount = sortedAnomalies.filter((a) => a.severity === "critical").reduce((sum, a) => sum + a.count, 0);
  const warningCount = sortedAnomalies.filter((a) => a.severity === "warning").reduce((sum, a) => sum + a.count, 0);

  // Calculate integrity metrics
  const auditedBatches = batches.filter((b) => b.last_audit_at);
  const avgIntegrity = auditedBatches.length > 0
    ? auditedBatches.reduce((sum, b) => sum + (b.integrity_score || 0), 0) / auditedBatches.length
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <CardTitle className="text-sm uppercase tracking-wider">Fraud Detection & Anomalies</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Flags</p>
            <p className="text-2xl font-display font-bold">{totalAnomalies}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              {totalAnomalies === 0 ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-success" />
                  All Clear
                </>
              ) : (
                <>
                  <TrendingUp className="w-3 h-3" />
                  Across {batches.length} batches
                </>
              )}
            </p>
          </div>

          <div className={`p-4 rounded-lg border ${criticalCount > 0 ? "border-destructive/30 bg-destructive/5" : ""}`}>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Critical</p>
            <p className={`text-2xl font-display font-bold ${criticalCount > 0 ? "text-destructive" : ""}`}>
              {criticalCount}
            </p>
            <p className="text-xs flex items-center gap-1 mt-1 text-muted-foreground">
              {criticalCount > 0 ? (
                <>
                  <AlertTriangle className="w-3 h-3 text-destructive" />
                  Immediate Review
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3 text-success" />
                  None detected
                </>
              )}
            </p>
          </div>

          <div className="p-4 rounded-lg border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Avg. Integrity</p>
            <p className={`text-2xl font-display font-bold ${
              avgIntegrity >= 0.8 ? "text-success" : avgIntegrity >= 0.6 ? "text-info" : "text-warning"
            }`}>
              {avgIntegrity > 0 ? `${Math.round(avgIntegrity * 100)}%` : "—"}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3 text-success" />
              {auditedBatches.length} audited
            </p>
          </div>
        </div>

        {/* Anomaly List */}
        {sortedAnomalies.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Detected Issues</p>
            {sortedAnomalies.slice(0, 5).map((anomaly, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-3 rounded-lg border ${getStyles(anomaly.severity)}`}
              >
                <div className="flex items-center gap-3">
                  {getIcon(anomaly.severity)}
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {anomaly.type.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {anomaly.examples.slice(0, 2).join(", ")}
                      {anomaly.examples.length > 2 && ` +${anomaly.examples.length - 2} more`}
                    </p>
                  </div>
                </div>
                <span className={`text-lg font-bold ${
                  anomaly.severity === "critical" ? "text-destructive" : 
                  anomaly.severity === "warning" ? "text-warning" : "text-info"
                }`}>
                  {anomaly.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
