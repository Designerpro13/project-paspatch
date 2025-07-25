// This is a server-side file.
'use server';

/**
 * @fileOverview AI agent that provides patch recommendations based on vulnerability analysis and asset criticality.
 *
 * - providePatchRecommendations - A function that provides patch recommendations.
 * - ProvidePatchRecommendationsInput - The input type for the providePatchRecommendations function.
 * - ProvidePatchRecommendationsOutput - The return type for the providePatchRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvidePatchRecommendationsInputSchema = z.object({
  vulnerabilityAnalysis: z
    .string()
    .describe(
      'The vulnerability analysis data, including identified vulnerabilities and their severity.'
    ),
  assetCriticality: z
    .string()
    .describe(
      'The asset criticality data, including a description of the assets and their importance to the organization.'
    ),
  vendorAdvisories: z.string().optional().describe('Optional vendor advisories related to the vulnerabilities.'),
});
export type ProvidePatchRecommendationsInput = z.infer<
  typeof ProvidePatchRecommendationsInputSchema
>;

const ProvidePatchRecommendationsOutputSchema = z.object({
  patchRecommendations: z
    .string()
    .describe(
      'A list of patch recommendations, prioritized by asset criticality and vulnerability severity.'
    ),
  justification: z
    .string()
    .describe(
      'A justification for the patch recommendations, explaining why each patch is recommended.'
    ),
});
export type ProvidePatchRecommendationsOutput = z.infer<
  typeof ProvidePatchRecommendationsOutputSchema
>;

export async function providePatchRecommendations(
  input: ProvidePatchRecommendationsInput
): Promise<ProvidePatchRecommendationsOutput> {
  return providePatchRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'providePatchRecommendationsPrompt',
  input: {schema: ProvidePatchRecommendationsInputSchema},
  output: {schema: ProvidePatchRecommendationsOutputSchema},
  prompt: `You are an AI patch advisor. You will receive vulnerability analysis data, asset criticality data, and vendor advisories.

You will use this information to provide patch recommendations, prioritized by asset criticality and vulnerability severity.
Include a justification for each patch recommendation.

Vulnerability Analysis:
{{{vulnerabilityAnalysis}}}

Asset Criticality:
{{{assetCriticality}}}

Vendor Advisories (Optional):
{{{vendorAdvisories}}}

Prioritized Patch Recommendations:
`, // This is a basic prompt. Add more instructions as needed.
});

const providePatchRecommendationsFlow = ai.defineFlow(
  {
    name: 'providePatchRecommendationsFlow',
    inputSchema: ProvidePatchRecommendationsInputSchema,
    outputSchema: ProvidePatchRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
