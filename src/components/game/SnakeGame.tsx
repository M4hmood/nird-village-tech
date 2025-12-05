import React, { useRef, useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import './SnakeGame.css';

interface SnakeGameProps {
  onClose: () => void;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved) : 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [snakeColor, setSnakeColor] = useState('#00ff41');

  const gameStateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    score: 0,
    gameOver: false,
  });

  const GRID_SIZE = 20;
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 400;
  const TILE_SIZE = CANVAS_WIDTH / GRID_SIZE;

  // Draw functions
  const drawTile = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, color: string, style: 'snake' | 'head' | 'food') => {
    const px = x * TILE_SIZE;
    const py = y * TILE_SIZE;

    if (style === 'head') {
      // Draw head with eyes
      ctx.fillStyle = color;
      ctx.fillRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
      
      // Eyes
      ctx.fillStyle = '#000';
      const eyeSize = 3;
      ctx.fillRect(px + 5, py + 5, eyeSize, eyeSize);
      ctx.fillRect(px + TILE_SIZE - 8, py + 5, eyeSize, eyeSize);
    } else if (style === 'snake') {
      ctx.fillStyle = color;
      ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
      ctx.strokeStyle = '#00cc33';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
    } else if (style === 'food') {
      // Draw food as glowing circle with gradient
      ctx.save();
      const gradient = ctx.createRadialGradient(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 0, px + TILE_SIZE / 2, py + TILE_SIZE / 2, TILE_SIZE / 2);
      gradient.addColorStop(0, '#ff6b9d');
      gradient.addColorStop(0.5, '#ff1744');
      gradient.addColorStop(1, '#c41c3b');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, TILE_SIZE / 2 - 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }, [TILE_SIZE]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with dark background
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * TILE_SIZE, 0);
      ctx.lineTo(i * TILE_SIZE, CANVAS_HEIGHT);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * TILE_SIZE);
      ctx.lineTo(CANVAS_WIDTH, i * TILE_SIZE);
      ctx.stroke();
    }

    // Draw food
    const { food } = gameStateRef.current;
    drawTile(ctx, food.x, food.y, '#ff1744', 'food');

    // Draw snake
    const { snake } = gameStateRef.current;
    snake.forEach((segment, index) => {
      if (index === 0) {
        drawTile(ctx, segment.x, segment.y, snakeColor, 'head');
      } else {
        drawTile(ctx, segment.x, segment.y, snakeColor, 'snake');
      }
    });
  }, [snakeColor, drawTile, TILE_SIZE, GRID_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT]);

  const spawnFood = useCallback(() => {
    let newFood;
    let collision = true;

    while (collision) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };

      collision = gameStateRef.current.snake.some(
        segment => segment.x === newFood.x && segment.y === newFood.y
      );
    }

    gameStateRef.current.food = newFood;
  }, []);

  const update = useCallback(() => {
    const state = gameStateRef.current;
    state.direction = state.nextDirection;

    const head = state.snake[0];
    const newHead = {
      x: head.x + state.direction.x,
      y: head.y + state.direction.y,
    };

    // Check wall collision
    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
      state.gameOver = true;
      setGameOver(true);
      return;
    }

    // Check self collision
    if (state.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      state.gameOver = true;
      setGameOver(true);
      return;
    }

    state.snake.unshift(newHead);

    // Check food collision
    if (newHead.x === state.food.x && newHead.y === state.food.y) {
      state.score += 10;
      setScore(state.score);

      // Update high score
      if (state.score > highScore) {
        setHighScore(state.score);
        localStorage.setItem('snakeHighScore', state.score.toString());
      }

      spawnFood();
    } else {
      state.snake.pop();
    }
  }, [highScore, spawnFood]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      update();
      draw();
    }, 100);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, update, draw]);

  // Initial draw
  useEffect(() => {
    draw();
  }, [draw]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = gameStateRef.current;

      switch (e.key) {
        case 'ArrowUp':
          if (state.direction.y === 0) state.nextDirection = { x: 0, y: -1 };
          e.preventDefault();
          break;
        case 'ArrowDown':
          if (state.direction.y === 0) state.nextDirection = { x: 0, y: 1 };
          e.preventDefault();
          break;
        case 'ArrowLeft':
          if (state.direction.x === 0) state.nextDirection = { x: -1, y: 0 };
          e.preventDefault();
          break;
        case 'ArrowRight':
          if (state.direction.x === 0) state.nextDirection = { x: 1, y: 0 };
          e.preventDefault();
          break;
        case ' ':
          e.preventDefault();
          if (!gameStarted) {
            setGameStarted(true);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted]);

  // Handle mobile touch controls
  const touchStartRef = useRef({ x: 0, y: 0 });

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;

    const startX = touchStartRef.current.x;
    const startY = touchStartRef.current.y;

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    const state = gameStateRef.current;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0 && state.direction.x === 0) state.nextDirection = { x: 1, y: 0 };
      if (deltaX < 0 && state.direction.x === 0) state.nextDirection = { x: -1, y: 0 };
    } else {
      if (deltaY > 0 && state.direction.y === 0) state.nextDirection = { x: 0, y: 1 };
      if (deltaY < 0 && state.direction.y === 0) state.nextDirection = { x: 0, y: -1 };
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleRestart = () => {
    gameStateRef.current = {
      snake: [{ x: 10, y: 10 }],
      food: { x: 15, y: 15 },
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      score: 0,
      gameOver: false,
    };
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    spawnFood();
    draw();
  };

  return (
    <div className="snake-game-container">
      <div className="snake-game-header">
        <h2 className="snake-game-title">🐍 SNAKE MASTER 🐍</h2>
        <button
          onClick={onClose}
          className="snake-game-close"
          aria-label="Close game"
        >
          <X size={24} />
        </button>
      </div>

      <div className="snake-game-content">
        <div className="snake-canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="snake-canvas"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />
        </div>

        <div className="snake-game-sidebar">
          <div className="snake-stats">
            <div className="stat-item">
              <span className="stat-label">Score</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">High Score</span>
              <span className="stat-value">{highScore}</span>
            </div>
          </div>

          <div className="snake-controls">
            <div className="control-section">
              <p className="control-title">Color</p>
              <div className="color-picker">
                {['#00ff41', '#ff1744', '#00bcd4', '#ffeb3b', '#9c27b0'].map((color) => (
                  <button
                    key={color}
                    className={`color-option ${snakeColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSnakeColor(color)}
                    title={`Change snake to ${color}`}
                  />
                ))}
              </div>
            </div>

            {!gameStarted ? (
              <Button
                onClick={handleRestart}
                className="snake-start-btn"
              >
                Start Game (Space)
              </Button>
            ) : gameOver ? (
              <Button
                onClick={handleRestart}
                className="snake-restart-btn"
              >
                Restart Game
              </Button>
            ) : null}
          </div>

          <div className="snake-instructions">
            <p className="instruction-title">Controls</p>
            <ul className="instruction-list">
              <li>↑↓←→ to move</li>
              <li>Space to start</li>
              <li>Mobile: Swipe</li>
            </ul>
          </div>

          {gameOver && (
            <div className="game-over-message">
              <p className="game-over-text">GAME OVER!</p>
              <p className="game-over-score">Final Score: {score}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
