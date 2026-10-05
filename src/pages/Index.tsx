import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Users, Award, Zap, Check, Star, Clock, Shield, Headphones, Globe, Rocket, Code, Palette, TrendingUp, MessageCircle, GraduationCap, DollarSign, Calendar, Users2 } from "lucide-react";
import { motion } from "framer-motion";
import PricingPlan from "@/components/PricingPlan";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">SkillForge</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
            Sign In
          </Link>
          <Link to="/register" className="px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 lg:px-12 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              🚀 Master Web Development in 2026
            </span>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
              Build Your Future in
              <span className="gradient-primary bg-clip-text text-white"> Web Development</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              SkillForge is a premier platform for web development training. Choose your path:
              personalized one-on-one coaching or unlimited access to all courses with our
              monthly subscription. Learn from expert instructors, join live cohorts, and
              launch your tech career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-3.5 rounded-xl gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-all shadow-md inline-flex items-center justify-center gap-2"
              >
                Start Learning <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-3.5 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-all inline-flex items-center justify-center"
              >
                I'm an Instructor
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 lg:px-12 py-20 lg:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              💰 Choose Your Plan
            </span>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-foreground mb-4">
              Invest in Your
              <span className="gradient-primary bg-clip-text text-white"> Tech Future</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Two flexible options to fit your learning style and budget.
              Whether you want personalized coaching or unlimited course access, we've got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingPlan
              title="One-on-One Training"
              price="₦100,000"
              description="Personalized web development coaching tailored to your goals"
              icon={<Users className="w-7 h-7" />}
              highlighted={false}
              actionLabel="Register for 1-on-1"
              onAction={() => window.location.href = "/register"}
              features={[
                "Personalized curriculum based on your goals",
                "Live 1-on-1 sessions with expert instructor",
                "Flexible scheduling that fits your availability",
                "Direct messaging and code review feedback",
                "Portfolio project guidance",
                "Job placement support",
              ]}
            />
            <PricingPlan
              title="LMS Monthly Subscription"
              price="₦10,000"
              period="/month"
              description="Unlimited access to all courses and learning materials"
              icon={<Rocket className="w-7 h-7" />}
              highlighted={true}
              badge="Most Popular"
              actionLabel="Start Monthly Access"
              onAction={() => window.location.href = "/register"}
              features={[
                "Access to ALL courses in the catalog",
                "Self-paced video lessons and quizzes",
                "Downloadable resources and code samples",
                "Community forum and peer support",
                "Monthly live Q&A sessions",
                "Certificate of completion",
              ]}
            />
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            All payments are secure and processed via Paystack. Cancel anytime.
            No hidden fees, no long-term contracts.
          </p>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="px-6 lg:px-12 py-20 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-4">
              Why Choose <span className="gradient-primary bg-clip-text text-white">SkillForge</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're building the best platform for aspiring web developers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Code className="w-6 h-6" />, title: "Expert Instructors", desc: "Learn from industry professionals with real-world experience" },
              { icon: <Users2 className="w-6 h-6" />, title: "Live Cohorts", desc: "Join scheduled training batches with peer collaboration" },
              { icon: <Headphones className="w-6 h-6" />, title: "Direct Support", desc: "Get help directly from instructors through built-in messaging" },
              { icon: <Globe className="w-6 h-6" />, title: "Job Ready", desc: "Build portfolio projects and get career placement support" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-card-hover transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 lg:px-12 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground text-center mb-12">
            Everything you need to teach and learn
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Zap className="w-6 h-6" />, title: "Easy Course Creation", desc: "Build engaging courses with video, text, and quizzes in minutes." },
              { icon: <Users className="w-6 h-6" />, title: "Student Management", desc: "Track enrollment, progress, and engagement from one dashboard." },
              { icon: <Award className="w-6 h-6" />, title: "Certificates & Progress", desc: "Motivate learners with completion tracking and certificates." },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 shadow-card hover:shadow-card-hover transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-8 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">© 2026 SkillForge. All rights reserved.</p>
      </footer>
    </div>
  );
}

