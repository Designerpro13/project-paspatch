'use server';
/**
 * @fileOverview This file contains the Genkit flow for mapping vulnerabilities to assets.
 *
 * It uses fuzzy matching to correlate software and hardware inventory data with vulnerability information.
 *
 * - mapVulnerabilitiesToAssets - The main function that initiates the vulnerability mapping process.
 * - MapVulnerabilitiesToAssetsInput - The input type for the mapVulnerabilitiesToAssets function.
 * - MapVulnerabilitiesToAssetsOutput - The output type for the mapVulnerabilitiesToAssets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MapVulnerabilitiesToAssetsInputSchema = z.object({
  vulnerabilityData: z.string().describe('Vulnerability data from sources like NVD.'),
  assetInventoryData: z.string().describe('Software and hardware inventory data of the organization.'),
});
export type MapVulnerabilitiesToAssetsInput = z.infer<typeof MapVulnerabilitiesToAssetsInputSchema>;

const MapVulnerabilitiesToAssetsOutputSchema = z.object({
  mappedVulnerabilities: z.string().describe('A report mapping vulnerabilities to specific assets.'),
});
export type MapVulnerabilitiesToAssetsOutput = z.infer<typeof MapVulnerabilitiesToAssetsOutputSchema>;

export async function mapVulnerabilitiesToAssets(
  input: MapVulnerabilitiesToAssetsInput
): Promise<MapVulnerabilitiesToAssetsOutput> {
  return mapVulnerabilitiesToAssetsFlow(input);
}

const mapVulnerabilitiesToAssetsPrompt = ai.definePrompt({
  name: 'mapVulnerabilitiesToAssetsPrompt',
  input: {schema: MapVulnerabilitiesToAssetsInputSchema},
  output: {schema: MapVulnerabilitiesToAssetsOutputSchema},
  prompt: `You are a security analyst tasked with mapping vulnerabilities to assets.

  Use the provided vulnerability data and asset inventory data to correlate vulnerabilities to the organization's assets using fuzzy matching.

  Vulnerability Data:
  {{vulnerabilityData}}

  Asset Inventory Data:
  {{assetInventoryData}}

  Provide a detailed report mapping vulnerabilities to specific assets, identifying the affected assets for each vulnerability.
  The report should be a single string, suitable for displaying in a text area.
  `,
});

const mapVulnerabilitiesToAssetsFlow = ai.defineFlow(
  {
    name: 'mapVulnerabilitiesToAssetsFlow',
    inputSchema: MapVulnerabilitiesToAssetsInputSchema,
    outputSchema: MapVulnerabilitiesToAssetsOutputSchema,
  },
  async input => {
    const {output} = await mapVulnerabilitiesToAssetsPrompt(input);
    return output!;
  }
);
