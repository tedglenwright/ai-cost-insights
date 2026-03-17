import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { modelMix } from "@/data/mockData";

export function ModelMixChart() {
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
              formatter={(value: number, _: string, entry: { payload: { name: string; cost: number } }) => [
                `${value}% · $${entry.payload.cost.toFixed(0)}`,
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
                <span className="text-xs font-mono text-foreground">{model.name}</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">${model.cost.toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
