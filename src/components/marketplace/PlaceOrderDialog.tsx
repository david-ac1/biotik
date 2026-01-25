import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, ShieldCheck, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { MarketplaceBatch } from "@/hooks/useMarketplaceBatches";
import { useCreateOrder, calculatePremium, calculateTotalPrice } from "@/hooks/useOrders";

interface PlaceOrderDialogProps {
  batch: MarketplaceBatch | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlaceOrderDialog({ batch, open, onOpenChange }: PlaceOrderDialogProps) {
  const [quantity, setQuantity] = useState<number>(10);
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [notes, setNotes] = useState("");

  const createOrder = useCreateOrder();

  if (!batch) return null;

  const basePrice = batch.price_per_kg || 5; // Default $5/kg if not set
  const premiumPercentage = calculatePremium(batch.stewardship_grade);
  const totalAmount = calculateTotalPrice(basePrice, quantity, premiumPercentage);
  const premiumAmount = totalAmount - basePrice * quantity;

  const handleSubmit = async () => {
    await createOrder.mutateAsync({
      batch_id: batch.id,
      quantity_kg: quantity,
      unit_price: basePrice,
      premium_percentage: premiumPercentage,
      total_amount: totalAmount,
      delivery_date: deliveryDate?.toISOString().split("T")[0],
      notes: notes || undefined,
    });

    onOpenChange(false);
    setQuantity(10);
    setDeliveryDate(undefined);
    setNotes("");
  };

  const gradeColors: Record<string, string> = {
    gold: "text-stewardship-gold",
    silver: "text-muted-foreground",
    standard: "text-muted-foreground",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Place Order
          </DialogTitle>
          <DialogDescription>
            Order verified poultry from {batch.farmer_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Batch Info */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{batch.breed}</p>
                <p className="text-sm text-muted-foreground">
                  Batch: {batch.batch_code}
                </p>
                {batch.farm_name && (
                  <p className="text-sm text-muted-foreground">
                    Farm: {batch.farm_name}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span
                  className={cn(
                    "text-xs font-semibold uppercase",
                    gradeColors[batch.stewardship_grade?.toLowerCase() || "standard"]
                  )}
                >
                  {batch.stewardship_grade || "Standard"} Grade
                </span>
                {batch.integrity_score !== null && (
                  <p className="text-sm font-medium">
                    {Math.round(batch.integrity_score)}% Integrity
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quantity Input */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity (kg)</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>

          {/* Delivery Date */}
          <div className="space-y-2">
            <Label>Preferred Delivery Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deliveryDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deliveryDate ? format(deliveryDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deliveryDate}
                  onSelect={setDeliveryDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Price Breakdown */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Base Price</span>
              <span>${basePrice.toFixed(2)}/kg × {quantity} kg</span>
            </div>
            {premiumPercentage > 0 && (
              <div className="flex justify-between text-sm text-primary">
                <span>{batch.stewardship_grade} Premium (+{premiumPercentage}%)</span>
                <span>+${premiumAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={createOrder.isPending}>
            {createOrder.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
