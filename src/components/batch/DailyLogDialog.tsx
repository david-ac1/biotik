import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { CalendarIcon, Loader2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useDailyLogs } from "@/hooks/useDailyLogs";
import type { Batch } from "@/hooks/useBatches";

interface DailyLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batch: Batch;
  onLogCreated?: (logId: string) => void;
}

export function DailyLogDialog({ open, onOpenChange, batch, onLogCreated }: DailyLogDialogProps) {
  const { createLog, logs } = useDailyLogs(batch.id);
  const [logDate, setLogDate] = useState<Date>(new Date());
  const [mortalityCount, setMortalityCount] = useState("0");
  const [feedConsumed, setFeedConsumed] = useState("");
  const [avgWeight, setAvgWeight] = useState("");
  const [notes, setNotes] = useState("");

  const batchStartDate = new Date(batch.start_date);
  const dayNumber = differenceInDays(logDate, batchStartDate) + 1;

  // Check if log already exists for this date
  const existingLog = logs.find(
    (log) => log.log_date === format(logDate, "yyyy-MM-dd")
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dayNumber < 1 || existingLog) return;

    const result = await createLog.mutateAsync({
      batch_id: batch.id,
      log_date: format(logDate, "yyyy-MM-dd"),
      day_number: dayNumber,
      mortality_count: parseInt(mortalityCount) || 0,
      feed_consumed_kg: feedConsumed ? parseFloat(feedConsumed) : undefined,
      avg_weight_g: avgWeight ? parseFloat(avgWeight) : undefined,
      notes: notes || undefined,
    });

    // Reset form
    setMortalityCount("0");
    setFeedConsumed("");
    setAvgWeight("");
    setNotes("");
    
    if (onLogCreated && result) {
      onLogCreated(result.id);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Daily Log Entry</DialogTitle>
          <DialogDescription>
            Record today's data for {batch.batch_code} ({batch.breed})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Log Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !logDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {logDate ? format(logDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={logDate}
                  onSelect={(date) => date && setLogDate(date)}
                  disabled={(date) =>
                    date > new Date() || date < batchStartDate
                  }
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {dayNumber > 0 && (
              <p className="text-sm text-primary font-medium">
                Day {dayNumber} of growth cycle
              </p>
            )}
            {existingLog && (
              <p className="text-sm text-warning">
                ⚠️ A log already exists for this date
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mortality">Mortality Count</Label>
              <Input
                id="mortality"
                type="number"
                min="0"
                placeholder="0"
                value={mortalityCount}
                onChange={(e) => setMortalityCount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feed">Feed Consumed (kg)</Label>
              <Input
                id="feed"
                type="number"
                min="0"
                step="0.1"
                placeholder="e.g. 25.5"
                value={feedConsumed}
                onChange={(e) => setFeedConsumed(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Average Weight (grams)</Label>
            <Input
              id="weight"
              type="number"
              min="0"
              step="1"
              placeholder="e.g. 1250"
              value={avgWeight}
              onChange={(e) => setAvgWeight(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any observations or issues..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={dayNumber < 1 || !!existingLog || createLog.isPending}
            >
              {createLog.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Log
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
