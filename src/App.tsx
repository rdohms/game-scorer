import { useState } from 'react';
import { useGameLoader } from './hooks/useGameLoader';
import { GamePicker } from './components/GamePicker';
import { ScoreSheet } from './components/ScoreSheet';
import './App.css';

function App() {
  const { games, loading, error } = useGameLoader();
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const selectedGame = games.find((g) => g.id === selectedGameId) ?? null;

  if (loading) {
    return (
      <div className="app">
        <div className="app__loading">Loading games...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="app__error">
          <p>Failed to load games: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">🎲 Board Game Scorer</h1>
      </header>

      <main className="app__main">
        <GamePicker
          games={games}
          selectedGameId={selectedGameId}
          onSelectGame={setSelectedGameId}
        />

        {selectedGame && (
          <ScoreSheet key={selectedGame.id} game={selectedGame} />
        )}
      </main>
    </div>
  );
}

export default App;
