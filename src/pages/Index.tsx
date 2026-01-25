import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, TrendingUp, Leaf, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BiotikLogo } from "@/components/BiotikLogo";
import heroImage from "@/assets/hero-farm.jpg";
import { Link } from "react-router-dom";

export default function Index() {
  const stats = [
    { value: "500+", label: "Verified Farms" },
    { value: "98%", label: "Avg. Integrity Score" },
    { value: "1.82", label: "Average FCR" },
    { value: "25+", label: "B2B Partners" },
  ];

  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "AI-Powered Verification",
      description: "Biological anomaly detection compares growth against industry benchmarks.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Premium Pricing",
      description: "Stewardship Gold certified farms earn up to 20% more per bird.",
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "One Health Compliant",
      description: "Real-time AMR surveillance integrated with public health systems.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "B2B Marketplace",
      description: "Direct pipeline connecting verified farms to premium hotel buyers.",
    },
  ];

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

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Sustainable Poultry Farm"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <ShieldCheck className="w-4 h-4" />
              Stewardship Verified Platform
            </div>

            <h1 className="text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
              Transform Public Health
              <span className="text-primary"> Into Farmer Prosperity</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              AI-powered biological verification for smallholder farms. 
              Connect antibiotic-free poultry to premium B2B markets.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login">
                <Button size="lg" className="text-base px-8">
                  Start Stewardship Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button size="lg" variant="outline" className="text-base px-8">
                  Explore Marketplace
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-foreground/80 text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">
              The Three Pillars of Biotik
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A complete ecosystem bridging sustainable livestock production 
              with premium food markets.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="card-interactive p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="badge-gold inline-flex mb-6">Stewardship Gold</div>
            <h2 className="text-4xl font-display font-bold text-foreground mb-6">
              Ready to Join the Stewardship Ecosystem?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Whether you're a smallholder farmer seeking premium prices or a 
              B2B buyer looking for verified clean poultry, Biotik connects you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="text-base px-8">
                  Request Access
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-background">Biotik</span>
            </div>
            <div className="flex gap-6 text-sm text-background/60">
              <a href="#" className="hover:text-background">Privacy Policy</a>
              <a href="#" className="hover:text-background">Terms of Service</a>
              <a href="#" className="hover:text-background">Contact</a>
            </div>
            <p className="text-sm text-background/60">
              © 2024 Biotik Stewardship Platforms
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
