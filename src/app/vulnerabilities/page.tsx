
"use client";

import { useApp, Vulnerability, VulnerabilityStatus } from "@/context/app-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VulnerabilitiesPage() {
  const { vulnerabilities, updateVulnerabilityStatus } = useApp();

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "destructive";
      case "High":
        return "secondary";
      case "Medium":
        return "outline";
      default:
        return "default";
    }
  };

    const getStatusBadgeVariant = (status: VulnerabilityStatus) => {
        switch (status) {
            case "New":
                return "secondary";
            case "Investigating":
                return "default";
            case "Patched":
                return "default";
            case "False Positive":
                return "outline";
            default:
                return "default";
        }
    }


  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8">
      <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Vulnerability Management</CardTitle>
                    <CardDescription>
                        View and manage the status of all ingested vulnerabilities.
                    </CardDescription>
                </div>
                 <Bug className="size-6 text-muted-foreground" />
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vulnerability ID</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vulnerabilities.map((vuln) => (
                <TableRow key={vuln.id}>
                  <TableCell className="font-medium">{vuln.id}</TableCell>
                  <TableCell>
                    <Badge variant={getSeverityBadgeVariant(vuln.severity)}>
                      {vuln.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                     <Badge variant={getStatusBadgeVariant(vuln.status)} className={vuln.status === 'Patched' ? 'bg-green-600 text-white' : ''}>
                        {vuln.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {(["New", "Investigating", "Patched", "False Positive"] as VulnerabilityStatus[]).map(status => (
                            <DropdownMenuItem key={status} onClick={() => updateVulnerabilityStatus(vuln.id, status)}>
                                Set to {status}
                            </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
