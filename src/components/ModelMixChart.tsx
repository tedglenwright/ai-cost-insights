import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "hsl(217, 91%, 60%)",
  "hsl(160, 84%, 39%)",
  "hsl(262, 83%, 58%)",
  "hsl(38, 92%, 50%)",
  "hsl(350, 89%, 60%)",
  "hsl(180, 70%, 45%)",
];

interface ModelMixChartProps {
  breakdown?: any[];
}

export function ModelMixChart({ breakdown = [] }: ModelMixChartProps) {
  const totalCost = breakdown.reduce((sum, r) => sum + (parseFloat(r.totalCost) || 0), 0);

  const modelMix = breakdown.map((row, i) => ({
    name: row.model,
    value: totalCost > 0 ? Math.round((parseFloat(row.totalCost) / totalCost) * 100) : 0,
    cost: parseFloat(row.totalCost) || 0,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="bg-card rounded-lg border p-5">
      <h2 className="text-sm font-semibold text-foreground">Model Mix</h2>
      <p className="text-xs text-muted-foreground mt-0.5 mb-4">Cost distribution by model</p>

      <div className="flex items-center gap-4">
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie data={modelMix} dataKey="value" innerRadius={45} outerRadius={72} paddingAngle={2} strokeWidth={0}>
              {modelMix.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 47%, 11%)",
                border: "none",
                borderRadius: "6px",
                fontSize: "12px",
                color: "#fff",
              }}
              formatter={(value: number, _: string, entry: any) => [
                `${value}% · $${entry.payload.cost.toFixed(2)}`,
                entry.payload.name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex-1 space-y-2.5">
          {modelMix.map((model) => (
            <div key={model.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ backgroundColor: model.color }} />
                <span className="text-xs font-mono text-foreground truncate max-w-[120px]">{model.name}</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">${model.cost.toFixed(2)}</span>
            </div>
          ))}
          {modelMix.length === 0 && (
            <p className="text-xs text-muted-foreground">No data for this period</p>
          )}
        </div>
      </div>
    </div>
  );
}
