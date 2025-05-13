import { createDojoConfig } from '@dojoengine/core';
import {
  NetworkId,
  makeStarknetDomain,
} from '@underware/pistols-sdk/pistols/config';
import { env } from './env.js';
import { manifest } from './manifests/manifest.js';

const networkId = env.NETWORK_ID as NetworkId;
const starknetDomain = makeStarknetDomain(networkId);

const dojoConfig = createDojoConfig({
  manifest,
  toriiUrl: env.TORII_URL,
  relayUrl: env.RELAY_URL,
});

export { networkId, starknetDomain, dojoConfig };
