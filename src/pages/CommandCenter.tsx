import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  MapPin,
  TrendingUp,
  Image as ImageIcon,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import chicken1 from "@/assets/chicken-1.jpg";
import chicken2 from "@/assets/chicken-2.jpg";

const growthData = [
  { day: "DAY 0", benchmark: 42, actual: 40 },
  { day: "DAY 7", benchmark: 180, actual: 175 },
  { day: "DAY 14", benchmark: 450, actual: 480 },
  { day: "DAY 21", benchmark: 900, actual: 920 },
  { day: "DAY 28", benchmark: 1400, actual: 1450 },
  { day: "DAY 35", benchmark: 2000, actual: 2100 },
];

const evidenceStream = [
  {
    farmer: "Farmer John",
    time: "14:20 PM",
    message: "Batch #102: Day 14 flock photos for weight verification.",
    images: [chicken1, chicken2],
    status: "verified",
    statusLabel: "Verified Geo",
  },
  {
    farmer: "Kigali Central Coop",
    time: "12:05 PM",
    message: "Feed delivery receipt submitted for Batch #094.",
    images: [chicken2],
    status: "pending",
    statusLabel: "Audit Pending",
  },
  {
    farmer: "Emmanuel M.",
    time: "09:45 AM",
    message: "Update: Vaccination schedule completed for layer units.",
    images: [],
    status: "bio-secure",
    statusLabel: "Bio-secure",
  },
];

const anomalyStats = [
  { label: "Input Variance", value: "+12.4%", sublabel: "Above Average", trend: "up" },
  { label: "Geo-Tag Integrity", value: "98.2%", sublabel: "High Confidence", status: "success" },
  { label: "Time Discrepancy", value: "2 Alerts", sublabel: "Manual Review Required", status: "warning" },
];

export default function CommandCenter() {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar userRole="admin" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Auditor Command Center" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Evidence Stream */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <CardTitle className="text-sm uppercase tracking-wider">
                      Evidence Stream
                    </CardTitle>
                  </div>
                  <span className="bg-success text-success-foreground text-[10px] uppercase font-semibold px-2 py-0.5 rounded">
                    Live
                  </span>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin">
                  {evidenceStream.map((item, i) => (
                    <div
                      key={i}
                      className={`border-l-4 ${
                        item.status === "verified"
                          ? "border-primary"
                          : item.status === "pending"
                          ? "border-info"
                          : "border-success"
                      } pl-4 py-2`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{item.farmer}</span>
                        <span className="text-xs text-muted-foreground">{item.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{item.message}</p>
                      
                      {item.images.length > 0 && (
                        <div className="flex gap-2 mb-3">
                          {item.images.map((img, j) => (
                            <img
                              key={j}
                              src={img}
                              alt="Evidence"
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                      
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${
                          item.status === "verified"
                            ? "bg-primary/10 text-primary"
                            : item.status === "pending"
                            ? "bg-info/10 text-info"
                            : "bg-success/10 text-success"
                        }`}
                      >
                        {item.status === "verified" && <CheckCircle2 className="w-3 h-3" />}
                        {item.status === "pending" && <Clock className="w-3 h-3" />}
                        {item.status === "bio-secure" && <CheckCircle2 className="w-3 h-3" />}
                        {item.statusLabel}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Charts Area */}
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
                      <CardTitle className="font-display">Biological Trajectory</CardTitle>
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
                        Actual Data
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={growthData}>
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

              {/* Fraud Detection */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    <CardTitle className="text-sm uppercase tracking-wider">
                      Fraud Detection & Anomalies
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {anomalyStats.map((stat, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-lg border ${
                          stat.status === "warning"
                            ? "border-warning/30 bg-warning/5"
                            : "border-border"
                        }`}
                      >
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          {stat.label}
                        </p>
                        <p className={`text-2xl font-display font-bold ${
                          stat.status === "warning" ? "text-warning" : "text-foreground"
                        }`}>
                          {stat.value}
                        </p>
                        <p className={`text-xs flex items-center gap-1 mt-1 ${
                          stat.trend === "up" ? "text-primary" : 
                          stat.status === "success" ? "text-success" : "text-warning"
                        }`}>
                          {stat.trend === "up" && <TrendingUp className="w-3 h-3" />}
                          {stat.status === "success" && <CheckCircle2 className="w-3 h-3" />}
                          {stat.status === "warning" && <AlertTriangle className="w-3 h-3" />}
                          {stat.sublabel}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Map & Verification */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-4"
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-info" />
                    <CardTitle className="text-sm uppercase tracking-wider">
                      Verification Clusters
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Map Placeholder */}
                  <div className="h-80 bg-muted rounded-lg relative overflow-hidden mb-6">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Map integration</p>
                        <p className="text-xs opacity-70">Kigali Region Clusters</p>
                      </div>
                    </div>
                    
                    {/* Sample cluster indicators */}
                    <div className="absolute top-1/4 right-1/3 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                      84%
                    </div>
                    <div className="absolute bottom-1/4 right-1/4 w-10 h-10 bg-info text-info-foreground rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                      92%
                    </div>
                  </div>

                  {/* Confidence Scoring */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Confidence Scoring</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground uppercase text-xs tracking-wider">
                            Digital Verification
                          </span>
                          <span className="font-semibold text-primary">94%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "94%" }} />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground uppercase text-xs tracking-wider">
                            On-Site Concordance
                          </span>
                          <span className="font-semibold text-info">81%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-info rounded-full" style={{ width: "81%" }} />
                        </div>
                      </div>
                    </div>
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
