import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { BookOpen, Eye, EyeOff, Loader2, CreditCard, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Checkout from "@/components/Checkout";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<"one_on_one" | "monthly" | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(name, email, password, role);
      toast.success("Account created successfully!");
      
      // For students, show payment options
      if (role === "student") {
        setShowPayment(true);
      } else {
        // Instructors go directly to dashboard
        navigate("/instructor");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    navigate("/student");
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
    // Still navigate to student dashboard even if payment is skipped
    navigate("/student");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">SkillForge</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Create your account</h1>
          <p className="text-muted-foreground">Start your learning journey today</p>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-8 border border-border">
          <AnimatePresence mode="wait">
            {!showPayment ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex gap-2 mb-6 bg-muted rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${role === "student" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("instructor")}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${role === "instructor" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    Instructor
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Account Created!</h3>
                  <p className="text-sm text-muted-foreground">Choose your learning path</p>
                </div>

                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => setSelectedPaymentType("one_on_one")}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedPaymentType === "one_on_one" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">One-on-One Training</p>
                        <p className="text-xs text-muted-foreground">Personalized coaching</p>
                      </div>
                      <span className="text-lg font-bold text-primary">₦100,000</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedPaymentType("monthly")}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedPaymentType === "monthly" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">Monthly LMS Access</p>
                        <p className="text-xs text-muted-foreground">All courses, every month</p>
                      </div>
                      <span className="text-lg font-bold text-primary">₦10,000<span className="text-xs">/mo</span></span>
                    </div>
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handlePaymentClose}
                    className="flex-1 py-3 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-all"
                  >
                    Skip for now
                  </button>
                  <button
                    onClick={() => {
                      if (selectedPaymentType) {
                        // The Checkout component will be shown as overlay
                      }
                    }}
                    disabled={!selectedPaymentType}
                    className="flex-1 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Pay Now
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Checkout Overlay */}
        <AnimatePresence>
          {showPayment && selectedPaymentType && (
            <Checkout
              paymentType={selectedPaymentType}
              onClose={() => setShowPayment(false)}
              onSuccess={handlePaymentSuccess}
            />
          )}
        </AnimatePresence>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

