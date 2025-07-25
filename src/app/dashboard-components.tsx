"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { severity: "Low", count: 186 },
  { severity: "Medium", count: 305 },
  { severity: "High", count: 237 },
  { severity: "Critical", count: 89 },
];

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--primary))",
  },
};

export function VulnerabilityChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <ResponsiveContainer>
        <BarChart data={chartData} accessibilityLayer>
          <XAxis
            dataKey="severity"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar dataKey="count" fill="var(--color-count)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

const patches = [
  {
    cve: "CVE-2023-4567",
    asset: "WebServer-01",
    severity: "Critical",
    service: "Apache/2.4.57",
  },
  {
    cve: "CVE-2023-5824",
    asset: "DB-Server-03",
    severity: "Critical",
    service: "MySQL 8.0.31",
  },
  {
    cve: "CVE-2023-3390",
    asset: "Kernel-All",
    severity: "High",
    service: "Linux Kernel 5.10",
  },
  {
    cve: "CVE-2023-2949",
    asset: "Win-Client-42",
    severity: "High",
    service: "OpenSSH 8.9p1",
  },
    {
    cve: "CVE-2023-50164",
    asset: "AppServer-02",
    severity: "High",
    service: "Struts 2.5.32",
  },
];

export function HighPriorityPatchesTable() {
  const getBadgeVariant = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "destructive";
      case "High":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>CVE</TableHead>
          <TableHead>Asset</TableHead>
          <TableHead>Service</TableHead>
          <TableHead className="text-right">Severity</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patches.map((patch) => (
          <TableRow key={patch.cve}>
            <TableCell className="font-medium">{patch.cve}</TableCell>
            <TableCell>{patch.asset}</TableCell>
            <TableCell>{patch.service}</TableCell>
            <TableCell className="text-right">
              <Badge variant={getBadgeVariant(patch.severity)}>
                {patch.severity}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
