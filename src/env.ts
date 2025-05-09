import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NETWORK_ID: z.string(),
  ACCOUNT_ADDRESS: z.string().optional(),
  ACCOUNT_PRIVATE_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
