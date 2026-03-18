import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS = [
  "hsl(217, 91%, 60%)",
  "hsl(160, 84%, 39%)",
  "hsl(262, 83%, 58%)",
  "hsl(38, 92%, 50%)",
  "hsl(350, 89%, 60%)",
  "hsl(180, 70%, 45%)",
];

// Abbreviate model names nicely
function abbreviateModel(model: string): string {
  if (!model) return "Unknown";
  const map: Record<string, string> = {
    "claude-haiku-4-5": "Haiku 4.5",
    "claude-sonnet-4-6": "Sonnet 4.6",
    "claude-opus-4-6": "Opus 4.6",
    "claude-3-opus-20250219": "Opus 3",
    "claude-3-sonnet-20250229": "Sonnet 3",
    "claude-3-haiku-20250307": "Haiku 3",
    "gpt-4o": "GPT-4o",
    "gpt-4-turbo": "GPT-4T",
    "gpt-3.5-turbo": "GPT-3.5",
    "gemini-2.0-pro": "Gemini Pro",
    "gemini-1.5-pro": "Gemini 1.5P",
    "gemini-1.5-flash": "Gemini Flash",
  };
  if (map[model]) return map[model];
  // Generic abbreviation: take last 2 segments
  const parts = model.split("-");
  if (parts.length <= 2) return model;
  return parts.slice(-2).join("-");
}

interface SpendChartProps {
  breakdown?: any[];
  duration?: string;
}

export function SpendChart({ breakdown = [], duration = "30" }: SpendChartProps) {
  const chartData = breakdown.map((row: any, i: number) => ({
    model: abbreviateModel(row.model),
    fullModel: row.model,
    spend: parseFloat((parseFloat(row.totalcost || row.totalCost || 0))) || 0,
    color: COLORS[i % COLORS.length],
  }));

  const durationLabel = duration === "all" ? "All time"
    : duration === "mtd" ? "Month to date"
    : duration === "ytd" ? "Year to date"
    : duration === "1" ? "Today"
    : `Last ${duration} days`;

  return (
    <div className="bg-card rounded-lg border p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Spend by Model</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{durationLabel}</p>
        </div>
      </div>
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
          No data for this period
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" vertical={false} />
            <XAxis
              dataKey="model"
              tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }}
              axisLine={false}
              tickLine={false}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v.toFixed(2)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 47%, 11%)",
                border: "none",
                borderRadius: "6px",
                fontSize: "12px",
                color: "#fff",
              }}
              formatter={(value: number, _: string, entry: any) => [
                `$${value.toFixed(4)}`,
                entry.payload.fullModel,
              ]}
            />
            <Bar dataKey="spend" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
