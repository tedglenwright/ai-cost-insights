import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { KpiCard } from "@/components/KpiCard";
import { SpendChart } from "@/components/SpendChart";
import { ModelMixChart } from "@/components/ModelMixChart";
import { Recommendations } from "@/components/Recommendations";
import { RecentLogs } from "@/components/RecentLogs";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getDashboard, login, setToken, getToken } from "@/lib/api";

const DURATION_LABELS: Record<string, string> = {
  "1": "Today",
  "7": "Past 7 days",
  "30": "Past 30 days",
  "mtd": "Month to date",
  "ytd": "Year to date",
  "all": "All time",
};

const Index = () => {
  const [duration, setDuration] = useState("30");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(!!getToken());

  // Auto-login with demo account
  useEffect(() => {
    if (!getToken()) {
      login("ted@aioptimizer.demo", "Demo1234!")
        .then((data) => {
          setToken(data.token);
          setAuthed(true);
        })
        .catch(console.error);
    }
  }, []);

  // Load dashboard data
  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    getDashboard(duration)
      .then((data) => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [duration, authed]);

  const totalSpend = parseFloat(dashboardData?.totalSpend) || 0;
  const breakdown = dashboardData?.breakdown || [];
  const recommendations = dashboardData?.recommendations || [];
  const callCount = breakdown.reduce((sum: number, r: any) => sum + (r.callCount || 0), 0);
  const potentialSavings = parseFloat(dashboardData?.totalSavingsPotential) || 0;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-card px-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div>
                <h1 className="text-sm font-semibold text-foreground">Overview</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="w-36 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DURATION_LABELS).map(([val, label]) => (
                    <SelectItem key={val} value={val} className="text-xs">{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </header>

          <main className="flex-1 p-5 space-y-5 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Loading...
              </div>
            ) : (
              <>
                {/* KPI Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <KpiCard
                    title={`Total Spend (${DURATION_LABELS[duration]})`}
                    value={`$${totalSpend.toFixed(2)}`}
                    change={`${callCount.toLocaleString()} calls`}
                    trend="down"
                    mono
                  />
                  <KpiCard
                    title="Avg Cost per Call"
                    value={`$${callCount > 0 ? (totalSpend / callCount).toFixed(4) : "0.00"}`}
                    change="Lower is better"
                    trend="down"
                    mono
                  />
                  <KpiCard
                    title="Potential Savings"
                    value={`$${potentialSavings.toFixed(2)}`}
                    change="See recommendations"
                    trend="down"
                    mono
                  />
                </div>

                {/* Spend Chart - pass real data */}
                <SpendChart breakdown={breakdown} duration={duration} />

                {/* Two Column: Model Mix + Recommendations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <ModelMixChart breakdown={breakdown} />
                  <Recommendations recommendations={recommendations} />
                </div>

                {/* Recent Logs */}
                <RecentLogs breakdown={breakdown} />
              </>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
