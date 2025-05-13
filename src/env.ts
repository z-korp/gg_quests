import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  // pistols/dojo
  NETWORK_ID: z.string(),
  ACCOUNT_ADDRESS: z.string().optional(),
  ACCOUNT_PRIVATE_KEY: z.string().optional(),
  // gg.xyz
  API_URL: z.string().optional().default('https://api.gg.quest'),
  GAME_SECRET: z.string(),
  DEPLOY_TYPE: z.enum(['slot', 'sepolia', 'mainnet']),
  NAMESPACE: z.string(),
  TORII_URL: z.string(),
  RELAY_URL: z.string(),
});

export const env = envSchema.parse(process.env);

// gameAddress: parsedEnv.GAME_ADDRESS,
// startBlock: parsedEnv.START_BLOCK,
// apiUrl: parsedEnv.API_URL,
// gameSecret: parsedEnv.GAME_SECRET,
