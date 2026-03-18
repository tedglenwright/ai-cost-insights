import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { getDrilldown, getToken, login, setToken } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";

const API_BASE = 'http://localhost:5001/api';

async function getDayBreakdown(date: string) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/drilldown?type=model&duration=custom&date=${date}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export default function Logs() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState("30");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [dayDetails, setDayDetails] = useState<Record<string, any[]>>({});
  const [loadingDay, setLoadingDay] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      if (!getToken()) {
        const data = await login("ted@glenwright.com", "Demo1234!");
        setToken(data.token);
      }
      const data = await getDrilldown("day", duration);
      setRows(data.rows || []);
      setLoading(false);
      setExpanded(null);
      setDayDetails({});
    };
    init().catch(console.error);
  }, [duration]);

  const toggleDay = async (date: string) => {
    if (expanded === date) {
      setExpanded(null);
      return;
    }
    setExpanded(date);
    if (dayDetails[date]) return;

    setLoadingDay(date);
    try {
      // Get model breakdown for this specific day
      const token = getToken();
      const res = await fetch(
        `${API_BASE}/drilldown?type=model&duration=custom&date=${date}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setDayDetails(prev => ({ ...prev, [date]: data.rows || [] }));
    } catch (err) {
      console.error(err);
    }
    setLoadingDay(null);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-card px-4 gap-3">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="text-sm font-semibold">Logs</h1>
            </div>
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
          </header>

          <main className="flex-1 p-5">
            {loading ? (
              <p className="text-muted-foreground text-sm">Loading...</p>
            ) : (
              <div className="bg-card rounded-lg border p-5">
                <h2 className="text-sm font-semibold mb-1">Daily Spend Log</h2>
                <p className="text-xs text-muted-foreground mb-4">Click a row to see model breakdown · {rows.length} days</p>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium text-muted-foreground pb-2.5 pr-4 w-8"></th>
                      <th className="text-left font-medium text-muted-foreground pb-2.5 pr-4">Date</th>
                      <th className="text-right font-medium text-muted-foreground pb-2.5 pr-4">Calls</th>
                      <th className="text-right font-medium text-muted-foreground pb-2.5 pr-4">Cost</th>
                      <th className="text-right font-medium text-muted-foreground pb-2.5">Tokens</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 && (
                      <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No data for this period</td></tr>
                    )}
                    {rows.map((row, i) => (
                      <>
                        <tr
                          key={row.label}
                          className="border-b hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => toggleDay(row.label)}
                        >
                          <td className="py-2.5 pr-2 text-muted-foreground">
                            {expanded === row.label
                              ? <ChevronDown className="h-3.5 w-3.5" />
                              : <ChevronRight className="h-3.5 w-3.5" />}
                          </td>
                          <td className="py-2.5 pr-4 font-mono font-medium">{new Date(row.label).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</td>
                          <td className="py-2.5 pr-4 text-right font-mono text-muted-foreground">{(row.calls || 0).toLocaleString()}</td>
                          <td className="py-2.5 pr-4 text-right font-mono">${(row.cost || 0).toFixed(4)}</td>
                          <td className="py-2.5 text-right font-mono text-muted-foreground">{((row.tokens || 0) / 1000).toFixed(1)}K</td>
                        </tr>

                        {expanded === row.label && (
                          <tr key={`${row.label}-detail`} className="border-b bg-muted/30">
                            <td colSpan={5} className="py-3 px-4">
                              {loadingDay === row.label ? (
                                <p className="text-xs text-muted-foreground py-2">Loading...</p>
                              ) : dayDetails[row.label]?.length > 0 ? (
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="border-b border-muted">
                                      <th className="text-left font-medium text-muted-foreground pb-1.5 pr-4">Model</th>
                                      <th className="text-right font-medium text-muted-foreground pb-1.5 pr-4">Calls</th>
                                      <th className="text-right font-medium text-muted-foreground pb-1.5 pr-4">Cost</th>
                                      <th className="text-right font-medium text-muted-foreground pb-1.5">Tokens</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {dayDetails[row.label].map((m, j) => (
                                      <tr key={j} className="border-b border-muted/50 last:border-0">
                                        <td className="py-1.5 pr-4 font-mono">
                                          <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 border-0">{m.provider}</Badge>
                                            {m.label}
                                          </div>
                                        </td>
                                        <td className="py-1.5 pr-4 text-right font-mono text-muted-foreground">{(m.calls || 0).toLocaleString()}</td>
                                        <td className="py-1.5 pr-4 text-right font-mono">${(m.cost || 0).toFixed(4)}</td>
                                        <td className="py-1.5 text-right font-mono text-muted-foreground">{((m.tokens || 0) / 1000).toFixed(1)}K</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <p className="text-xs text-muted-foreground py-2">No model breakdown available</p>
                              )}
                            </td>
                          </tr>
                        )}
                      </>
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
}
