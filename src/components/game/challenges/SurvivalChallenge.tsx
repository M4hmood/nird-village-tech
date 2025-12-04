import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Challenge } from '@/context/GameContext';
import { Zap, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SurvivalChallengeProps {
  challenge: Challenge;
  onComplete: (score: number) => void;
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  speed: number;
  emoji: string;
}

const enemies = ['📢', '👁️', '🔄', '💩', '📍', '🦠', '🐛', '👾'];

export function SurvivalChallenge({ challenge, onComplete }: SurvivalChallengeProps) {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [destroyed, setDestroyed] = useState(0);
  const [lives, setLives] = useState(3);
  const [bloatwares, setBloatwares] = useState<Enemy[]>([]);
  const livesRef = useRef(3);
  const destroyedRef = useRef(0);

  const score = destroyed * 10;
  const targetReached = destroyed >= challenge.targetScore;

  const spawnEnemy = useCallback(() => {
    const newEnemy: Enemy = {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 10,
      y: -10,
      speed: 1.5 + Math.random(),
      emoji: enemies[Math.floor(Math.random() * enemies.length)],
    };
    setBloatwares(prev => [...prev, newEnemy]);
  }, []);

  const destroyTarget = useCallback((id: number) => {
    setBloatwares(prev => prev.filter(b => b.id !== id));
    destroyedRef.current += 1;
    setDestroyed(destroyedRef.current);
  }, []);

  // Spawn enemies
  useEffect(() => {
    if (!started || finished) return;
    const interval = setInterval(spawnEnemy, 600);
    return () => clearInterval(interval);
  }, [started, finished, spawnEnemy]);

  // Move enemies
  useEffect(() => {
    if (!started || finished) return;

    const interval = setInterval(() => {
      setBloatwares(prev => {
        const updated = prev.map(b => ({ ...b, y: b.y + b.speed }));
        const escaped = updated.filter(b => b.y > 100);
        const remaining = updated.filter(b => b.y <= 100);
        
        if (escaped.length > 0) {
          const newLives = livesRef.current - escaped.length;
          livesRef.current = Math.max(0, newLives);
          setTimeout(() => {
            setLives(Math.max(0, newLives));
            if (newLives <= 0) {
              setFinished(true);
              onComplete(destroyedRef.current * 10);
            }
          }, 0);
        }
        
        return remaining;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [started, finished, onComplete]);

  // Check win condition
  useEffect(() => {
    if (targetReached && !finished) {
      setFinished(true);
      onComplete(score);
    }
  }, [targetReached, finished, score, onComplete]);

  if (!started) {
    return (
      <div className="text-center space-y-6 py-8">
        <Zap className="w-16 h-16 mx-auto text-secondary" />
        <h3 className="text-2xl text-secondary neon-glow-pink">SURVIVAL CHALLENGE</h3>
        <p className="text-muted-foreground font-pixel">
          Destroy {challenge.targetScore} bloatware to win!
        </p>
        <p className="text-lg text-destructive">You have 3 lives</p>
        <Button onClick={() => setStarted(true)} className="pixel-button animate-pulse-glow">
          START
        </Button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="text-center space-y-6 py-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl">
          {targetReached ? '🏆' : '💀'}
        </motion.div>
        <h3 className="text-2xl text-primary neon-glow">
          {targetReached ? 'CHALLENGE COMPLETE!' : 'GAME OVER'}
        </h3>
        <div className="text-4xl text-secondary neon-glow-pink">{destroyed}/{challenge.targetScore}</div>
        <div className="text-2xl text-primary">{score} pts</div>
        {targetReached && (
          <p className="text-primary font-pixel">+{challenge.reward} XP earned!</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* HUD */}
      <div className="flex justify-between items-center p-4 border-4 border-secondary bg-card">
        <div className="flex items-center gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart key={i} className={`w-6 h-6 ${i < lives ? 'text-destructive fill-destructive' : 'text-muted'}`} />
          ))}
        </div>
        <div className="text-2xl text-secondary neon-glow-pink">
          {destroyed}/{challenge.targetScore}
        </div>
      </div>

      {/* Game Area */}
      <div className="relative h-[350px] border-4 border-secondary bg-background overflow-hidden">
        {bloatwares.map(enemy => (
          <motion.button
            key={enemy.id}
            className="absolute text-3xl cursor-crosshair hover:scale-125"
            style={{ left: `${enemy.x}%`, top: `${enemy.y}%`, transform: 'translate(-50%, -50%)' }}
            onClick={() => destroyTarget(enemy.id)}
            whileTap={{ scale: 0 }}
          >
            {enemy.emoji}
          </motion.button>
        ))}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-secondary animate-pulse" />
      </div>
    </div>
  );
}