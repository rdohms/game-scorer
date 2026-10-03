import { useState, useEffect } from 'react';
import type { GameConfig } from '../types/game';

interface UseGameLoaderResult {
  games: GameConfig[];
  loading: boolean;
  error: string | null;
}

export function useGameLoader(): UseGameLoaderResult {
  const [games, setGames] = useState<GameConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGames() {
      try {
        const manifestResponse = await fetch('/games/manifest.json');
        if (!manifestResponse.ok) {
          throw new Error('Failed to load game manifest');
        }
        const filenames: string[] = await manifestResponse.json();

        const gamePromises = filenames.map(async (filename) => {
          const response = await fetch(`/games/${filename}`);
          if (!response.ok) {
            throw new Error(`Failed to load game config: ${filename}`);
          }
          return response.json() as Promise<GameConfig>;
        });

        const loadedGames = await Promise.all(gamePromises);
        setGames(loadedGames);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error loading games');
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, []);

  return { games, loading, error };
}
