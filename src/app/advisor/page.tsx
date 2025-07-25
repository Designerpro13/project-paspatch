"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { providePatchRecommendations, ProvidePatchRecommendationsOutput } from "@/ai/flows/provide-patch-recommendations";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdvisorPage() {
  const [vulnerabilityAnalysis, setVulnerabilityAnalysis] = useState("");
  const [assetCriticality, setAssetCriticality] = useState("");
  const [vendorAdvisories, setVendorAdvisories] = useState("");
  const [result, setResult] = useState<ProvidePatchRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vulnerabilityAnalysis || !assetCriticality) {
      toast({
        variant: "destructive",
        title: "Input Required",
        description: "Please provide vulnerability analysis and asset criticality data.",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await providePatchRecommendations({
        vulnerabilityAnalysis,
        assetCriticality,
        vendorAdvisories: vendorAdvisories || undefined,
      });
      setResult(response);
      toast({
        title: "Success",
        description: "Patch recommendations generated successfully.",
      });
    } catch (error: any) {
      console.error("Advisor error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate recommendations.",
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
              <CardTitle>AI-Driven Patch Advisor</CardTitle>
              <CardDescription>
                Get intelligent patch recommendations based on vulnerability severity, asset importance, and vendor advice.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vulnerabilityAnalysis">Vulnerability Analysis</Label>
                <Textarea
                  id="vulnerabilityAnalysis"
                  value={vulnerabilityAnalysis}
                  onChange={(e) => setVulnerabilityAnalysis(e.target.value)}
                  placeholder="Paste vulnerability reports or summaries here..."
                  className="min-h-[120px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assetCriticality">Asset Criticality</Label>
                <Textarea
                  id="assetCriticality"
                  value={assetCriticality}
                  onChange={(e) => setAssetCriticality(e.target.value)}
                  placeholder="Describe your critical assets, e.g., 'WebServer-01: Public-facing, high traffic.'"
                  className="min-h-[120px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendorAdvisories">Vendor Advisories (Optional)</Label>
                <Textarea
                  id="vendorAdvisories"
                  value={vendorAdvisories}
                  onChange={(e) => setVendorAdvisories(e.target.value)}
                  placeholder="Paste any relevant vendor security advisories here..."
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get Recommendations
              </Button>
            </CardFooter>
          </Card>
        </form>

        {isLoading && (
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Patch Recommendations</h3>
                <pre className="mt-2 w-full whitespace-pre-wrap rounded-md bg-muted p-4">
                  <code className="text-muted-foreground">{result.patchRecommendations}</code>
                </pre>
              </div>
              <div>
                <h3 className="font-semibold">Justification</h3>
                 <pre className="mt-2 w-full whitespace-pre-wrap rounded-md bg-muted p-4">
                  <code className="text-muted-foreground">{result.justification}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
