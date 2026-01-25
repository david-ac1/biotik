import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BiotikLogo } from "@/components/BiotikLogo";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-farm.jpg";

type UserRole = "farmer" | "buyer" | "admin";
type AuthMode = "signin" | "signup";

const roleLabels: Record<UserRole, string> = {
  farmer: "Farmer",
  buyer: "Buyer",
  admin: "Admin",
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  
  const [mode, setMode] = useState<AuthMode>("signin");
  const [role, setRole] = useState<UserRole>("farmer");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || (role === "admin" ? "/command-center" : "/dashboard");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await signUp(email, password, fullName, role);
        if (error) {
          toast({
            variant: "destructive",
            title: "Sign up failed",
            description: error.message,
          });
          return;
        }
        toast({
          title: "Account created!",
          description: "You can now sign in with your credentials.",
        });
        setMode("signin");
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            variant: "destructive",
            title: "Sign in failed",
            description: error.message,
          });
          return;
        }
        navigate(from, { replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex w-full max-w-6xl bg-card rounded-3xl overflow-hidden shadow-elevated border border-border"
      >
        {/* Left Panel - Hero Image */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden group">
          <img
            src={heroImage}
            alt="Sustainable Poultry Farming"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 glass-overlay flex flex-col justify-end p-12 text-primary-foreground">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary-foreground/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-primary-foreground/30 text-xs font-medium uppercase tracking-widest mb-4">
                <ShieldCheck className="w-4 h-4" />
                <span>Stewardship Verified</span>
              </div>
              
              <h2 className="text-4xl font-display font-bold mb-4 leading-tight">
                Advancing Sustainable
                <br />
                Poultry Agriculture.
              </h2>
              
              <p className="text-primary-foreground/90 mb-8 max-w-md">
                Join the clinical-grade B2B ecosystem for real-time biosecurity, 
                traceability, and ethical farming management.
              </p>
              
              <div className="flex gap-8 pt-6 border-t border-primary-foreground/30">
                <div>
                  <div className="text-3xl font-display font-bold">98%</div>
                  <div className="text-xs uppercase tracking-wider opacity-80">Integrity Score</div>
                </div>
                <div>
                  <div className="text-3xl font-display font-bold">1.82</div>
                  <div className="text-xs uppercase tracking-wider opacity-80">Average FCR</div>
                </div>
                <div>
                  <div className="text-3xl font-display font-bold">Verified</div>
                  <div className="text-xs uppercase tracking-wider opacity-80">One Health Standard</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col">
          <div className="flex justify-between items-center mb-12">
            <BiotikLogo />
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl font-display font-bold mb-2 text-foreground">
                {mode === "signin" ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-muted-foreground mb-8">
                {mode === "signin" 
                  ? "Enter your credentials to access the stewardship dashboard."
                  : "Sign up to join the Biotik ecosystem."}
              </p>

              {/* Role Selector */}
              <div className="flex bg-muted rounded-lg p-1 mb-8">
                {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                      role === r
                        ? "bg-card shadow-sm text-primary border border-primary/20"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {roleLabels[r]}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Ebuka Okafor"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {mode === "signin" && (
                  <div className="flex items-center gap-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                      Keep me logged in for 30 days
                    </Label>
                  </div>
                )}

                <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isLoading}>
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {mode === "signin" ? "Sign In to Dashboard" : "Create Account"}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>

              <p className="text-center mt-6 text-muted-foreground text-sm">
                {mode === "signin" ? (
                  <>
                    Don't have an account?{" "}
                    <button 
                      type="button"
                      onClick={() => setMode("signup")} 
                      className="text-primary font-medium hover:underline"
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button 
                      type="button"
                      onClick={() => setMode("signin")} 
                      className="text-primary font-medium hover:underline"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </p>
            </motion.div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-8 border-t border-border mt-8">
            <div className="flex gap-4">
              <a href="#" className="hover:text-foreground">Privacy Policy</a>
              <a href="#" className="hover:text-foreground">Terms of Service</a>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              <span>256-bit SSL Secure Platform</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
