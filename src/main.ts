// import { SigningKey } from '@dojoengine/torii-wasm/node';
import { w3cwebsocket } from 'websocket';
import { init, createWorker, SDK } from '@dojoengine/sdk/node';
import { dojoConfig, starknetDomain } from './dojoConfig.js';
import { historicalEventsListener } from './queries/historicalEvents.js';
import type * as torii from '@dojoengine/torii-wasm/types';
import * as models from './bindings/models.gen.js';

export type ZKubeSchemaType = models.SchemaType;

// Those lines are require so that websocket works.
// @ts-ignore
global.Websocket = w3cwebsocket;
// @ts-ignore
global.WorkerGlobalScope = global;

const sdk: SDK<ZKubeSchemaType> = await init({
  client: {
    toriiUrl: dojoConfig.toriiUrl,
    relayUrl: dojoConfig.relayUrl,
    worldAddress: dojoConfig.manifest.world.address,
  },
  domain: {
    ...starknetDomain,
    name: 'zkube_gg_quests',
  },
  // identity: env.ACCOUNT_ADDRESS,
  // signer: SigningKey.fromSecretScalar(env.ACCOUNT_PRIVATE_KEY),
});

await createWorker(async () => {
  console.log('-- STARTING ZKUBE GG...');

  // // test queries
  // const challenge = await getChallenge(sdk, '0x00000000000000000000000000000000000000000000000000000000000000d5');
  // const duelist = await getDuelist(sdk, '0x00000000000000000000000000000000000000000000000000000000000000d5');

  const subs: torii.Subscription[] = [];
  subs.push(await historicalEventsListener(sdk));

  return subs;
});
