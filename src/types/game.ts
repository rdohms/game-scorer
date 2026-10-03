// --- Game Config (loaded from JSON) ---

export interface BonusColumn {
  key: string;
  label: string;
  description?: string;
}

export interface GameEndConfig {
  trigger: 'rounds' | 'threshold';
  threshold?: number;
  description?: string;
}

export interface GameScoring {
  rounds: number | null; // null = unlimited
  roundLabel: string;
  endGameBonuses?: BonusColumn[];
  endGame: GameEndConfig;
  lowerIsBetter: boolean;
}

export interface GameConfig {
  id: string;
  name: string;
  description?: string;
  minPlayers: number;
  maxPlayers: number;
  scoring: GameScoring;
}

// --- Game State (runtime + localStorage) ---

export interface PlayerScore {
  name: string;
  rounds: number[]; // rounds[i] = score for round i
  bonuses: Record<string, number>; // bonuses[key] = bonus value
}

export interface GameState {
  gameId: string;
  currentRound: number; // 0-indexed
  players: PlayerScore[];
  isFinished: boolean;
}
