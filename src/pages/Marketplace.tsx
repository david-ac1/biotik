import { useState } from "react";
import { motion } from "framer-motion";
import { Grid3X3, List, MapPin, ArrowRight, ShieldCheck, Leaf, Award, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { PlaceOrderDialog } from "@/components/marketplace/PlaceOrderDialog";
import { useMarketplaceBatches, MarketplaceBatch, MarketplaceFilters } from "@/hooks/useMarketplaceBatches";
import chicken1 from "@/assets/chicken-1.jpg";
import chicken2 from "@/assets/chicken-2.jpg";
import chicken3 from "@/assets/chicken-3.jpg";

type ViewMode = "grid" | "list";

const batchImages = [chicken1, chicken2, chicken3];

const gradeLabels: Record<string, string> = {
  gold: "Gold Stewardship",
  silver: "Silver Standard",
  standard: "Standard Grade",
  pending: "Pending Verification",
};

export default function Marketplace() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [maturityRange, setMaturityRange] = useState<[number, number]>([30, 60]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>(["gold", "silver", "standard"]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedBatch, setSelectedBatch] = useState<MarketplaceBatch | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);

  const filters: MarketplaceFilters = {
    grades: selectedGrades,
    district: selectedDistrict,
    maturityRange: maturityRange,
    searchQuery: "",
  };

  const { data: batches, isLoading } = useMarketplaceBatches(filters);

  const handleGradeToggle = (grade: string) => {
    setSelectedGrades((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
    );
  };

  const handlePlaceOrder = (batch: MarketplaceBatch) => {
    setSelectedBatch(batch);
    setOrderDialogOpen(true);
  };

  const getImageForBatch = (index: number) => {
    return batchImages[index % batchImages.length];
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar userRole="buyer" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex gap-8">
              {/* Filters Sidebar */}
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-64 flex-shrink-0 hidden lg:block"
              >
                <div className="sticky top-6 space-y-6">
                  <div>
                    <h2 className="font-display font-bold text-lg mb-1">Filters</h2>
                    <p className="text-xs text-primary uppercase tracking-wider font-semibold">
                      Refine Batch Selection
                    </p>
                  </div>

                  {/* Stewardship Grade */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <span>Stewardship Grade</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { value: "gold", label: "Gold Verified" },
                        { value: "silver", label: "Silver Standard" },
                        { value: "standard", label: "Standard Grade" },
                      ].map((grade) => (
                        <div key={grade.value} className="flex items-center gap-2">
                          <Checkbox
                            id={`grade-${grade.value}`}
                            checked={selectedGrades.includes(grade.value)}
                            onCheckedChange={() => handleGradeToggle(grade.value)}
                          />
                          <Label htmlFor={`grade-${grade.value}`} className="text-sm cursor-pointer">
                            {grade.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* District */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>District</span>
                    </div>
                    <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Regions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        <SelectItem value="gasabo">Gasabo District</SelectItem>
                        <SelectItem value="kicukiro">Kicukiro District</SelectItem>
                        <SelectItem value="nyarugenge">Nyarugenge District</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Maturity Range */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span>📅</span>
                      <span>Maturity Range</span>
                    </div>
                    <div>
                      <p className="text-xs text-primary mb-3">
                        Expected Days: {maturityRange[0]} - {maturityRange[1]}
                      </p>
                      <Slider
                        value={maturityRange}
                        onValueChange={(value) => setMaturityRange(value as [number, number])}
                        min={0}
                        max={90}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.aside>

              {/* Main Content */}
              <div className="flex-1">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
                >
                  <div>
                    <h1 className="text-3xl font-display font-bold text-foreground mb-1">Stewardship Marketplace</h1>
                    <p className="text-primary font-medium">Verified Clinical Grade Poultry Batches</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex bg-muted rounded-lg p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === "grid"
                            ? "bg-card shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === "list"
                            ? "bg-card shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Loading State */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : batches && batches.length > 0 ? (
                  /* Batch Grid */
                  <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                    {batches.map((batch, i) => {
                      const grade = batch.stewardship_grade?.toLowerCase() || "standard";
                      const premium = grade === "gold" ? "+15%" : grade === "silver" ? "+8%" : "Base";

                      return (
                        <motion.div
                          key={batch.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Card className="card-interactive overflow-hidden group">
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={getImageForBatch(i)}
                                alt={batch.breed}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                              <span
                                className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                                  grade === "gold"
                                    ? "bg-stewardship-gold text-stewardship-gold-foreground"
                                    : grade === "silver"
                                      ? "bg-muted-foreground text-muted"
                                      : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {grade === "gold" && "✦ "}
                                {gradeLabels[grade] || "Standard Grade"}
                              </span>
                              <span className="absolute bottom-4 left-4 bg-foreground/80 text-background px-2 py-1 rounded text-xs font-medium">
                                ID: {batch.batch_code}
                              </span>
                            </div>

                            <CardContent className="p-5">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="font-display font-bold text-lg">{batch.breed}</h3>
                                  <p className="text-sm text-muted-foreground">{batch.farmer_name}</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs text-primary uppercase font-semibold">Premium</span>
                                  <p className="font-display font-bold">{premium}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 text-sm text-primary mb-4">
                                <MapPin className="w-4 h-4" />
                                <span>
                                  {batch.district || "Unknown"} • {batch.expected_maturity_days || 42} Days
                                </span>
                              </div>

                              <div className="bg-muted rounded-lg p-3 mb-4">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                  <Award className="w-4 h-4" />
                                  <span className="uppercase tracking-wider font-medium">Integrity Score</span>
                                </div>
                                <p className="text-sm font-semibold text-primary">
                                  {batch.integrity_score !== null
                                    ? `${Math.round(batch.integrity_score)}% Verified`
                                    : "Pending Verification"}
                                </p>
                              </div>

                              <Button
                                variant="outline"
                                className="w-full group/btn"
                                onClick={() => handlePlaceOrder(batch)}
                              >
                                Place Order
                                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  /* Empty State */
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Leaf className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Batches Available</h3>
                      <p className="text-muted-foreground">
                        No verified batches match your current filters. Try adjusting your criteria.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-border py-6 mt-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>© 2026 Biotik Stewardship Platforms. All batches are laboratory verified.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-foreground">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-foreground">
                  Terms of Procurement
                </a>
                <a href="#" className="hover:text-foreground">
                  Stewardship Protocol v4.2
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>

      <PlaceOrderDialog
        batch={selectedBatch}
        open={orderDialogOpen}
        onOpenChange={setOrderDialogOpen}
      />
    </div>
  );
}
