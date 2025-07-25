// Prioritizes patches based on outdated service versions identified in network scans, using LLMs.

'use server';

/**
 * @fileOverview An AI agent that prioritizes patches based on outdated service versions from network scans.
 *
 * - prioritizePatches - A function that prioritizes patches based on network scan data.
 * - PrioritizePatchesInput - The input type for the prioritizePatches function.
 * - PrioritizePatchesOutput - The return type for the prioritizePatches function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NmapScanResultSchema = z.string().describe('The XML output from an Nmap service scan.');

const PrioritizePatchesInputSchema = z.object({
  nmapScanResult: NmapScanResultSchema,
});
export type PrioritizePatchesInput = z.infer<typeof PrioritizePatchesInputSchema>;

const PatchRecommendationSchema = z.object({
  service: z.string().describe('The name of the outdated service.'),
  currentVersion: z.string().describe('The currently running version of the service.'),
  recommendedPatch: z.string().describe('The recommended patch or upgrade version.'),
  rationale: z.string().describe('The rationale for the patch recommendation, including CVEs addressed.'),
  priority: z.enum(['Critical', 'High', 'Medium', 'Low']).describe('The priority of the patch.'),
});

const PrioritizePatchesOutputSchema = z.array(PatchRecommendationSchema).describe('A list of patch recommendations, prioritized by criticality.');
export type PrioritizePatchesOutput = z.infer<typeof PrioritizePatchesOutputSchema>;

export async function prioritizePatches(input: PrioritizePatchesInput): Promise<PrioritizePatchesOutput> {
  return prioritizePatchesFlow(input);
}

const nmapParsingPrompt = ai.definePrompt({
  name: 'nmapParsingPrompt',
  input: {schema: PrioritizePatchesInputSchema},
  output: {schema: PrioritizePatchesOutputSchema},
  prompt: `You are a security expert tasked with analyzing Nmap scan results to identify outdated services and recommend patches.

  Analyze the provided Nmap XML output and extract information about outdated services, their current versions, and potential vulnerabilities.

  Based on the scan results, provide a prioritized list of patch recommendations, including the service name, current version, recommended patch, rationale, and priority.

  Nmap Scan Result (XML):
  {{nmapScanResult}}

  Prioritize patches based on the severity of the vulnerabilities, the criticality of the affected systems, and the ease of applying the patch.

  Format your output as a JSON array of patch recommendations.
  `,
});

const prioritizePatchesFlow = ai.defineFlow(
  {
    name: 'prioritizePatchesFlow',
    inputSchema: PrioritizePatchesInputSchema,
    outputSchema: PrioritizePatchesOutputSchema,
  },
  async input => {
    const {output} = await nmapParsingPrompt(input);
    return output!;
  }
);
