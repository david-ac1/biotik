import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useBatches } from "@/hooks/useBatches";

const BREEDS = [
  { value: "Cobb 500", label: "Cobb 500", maturity: 42 },
  { value: "Ross 308", label: "Ross 308", maturity: 42 },
  { value: "Hubbard Classic", label: "Hubbard Classic", maturity: 49 },
  { value: "Arbor Acres", label: "Arbor Acres", maturity: 45 },
];

interface CreateBatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBatchDialog({ open, onOpenChange }: CreateBatchDialogProps) {
  const { createBatch } = useBatches();
  const [breed, setBreed] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [initialCount, setInitialCount] = useState("");

  const selectedBreed = BREEDS.find((b) => b.value === breed);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!breed || !startDate || !initialCount) return;

    await createBatch.mutateAsync({
      breed,
      start_date: format(startDate, "yyyy-MM-dd"),
      initial_count: parseInt(initialCount),
      expected_maturity_days: selectedBreed?.maturity || 42,
    });

    // Reset form
    setBreed("");
    setStartDate(undefined);
    setInitialCount("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Create New Batch</DialogTitle>
          <DialogDescription>
            Register a new poultry batch to start tracking its growth cycle.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="breed">Breed</Label>
            <Select value={breed} onValueChange={setBreed}>
              <SelectTrigger>
                <SelectValue placeholder="Select breed" />
              </SelectTrigger>
              <SelectContent>
                {BREEDS.map((b) => (
                  <SelectItem key={b.value} value={b.value}>
                    {b.label} ({b.maturity} days)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialCount">Initial Bird Count</Label>
            <Input
              id="initialCount"
              type="number"
              min="1"
              placeholder="e.g. 500"
              value={initialCount}
              onChange={(e) => setInitialCount(e.target.value)}
              required
            />
          </div>

          {selectedBreed && (
            <div className="rounded-lg bg-muted p-3 text-sm">
              <p className="text-muted-foreground">
                Expected maturity:{" "}
                <span className="font-medium text-foreground">
                  {selectedBreed.maturity} days
                </span>
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!breed || !startDate || !initialCount || createBatch.isPending}
            >
              {createBatch.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Batch
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
