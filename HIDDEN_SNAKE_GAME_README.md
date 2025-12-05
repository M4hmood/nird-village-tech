# 🐍 Hidden Snake Game - Hackathon Challenge

## Overview

This is a hidden Snake game integrated into the NIRD Village website. The game is only accessible through a **secret activation trigger**, making it an Easter egg that rewards curious players.

### Features

✅ **Secret Activation System** - Classic Konami Code & custom "SNAKE" key sequence  
✅ **Full-Featured Snake Game** - Classic gameplay with modern polishing  
✅ **Stylized Graphics** - Retro pixel art with neon glow effects  
✅ **Responsive Design** - Works on desktop and mobile (with touch controls)  
✅ **High Score System** - Persistent local storage of best scores  
✅ **Customizable Snake Colors** - 5 different color skins to choose from  
✅ **Smooth Animations** - Comic-style reveal animation when activated  
✅ **Polished Polish** - Score tracking, collision detection, game over screen  

---

## How to Activate the Hidden Game

There are **two secret activation sequences**:

### Method 1: Konami Code (Classic)
Press the sequence in order:
```
↑ ↑ ↓ ↓ ← → ← → B A
```
(Arrow keys, then press 'B' and 'A')

### Method 2: S.N.A.K.E Sequence (Easter Egg)
Simply press in order:
```
S N A K E
```

Once activated, you'll see a dramatic "🐍 SNAKE REVEALED! 🐍" animation, and the full game modal will appear!

---

## Game Controls

### Desktop
- **Arrow Keys** (↑↓←→) - Move the snake
- **Space** - Start the game / Restart after game over
- **Mouse** - Click color buttons to change snake appearance
- **X Button** - Close the game

### Mobile / Touch
- **Swipe** - Control snake direction
- **Space / Tap Start** - Begin game
- **Tap Restart** - Play again

---

## Customization Guide

### Changing the Activation Sequence

Edit `src/components/game/SecretActivation.tsx`:

```typescript
const ACTIVATION_SEQUENCES = [
  {
    name: 'Custom Sequence',
    keys: ['your', 'custom', 'keys']  // e.g., ['p', 'l', 'a', 'y']
  },
  // Add more sequences as needed
];
```

### Changing Game Speed

Edit `src/components/game/SnakeGame.tsx`:

```typescript
const gameLoop = setInterval(() => {
  update();
  draw();
}, 100); // ← Change this number (100ms = moderate speed)
           // Lower = faster, Higher = slower
```

### Changing Grid Size

Edit `src/components/game/SnakeGame.tsx`:

```typescript
const GRID_SIZE = 20; // ← Increase for larger grid, decrease for tighter game
```

### Changing Colors & Styling

- **Game background**: Edit `.snake-canvas` background color in `SnakeGame.css`
- **Snake colors**: Add colors to the color picker array in `SnakeGame.tsx`
- **Neon glow effects**: Adjust colors and `text-shadow` in `SnakeGame.css`

---

## Project Structure

```
src/components/game/
├── HiddenSnakeGame.tsx       # Main orchestrator component (activation + reveal animation)
├── SecretActivation.tsx       # Key sequence listener (invisible)
├── SnakeGame.tsx              # Game logic and UI
├── HiddenSnakeGame.css        # Reveal animation styling
└── SnakeGame.css              # Game UI and canvas styling
```

### Component Responsibilities

| Component | Purpose |
|-----------|---------|
| `HiddenSnakeGame` | Manages game activation state & reveal animation |
| `SecretActivation` | Listens for secret key sequences (invisible component) |
| `SnakeGame` | Full game implementation: canvas rendering, game logic, controls |

---

## Game Mechanics

### Score System
- **+10 points** for each food eaten
- High score is automatically saved to `localStorage`
- High score persists between sessions

### Collision Detection
- **Walls**: Game ends if snake hits canvas edge
- **Self-collision**: Game ends if snake hits itself
- **Food collision**: Increases length and score

### Food Spawning
- Random location on grid
- Never spawns on snake body
- Animated with radial gradient and glow effect

### Snake Movement
- Continuous movement in current direction
- Cannot reverse into itself (prevents instant death)
- Smooth grid-based movement

---

## Technical Stack

- **React 18** - Component framework
- **TypeScript** - Type safety
- **Canvas API** - Game rendering
- **Framer Motion** - Animations
- **localStorage** - High score persistence
- **Tailwind CSS** - Utility styling
- **shadcn/ui** - UI components (Button)

---

## Responsive Design

### Desktop
- Full 400x400px canvas
- Sidebar with stats and controls
- Landscape layout

### Tablet
- Canvas scales to fit
- Single column layout
- Touch controls enabled

### Mobile (< 480px)
- 280x280px canvas
- Optimized controls
- Swipe gestures supported

---

## Browser Compatibility

✅ Chrome/Edge 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Mobile browsers with canvas support  

---

## Local Development

### Installation
```bash
npm install
```

### Run Dev Server
```bash
npm run dev
```

Navigate to `http://localhost:5173` (or the port shown in terminal)

### Build for Production
```bash
npm run build
```

The built files will be in `dist/` folder - ready for deployment!

---

## Deployment

This is a **front-end only** project - no server required!

### Deploy Options
1. **Vercel** - `vercel deploy`
2. **Netlify** - Connect GitHub repo, auto-deploys
3. **GitHub Pages** - Standard static hosting
4. **AWS S3** - Bucket for static files
5. **Any web server** - Just serve the `dist/` folder

---

## Bonus Features Implemented

✅ **Local High-Score Saving** - Persists in browser storage  
✅ **Animated Transition** - Comic-style reveal animation  
✅ **Customizable Appearance** - 5 snake color options  
✅ **Touch Controls** - Full mobile support  
✅ **Polished UI** - Neon glow effects, smooth animations  

### Potential Future Enhancements
- 🎵 Sound effects (eat, game over, activate)
- 🎮 Multiple difficulty levels
- 📊 Leaderboard with online sync
- 🎨 More snake skins and customization
- 🌍 Multiplayer mode
- 🏆 Achievement system

---

## File Sizes

- **HiddenSnakeGame.tsx**: ~2.5 KB
- **SecretActivation.tsx**: ~2 KB
- **SnakeGame.tsx**: ~10 KB
- **CSS Files**: ~8 KB combined
- **Total Game Code**: ~22.5 KB (unminified)

---

## Credits

Built for the NUIT DE L'INFO 2025 Hackathon Challenge  
Theme: "David vs Goliath: How schools can stand up to Big Tech?"

---

## License

Part of the NIRD Village Tech project - Resistant Digital Village initiative
