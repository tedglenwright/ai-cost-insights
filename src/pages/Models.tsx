import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { getDashboard, getToken, login, setToken } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays } from "lucide-react";

const Index = () => {
  const [breakdown, setBreakdown] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState("30");

  useEffect(() => {
    const init = async () => {
      try { const data = await login("ted@glenwright.com", "Demo1234!"); setToken(data.token); } catch(e) { console.error(e); }
      const dash = await getDashboard(duration);
      setBreakdown(dash.breakdown || []);
      setLoading(false);
    };
    init().catch(console.error);
  }, [duration]);

  const totalCost = breakdown.reduce((sum, r) => sum + (parseFloat(r.totalCost) || 0), 0);
  const totalCalls = breakdown.reduce((sum, r) => sum + (parseInt(r.callCount) || 0), 0);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-card px-4 gap-3">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="text-sm font-semibold">Models</h1>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="w-36 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Today</SelectItem>
                  <SelectItem value="7">Past 7 days</SelectItem>
                  <SelectItem value="30">Past 30 days</SelectItem>
                  <SelectItem value="mtd">Month to date</SelectItem>
                  <SelectItem value="ytd">Year to date</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </header>
          <main className="flex-1 p-5">
            {loading ? (
              <p className="text-muted-foreground text-sm">Loading...</p>
            ) : (
              <div className="bg-card rounded-lg border p-5">
                <h2 className="text-sm font-semibold mb-1">All Models (Inception to Date)</h2>
                <p className="text-xs text-muted-foreground mb-4">Complete usage across all models</p>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium text-muted-foreground pb-2.5 pr-4">Provider</th>
                      <th className="text-left font-medium text-muted-foreground pb-2.5 pr-4">Model</th>
                      <th className="text-right font-medium text-muted-foreground pb-2.5 pr-4">Calls</th>
                      <th className="text-right font-medium text-muted-foreground pb-2.5 pr-4">% of Calls</th>
                      <th className="text-right font-medium text-muted-foreground pb-2.5 pr-4">Total Cost</th>
                      <th className="text-right font-medium text-muted-foreground pb-2.5 pr-4">% of Spend</th>
                      <th className="text-right font-medium text-muted-foreground pb-2.5">Avg Latency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdown.map((row, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="py-2.5 pr-4">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 border-0">{row.provider}</Badge>
                        </td>
                        <td className="py-2.5 pr-4 font-mono font-medium">{row.model}</td>
                        <td className="py-2.5 pr-4 text-right font-mono text-muted-foreground">{(row.callCount || 0).toLocaleString()}</td>
                        <td className="py-2.5 pr-4 text-right text-muted-foreground">
                          {totalCalls > 0 ? ((row.callCount / totalCalls) * 100).toFixed(1) : 0}%
                        </td>
                        <td className="py-2.5 pr-4 text-right font-mono">${(parseFloat(row.totalCost) || 0).toFixed(4)}</td>
                        <td className="py-2.5 pr-4 text-right text-muted-foreground">
                          {totalCost > 0 ? ((parseFloat(row.totalCost) / totalCost) * 100).toFixed(1) : 0}%
                        </td>
                        <td className="py-2.5 text-right font-mono text-muted-foreground">
                          {row.avgLatency ? `${parseInt(row.avgLatency)}ms` : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
