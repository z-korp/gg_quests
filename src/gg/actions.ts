import { pushActions } from './push.js';

export enum Actions {
  StartGame = 'start_game',
  UseHammer = 'use_hammer',
  UseTotem = 'use_totem',
  UseWave = 'use_wave',
  ClearLinesInOneCombo3 = 'clear_lines_in_one_combo_3',
  ClearLinesInOneCombo6 = 'clear_lines_in_one_combo_6',
  ClearLinesInOneCombo9 = 'clear_lines_in_one_combo_9',
  TotalComboInOneGameAbove50 = 'total_combo_in_one_game_above_50',
  TotalComboInOneGameAbove150 = 'total_combo_in_one_game_above_150',
  TotalComboInOneGameAbove250 = 'total_combo_in_one_game_above_250',
  TotalScoreInOneGameAbove100 = 'total_score_in_one_game_above_100',
  TotalScoreInOneGameAbove300 = 'total_score_in_one_game_above_300',
  TotalScoreInOneGameAbove800 = 'total_score_in_one_game_above_800',
}

export class ActionsPerPlayer {
  actions: Record<string, Actions[]> = {};

  constructor() {
    this.actions = {};
  }

  append(address: string, action: Actions) {
    if (!this.actions[address]) {
      this.actions[address] = [];
    }
    this.actions[address].push(action);
  }

  push() {
    Object.entries(this.actions).forEach(([address, actions]) => {
      pushActions({ address, actions });
    });
  }
}
