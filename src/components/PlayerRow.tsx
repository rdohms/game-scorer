import { useRef, useEffect } from 'react';
import type { BonusColumn } from '../types/game';
import { calculateTotal } from '../utils/scoring';
import type { PlayerScore } from '../types/game';
import './PlayerRow.css';

// Block non-numeric characters that browsers allow in type="number" (e, E, +, .)
const BLOCKED_KEYS = ['e', 'E', '+', '.'];

function handleNumericKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
  if (BLOCKED_KEYS.includes(e.key)) {
    e.preventDefault();
  }
}

function handleNumericPaste(e: React.ClipboardEvent<HTMLInputElement>) {
  const pasted = e.clipboardData.getData('text');
  if (!/^-?\d+$/.test(pasted)) {
    e.preventDefault();
  }
}

interface PlayerRowProps {
  player: PlayerScore;
  playerIndex: number;
  currentRound: number;
  totalRounds: number; // number of round columns to render
  bonusColumns: BonusColumn[];
  showBonuses: boolean;
  isFinished: boolean;
  isWinner: boolean;
  canRemove: boolean;
  autoFocusName: boolean;
  onUpdateName: (index: number, name: string) => void;
  onUpdateScore: (playerIndex: number, round: number, value: number) => void;
  onUpdateBonus: (playerIndex: number, key: string, value: number) => void;
  onRemovePlayer: (index: number) => void;
}

export function PlayerRow({
  player,
  playerIndex,
  currentRound,
  totalRounds,
  bonusColumns,
  showBonuses,
  isFinished,
  isWinner,
  canRemove,
  autoFocusName,
  onUpdateName,
  onUpdateScore,
  onUpdateBonus,
  onRemovePlayer,
}: PlayerRowProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const hasScores = player.rounds.some((s) => s !== 0);

  useEffect(() => {
    if (autoFocusName && nameRef.current) {
      nameRef.current.focus();
    }
  }, [autoFocusName]);

  const total = calculateTotal(player);

  return (
    <tr className={`player-row ${isWinner ? 'player-row--winner' : ''}`}>
      <td className="player-row__name-cell">
        <div className="player-row__name-wrapper">
          <input
            ref={nameRef}
            type="text"
            className="player-row__name"
            value={player.name}
            onChange={(e) => onUpdateName(playerIndex, e.target.value)}
            placeholder="Enter name..."
            disabled={isFinished}
            readOnly={hasScores && isFinished}
          />
          {canRemove && !hasScores && (
            <button
              className="player-row__remove"
              onClick={() => onRemovePlayer(playerIndex)}
              title="Remove player"
              aria-label={`Remove ${player.name || 'player'}`}
            >
              ✕
            </button>
          )}
        </div>
      </td>

      {Array.from({ length: totalRounds }, (_, roundIndex) => {
        const isActive = roundIndex === currentRound && !isFinished;
        const score = player.rounds[roundIndex] ?? 0;
        const isPast = roundIndex < currentRound;

        return (
          <td
            key={roundIndex}
            className={`player-row__score-cell ${
              isActive ? 'player-row__score-cell--active' : ''
            } ${isPast ? 'player-row__score-cell--past' : ''} ${
              roundIndex > currentRound ? 'player-row__score-cell--future' : ''
            }`}
          >
            <input
              type="number"
              inputMode="numeric"
              className="player-row__score-input"
              value={score || ''}
              onChange={(e) =>
                onUpdateScore(
                  playerIndex,
                  roundIndex,
                  e.target.value === '' ? 0 : Number(e.target.value)
                )
              }
              onKeyDown={handleNumericKeyDown}
              onPaste={handleNumericPaste}
              disabled={!isActive || !player.name}
              tabIndex={isActive ? 0 : -1}
            />
          </td>
        );
      })}

      {showBonuses &&
        bonusColumns.map((bonus) => {
          const bonusValue = player.bonuses[bonus.key] ?? 0;
          return (
            <td key={bonus.key} className="player-row__score-cell player-row__score-cell--bonus">
              <input
                type="number"
                inputMode="numeric"
                className="player-row__score-input"
                value={bonusValue || ''}
                onChange={(e) =>
                  onUpdateBonus(
                    playerIndex,
                    bonus.key,
                    e.target.value === '' ? 0 : Number(e.target.value)
                  )
                }
                onKeyDown={handleNumericKeyDown}
                onPaste={handleNumericPaste}
                disabled={isFinished && Object.keys(player.bonuses).length > 0}
                title={bonus.description}
              />
            </td>
          );
        })}

      <td className="player-row__total-cell">
        <span className="player-row__total">{total}</span>
      </td>
    </tr>
  );
}
