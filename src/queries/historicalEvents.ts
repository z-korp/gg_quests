import {
  ClauseBuilder,
  HistoricalToriiQueryBuilder,
  ParsedEntity,
  SDK,
  ToriiQueryBuilder,
  ToriiResponse,
} from '@dojoengine/sdk/node';
import { feltToString } from '@underware/pistols-sdk/starknet';
import { bigintToAddress } from '@underware/pistols-sdk/utils';
import { Actions, ActionsPerPlayer } from '../gg/actions.js';
import { ZKubeSchemaType } from 'src/main.js';
import * as models from 'src/bindings/models.gen.js';
import { env } from 'process';

type ZKubeEntity = ParsedEntity<ZKubeSchemaType>;

class ZKubeQueryBuilder extends ToriiQueryBuilder<ZKubeSchemaType> {}
class ZKubeHistoricalQueryBuilder extends HistoricalToriiQueryBuilder<ZKubeSchemaType> {}
class ZKubeClauseBuilder extends ClauseBuilder<ZKubeSchemaType> {}
type ZKubeToriiResponse = ToriiResponse<ZKubeSchemaType>;

export const historicalEventsListener = async (sdk: SDK<ZKubeSchemaType>) => {
  async function onEntityUpdated({
    data,
    error,
  }: {
    data: ZKubeEntity[];
    error: Error | null;
  }) {
    if (error) {
      console.error(error);
      return;
    }

    // actions to submit
    const actionsPerPlayer = new ActionsPerPlayer();

    // console.log(`--- SUB data:`, data);
    const entity = data.pop();
    if (entity && entity.entityId !== '0x0') {
      console.log(`--- HISTORICAL got:`, entity);
      console.log(
        `--- HISTORICAL got:`,
        Object.keys(entity.models.zkube_budo_v1_1_0 ?? {})
      );

      // activity events
      // {
      //   is_public: true,
      //   player_address: "0x057c54434905c896cc163358a9057f91b5e3e6a4f60b5a4bef3fdd77c2dc91aa",
      //   activity: "MovesRevealed",
      //   timestamp: 1746824284,
      //   identifier: "0x00000000000000000000000000000000000000000000000000000000000000e4",
      // }
      const startGame = entity.models?.zkube_budo_v1_1_0
        ?.StartGame as models.StartGame;
      if (startGame) {
        console.log(`--- HISTORICAL StartGameEvent:`, startGame);
        actionsPerPlayer.append(
          bigintToAddress(startGame.player),
          Actions.StartGame
        );
      }

      const useBonus = entity.models?.zkube_budo_v1_1_0
        ?.UseBonus as models.UseBonus;
      if (useBonus) {
        console.log(`--- HISTORICAL UseBonusEvent:`, useBonus);
        if (useBonus.bonus.activeVariant() === 'Hammer') {
          actionsPerPlayer.append(
            bigintToAddress(useBonus.player),
            Actions.UseHammer
          );
        } else if (useBonus.bonus.activeVariant() === 'Totem') {
          actionsPerPlayer.append(
            bigintToAddress(useBonus.player),
            Actions.UseTotem
          );
        } else if (useBonus.bonus.activeVariant() === 'Wave') {
          actionsPerPlayer.append(
            bigintToAddress(useBonus.player),
            Actions.UseWave
          );
        }
      }

      // trophy progression events
      // {
      //   task_id: "0x000000000000000000000000000000000000000050657266656374446f646765",
      //   time: 1746824284,
      //   player_id: "0x0256d696f908f2748efcc6931c1bca88f269394ab80b91c691d7916f04af3d8c",
      //   count: 1,
      // }
      const progression = entity.models?.zkube_budo_v1_1_0
        ?.TrophyProgression as models.TrophyProgression;
      if (progression) {
        const action_id = feltToString(progression.task_id);
        console.log(
          `--- HISTORICAL TrophyProgression [${action_id}]`,
          progression
        );

        // CHAINING
        if (action_id === 'CHAINING0') {
          actionsPerPlayer.append(
            bigintToAddress(progression.player_id),
            Actions.ClearLinesInOneCombo3
          );
        }
        if (action_id === 'CHAINING1') {
          actionsPerPlayer.append(
            bigintToAddress(progression.player_id),
            Actions.ClearLinesInOneCombo6
          );
        }
        if (action_id === 'CHAINING2') {
          actionsPerPlayer.append(
            bigintToAddress(progression.player_id),
            Actions.ClearLinesInOneCombo9
          );
        }
        if (action_id === 'MASTERING0') {
          actionsPerPlayer.append(
            bigintToAddress(progression.player_id),
            Actions.TotalComboInOneGameAbove50
          );
        }
        if (action_id === 'MASTERING1') {
          actionsPerPlayer.append(
            bigintToAddress(progression.player_id),
            Actions.TotalComboInOneGameAbove150
          );
        }
        if (action_id === 'MASTERING2') {
          actionsPerPlayer.append(
            bigintToAddress(progression.player_id),
            Actions.TotalComboInOneGameAbove250
          );
        }
        /*if (action_id === 'PLAYING0') {
          actionsPerPlayer.append(
            bigintToAddress(progression.player_id),
            'play_game'
          );
        }
        if (action_id === 'PLAYING1') {
          actionsPerPlayer.append(
            bigintToAddress(progression.player_id),
            'GameExperienced'
          );
        }
        if (action_id === 'PLAYING2') {
          actionsPerPlayer.append(
            bigintToAddress(progression.player_id),
            'GameVeteran'
          );
        }*/
      }
    }

    // push actions to gg
    actionsPerPlayer.push();
  }

  const query: ZKubeHistoricalQueryBuilder = new ZKubeHistoricalQueryBuilder()
    .withEntityModels([
      `${env.NAMESPACE}-TrophyProgression`,
      `${env.NAMESPACE}-StartGame`,
      `${env.NAMESPACE}-UseBonus`,
    ])
    .withDirection('Backward')
    .withLimit(1);

  //@ts-ignore
  const events: ZKubeToriiResponse = await sdk.getEventMessages({
    query: query,
  });
  const items: ZKubeEntity[] = events.getItems();
  console.log(`Historical intitial events [${items.length}]`);

  const [entities, sub] = await sdk.subscribeEventQuery({
    query,
    //@ts-ignore
    callback: onEntityUpdated,
  });

  return sub;
};
