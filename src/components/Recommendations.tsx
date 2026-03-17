import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Recommendation {
  currentModel: string;
  suggestedModel: string;
  monthlySavings: string;
  savingsPercent: string;
  calls: number;
  reasoning: string;
  confidence: string;
}

interface RecommendationsProps {
  recommendations?: Recommendation[];
}

export function Recommendations({ recommendations = [] }: RecommendationsProps) {
  return (
    <div className="bg-card rounded-lg border p-5">
      <h2 className="text-sm font-semibold text-foreground">Recommendations</h2>
      <p className="text-xs text-muted-foreground mt-0.5 mb-4">AI-powered cost optimizations</p>

      <div className="space-y-3">
        {recommendations.length === 0 && (
          <p className="text-xs text-muted-foreground">Log more API calls to get optimization suggestions.</p>
        )}
        {recommendations.map((rec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: i * 0.08 }}
            className="group border rounded-md p-3.5 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-success shrink-0" />
                <Badge variant="secondary" className="text-[10px] font-medium bg-success/10 text-success border-0 px-1.5 py-0">
                  {rec.confidence === "high" ? "Recommended" : "Consider"}
                </Badge>
              </div>
              <span className="text-sm font-mono font-semibold text-success whitespace-nowrap">
                ${parseFloat(rec.monthlySavings).toFixed(2)}/mo
              </span>
            </div>
            <h3 className="text-sm font-medium text-foreground leading-snug">
              {rec.currentModel} → {rec.suggestedModel}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{rec.reasoning}</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              View details <ArrowRight className="h-3 w-3" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
