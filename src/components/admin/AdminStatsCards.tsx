import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp,
  Award,
  Shield
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminStats } from "@/hooks/useAdminData";

interface AdminStatsCardsProps {
  stats: AdminStats | undefined;
  isLoading: boolean;
}

export function AdminStatsCards({ stats, isLoading }: AdminStatsCardsProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      label: "Active Batches",
      value: stats.activeBatches,
      sublabel: `of ${stats.totalBatches} total`,
      icon: Activity,
      color: "text-primary",
    },
    {
      label: "Completed",
      value: stats.completedBatches,
      sublabel: "Ready for market",
      icon: CheckCircle2,
      color: "text-success",
    },
    {
      label: "Pending Audits",
      value: stats.pendingAudits,
      sublabel: "Need review",
      icon: Shield,
      color: "text-info",
    },
    {
      label: "Anomalies",
      value: stats.totalAnomalies,
      sublabel: `${stats.criticalAnomalies} critical`,
      icon: AlertTriangle,
      color: stats.criticalAnomalies > 0 ? "text-destructive" : "text-warning",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <Card key={item.label}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {item.label}
              </span>
              <item.icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <p className="text-2xl font-display font-bold">{item.value}</p>
            <p className="text-xs text-muted-foreground">{item.sublabel}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function GradeDistributionCard({ stats, isLoading }: AdminStatsCardsProps) {
  if (isLoading || !stats) {
    return (
      <Card>
        <CardContent className="p-4">
          <Skeleton className="h-4 w-32 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const total = stats.goldGraded + stats.silverGraded + stats.standardGraded;
  const grades = [
    { label: "Gold", count: stats.goldGraded, color: "bg-amber-500", percent: total ? (stats.goldGraded / total) * 100 : 0 },
    { label: "Silver", count: stats.silverGraded, color: "bg-slate-400", percent: total ? (stats.silverGraded / total) * 100 : 0 },
    { label: "Standard", count: stats.standardGraded, color: "bg-orange-600", percent: total ? (stats.standardGraded / total) * 100 : 0 },
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium">Stewardship Grades</span>
        </div>
        <div className="space-y-3">
          {grades.map((grade) => (
            <div key={grade.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">{grade.label}</span>
                <span className="font-medium">{grade.count}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${grade.color} rounded-full transition-all duration-500`}
                  style={{ width: `${grade.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        {total === 0 && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            No graded batches yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function IntegrityScoreCard({ stats, isLoading }: AdminStatsCardsProps) {
  if (isLoading || !stats) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <Skeleton className="h-4 w-32 mx-auto mb-4" />
          <Skeleton className="h-16 w-16 rounded-full mx-auto" />
        </CardContent>
      </Card>
    );
  }

  const score = Math.round(stats.averageIntegrity * 100);
  const getScoreColor = () => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-info";
    if (score >= 40) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card>
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Avg. Integrity</span>
        </div>
        <div
          className={`text-4xl font-display font-bold ${getScoreColor()}`}
        >
          {score > 0 ? `${score}%` : "—"}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Across all audited batches
        </p>
      </CardContent>
    </Card>
  );
}
