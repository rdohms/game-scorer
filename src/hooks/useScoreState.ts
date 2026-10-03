import { useState, useCallback, useEffect } from 'react';
import type { GameConfig, GameState, PlayerScore } from '../types/game';

const STORAGE_PREFIX = 'game-scorer:';

function createEmptyPlayer(name: string = ''): PlayerScore {
  return {
    name,
    rounds: [],
    bonuses: {},
  };
}

function createInitialState(gameId: string): GameState {
  return {
    gameId,
    currentRound: 0,
    players: [createEmptyPlayer()],
    isFinished: false,
  };
}

function loadState(gameId: string): GameState | null {
  try {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}${gameId}`);
    if (saved) {
      return JSON.parse(saved) as GameState;
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

function saveState(state: GameState): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${state.gameId}`, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

export interface UseScoreStateResult {
  state: GameState;
  hasSavedState: boolean;
  addPlayer: () => void;
  removePlayer: (index: number) => void;
  updateName: (index: number, name: string) => void;
  updateScore: (playerIndex: number, round: number, value: number) => void;
  updateBonus: (playerIndex: number, key: string, value: number) => void;
  nextRound: () => void;
  endGame: () => void;
  resetGame: () => void;
  resumeGame: () => void;
}

export function useScoreState(game: GameConfig): UseScoreStateResult {
  const [hasSavedState] = useState(() => loadState(game.id) !== null);
  const [state, setState] = useState<GameState>(() => createInitialState(game.id));

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  const addPlayer = useCallback(() => {
    setState((prev) => ({
      ...prev,
      players: [...prev.players, createEmptyPlayer()],
    }));
  }, []);

  const removePlayer = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      players: prev.players.filter((_, i) => i !== index),
    }));
  }, []);

  const updateName = useCallback((index: number, name: string) => {
    setState((prev) => {
      const players = [...prev.players];
      players[index] = { ...players[index], name };
      return { ...prev, players };
    });
  }, []);

  const updateScore = useCallback((playerIndex: number, round: number, value: number) => {
    setState((prev) => {
      const players = [...prev.players];
      const player = { ...players[playerIndex] };
      const rounds = [...player.rounds];

      // Ensure the rounds array is long enough
      while (rounds.length <= round) {
        rounds.push(0);
      }
      rounds[round] = value;

      player.rounds = rounds;
      players[playerIndex] = player;
      return { ...prev, players };
    });
  }, []);

  const updateBonus = useCallback((playerIndex: number, key: string, value: number) => {
    setState((prev) => {
      const players = [...prev.players];
      const player = { ...players[playerIndex] };
      player.bonuses = { ...player.bonuses, [key]: value };
      players[playerIndex] = player;
      return { ...prev, players };
    });
  }, []);

  const nextRound = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentRound: prev.currentRound + 1,
    }));
  }, []);

  const endGame = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isFinished: true,
    }));
  }, []);

  const resetGame = useCallback(() => {
    const newState = createInitialState(game.id);
    setState(newState);
  }, [game.id]);

  const resumeGame = useCallback(() => {
    const saved = loadState(game.id);
    if (saved) {
      setState(saved);
    }
  }, [game.id]);

  return {
    state,
    hasSavedState,
    addPlayer,
    removePlayer,
    updateName,
    updateScore,
    updateBonus,
    nextRound,
    endGame,
    resetGame,
    resumeGame,
  };
}
