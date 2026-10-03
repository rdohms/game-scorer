import { useState } from 'react';
import type { GameConfig } from '../types/game';
import { useScoreState } from '../hooks/useScoreState';
import { PlayerRow } from './PlayerRow';
import { getWinnerIndex, checkThreshold } from '../utils/scoring';
import './ScoreSheet.css';

interface ScoreSheetProps {
  game: GameConfig;
}

export function ScoreSheet({ game }: ScoreSheetProps) {
  const {
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
  } = useScoreState(game);

  const [hasChosen, setHasChosen] = useState(!hasSavedState);

  // If there's a saved state, show resume/new choice
  if (!hasChosen) {
    return (
      <div className="score-sheet__resume-prompt">
        <p>You have a game in progress. Would you like to resume?</p>
        <div className="score-sheet__resume-actions">
          <button
            className="btn btn--primary"
            onClick={() => {
              resumeGame();
              setHasChosen(true);
            }}
          >
            Resume Game
          </button>
          <button
            className="btn btn--secondary"
            onClick={() => {
              resetGame();
              setHasChosen(true);
            }}
          >
            New Game
          </button>
        </div>
      </div>
    );
  }

  const { scoring } = game;
  const isUnlimited = scoring.rounds === null;
  const totalRoundsToShow = isUnlimited
    ? state.currentRound + 1
    : scoring.rounds!;
  const isLastFixedRound = !isUnlimited && state.currentRound >= scoring.rounds! - 1;
  const bonusColumns = scoring.endGameBonuses ?? [];
  const showBonuses = state.isFinished && bonusColumns.length > 0;

  // Determine if end game should be available
  const thresholdReached =
    scoring.endGame.trigger === 'threshold' &&
    scoring.endGame.threshold != null &&
    checkThreshold(state.players, scoring.endGame.threshold);

  const canEndGame =
    !state.isFinished &&
    (
      (scoring.endGame.trigger === 'rounds' && isLastFixedRound) ||
      (scoring.endGame.trigger === 'threshold') // always allow manual end for threshold games
    );

  const canNextRound =
    !state.isFinished &&
    (
      (isUnlimited) ||
      (!isUnlimited && state.currentRound < scoring.rounds! - 1)
    );

  const winnerIndex = state.isFinished
    ? getWinnerIndex(state.players.filter(p => p.name.trim() !== ''), scoring.lowerIsBetter)
    : -1;

  // Map winner index back to the full players array
  const namedPlayers = state.players
    .map((p, i) => ({ player: p, originalIndex: i }))
    .filter(({ player }) => player.name.trim() !== '');
  const winnerOriginalIndex = winnerIndex >= 0 && namedPlayers[winnerIndex]
    ? namedPlayers[winnerIndex].originalIndex
    : -1;

  return (
    <div className="score-sheet">
      {thresholdReached && !state.isFinished && (
        <div className="score-sheet__alert">
          ⚠️ {scoring.endGame.description ?? 'A player has reached the threshold!'}
        </div>
      )}

      <div className="score-sheet__table-wrapper">
        <table className="score-sheet__table">
          <thead>
            <tr>
              <th className="score-sheet__header-name">Player</th>
              {Array.from({ length: totalRoundsToShow }, (_, i) => (
                <th
                  key={i}
                  className={`score-sheet__header-round ${
                    i === state.currentRound && !state.isFinished
                      ? 'score-sheet__header-round--active'
                      : ''
                  }`}
                >
                  {scoring.roundLabel} {i + 1}
                </th>
              ))}
              {showBonuses &&
                bonusColumns.map((bonus) => (
                  <th key={bonus.key} className="score-sheet__header-bonus" title={bonus.description}>
                    {bonus.label}
                  </th>
                ))}
              <th className="score-sheet__header-total">Total</th>
            </tr>
          </thead>
          <tbody>
            {state.players.map((player, index) => (
              <PlayerRow
                key={index}
                player={player}
                playerIndex={index}
                currentRound={state.currentRound}
                totalRounds={totalRoundsToShow}
                bonusColumns={bonusColumns}
                showBonuses={showBonuses}
                isFinished={state.isFinished}
                isWinner={state.isFinished && index === winnerOriginalIndex}
                canRemove={state.players.length > 1}
                autoFocusName={index === state.players.length - 1 && player.name === ''}
                onUpdateName={updateName}
                onUpdateScore={updateScore}
                onUpdateBonus={updateBonus}
                onRemovePlayer={removePlayer}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="score-sheet__actions">
        {!state.isFinished && (
          <button className="btn btn--ghost" onClick={addPlayer}>
            ＋ Add Player
          </button>
        )}

        {canNextRound && !state.isFinished && (
          <button className="btn btn--primary" onClick={nextRound}>
            Next Round
          </button>
        )}

        {canEndGame && (
          <button
            className={`btn ${thresholdReached ? 'btn--warning' : 'btn--danger'}`}
            onClick={endGame}
          >
            End Game
          </button>
        )}

        {state.isFinished && (
          <button className="btn btn--primary" onClick={resetGame}>
            New Game
          </button>
        )}
      </div>

      {state.isFinished && winnerOriginalIndex >= 0 && (
        <div className="score-sheet__winner-banner">
          🏆 {state.players[winnerOriginalIndex].name} wins!
        </div>
      )}
    </div>
  );
}
