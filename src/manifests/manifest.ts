import slot from './manifest_slot.json' with { type: "json" };
import sepolia from './manifest_sepolia.json' with { type: "json" };
import mainnet from './manifest_mainnet.json' with { type: "json" };

import { env } from '../env.js';

const deployType = env.DEPLOY_TYPE;

const manifests = {
  sepolia,
  mainnet,
  slot,
};

// Fallback to `slot` if deployType is not a key in `manifests`
export const manifest = deployType in manifests ? manifests[deployType] : slot;

export type Manifest = typeof manifest;
