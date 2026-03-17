import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { KpiCard } from "@/components/KpiCard";
import { SpendChart } from "@/components/SpendChart";
import { ModelMixChart } from "@/components/ModelMixChart";
import { Recommendations } from "@/components/Recommendations";
import { RecentLogs } from "@/components/RecentLogs";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
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
            <Button variant="outline" size="sm" className="text-xs gap-2">
              <CalendarDays className="h-3.5 w-3.5" />
              Last 14 days
            </Button>
          </header>

          <main className="flex-1 p-5 space-y-5 overflow-auto">
            {/* KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <KpiCard title="Total Spend" value="$1,629.80" change="12.3% ↓" trend="down" mono />
              <KpiCard title="Projected Monthly" value="$3,482.00" change="8.1% ↑" trend="up" mono />
              <KpiCard title="Savings Realized" value="$557.00" change="23.5% ↑" trend="down" mono />
            </div>

            {/* Spend Chart */}
            <SpendChart />

            {/* Two Column: Model Mix + Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ModelMixChart />
              <Recommendations />
            </div>

            {/* Recent Logs */}
            <RecentLogs />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
