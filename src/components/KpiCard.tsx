import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  mono?: boolean;
}

export function KpiCard({ title, value, change, trend, mono }: KpiCardProps) {
  const isPositive = trend === "down"; // down spend = good

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-lg border p-5 hover:shadow-md transition-shadow"
    >
      <p className="text-sm text-muted-foreground font-medium">{title}</p>
      <p className={`text-2xl font-semibold mt-1 tracking-tight ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
      <div className="flex items-center gap-1.5 mt-2">
        {isPositive ? (
          <TrendingDown className="h-3.5 w-3.5 text-success" />
        ) : (
          <TrendingUp className="h-3.5 w-3.5 text-warning" />
        )}
        <span className={`text-xs font-medium ${isPositive ? "text-success" : "text-warning"}`}>
          {change}
        </span>
        <span className="text-xs text-muted-foreground">vs last period</span>
      </div>
    </motion.div>
  );
}
