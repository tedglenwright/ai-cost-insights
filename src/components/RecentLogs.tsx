import { Badge } from "@/components/ui/badge";

interface RecentLogsProps {
  breakdown?: any[];
}

export function RecentLogs({ breakdown = [] }: RecentLogsProps) {
  return (
    <div className="bg-card rounded-lg border p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Spending by Model</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Cost breakdown across all models</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b">
              <th className="text-left font-medium text-muted-foreground pb-2.5 pr-4">Provider</th>
              <th className="text-left font-medium text-muted-foreground pb-2.5 pr-4">Model</th>
              <th className="text-right font-medium text-muted-foreground pb-2.5 pr-4">Calls</th>
              <th className="text-right font-medium text-muted-foreground pb-2.5 pr-4">Total Cost</th>
              <th className="text-right font-medium text-muted-foreground pb-2.5 pr-4">Avg Cost</th>
              <th className="text-right font-medium text-muted-foreground pb-2.5">Avg Latency</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  No API calls logged yet
                </td>
              </tr>
            )}
            {breakdown.map((row, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                <td className="py-2.5 pr-4">
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 border-0">
                    {row.provider}
                  </Badge>
                </td>
                <td className="py-2.5 pr-4 font-mono font-medium text-foreground truncate max-w-[180px]">{row.model}</td>
                <td className="py-2.5 pr-4 text-right font-mono text-muted-foreground">{(parseInt((parseInt(row.callcount || row.callCount || 0)) || row.callcount || 0)).toLocaleString()}</td>
                <td className="py-2.5 pr-4 text-right font-mono text-foreground">${(parseFloat((parseFloat(row.totalcost || row.totalCost || 0))) || 0).toFixed(4)}</td>
                <td className="py-2.5 pr-4 text-right font-mono text-muted-foreground">
                  ${(parseInt(row.callcount || row.callCount || 0)) > 0 ? (parseFloat((parseFloat(row.totalcost || row.totalCost || 0))) / (parseInt(row.callcount || row.callCount || 0))).toFixed(6) : "0.00"}
                </td>
                <td className="py-2.5 text-right font-mono text-muted-foreground">
                  {(row.avglatency || row.avgLatency) ? `${parseInt((row.avglatency || row.avgLatency))}ms` : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
