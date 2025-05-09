// import { SigningKey } from '@dojoengine/torii-wasm/node';
import { addAddressPadding, type BigNumberish } from 'starknet';
import { w3cwebsocket } from 'websocket';
import {
  KeysClause,
  ToriiQueryBuilder,
  createWorker,
  init,
  type ParsedEntity,
  getModel,
  HistoricalToriiQueryBuilder,
  StandardizedQueryResult,
} from '@dojoengine/sdk/node';
import {
  dojoConfig,
  starknerDomain,
} from './dojoConfig.js';
import {
  PistolsEntity,
  PistolsHistoricalQueryBuilder,
  PistolsToriiResponse,
} from '@underware/pistols-sdk/pistols/node';
import { models } from '@underware/pistols-sdk/pistols/gen';
// import { env } from './env.ts';

// Those lines are require so that websocket works.
// @ts-ignore
global.Websocket = w3cwebsocket;
// @ts-ignore
global.WorkerGlobalScope = global;

const sdk = await init({
  client: {
    toriiUrl: dojoConfig.toriiUrl,
    relayUrl: dojoConfig.relayUrl,
    worldAddress: dojoConfig.manifest.world.address,
  },
  domain: {
    ...starknerDomain,
    name: 'pistols_gg_quests',
  },
  // identity: env.ACCOUNT_ADDRESS,
  // signer: SigningKey.fromSecretScalar(env.ACCOUNT_PRIVATE_KEY),
});


await createWorker(async () => {
  console.log('-- STARTING PISTOLS GG...');

  async function onEntityUpdated({ data, error }: { data: PistolsEntity[]; error: Error | null }) {
    if (error) {
      console.error(error);
      return;
    }
    console.log(`--- SUB data:`, data);
    const entity = data.pop();
    if (entity && entity.entityId !== '0x0') {
      // do whatever you need here
      const model = entity.models?.pistols?.PlayerActivityEvent;
      console.log(`--- SUB model:`, model);
    }
  }

  const query = new PistolsHistoricalQueryBuilder()
    // .withClause(
    //   KeysClause(
    //     [models.ModelsMapping.PlayerActivityEvent],
    //     [undefined]
    //   ).build()
    // )
    .withEntityModels([
      models.ModelsMapping.PlayerActivityEvent
    ])
    .includeHashedKeys();

  //@ts-ignore
  const events: PistolsToriiResponse = await sdk.getEventMessages({
    query: query,
  });
  const items: PistolsEntity[] = events.getItems();
  console.log(`Entities from worker [${items.length}]`);

  const [entities, sub] = await sdk.subscribeEntityQuery({
    query,
    //@ts-ignore
    callback: onEntityUpdated,
  });

  // return [];
  return [sub];
});
