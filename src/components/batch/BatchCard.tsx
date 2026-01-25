import { format, differenceInDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Bird, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Batch } from "@/hooks/useBatches";

interface BatchCardProps {
  batch: Batch;
}

export function BatchCard({ batch }: BatchCardProps) {
  const navigate = useNavigate();
  
  const startDate = new Date(batch.start_date);
  const today = new Date();
  const dayNumber = differenceInDays(today, startDate) + 1;
  const progress = Math.min((dayNumber / batch.expected_maturity_days) * 100, 100);
  const currentCount = batch.current_count || batch.initial_count;
  const mortalityRate = ((batch.initial_count - currentCount) / batch.initial_count) * 100;

  const gradeColors = {
    gold: "bg-stewardship-gold text-stewardship-gold-foreground",
    silver: "bg-muted-foreground text-muted",
    standard: "bg-muted text-muted-foreground",
    pending: "bg-info/10 text-info",
  };

  const statusColors = {
    active: "bg-success/10 text-success",
    completed: "bg-primary/10 text-primary",
    cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <Card className="card-interactive group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {batch.batch_code}
            </p>
            <h3 className="font-display font-bold text-lg">{batch.breed}</h3>
          </div>
          <div className="flex gap-2">
            <Badge
              className={statusColors[batch.status as keyof typeof statusColors] || statusColors.active}
              variant="secondary"
            >
              {batch.status}
            </Badge>
            <Badge
              className={gradeColors[batch.stewardship_grade as keyof typeof gradeColors] || gradeColors.pending}
            >
              {batch.stewardship_grade === "gold" && "✦ "}
              {batch.stewardship_grade.charAt(0).toUpperCase() + batch.stewardship_grade.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="stat-card">
            <span className="stat-label flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Day
            </span>
            <span className="stat-value">{dayNumber}</span>
            <span className="text-xs text-muted-foreground">of {batch.expected_maturity_days}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label flex items-center gap-1">
              <Bird className="w-3 h-3" />
              Birds
            </span>
            <span className="stat-value">{currentCount.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">of {batch.initial_count.toLocaleString()}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Score
            </span>
            <span className="stat-value text-primary">{batch.integrity_score}%</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Growth Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Mortality warning */}
        {mortalityRate > 5 && (
          <div className="flex items-center gap-2 text-warning text-sm mb-4 p-2 rounded-lg bg-warning/10">
            <AlertCircle className="w-4 h-4" />
            <span>Mortality rate: {mortalityRate.toFixed(1)}%</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Started {format(startDate, "MMM d, yyyy")}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/batch/${batch.id}`)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
