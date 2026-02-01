import { motion } from "framer-motion";
import { 
  BookOpen, 
  Bird, 
  ShieldCheck, 
  TrendingUp, 
  MessageCircle,
  QrCode,
  ShoppingCart,
  Users,
  Camera,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Leaf
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BiotikLogo } from "@/components/BiotikLogo";
import { Link } from "react-router-dom";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <BiotikLogo />
          <div className="flex items-center gap-4">
            <Link to="/marketplace">
              <Button variant="ghost">Marketplace</Button>
            </Link>
            <Link to="/login">
              <Button>
                Sign In
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            Documentation Center
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">
            Biotik User Guide
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about the Biotik Stewardship Platform — from batch logging to marketplace sales.
          </p>
        </motion.div>

        {/* Role-Based Tabs */}
        <Tabs defaultValue="farmers" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="farmers" className="flex items-center gap-2">
              <Bird className="w-4 h-4" />
              Farmers
            </TabsTrigger>
            <TabsTrigger value="buyers" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Buyers
            </TabsTrigger>
            <TabsTrigger value="admins" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Admins
            </TabsTrigger>
          </TabsList>

          {/* Farmers Guide */}
          <TabsContent value="farmers" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Getting Started */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-primary" />
                    Getting Started
                  </CardTitle>
                  <CardDescription>
                    Begin your stewardship journey in three simple steps
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mb-3">1</div>
                      <h4 className="font-semibold mb-2">Create Account</h4>
                      <p className="text-sm text-muted-foreground">Sign up with your email and complete your farm profile with location and contact details.</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mb-3">2</div>
                      <h4 className="font-semibold mb-2">Create First Batch</h4>
                      <p className="text-sm text-muted-foreground">Add your poultry batch with breed, count, and start date. The system generates a unique batch code.</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mb-3">3</div>
                      <h4 className="font-semibold mb-2">Log Daily Data</h4>
                      <p className="text-sm text-muted-foreground">Record mortality, feed intake, and weight daily. Upload evidence photos for AI verification.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Feature Guides */}
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="batch-management" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Bird className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold">Batch Management</h3>
                        <p className="text-sm text-muted-foreground">Create, track, and complete batches</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-6 space-y-4">
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      <h4 className="text-foreground font-semibold">Creating a Batch</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Click "New Batch" on your dashboard</li>
                        <li>Select breed (Cobb 500, Ross 308, etc.)</li>
                        <li>Enter initial bird count and start date</li>
                        <li>Set expected maturity days (typically 35-42)</li>
                      </ul>
                      
                      <h4 className="text-foreground font-semibold mt-4">Batch Lifecycle</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Active:</strong> Currently tracking and logging data</li>
                        <li><strong>Completed:</strong> Reached maturity, ready for marketplace</li>
                        <li><strong>Available for Sale:</strong> Listed on B2B marketplace</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="daily-logging" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-info" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold">Daily Logging</h3>
                        <p className="text-sm text-muted-foreground">Record daily metrics for AI verification</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-6 space-y-4">
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      <h4 className="text-foreground font-semibold">Required Daily Data</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Mortality Count:</strong> Birds lost since last log</li>
                        <li><strong>Feed Consumed (kg):</strong> Total feed given today</li>
                        <li><strong>Average Weight (g):</strong> Sample weigh at least 5 birds</li>
                        <li><strong>Notes:</strong> Any observations or issues</li>
                      </ul>
                      
                      <h4 className="text-foreground font-semibold mt-4">Best Practices</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Log at the same time each day for consistency</li>
                        <li>Weigh birds before feeding for accurate readings</li>
                        <li>Document any health issues in notes</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="photo-evidence" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                        <Camera className="w-5 h-5 text-success" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold">Photo Evidence</h3>
                        <p className="text-sm text-muted-foreground">Upload photos for AI-powered verification</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-6 space-y-4">
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      <h4 className="text-foreground font-semibold">Photo Types</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Flock Overview:</strong> Wide shot of the entire flock</li>
                        <li><strong>Feed Station:</strong> Photo of feeders with visible feed</li>
                        <li><strong>Water System:</strong> Drinkers and water quality</li>
                        <li><strong>Health Check:</strong> Close-up of bird condition</li>
                      </ul>
                      
                      <h4 className="text-foreground font-semibold mt-4">AI Verification</h4>
                      <p>Our AI analyzes photos for:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Flock density and welfare indicators</li>
                        <li>Feed availability and cleanliness</li>
                        <li>EXIF metadata (timestamp, GPS location)</li>
                        <li>Consistency with logged data</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="stewardship-grades" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-stewardship-gold/10 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-stewardship-gold" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold">Stewardship Grades</h3>
                        <p className="text-sm text-muted-foreground">Understand Gold, Silver, and Bronze ratings</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-6 space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 bg-stewardship-gold/10 rounded-lg">
                        <Badge className="bg-stewardship-gold text-stewardship-gold-foreground">Gold</Badge>
                        <div>
                          <p className="text-sm font-medium">Premium Tier — Up to 20% price premium</p>
                          <p className="text-xs text-muted-foreground">Integrity Score 90%+, FCR ≤1.7, consistent logging, verified photos</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-stewardship-silver/10 rounded-lg">
                        <Badge className="bg-stewardship-silver text-stewardship-silver-foreground">Silver</Badge>
                        <div>
                          <p className="text-sm font-medium">Standard Tier — Up to 10% price premium</p>
                          <p className="text-xs text-muted-foreground">Integrity Score 75-89%, FCR ≤1.85, regular logging</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-stewardship-bronze/10 rounded-lg">
                        <Badge className="bg-stewardship-bronze text-stewardship-bronze-foreground">Bronze</Badge>
                        <div>
                          <p className="text-sm font-medium">Entry Tier — Market price</p>
                          <p className="text-xs text-muted-foreground">Integrity Score 50-74%, basic compliance</p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="qr-passports" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <QrCode className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold">QR Batch Passports</h3>
                        <p className="text-sm text-muted-foreground">Public verification for buyers</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-6 space-y-4">
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      <p>Each completed batch gets a unique QR code that links to a public verification page showing:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Complete growth trajectory vs. industry benchmark</li>
                        <li>FCR (Feed Conversion Ratio) performance</li>
                        <li>Mortality rate and flock health</li>
                        <li>Verified evidence photos with timestamps</li>
                        <li>Stewardship grade and audit history</li>
                      </ul>
                      <p className="mt-4">Download the QR code from your batch detail page and share it with buyers for transparent verification.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </TabsContent>

          {/* Buyers Guide */}
          <TabsContent value="buyers" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                    Buyer Guide
                  </CardTitle>
                  <CardDescription>
                    Source verified, antibiotic-free poultry from certified farms
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        Marketplace Features
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                          Browse verified batches from certified farms
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                          Filter by stewardship grade (Gold, Silver, Bronze)
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                          View complete batch history and AI verification</li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                          Scan QR codes for public verification
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-stewardship-gold" />
                        Verification Guarantee
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-stewardship-gold mt-2" />
                          AI-verified growth data against benchmarks
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-stewardship-gold mt-2" />
                          Photo evidence with EXIF metadata
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-stewardship-gold mt-2" />
                          Anomaly detection for suspicious patterns
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-stewardship-gold mt-2" />
                          Complete audit trail for compliance
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="placing-orders" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold">Placing Orders</h3>
                        <p className="text-sm text-muted-foreground">How to purchase verified batches</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-6 space-y-4">
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Browse available batches in the Marketplace</li>
                        <li>Click "Order" on your chosen batch</li>
                        <li>Enter quantity (kg) and preferred delivery date</li>
                        <li>Review pricing with stewardship premium applied</li>
                        <li>Submit order — farmer receives notification</li>
                        <li>Track order status in your Orders dashboard</li>
                      </ol>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="understanding-grades" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-stewardship-gold/10 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-stewardship-gold" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold">Understanding Grades</h3>
                        <p className="text-sm text-muted-foreground">What each stewardship level means</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-6 space-y-4">
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      <p>Stewardship grades reflect the quality and transparency of farming practices:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Gold:</strong> Exceptional standards, full verification, premium FCR</li>
                        <li><strong>Silver:</strong> Strong standards, good verification coverage</li>
                        <li><strong>Bronze:</strong> Basic compliance, entry-level verification</li>
                      </ul>
                      <p className="mt-4">Higher grades indicate lower risk and better welfare standards.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </TabsContent>

          {/* Admins Guide */}
          <TabsContent value="admins" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Admin Command Center Guide
                  </CardTitle>
                  <CardDescription>
                    Monitor, audit, and manage the verification ecosystem
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
                      <h4 className="font-semibold">Real-Time Analytics</h4>
                      <p className="text-xs text-muted-foreground">Platform-wide statistics and trends</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-2" />
                      <h4 className="font-semibold">Anomaly Detection</h4>
                      <p className="text-xs text-muted-foreground">AI-flagged suspicious patterns</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <Camera className="w-8 h-8 text-info mx-auto mb-2" />
                      <h4 className="font-semibold">Evidence Stream</h4>
                      <p className="text-xs text-muted-foreground">Live photo verification feed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="verification-queue" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-info" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold">Verification Queue</h3>
                        <p className="text-sm text-muted-foreground">Review and audit pending batches</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-6 space-y-4">
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      <p>The verification queue shows batches requiring manual review:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Batches with anomaly flags from AI detection</li>
                        <li>Newly completed batches awaiting final audit</li>
                        <li>Batches with inconsistent photo evidence</li>
                      </ul>
                      <p className="mt-4">Click "Audit" to view full batch details and evidence.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="anomaly-detection" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold">Anomaly Detection</h3>
                        <p className="text-sm text-muted-foreground">AI-powered fraud and issue detection</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-6 space-y-4">
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      <p>The system detects several types of anomalies:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Mortality Spike:</strong> Unusual death rates vs. batch average</li>
                        <li><strong>FCR Deviation:</strong> Feed conversion outside normal range</li>
                        <li><strong>Weight Variance:</strong> Growth not matching breed benchmarks</li>
                        <li><strong>Photo Inconsistency:</strong> EXIF data or visual mismatches</li>
                        <li><strong>Logging Gaps:</strong> Missing daily data entries</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-display font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="faq-1" className="border rounded-lg px-4">
              <AccordionTrigger>What is FCR and why does it matter?</AccordionTrigger>
              <AccordionContent>
                FCR (Feed Conversion Ratio) measures how efficiently birds convert feed into body weight. Lower FCR = better efficiency. Industry standard is 1.6-1.8. FCR is a key metric for determining stewardship grades and buyer confidence.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-2" className="border rounded-lg px-4">
              <AccordionTrigger>How is the Integrity Score calculated?</AccordionTrigger>
              <AccordionContent>
                The Integrity Score combines: logging consistency (30%), photo verification status (25%), FCR performance vs. benchmark (25%), and mortality rate vs. breed average (20%). Scores update daily based on new data.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-3" className="border rounded-lg px-4">
              <AccordionTrigger>Can I use WhatsApp to log data?</AccordionTrigger>
              <AccordionContent>
                Yes! Connect to the Biotik AI Steward via WhatsApp to log daily data, upload photos, and receive automated reminders. The chatbot parses your messages and photos for direct database entry.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-4" className="border rounded-lg px-4">
              <AccordionTrigger>How do buyers verify my batch?</AccordionTrigger>
              <AccordionContent>
                Each completed batch has a unique QR code linking to a public verification page. Buyers can scan this code to view the full audit trail, growth data, photos, and stewardship grade without needing an account.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-12">
              <h3 className="text-2xl font-display font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Join the Biotik Stewardship ecosystem and connect with verified farms or premium buyers.
              </p>
              <Link to="/login">
                <Button size="lg">
                  Sign In to Continue
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-foreground py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-background">Biotik</span>
            </div>
            <div className="flex gap-6 text-sm text-background/60">
              <Link to="/" className="hover:text-background">Home</Link>
              <Link to="/docs" className="hover:text-background">Documentation</Link>
              <Link to="/marketplace" className="hover:text-background">Marketplace</Link>
            </div>
            <p className="text-sm text-background/60">© 2026 Biotik Stewardship Platforms</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
