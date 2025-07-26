
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ingestVulnerabilityData } from "@/ai/flows/ingest-vulnerability-data";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useApp } from "@/context/app-context";

export default function IngestPage() {
  const [source, setSource] = useState("NVD");
  const [data, setData] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addVulnerabilities } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) {
      toast({
        variant: "destructive",
        title: "Input Required",
        description: "Please provide vulnerability data to ingest.",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await ingestVulnerabilityData({ source, data });
      if (response.success) {
        setResult(response);
        const parsedData = JSON.parse(response.normalizedData);

        // Assuming parsedData is an array of vulnerabilities, or an object with a vulnerabilities key
        const vulnerabilities = parsedData.vulnerabilities || (Array.isArray(parsedData) ? parsedData : [parsedData]);
        addVulnerabilities(vulnerabilities);

        toast({
          title: "Success",
          description: "Vulnerability data ingested and normalized successfully.",
        });
        setData("");
      } else {
        throw new Error(response.message || "Ingestion failed.");
      }
    } catch (error: any) {
      console.error("Ingestion error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to ingest vulnerability data.",
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
              <CardTitle>Vulnerability Data Ingestion</CardTitle>
              <CardDescription>
                Input vulnerability data from sources like NVD or vendor advisories. The AI will normalize it into a standard format.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="source">Data Source</Label>
                <Input
                  id="source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g., NVD, Vendor Advisory"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data">Vulnerability Data (JSON)</Label>
                <Textarea
                  id="data"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  placeholder='{ "vulnerabilities": [{ "id": "CVE-2023-1234", ... }] }'
                  className="min-h-[200px] font-mono"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Ingest and Normalize Data
              </Button>
            </CardFooter>
          </Card>
        </form>

        {isLoading && (
          <Card>
            <CardHeader>
              <CardTitle>Normalized Output</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
        )}

        {result && result.success && (
          <Card>
            <CardHeader>
              <CardTitle>Normalized Output</CardTitle>
              <CardDescription>{result.message}</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="mt-2 w-full rounded-md bg-muted p-4">
                <code className="text-muted-foreground">
                  {JSON.stringify(JSON.parse(result.normalizedData), null, 2)}
                </code>
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
