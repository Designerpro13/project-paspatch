"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mapVulnerabilitiesToAssets } from "@/ai/flows/map-vulnerabilities-to-assets";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MappingPage() {
  const [vulnerabilityData, setVulnerabilityData] = useState("");
  const [assetInventoryData, setAssetInventoryData] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vulnerabilityData || !assetInventoryData) {
      toast({
        variant: "destructive",
        title: "Input Required",
        description:
          "Please provide both vulnerability data and asset inventory data.",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await mapVulnerabilitiesToAssets({
        vulnerabilityData,
        assetInventoryData,
      });
      setResult(response.mappedVulnerabilities);
      toast({
        title: "Success",
        description: "Vulnerabilities mapped to assets successfully.",
      });
    } catch (error: any) {
      console.error("Mapping error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to map vulnerabilities to assets.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="mx-auto grid max-w-4xl gap-8">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Vulnerability Asset Mapping</CardTitle>
              <CardDescription>
                Correlate vulnerabilities with your hardware and software
                inventory using AI-powered fuzzy matching.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vulnerabilityData">
                  Vulnerability Data (JSON)
                </Label>
                <Textarea
                  id="vulnerabilityData"
                  value={vulnerabilityData}
                  onChange={(e) => setVulnerabilityData(e.target.value)}
                  placeholder='Paste normalized vulnerability data here...'
                  className="min-h-[150px] font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assetInventoryData">
                  Asset Inventory Data (JSON/CSV)
                </Label>
                <Textarea
                  id="assetInventoryData"
                  value={assetInventoryData}
                  onChange={(e) => setAssetInventoryData(e.target.value)}
                  placeholder='Paste your software/hardware inventory here...'
                  className="min-h-[150px] font-mono"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Map Vulnerabilities
              </Button>
            </CardFooter>
          </Card>
        </form>

        {isLoading && (
          <Card>
            <CardHeader>
              <CardTitle>Mapping Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Mapping Report</CardTitle>
              <CardDescription>
                The following report details which assets are affected by the
                provided vulnerabilities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="mt-2 w-full whitespace-pre-wrap rounded-md bg-muted p-4">
                <code className="text-muted-foreground">{result}</code>
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
