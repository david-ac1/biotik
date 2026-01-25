import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus,
  MessageCircle, 
  QrCode, 
  Trophy, 
  HelpCircle,
  Bird,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { BatchCard } from "@/components/batch/BatchCard";
import { CreateBatchDialog } from "@/components/batch/CreateBatchDialog";
import { useBatches } from "@/hooks/useBatches";
import { useAuth } from "@/contexts/AuthContext";

export default function FarmerLogging() {
  const { profile } = useAuth();
  const { batches, isLoading } = useBatches();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const activeBatches = batches.filter((b) => b.status === "active");
  const completedBatches = batches.filter((b) => b.status === "completed");
  
  // Calculate totals
  const totalBirds = activeBatches.reduce((sum, b) => sum + (b.current_count || b.initial_count), 0);
  const avgScore = activeBatches.length > 0
    ? Math.round(activeBatches.reduce((sum, b) => sum + b.integrity_score, 0) / activeBatches.length)
    : 0;

  return (
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar userRole="farmer" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                    Livestock Dashboard
                  </h1>
                  <p className="text-muted-foreground">
                    Welcome back, {profile?.full_name || "Farmer"}. Manage your batches and track stewardship.
                  </p>
                </div>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Batch
                </Button>
              </div>
            </motion.div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bird className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Batches</p>
                      <p className="text-2xl font-display font-bold">{activeBatches.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stewardship-gold/10 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-stewardship-gold" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Birds</p>
                      <p className="text-2xl font-display font-bold">{totalBirds.toLocaleString()}</p>
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
                      <p className="text-sm text-muted-foreground">Avg. Score</p>
                      <p className="text-2xl font-display font-bold text-primary">{avgScore}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-2xl font-display font-bold">{completedBatches.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Batches */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="font-display font-bold text-xl mb-4">Active Batches</h2>
                  
                  {isLoading ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {[1, 2].map((i) => (
                        <Card key={i} className="animate-pulse">
                          <CardContent className="p-5 h-64" />
                        </Card>
                      ))}
                    </div>
                  ) : activeBatches.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Bird className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-display font-bold text-lg mb-2">No active batches</h3>
                        <p className="text-muted-foreground mb-4">
                          Create your first batch to start tracking your poultry.
                        </p>
                        <Button onClick={() => setShowCreateDialog(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Create Batch
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {activeBatches.map((batch) => (
                        <BatchCard key={batch.id} batch={batch} />
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Rewards Card */}
                {activeBatches.some((b) => b.stewardship_grade === "gold") && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="bg-stewardship-gold/5 border-stewardship-gold/20">
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-stewardship-gold/20 flex items-center justify-center flex-shrink-0">
                          <Trophy className="w-7 h-7 text-stewardship-gold" />
                        </div>
                        <div>
                          <h4 className="font-display font-semibold text-stewardship-gold mb-1">
                            Stewardship Gold Rewards
                          </h4>
                          <p className="text-sm text-foreground">
                            You have Gold status batches! You'll earn premium rates on verified sales.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>

              {/* Right Column - WhatsApp Connect */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-whatsapp-green" />
                      WhatsApp Bot
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Connect to the Biotik AI Steward to log data directly from WhatsApp.
                    </p>
                    
                    <div className="flex justify-center">
                      <div className="w-32 h-32 bg-whatsapp-green rounded-2xl flex items-center justify-center">
                        <QrCode className="w-20 h-20 text-primary-foreground" />
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0">1</span>
                        <span>Open WhatsApp on your phone</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0">2</span>
                        <span>Scan the QR code above</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0">3</span>
                        <span>Send "HELLO" to begin</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Help Button */}
            <Button
              variant="outline"
              size="icon"
              className="fixed bottom-6 left-6 w-12 h-12 rounded-full shadow-lg"
            >
              <HelpCircle className="w-5 h-5" />
            </Button>
          </div>
        </main>
      </div>

      <CreateBatchDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}
