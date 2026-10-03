# 🎲 Board Game Scorer

A simple, config-driven board game scoring app. Pick a game, add players, track scores round by round.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## How It Works

1. **Choose a game** from the dropdown
2. **Add players** — type a name and press Tab/Enter
3. **Enter scores** — only the current round is editable
4. **Next Round** — locks the current round and moves to the next
5. **End Game** — reveals any bonus columns, computes final totals, highlights the winner

Scores auto-save to `localStorage` — refresh the page and you can resume.

## Adding a New Game

Games are defined as JSON files in [`public/games/`](public/games/). To add a new game:

1. Create a new JSON file in `public/games/` (e.g., `my-game.json`)
2. Add the filename to [`public/games/manifest.json`](public/games/manifest.json)
3. Reload the app

### Game Config Schema

```json
{
  "id": "my-game",
  "name": "My Game",
  "description": "A short description shown under the dropdown",
  "minPlayers": 2,
  "maxPlayers": 6,
  "scoring": {
    "rounds": 3,
    "roundLabel": "Round",
    "endGameBonuses": [
      {
        "key": "bonus-id",
        "label": "Bonus Name",
        "description": "Tooltip explaining the bonus"
      }
    ],
    "endGame": {
      "trigger": "rounds",
      "description": "Explanation shown when game ends"
    },
    "lowerIsBetter": false
  }
}
```

### Config Properties

| Property | Type | Description |
|----------|------|-------------|
| `scoring.rounds` | `number \| null` | Fixed round count, or `null` for unlimited rounds |
| `scoring.roundLabel` | `string` | Label prefix for columns (e.g., "Round" → "Round 1") |
| `scoring.endGameBonuses` | `array` | Optional bonus score inputs shown at game end |
| `scoring.endGame.trigger` | `"rounds" \| "threshold"` | How the game ends |
| `scoring.endGame.threshold` | `number` | For threshold games: value that triggers end |
| `scoring.lowerIsBetter` | `boolean` | `true` = lowest score wins |

### End Game Triggers

- **`"rounds"`** — Game ends after the configured number of rounds. "End Game" button appears on the last round.
- **`"threshold"`** — Game ends when any player's running total reaches the threshold value. The app shows a warning alert and the "End Game" button pulses.

### Examples

See the included games for reference:
- [`sushi-go.json`](public/games/sushi-go.json) — Fixed 3 rounds + pudding end-game bonus
- [`take-5.json`](public/games/take-5.json) — Unlimited rounds, threshold at 66, lower-is-better

## Tech Stack

- React + TypeScript
- Vite
- CSS (no UI framework)
- localStorage for persistence

## Project Structure

```
src/
├── App.tsx                    # Root component
├── App.css                    # Global styles + CSS variables
├── types/game.ts              # TypeScript interfaces
├── hooks/
│   ├── useGameLoader.ts       # Fetches game configs from /public/games/
│   └── useScoreState.ts       # Score state management + localStorage
├── components/
│   ├── GamePicker.tsx/.css     # Game selection dropdown
│   ├── ScoreSheet.tsx/.css     # Main scoring table
│   └── PlayerRow.tsx/.css      # Individual player row
└── utils/
    └── scoring.ts             # Pure scoring functions
```
