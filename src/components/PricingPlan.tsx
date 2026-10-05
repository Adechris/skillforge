import { motion } from "framer-motion";
import { Check, Star, Users, Clock, Zap, Shield, Headphones, Globe } from "lucide-react";

interface PricingPlanProps {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  actionLabel: string;
  onAction: () => void;
  icon: React.ReactNode;
}

const PricingPlan = ({
  title,
  price,
  period,
  description,
  features,
  highlighted = false,
  badge,
  actionLabel,
  onAction,
  icon,
}: PricingPlanProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className={`relative rounded-3xl p-8 border-2 transition-all ${highlighted
      ? "bg-card border-primary shadow-2xl shadow-primary/20 scale-[1.02]"
      : "bg-card border-border hover:border-primary/50 hover:shadow-card-hover"
      }`}
  >
    {badge && (
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full gradient-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">
        {badge}
      </span>
    )}
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${highlighted ? "gradient-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>
    <div className="mb-6">
      <span className="text-4xl font-extrabold text-foreground">{price}</span>
      {period && <span className="text-muted-foreground ml-1">{period}</span>}
    </div>
    <ul className="space-y-3 mb-8">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-3 text-sm">
          <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
          <span className="text-muted-foreground">{feature}</span>
        </li>
      ))}
    </ul>
    <button
      onClick={onAction}
      className={`w-full py-3.5 rounded-xl font-semibold transition-all ${highlighted
        ? "gradient-primary text-primary-foreground hover:opacity-90 shadow-md"
        : "bg-muted text-foreground hover:bg-muted/80"
        }`}
    >
      {actionLabel}
    </button>
  </motion.div>
);

export default PricingPlan;