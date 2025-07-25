
// src/app/dashboard-components.tsx
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
import { useApp } from "@/context/app-context";
import { AlertCircle } from "lucide-react";

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--primary))",
  },
};

export function VulnerabilityChart({ data }: { data: any[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <ResponsiveContainer>
        <BarChart data={data} accessibilityLayer>
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
            allowDecimals={false}
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

export function HighPriorityPatchesTable() {
  const { patches } = useApp();

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

  if (patches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
        <AlertCircle className="size-10 mb-4" />
        <h3 className="font-semibold">No Patches Prioritized</h3>
        <p className="text-sm">Run the patch prioritizer to see recommended patches here.</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Priority</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Recommendation</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patches.filter(p => p.priority === "Critical" || p.priority === "High").map((patch, index) => (
          <TableRow key={index}>
            <TableCell>
              <Badge variant={getBadgeVariant(patch.priority)}>
                {patch.priority}
              </Badge>
            </TableCell>
            <TableCell>{patch.service}</TableCell>
            <TableCell>{patch.recommendedPatch}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
