import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { Heart, Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Bloatware {
  id: number;
  x: number;
  y: number;
  type: string;
  speed: number;
  points: number;
}

const bloatwareTypes = [
  { type: 'ADS', emoji: '📢', points: 10, color: 'text-neon-yellow' },
  { type: 'TELEMETRY', emoji: '👁️', points: 15, color: 'text-neon-pink' },
  { type: 'UPDATES', emoji: '🔄', points: 20, color: 'text-neon-cyan' },
  { type: 'BLOAT', emoji: '💩', points: 25, color: 'text-destructive' },
  { type: 'TRACKER', emoji: '📍', points: 30, color: 'text-neon-orange' },
];

interface ArcadeModeProps {
  onGameOver: (score: number) => void;
  onBack: () => void;
}

export function ArcadeMode({ onGameOver, onBack }: ArcadeModeProps) {
  const { destroyBloatware } = useGame();
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [bloatwares, setBloatwares] = useState<Bloatware[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  
  // Use refs to avoid state updates during render
  const scoreRef = useRef(0);
  const livesRef = useRef(3);

  const spawnBloatware = useCallback(() => {
    const typeIndex = Math.floor(Math.random() * bloatwareTypes.length);
    const type = bloatwareTypes[typeIndex];
    const newBloatware: Bloatware = {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 10,
      y: -10,
      type: type.type,
      speed: 1 + (level * 0.3) + Math.random() * 0.5,
      points: type.points,
    };
    setBloatwares(prev => [...prev, newBloatware]);
  }, [level]);

  const destroyTarget = useCallback((id: number, points: number) => {
    setBloatwares(prev => prev.filter(b => b.id !== id));
    const comboBonus = Math.floor(combo / 5) * 5;
    const newScore = scoreRef.current + points + comboBonus;
    scoreRef.current = newScore;
    setScore(newScore);
    setCombo(prev => prev + 1);
    destroyBloatware();
  }, [combo, destroyBloatware]);

  // Spawn interval
  useEffect(() => {
    if (!gameStarted || isPaused || gameOver) return;

    const spawnInterval = setInterval(() => {
      spawnBloatware();
    }, Math.max(500, 2000 - (level * 200)));

    return () => clearInterval(spawnInterval);
  }, [gameStarted, isPaused, gameOver, level, spawnBloatware]);

  // Move bloatwares
  useEffect(() => {
    if (!gameStarted || isPaused || gameOver) return;

    const moveInterval = setInterval(() => {
      setBloatwares(prev => {
        const updated = prev.map(b => ({ ...b, y: b.y + b.speed }));
        const escaped = updated.filter(b => b.y > 100);
        const remaining = updated.filter(b => b.y <= 100);
        
        if (escaped.length > 0) {
          const newLives = livesRef.current - escaped.length;
          livesRef.current = Math.max(0, newLives);
          
          // Schedule state update for next tick to avoid render-phase updates
          setTimeout(() => {
            setLives(Math.max(0, newLives));
            setCombo(0);
            if (newLives <= 0) {
              setGameOver(true);
              onGameOver(scoreRef.current);
            }
          }, 0);
        }
        
        return remaining;
      });
    }, 50);

    return () => clearInterval(moveInterval);
  }, [gameStarted, isPaused, gameOver, onGameOver]);

  // Level up every 200 points
  useEffect(() => {
    const newLevel = Math.floor(score / 200) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
    }
  }, [score, level]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    scoreRef.current = 0;
    setLives(3);
    livesRef.current = 3;
    setBloatwares([]);
    setLevel(1);
    setCombo(0);
  };

  const restartGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setTimeout(startGame, 100);
  };

  if (!gameStarted) {
    return (
      <div className="text-center space-y-8 py-12">
        <motion.div
          className="text-8xl"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          👾
        </motion.div>
        <h2 className="text-3xl text-primary neon-glow">ARCADE MODE</h2>
        <p className="text-muted-foreground font-pixel text-lg max-w-md mx-auto">
          Destroy the bloatware before it infects the system!
          Click fast, build combos, survive!
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={startGame} className="pixel-button animate-pulse-glow">
            <Play className="w-5 h-5 mr-2" />
            START
          </Button>
          <Button onClick={onBack} variant="outline" className="border-2 border-muted">
            BACK
          </Button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="text-center space-y-8 py-12">
        <motion.div
          className="text-8xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          💀
        </motion.div>
        <h2 className="text-3xl text-destructive">GAME OVER</h2>
        <div className="space-y-2">
          <p className="text-4xl text-primary neon-glow">{score}</p>
          <p className="text-muted-foreground font-pixel">FINAL SCORE</p>
        </div>
        <div className="text-muted-foreground font-pixel">
          <p>Level reached: {level}</p>
          <p>Max combo: {combo}x</p>
        </div>
        <div className="flex justify-center gap-4">
          <Button onClick={restartGame} className="pixel-button">
            <RotateCcw className="w-5 h-5 mr-2" />
            TRY AGAIN
          </Button>
          <Button onClick={onBack} variant="outline" className="border-2 border-muted">
            BACK
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* HUD */}
      <div className="flex justify-between items-center p-4 border-4 border-primary bg-card">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-6 h-6 ${i < lives ? 'text-destructive fill-destructive' : 'text-muted'}`}
              />
            ))}
          </div>
          <div className="text-sm font-pixel">
            <span className="text-muted-foreground">LVL</span>
            <span className="text-primary ml-1">{level}</span>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl text-primary neon-glow font-display">{score}</div>
          {combo > 2 && (
            <motion.div
              key={combo}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-xs text-secondary font-pixel"
            >
              {combo}x COMBO!
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsPaused(!isPaused)}
            variant="ghost"
            size="sm"
            className="border-2 border-muted"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
          <Button
            onClick={restartGame}
            variant="ghost"
            size="sm"
            className="border-2 border-muted"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Game Area */}
      <div 
        className="relative h-[400px] border-4 border-primary bg-background overflow-hidden scanline"
        style={{ touchAction: 'none' }}
      >
        {isPaused && (
          <div className="absolute inset-0 bg-background/90 flex items-center justify-center z-50">
            <div className="text-center">
              <h3 className="text-2xl text-primary neon-glow mb-4">PAUSED</h3>
              <Button onClick={() => setIsPaused(false)} className="pixel-button">
                <Play className="w-4 h-4 mr-2" />
                RESUME
              </Button>
            </div>
          </div>
        )}

        {/* Bloatwares */}
        {bloatwares.map((bloatware) => {
          const typeInfo = bloatwareTypes.find(t => t.type === bloatware.type);
          return (
            <motion.button
              key={bloatware.id}
              className={`absolute text-3xl cursor-crosshair hover:scale-125 transition-transform ${typeInfo?.color}`}
              style={{
                left: `${bloatware.x}%`,
                top: `${bloatware.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => destroyTarget(bloatware.id, bloatware.points)}
              whileTap={{ scale: 0 }}
            >
              {typeInfo?.emoji}
            </motion.button>
          );
        })}

        {/* Defense Line */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-primary animate-pulse" />
      </div>

      {/* Controls hint */}
      <p className="text-center text-muted-foreground font-pixel text-sm">
        Click/tap bloatware to destroy • Don't let them reach the bottom!
      </p>
    </div>
  );
}