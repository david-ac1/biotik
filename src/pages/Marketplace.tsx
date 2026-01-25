import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Grid3X3, 
  List, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  Leaf,
  Users,
  Sparkles
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import chicken1 from "@/assets/chicken-1.jpg";
import chicken2 from "@/assets/chicken-2.jpg";
import chicken3 from "@/assets/chicken-3.jpg";

type ViewMode = "grid" | "list";

interface BatchListing {
  id: string;
  name: string;
  image: string;
  grade: "gold" | "silver" | "standard";
  premium: string;
  location: string;
  maturityDays: number;
  impactType: "sdg" | "environmental" | "social";
  impactValue: string;
}

const batches: BatchListing[] = [
  {
    id: "#8842-R308",
    name: "Ross 308 Premium",
    image: chicken1,
    grade: "gold",
    premium: "+$0.15/kg",
    location: "Central Plateau District",
    maturityDays: 42,
    impactType: "sdg",
    impactValue: "Saves 200 Healthcare Doses",
  },
  {
    id: "#9121-C500",
    name: "Cobb 500 Select",
    image: chicken2,
    grade: "gold",
    premium: "+$0.12/kg",
    location: "Valley Lowlands",
    maturityDays: 38,
    impactType: "environmental",
    impactValue: "15% Lower Nitrogen Waste",
  },
  {
    id: "#7743-HUB",
    name: "Hubbard Organic",
    image: chicken3,
    grade: "silver",
    premium: "+$0.08/kg",
    location: "Highland Plains",
    maturityDays: 55,
    impactType: "social",
    impactValue: "Supports 12 Local Cooperatives",
  },
];

const gradeLabels = {
  gold: "Gold Stewardship",
  silver: "Silver Standard",
  standard: "Standard Grade",
};

const impactIcons = {
  sdg: <Sparkles className="w-4 h-4" />,
  environmental: <Leaf className="w-4 h-4" />,
  social: <Users className="w-4 h-4" />,
};

const impactLabels = {
  sdg: "SDG Impact Score",
  environmental: "Environmental Impact",
  social: "Social Value",
};

export default function Marketplace() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [maturityRange, setMaturityRange] = useState([30, 60]);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar userRole="buyer" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          userName="Hotel Kigali" 
          userRole="B2B Buyer" 
        />
        
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
                      {["Gold Verified", "Silver Standard", "Standard Grade"].map((grade, i) => (
                        <div key={grade} className="flex items-center gap-2">
                          <Checkbox id={`grade-${i}`} defaultChecked={i === 0} />
                          <Label htmlFor={`grade-${i}`} className="text-sm cursor-pointer">
                            {grade}
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
                    <Select defaultValue="all">
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
                        onValueChange={setMaturityRange}
                        min={0}
                        max={90}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <Button className="w-full">Apply All Filters</Button>
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
                    <h1 className="text-3xl font-display font-bold text-foreground mb-1">
                      Stewardship Marketplace
                    </h1>
                    <p className="text-primary font-medium">
                      Verified Clinical Grade Poultry Batches
                    </p>
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

                {/* Batch Grid */}
                <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                  {batches.map((batch, i) => (
                    <motion.div
                      key={batch.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="card-interactive overflow-hidden group">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={batch.image}
                            alt={batch.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                          <span
                            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                              batch.grade === "gold"
                                ? "bg-stewardship-gold text-stewardship-gold-foreground"
                                : batch.grade === "silver"
                                ? "bg-muted-foreground text-muted"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {batch.grade === "gold" && "✦ "}
                            {gradeLabels[batch.grade]}
                          </span>
                          <span className="absolute bottom-4 left-4 bg-foreground/80 text-background px-2 py-1 rounded text-xs font-medium">
                            ID: {batch.id}
                          </span>
                        </div>

                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-display font-bold text-lg">{batch.name}</h3>
                            <div className="text-right">
                              <span className="text-xs text-primary uppercase font-semibold">
                                Premium
                              </span>
                              <p className="font-display font-bold">{batch.premium}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-sm text-primary mb-4">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {batch.location} • {batch.maturityDays} Days Maturity
                            </span>
                          </div>

                          <div className="bg-muted rounded-lg p-3 mb-4">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                              {impactIcons[batch.impactType]}
                              <span className="uppercase tracking-wider font-medium">
                                {impactLabels[batch.impactType]}
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-primary">
                              {batch.impactValue}
                            </p>
                          </div>

                          <Button variant="outline" className="w-full group/btn">
                            View Batch Details
                            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-border py-6 mt-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>© 2024 Biotik Stewardship Platforms. All batches are laboratory verified.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-foreground">Privacy Policy</a>
                <a href="#" className="hover:text-foreground">Terms of Procurement</a>
                <a href="#" className="hover:text-foreground">Stewardship Protocol v4.2</a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
