import type { GameConfig } from '../types/game';
import './GamePicker.css';

interface GamePickerProps {
  games: GameConfig[];
  selectedGameId: string | null;
  onSelectGame: (gameId: string) => void;
}

export function GamePicker({ games, selectedGameId, onSelectGame }: GamePickerProps) {
  const selectedGame = games.find((g) => g.id === selectedGameId);

  return (
    <div className="game-picker">
      <select
        value={selectedGameId ?? ''}
        onChange={(e) => onSelectGame(e.target.value)}
        className="game-picker__select"
      >
        <option value="" disabled>
          Choose a game...
        </option>
        {games.map((game) => (
          <option key={game.id} value={game.id}>
            {game.name}
          </option>
        ))}
      </select>
      {selectedGame?.description && (
        <p className="game-picker__description">{selectedGame.description}</p>
      )}
    </div>
  );
}
