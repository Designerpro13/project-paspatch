"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Printer } from "lucide-react";
import { HighPriorityPatchesTable, VulnerabilityChart } from "../dashboard-components";

export default function ReportsPage() {

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between gap-4 print:hidden">
            <div>
                <h1 className="text-2xl font-bold">Security Posture Report</h1>
                <p className="text-muted-foreground">Generated on: {new Date().toLocaleDateString()}</p>
            </div>
          <Button onClick={handlePrint} variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>
        </div>

        <Card id="report-content">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Vulnerability & Patch Compliance Report</CardTitle>
            <CardDescription className="text-center">
              Period: {new Date(new Date().setDate(new Date().getDate() - 30)).toLocaleDateString()} - {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Summary Section */}
            <section>
              <h2 className="text-xl font-semibold mb-2">Executive Summary</h2>
              <p className="text-muted-foreground">
                This report provides a comprehensive overview of the organization's vulnerability landscape and patch management effectiveness over the last 30 days. Key findings indicate a 10% increase in total vulnerabilities, primarily driven by newly discovered exploits in web-facing applications. While patch deployment has been active, 89 critical issues remain outstanding, requiring immediate attention. The security team should prioritize patches for web servers and databases to mitigate the most significant risks.
              </p>
            </section>
            
            <Separator />

            {/* Metrics Section */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
                 <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle>Vulnerability Breakdown</CardTitle></CardHeader>
                        <CardContent>
                            <VulnerabilityChart />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle>Statistics</CardTitle></CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex justify-between"><span>Total Vulnerabilities:</span> <span className="font-semibold">1,234</span></div>
                            <div className="flex justify-between"><span>Critical Issues:</span> <span className="font-semibold text-destructive">89</span></div>
                            <div className="flex justify-between"><span>High-Severity Issues:</span> <span className="font-semibold">237</span></div>
                            <div className="flex justify-between"><span>Assets Scanned:</span> <span className="font-semibold">2,450</span></div>
                            <div className="flex justify-between"><span>Mean Time to Patch (Critical):</span> <span className="font-semibold">7.2 days</span></div>
                        </CardContent>
                    </Card>
                 </div>
            </section>

            <Separator />

            {/* Actionable Items Section */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Actionable Intelligence: High-Priority Patches</h2>
              <HighPriorityPatchesTable />
            </section>
            
            <Separator />

            {/* Recommendations Section */}
            <section>
              <h2 className="text-xl font-semibold mb-2">Recommendations</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><span className="font-semibold text-foreground">Immediate Action:</span> Address all 'Critical' patches within the next 48 hours, starting with CVE-2023-4567 and CVE-2023-5824.</li>
                <li><span className="font-semibold text-foreground">Review Asset Criticality:</span> Verify that the criticality of 'DB-Server-03' is correctly classified, as it is associated with a critical vulnerability.</li>
                <li><span className="font-semibold text-foreground">Improve Scan Frequency:</span> Increase the scanning frequency for public-facing assets to daily to ensure rapid detection of new threats.</li>
              </ul>
            </section>

          </CardContent>
        </Card>
      </div>
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .print\:hidden {
            display: none;
          }
          #report-content {
            box-shadow: none;
            border: none;
          }
        }
      `}</style>
    </div>
  );
}
