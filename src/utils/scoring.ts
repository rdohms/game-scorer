import type { PlayerScore } from '../types/game';

/**
 * Calculate the total score for a player (all rounds + all bonuses).
 */
export function calculateTotal(player: PlayerScore): number {
  const roundsTotal = player.rounds.reduce((sum, score) => sum + score, 0);
  const bonusTotal = Object.values(player.bonuses).reduce((sum, score) => sum + score, 0);
  return roundsTotal + bonusTotal;
}

/**
 * Check if any player's running total has reached or exceeded the threshold.
 */
export function checkThreshold(players: PlayerScore[], threshold: number): boolean {
  return players.some((player) => calculateTotal(player) >= threshold);
}

/**
 * Get the index of the winning player.
 * If lowerIsBetter is true, the player with the lowest total wins.
 * Otherwise, the player with the highest total wins.
 * Returns -1 if there are no players.
 */
export function getWinnerIndex(players: PlayerScore[], lowerIsBetter: boolean): number {
  if (players.length === 0) return -1;

  let bestIndex = 0;
  let bestTotal = calculateTotal(players[0]);

  for (let i = 1; i < players.length; i++) {
    const total = calculateTotal(players[i]);
    const isBetter = lowerIsBetter ? total < bestTotal : total > bestTotal;
    if (isBetter) {
      bestIndex = i;
      bestTotal = total;
    }
  }

  return bestIndex;
}
