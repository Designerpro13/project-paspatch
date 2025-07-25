// The AI flow that parses Nmap Service Scan XML output using LLM, enabling the system to understand network services.
'use server';

/**
 * @fileOverview Parses Nmap Service Scan XML output using LLM.
 *
 * - parseNmapServiceScan - A function that handles the parsing of Nmap service scan XML output.
 * - ParseNmapServiceScanInput - The input type for the parseNmapServiceScan function.
 * - ParseNmapServiceScanOutput - The return type for the parseNmapServiceScan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseNmapServiceScanInputSchema = z.object({
  xmlData: z.string().describe('The XML output from an Nmap service scan.'),
});
export type ParseNmapServiceScanInput = z.infer<typeof ParseNmapServiceScanInputSchema>;

const ParseNmapServiceScanOutputSchema = z.object({
  services: z
    .array(z.object({
      port: z.number().describe('The port number the service is running on.'),
      protocol: z.string().describe('The protocol used by the service (e.g., tcp, udp).'),
      serviceName: z.string().describe('The name of the service.'),
      serviceVersion: z.string().describe('The version of the service, if available.'),
      state: z.string().describe('The state of the port (e.g., open, closed, filtered).'),
    }))
    .describe('A list of services identified in the Nmap scan.'),
  summary: z.string().describe('A summary of the scan results and identified services.'),
});
export type ParseNmapServiceScanOutput = z.infer<typeof ParseNmapServiceScanOutputSchema>;

export async function parseNmapServiceScan(input: ParseNmapServiceScanInput): Promise<ParseNmapServiceScanOutput> {
  return parseNmapServiceScanFlow(input);
}

const parseNmapServiceScanPrompt = ai.definePrompt({
  name: 'parseNmapServiceScanPrompt',
  input: {schema: ParseNmapServiceScanInputSchema},
  output: {schema: ParseNmapServiceScanOutputSchema},
  prompt: `You are a network security expert. Your task is to parse the XML output from an Nmap service scan and extract information about the identified services.

  Analyze the provided XML data and identify the running services, their versions, and the ports they are running on.  Provide a summary of the scan results, including the number of identified services and any potential security risks.

  Ensure that the output is a valid JSON according to the output schema.

  Here is the Nmap XML data:
  {{xmlData}}`,
});

const parseNmapServiceScanFlow = ai.defineFlow(
  {
    name: 'parseNmapServiceScanFlow',
    inputSchema: ParseNmapServiceScanInputSchema,
    outputSchema: ParseNmapServiceScanOutputSchema,
  },
  async input => {
    const {output} = await parseNmapServiceScanPrompt(input);
    return output!;
  }
);
