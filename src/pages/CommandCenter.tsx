import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  MapPin,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { EvidenceStreamCard } from "@/components/admin/EvidenceStreamCard";
import { AdminStatsCards, GradeDistributionCard, IntegrityScoreCard } from "@/components/admin/AdminStatsCards";
import { BatchVerificationQueue } from "@/components/admin/BatchVerificationQueue";
import { AnomalyDetectionPanel } from "@/components/admin/AnomalyDetectionPanel";
import { 
  useAdminBatches, 
  useAdminEvidenceStream, 
  useAdminStats 
} from "@/hooks/useAdminData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Benchmark growth data for Cobb 500/Ross 308
const benchmarkData = [
  { day: "DAY 0", benchmark: 42, actual: 0 },
  { day: "DAY 7", benchmark: 180, actual: 0 },
  { day: "DAY 14", benchmark: 450, actual: 0 },
  { day: "DAY 21", benchmark: 900, actual: 0 },
  { day: "DAY 28", benchmark: 1400, actual: 0 },
  { day: "DAY 35", benchmark: 2000, actual: 0 },
  { day: "DAY 42", benchmark: 2800, actual: 0 },
];

export default function CommandCenter() {
  const navigate = useNavigate();
  const { data: batches, isLoading: batchesLoading } = useAdminBatches();
  const { data: evidence, isLoading: evidenceLoading } = useAdminEvidenceStream();
  const { data: stats, isLoading: statsLoading } = useAdminStats();

  const handleAuditBatch = (batchId: string) => {
    navigate(`/batch/${batchId}`);
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar userRole="admin" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Auditor Command Center" />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AdminStatsCards stats={stats} isLoading={statsLoading} />
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-6">
            {/* Evidence Stream */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <EvidenceStreamCard 
                evidence={evidence || []} 
                isLoading={evidenceLoading} 
              />
            </motion.div>

            {/* Main Content Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-5 space-y-6"
            >
              {/* Biological Trajectory Chart */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-display flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" />
                        Biological Trajectory
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Weight Growth (g) vs Standard Benchmark
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-info" />
                        Benchmark
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-primary" />
                        Actual
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={benchmarkData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="day" 
                          tick={{ fontSize: 12 }}
                          stroke="hsl(var(--muted-foreground))"
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          stroke="hsl(var(--muted-foreground))"
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="benchmark"
                          stroke="hsl(var(--info))"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ fill: "hsl(var(--info))", strokeWidth: 2 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="actual"
                          stroke="hsl(var(--primary))"
                          strokeWidth={3}
                          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Anomaly Detection */}
              <AnomalyDetectionPanel 
                batches={batches || []} 
                isLoading={batchesLoading} 
              />
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-4 space-y-6"
            >
              {/* Verification Queue */}
              <BatchVerificationQueue 
                batches={batches || []} 
                isLoading={batchesLoading}
                onAuditBatch={handleAuditBatch}
              />

              {/* Grade Distribution & Integrity */}
              <div className="grid grid-cols-2 gap-4">
                <GradeDistributionCard stats={stats} isLoading={statsLoading} />
                <IntegrityScoreCard stats={stats} isLoading={statsLoading} />
              </div>

              {/* Map Placeholder */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-info" />
                    <CardTitle className="text-sm uppercase tracking-wider">
                      Verification Clusters
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-muted rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <MapPin className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Map Integration</p>
                        <p className="text-xs opacity-70">Coming Soon</p>
                      </div>
                    </div>
                    
                    {/* Sample cluster indicators */}
                    {batches && batches.length > 0 && (
                      <>
                        <div className="absolute top-1/4 right-1/3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                          {batches.filter(b => b.stewardship_grade === "gold").length}
                        </div>
                        <div className="absolute bottom-1/4 right-1/4 w-8 h-8 bg-info text-info-foreground rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                          {batches.filter(b => b.status === "active").length}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
