import { config } from 'dotenv';
config();

import '@/ai/flows/ingest-vulnerability-data.ts';
import '@/ai/flows/provide-patch-recommendations.ts';
import '@/ai/flows/parse-nmap-service-scan.ts';
import '@/ai/flows/map-vulnerabilities-to-assets.ts';
import '@/ai/flows/prioritize-patches.ts';
import '@/ai/flows/query-vulnerability-information.ts';