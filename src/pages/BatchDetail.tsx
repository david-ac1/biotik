import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import {
  ArrowLeft,
  Bird,
  Calendar,
  TrendingUp,
  Plus,
  Camera,
  FileText,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DailyLogDialog } from "@/components/batch/DailyLogDialog";
import { PhotoUpload } from "@/components/batch/PhotoUpload";
import { useBatch } from "@/hooks/useBatches";
import { useDailyLogs } from "@/hooks/useDailyLogs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BatchDetail() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const { data: batch, isLoading: batchLoading } = useBatch(batchId);
  const { logs, isLoading: logsLoading } = useDailyLogs(batchId);
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  if (batchLoading || !batch) {
    return (
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar userRole="farmer" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading batch...</div>
        </div>
      </div>
    );
  }

  const startDate = new Date(batch.start_date);
  const today = new Date();
  const dayNumber = differenceInDays(today, startDate) + 1;
  const progress = Math.min((dayNumber / batch.expected_maturity_days) * 100, 100);
  const currentCount = batch.current_count || batch.initial_count;

  // Prepare chart data
  const chartData = logs
    .slice()
    .sort((a, b) => a.day_number - b.day_number)
    .map((log) => ({
      day: `Day ${log.day_number}`,
      weight: log.avg_weight_g || 0,
      feed: log.feed_consumed_kg || 0,
    }));

  const gradeColors = {
    gold: "bg-stewardship-gold text-stewardship-gold-foreground",
    silver: "bg-muted-foreground text-muted",
    standard: "bg-muted text-muted-foreground",
    pending: "bg-info/10 text-info",
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar userRole="farmer" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Back button */}
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>

            {/* Batch Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                    {batch.batch_code}
                  </p>
                  <h1 className="text-3xl font-display font-bold text-foreground">
                    {batch.breed}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Started {format(startDate, "MMMM d, yyyy")}
                  </p>
                </div>
                <Badge
                  className={gradeColors[batch.stewardship_grade as keyof typeof gradeColors] || gradeColors.pending}
                >
                  {batch.stewardship_grade === "gold" && "✦ "}
                  {batch.stewardship_grade.charAt(0).toUpperCase() + batch.stewardship_grade.slice(1)} Status
                </Badge>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Growth Day</p>
                        <p className="text-2xl font-display font-bold">
                          {dayNumber} <span className="text-sm font-normal text-muted-foreground">/ {batch.expected_maturity_days}</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bird className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Current Count</p>
                        <p className="text-2xl font-display font-bold">
                          {currentCount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Integrity Score</p>
                        <p className="text-2xl font-display font-bold text-primary">
                          {batch.integrity_score}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Logs Recorded</p>
                        <p className="text-2xl font-display font-bold">
                          {logs.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Growth Progress</span>
                  <span>{Math.round(progress)}% complete</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-stewardship-gold rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <Tabs defaultValue="logs" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="logs" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Daily Logs
                  </TabsTrigger>
                  <TabsTrigger value="photos" className="gap-2">
                    <Camera className="w-4 h-4" />
                    Evidence Photos
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </TabsTrigger>
                </TabsList>

                <Button onClick={() => setShowLogDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Log
                </Button>
              </div>

              <TabsContent value="logs" className="space-y-4">
                {logs.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-display font-bold text-lg mb-2">No logs yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start recording daily data for this batch.
                      </p>
                      <Button onClick={() => setShowLogDialog(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Log
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {logs.map((log) => (
                      <Card key={log.id} className="card-interactive">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="font-display font-bold text-primary">
                                  D{log.day_number}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">
                                  {format(new Date(log.log_date), "EEEE, MMMM d, yyyy")}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  via {log.logged_via}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-6 text-sm">
                              <div className="text-center">
                                <p className="text-muted-foreground">Mortality</p>
                                <p className="font-semibold">{log.mortality_count}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-muted-foreground">Feed (kg)</p>
                                <p className="font-semibold">{log.feed_consumed_kg || "-"}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-muted-foreground">Avg Weight (g)</p>
                                <p className="font-semibold">{log.avg_weight_g || "-"}</p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedLogId(log.id)}
                              >
                                <Camera className="mr-2 h-4 w-4" />
                                Photos
                              </Button>
                            </div>
                          </div>
                          {log.notes && (
                            <p className="mt-3 text-sm text-muted-foreground border-t pt-3">
                              {log.notes}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="photos">
                {selectedLogId ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Upload Evidence Photos</CardTitle>
                        <Button variant="outline" size="sm" onClick={() => setSelectedLogId(null)}>
                          Back to log selection
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <PhotoUpload logId={selectedLogId} />
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-display font-bold text-lg mb-2">Select a log entry</h3>
                      <p className="text-muted-foreground">
                        Photos must be attached to a specific daily log. Select a log from the "Daily Logs" tab.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Growth Trajectory</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {chartData.length > 0 ? (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                            <YAxis stroke="hsl(var(--muted-foreground))" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="weight"
                              name="Weight (g)"
                              stroke="hsl(var(--primary))"
                              strokeWidth={2}
                              dot={{ fill: "hsl(var(--primary))" }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        <p>Add daily logs to see growth analytics</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <DailyLogDialog
        open={showLogDialog}
        onOpenChange={setShowLogDialog}
        batch={batch}
        onLogCreated={(logId) => setSelectedLogId(logId)}
      />
    </div>
  );
}
