import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BiotikLogo } from "@/components/BiotikLogo";
import { 
  Shield, 
  Leaf, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Award,
  CheckCircle2,
  AlertTriangle,
  Bird,
  Scale
} from "lucide-react";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export default function BatchPassport() {
  const { batchId } = useParams<{ batchId: string }>();

  const { data: batch, isLoading: batchLoading } = useQuery({
    queryKey: ["public-batch", batchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("batches")
        .select("*")
        .eq("id", batchId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!batchId,
  });

  const { data: farmer } = useQuery({
    queryKey: ["public-farmer", batch?.farmer_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, farm_name, district")
        .eq("id", batch!.farmer_id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!batch?.farmer_id,
  });

  const { data: dailyLogs } = useQuery({
    queryKey: ["public-logs", batchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_logs")
        .select("*")
        .eq("batch_id", batchId)
        .order("day_number", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!batchId,
  });

  const { data: photos } = useQuery({
    queryKey: ["public-photos", dailyLogs],
    queryFn: async () => {
      if (!dailyLogs?.length) return [];
      const logIds = dailyLogs.map(l => l.id);
      const { data, error } = await supabase
        .from("evidence_photos")
        .select("*")
        .in("log_id", logIds)
        .eq("verification_status", "verified")
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
    enabled: !!dailyLogs?.length,
  });

  if (batchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading batch passport...</p>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-destructive/5 to-background">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Batch Not Found</h2>
            <p className="text-muted-foreground">
              This batch passport is not available for public viewing.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const gradeConfig = {
    gold: { color: "bg-yellow-500", label: "Gold", icon: Award },
    silver: { color: "bg-gray-400", label: "Silver", icon: Award },
    standard: { color: "bg-amber-700", label: "Standard", icon: CheckCircle2 },
    pending: { color: "bg-muted", label: "Pending", icon: AlertTriangle },
  };

  const grade = gradeConfig[batch.stewardship_grade as keyof typeof gradeConfig] || gradeConfig.pending;
  const GradeIcon = grade.icon;

  // Cobb 500 benchmark data
  const cobb500Benchmark = [
    { day: 1, weight: 42 },
    { day: 7, weight: 187 },
    { day: 14, weight: 486 },
    { day: 21, weight: 922 },
    { day: 28, weight: 1479 },
    { day: 35, weight: 2106 },
    { day: 42, weight: 2746 },
  ];

  const chartData = cobb500Benchmark.map(benchmark => {
    const actualLog = dailyLogs?.find(l => l.day_number === benchmark.day);
    return {
      day: benchmark.day,
      benchmark: benchmark.weight,
      actual: actualLog?.avg_weight_g || null,
    };
  });

  const totalMortality = dailyLogs?.reduce((sum, log) => sum + (log.mortality_count || 0), 0) || 0;
  const survivalRate = batch.initial_count > 0 
    ? (((batch.initial_count - totalMortality) / batch.initial_count) * 100).toFixed(1)
    : "N/A";

  const latestFCR = dailyLogs?.length 
    ? dailyLogs[dailyLogs.length - 1].fcr_cumulative 
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <BiotikLogo />
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Verified Batch Passport</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Card */}
        <Card className="mb-6 overflow-hidden">
          <div className={`h-2 ${grade.color}`} />
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Batch Code</p>
                <CardTitle className="text-2xl font-bold">{batch.batch_code}</CardTitle>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2 gap-2">
                <GradeIcon className="h-5 w-5" />
                {grade.label} Grade
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Bird className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Breed</p>
                  <p className="font-medium">{batch.breed}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p className="font-medium">{format(new Date(batch.start_date), "MMM d, yyyy")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Flock Size</p>
                  <p className="font-medium">{batch.current_count?.toLocaleString()} birds</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium">{farmer?.district || "—"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Farmer Info */}
        {farmer && (
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Verified Producer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{farmer.farm_name || farmer.full_name}</p>
              <p className="text-sm text-muted-foreground">{farmer.district} District</p>
            </CardContent>
          </Card>
        )}

        {/* Performance Metrics */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <Scale className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{latestFCR?.toFixed(2) || "—"}</p>
              <p className="text-sm text-muted-foreground">Feed Conversion Ratio</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold">{survivalRate}%</p>
              <p className="text-sm text-muted-foreground">Survival Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">{batch.integrity_score}%</p>
              <p className="text-sm text-muted-foreground">Integrity Score</p>
            </CardContent>
          </Card>
        </div>

        {/* Growth Chart */}
        {dailyLogs && dailyLogs.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Growth Trajectory</CardTitle>
              <p className="text-sm text-muted-foreground">
                Actual weight vs. {batch.breed} benchmark
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="day" 
                      label={{ value: "Day", position: "bottom", offset: -5 }}
                    />
                    <YAxis 
                      label={{ value: "Weight (g)", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="benchmark" 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeDasharray="5 5"
                      name="Benchmark"
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Actual"
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Evidence Photos */}
        {photos && photos.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Verified Evidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden">
                    <img 
                      src={photo.photo_url} 
                      alt="Evidence photo"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <Badge variant="secondary" className="text-xs">
                        {photo.photo_type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Audit Trail */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Audit Trail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Daily Logs Recorded</span>
                <span className="font-medium">{dailyLogs?.length || 0} entries</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Evidence Photos</span>
                <span className="font-medium">{photos?.length || 0} verified</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Audit</span>
                <span className="font-medium">
                  {batch.last_audit_at 
                    ? format(new Date(batch.last_audit_at), "MMM d, yyyy")
                    : "Pending"
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>This batch passport is verified and secured by Biotik's blockchain-backed audit system.</p>
          <p className="mt-1">Scan the QR code on your product packaging to verify authenticity.</p>
        </div>
      </main>
    </div>
  );
}
