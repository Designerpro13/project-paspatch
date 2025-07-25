"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { parseNmapServiceScan, ParseNmapServiceScanOutput } from "@/ai/flows/parse-nmap-service-scan";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ScanParserPage() {
  const [xmlData, setXmlData] = useState("");
  const [result, setResult] = useState<ParseNmapServiceScanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!xmlData) {
      toast({
        variant: "destructive",
        title: "Input Required",
        description: "Please provide Nmap XML data to parse.",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await parseNmapServiceScan({ xmlData });
      setResult(response);
      toast({
        title: "Success",
        description: "Nmap scan parsed successfully.",
      });
    } catch (error: any) {
      console.error("Parsing error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to parse Nmap scan.",
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
              <CardTitle>Nmap Service Scan Parser</CardTitle>
              <CardDescription>
                Paste the XML output from an Nmap scan to have the AI extract and summarize the discovered services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="xmlData">Nmap XML Output</Label>
                <Textarea
                  id="xmlData"
                  value={xmlData}
                  onChange={(e) => setXmlData(e.target.value)}
                  placeholder="<nmaprun>...</nmaprun>"
                  className="min-h-[250px] font-mono"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Parse Scan Data
              </Button>
            </CardFooter>
          </Card>
        </form>

        {isLoading && (
          <Card>
            <CardHeader>
              <CardTitle>Parsed Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Parsed Results</CardTitle>
              <CardDescription>{result.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Port</TableHead>
                    <TableHead>Protocol</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Version</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.services.map((service, index) => (
                    <TableRow key={index}>
                      <TableCell>{service.port}</TableCell>
                      <TableCell>{service.protocol}</TableCell>
                      <TableCell>
                        <Badge variant={service.state === 'open' ? 'destructive' : 'secondary'}>{service.state}</Badge>
                      </TableCell>
                      <TableCell>{service.serviceName}</TableCell>
                      <TableCell>{service.serviceVersion}</TableCell>
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
