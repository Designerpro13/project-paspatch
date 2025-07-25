

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { prioritizePatches, PrioritizePatchesOutput } from "@/ai/flows/prioritize-patches";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useApp } from "@/context/app-context";

export default function PrioritizePage() {
  const [nmapScanResult, setNmapScanResult] = useState("");
  const [result, setResult] = useState<PrioritizePatchesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { assets, addPatches } = useApp();
  
  useEffect(() => {
    if (assets.length > 0) {
      const xml = `<nmaprun>
        <host>
          <ports>
            ${assets.map(asset => `<port protocol="${asset.protocol}" portid="${asset.port}">
              <state state="open"/>
              <service name="${asset.serviceName}" version="${asset.serviceVersion}"/>
            </port>`).join('\n')}
          </ports>
        </host>
      </nmaprun>`;
      setNmapScanResult(xml);
    }
  }, [assets]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nmapScanResult) {
      toast({
        variant: "destructive",
        title: "Input Required",
        description: "Please provide Nmap scan results to prioritize patches.",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await prioritizePatches({ nmapScanResult });
      setResult(response);
      addPatches(response);
      toast({
        title: "Success",
        description: "Patch prioritization complete. Dashboard and Patch Management page updated.",
      });
    } catch (error: any) {
      console.error("Prioritization error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to prioritize patches.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getBadgeVariant = (priority: string) => {
    switch (priority) {
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

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="mx-auto grid max-w-6xl gap-8">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Intelligent Patch Prioritization</CardTitle>
              <CardDescription>
                Use Nmap scan data from the Scan Parser to generate a prioritized list of patch recommendations. The dashboard will update with the results.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nmapScanResult">Nmap Scan Result (XML from parsed assets)</Label>
                <Textarea
                  id="nmapScanResult"
                  value={nmapScanResult}
                  onChange={(e) => setNmapScanResult(e.target.value)}
                  placeholder="<nmaprun>...</nmaprun>"
                  className="min-h-[250px] font-mono"
                  readOnly={assets.length > 0}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Prioritize Patches
              </Button>
            </CardFooter>
          </Card>
        </form>

        {isLoading && (
          <Card>
            <CardHeader>
              <CardTitle>Prioritized Patch Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Prioritized Patch Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Priority</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Current Version</TableHead>
                    <TableHead>Recommendation</TableHead>
                    <TableHead>Rationale</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.map((rec, index) => (
                    <TableRow key={index}>
                      <TableCell><Badge variant={getBadgeVariant(rec.priority)}>{rec.priority}</Badge></TableCell>
                      <TableCell>{rec.service}</TableCell>
                      <TableCell>{rec.currentVersion}</TableCell>
                      <TableCell>{rec.recommendedPatch}</TableCell>
                      <TableCell>{rec.rationale}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
