import { recentLogs } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

export function RecentLogs() {
  return (
    <div className="bg-card rounded-lg border p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Recent API Calls</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Latest requests across all models</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b">
              <th className="text-left font-medium text-muted-foreground pb-2.5 pr-4">Model</th>
              <th className="text-right font-medium text-muted-foreground pb-2.5 pr-4">Tokens</th>
              <th className="text-right font-medium text-muted-foreground pb-2.5 pr-4">Cost</th>
              <th className="text-right font-medium text-muted-foreground pb-2.5 pr-4">Latency</th>
              <th className="text-center font-medium text-muted-foreground pb-2.5 pr-4">Status</th>
              <th className="text-right font-medium text-muted-foreground pb-2.5">Time</th>
            </tr>
          </thead>
          <tbody>
            {recentLogs.map((log) => (
              <tr key={log.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                <td className="py-2.5 pr-4 font-mono font-medium text-foreground">{log.model}</td>
                <td className="py-2.5 pr-4 text-right font-mono text-muted-foreground">{log.tokens.toLocaleString()}</td>
                <td className="py-2.5 pr-4 text-right font-mono text-foreground">${log.cost.toFixed(4)}</td>
                <td className="py-2.5 pr-4 text-right font-mono text-muted-foreground">{log.latency}</td>
                <td className="py-2.5 pr-4 text-center">
                  <Badge
                    variant="secondary"
                    className={`text-[10px] px-1.5 py-0 border-0 ${
                      log.status === "success"
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {log.status}
                  </Badge>
                </td>
                <td className="py-2.5 text-right text-muted-foreground">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
