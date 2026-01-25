import { motion } from "framer-motion";
import { 
  MessageCircle, 
  QrCode, 
  Trophy, 
  HelpCircle,
  Check,
  Phone,
  Camera,
  Send
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default function FarmerLogging() {
  const batchStats = [
    { label: "Current Batch", value: "#102", sublabel: "(Cobb 500)" },
    { label: "Growth Day", value: "Day 28", sublabel: null },
    { label: "Health Status", value: "Green", sublabel: null, isStatus: true },
    { label: "Integrity Score", value: "98%", sublabel: null, isScore: true },
  ];

  const chatMessages = [
    {
      type: "bot",
      text: "Hello Farmer Ebuka! Welcome to your Biotik Stewardship Dashboard. You are currently managing Batch #102 (Cobb 500). Your current health status is: Green 🟢.",
      time: "1:37 PM",
    },
    { type: "user", text: "1", time: "1:39 PM" },
    {
      type: "bot",
      text: "📊 Day 28: Daily Log Let's keep the streak alive! How many birds died today? (Please reply with a number)",
      time: "1:39 PM",
    },
    { type: "user", text: "0", time: "1:42 PM" },
    {
      type: "bot",
      text: "📸 Verification Time: To confirm your Stewardship Gold status, please send: A photo of today's empty feed bags. A wide photo of the flock.",
      time: "1:43 PM",
    },
  ];

  return (
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar userRole="farmer" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          userName="Ebuka Okafor" 
          userRole="Farmer" 
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                Livestock Logging
              </h1>
              <p className="text-muted-foreground">
                Manage your farm stewardship through automated WhatsApp synchronization.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Batch Overview Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg font-display">Batch Overview</CardTitle>
                      <span className="badge-gold">Stewardship Gold Status</span>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {batchStats.map((stat, i) => (
                          <div key={i} className="stat-card">
                            <span className="stat-label">{stat.label}</span>
                            <span className={`stat-value ${stat.isScore ? "text-primary" : ""}`}>
                              {stat.isStatus && (
                                <span className="inline-flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-success" />
                                  {stat.value}
                                </span>
                              )}
                              {!stat.isStatus && stat.value}
                            </span>
                            {stat.sublabel && (
                              <span className="text-xs text-muted-foreground">{stat.sublabel}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* WhatsApp Connect Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                          <h3 className="text-2xl font-display font-bold mb-2">
                            Connect WhatsApp Bot
                          </h3>
                          <p className="text-muted-foreground mb-6">
                            Link your account to the Biotik AI Steward to start your daily 
                            logging trail. Our AI will verify your photos and logs automatically.
                          </p>
                          
                          <div className="space-y-3">
                            {[
                              { num: 1, text: "Open WhatsApp on your mobile phone" },
                              { num: 2, text: "Scan the QR code to the right with your camera" },
                              { num: 3, text: 'Send "HELLO" to begin your Day 28 stewardship log', highlight: "HELLO" },
                            ].map((step) => (
                              <div key={step.num} className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center flex-shrink-0">
                                  {step.num}
                                </span>
                                <span className="text-sm text-foreground">
                                  {step.highlight ? (
                                    <>
                                      Send "<span className="text-primary font-semibold">{step.highlight}</span>" to begin your Day 28 stewardship log
                                    </>
                                  ) : (
                                    step.text
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0">
                          <div className="w-40 h-40 bg-whatsapp-green rounded-2xl flex items-center justify-center">
                            <QrCode className="w-24 h-24 text-primary-foreground" />
                          </div>
                          <p className="text-center text-xs text-muted-foreground mt-2 uppercase tracking-wider">
                            Scan to Sync
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Rewards Card */}
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
                          You've earned an extra <strong>450 NGN</strong> per bird for this batch. 
                          Keep your health status green to maintain this premium rate!
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Right Column - WhatsApp Preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1"
              >
                <div className="bg-foreground rounded-[2.5rem] p-3 shadow-2xl">
                  <div className="bg-whatsapp-chat rounded-[2rem] overflow-hidden h-[600px] flex flex-col">
                    {/* Chat Header */}
                    <div className="bg-primary px-4 py-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-primary-foreground font-semibold text-sm">
                          Biotik AI Steward
                        </p>
                        <p className="text-primary-foreground/70 text-xs">Online</p>
                      </div>
                      <div className="flex gap-4 text-primary-foreground/80">
                        <Phone className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-4 space-y-3 overflow-y-auto scrollbar-thin">
                      {chatMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-xl px-3 py-2 ${
                              msg.type === "user"
                                ? "bg-whatsapp-bubble-sent text-foreground"
                                : "bg-whatsapp-bubble text-foreground"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            <p className="text-[10px] text-muted-foreground text-right mt-1">
                              {msg.time}
                              {msg.type === "user" && (
                                <Check className="w-3 h-3 inline ml-1 text-info" />
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <div className="p-3 bg-card border-t border-border flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full px-4 py-2 text-sm text-muted-foreground">
                        Type a message
                      </div>
                      <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <Camera className="w-5 h-5 text-primary-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
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
    </div>
  );
}
