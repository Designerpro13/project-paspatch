// src/app/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  Siren,
} from "lucide-react";
import {
  HighPriorityPatchesTable,
  VulnerabilityChart,
} from "./dashboard-components";
import { useApp } from "@/context/app-context";
import { Skeleton } from "@/components/ui/skeleton";

function StatCard({ title, value, icon: Icon, description, colorClass = "" }: {
  title: string,
  value: number,
  icon: React.ElementType,
  description: string,
  colorClass?: string,
}) {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${colorClass || "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${colorClass}`}>
          {value.toLocaleString()}
        </div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}


export default function DashboardPage() {
  const { dashboardData, isDemoMode, isLoading } = useApp();

  if (isLoading) {
    return (
       <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="lg:col-span-4 h-80" />
          <Skeleton className="lg:col-span-3 h-80" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Vulnerabilities" 
          value={dashboardData.totalVulnerabilities}
          icon={Siren}
          description={isDemoMode ? "+10.1% from last month" : "Real-time count"}
        />
        <StatCard 
          title="Critical Issues" 
          value={dashboardData.criticalIssues}
          icon={AlertTriangle}
          description={isDemoMode ? "+5 since yesterday" : "Requires immediate action"}
          colorClass="text-destructive"
        />
        <StatCard 
          title="Patches Applied" 
          value={dashboardData.patchesApplied}
          icon={ShieldCheck}
          description={isDemoMode ? "+201 since last week" : "Across all assets"}
          colorClass="text-primary"
        />
        <StatCard 
          title="Assets Monitored" 
          value={dashboardData.assetsMonitored}
          icon={Activity}
          description="Real-time asset tracking"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader>
            <CardTitle>Vulnerability Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <VulnerabilityChart data={dashboardData.vulnerabilityChartData} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader>
            <CardTitle>High-Priority Patches</CardTitle>
          </CardHeader>
          <CardContent>
            <HighPriorityPatchesTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
