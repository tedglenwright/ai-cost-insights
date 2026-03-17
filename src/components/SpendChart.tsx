import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { spendOverTime } from "@/data/mockData";

export function SpendChart() {
  return (
    <div className="bg-card rounded-lg border p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Spend Over Time</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Daily API costs · Last 14 days</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Actual
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
            Projected
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={spendOverTime} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(222, 47%, 11%)",
              border: "none",
              borderRadius: "6px",
              fontSize: "12px",
              color: "#fff",
            }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
          />
          <Area type="monotone" dataKey="projected" stroke="hsl(215, 16%, 77%)" strokeDasharray="4 4" strokeWidth={1.5} fill="none" />
          <Area type="monotone" dataKey="spend" stroke="hsl(217, 91%, 60%)" strokeWidth={2} fill="url(#spendGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
