import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';

interface Bloatware {
  id: number;
  type: string;
  icon: string;
  x: number;
  y: number;
  speed: number;
  points: number;
}

const bloatwareTypes = [
  { type: 'telemetry', icon: '👁️', name: 'Telemetry', points: 10 },
  { type: 'ads', icon: '📢', name: 'Ads', points: 15 },
  { type: 'updates', icon: '🔄', name: 'Forced Updates', points: 20 },
  { type: 'bloat', icon: '💩', name: 'Bloatware', points: 25 },
  { type: 'tracker', icon: '🎯', name: 'Tracker', points: 30 },
];

interface BloatwareShooterProps {
  onComplete: () => void;
  duration?: number;
}

export function BloatwareShooter({ onComplete, duration = 20 }: BloatwareShooterProps) {
  const { addShooterScore, destroyBloatware, state, addPerfectInstall } = useGame();
  const [bloatwares, setBloatwares] = useState<Bloatware[]>([]);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isComplete, setIsComplete] = useState(false);
  const [hitEffects, setHitEffects] = useState<{ id: number; x: number; y: number }[]>([]);
  const [combo, setCombo] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);
  const hitCount = useRef(0);

  // Spawn bloatware
  useEffect(() => {
    if (isComplete) return;
    
    const spawnInterval = setInterval(() => {
      const type = bloatwareTypes[Math.floor(Math.random() * bloatwareTypes.length)];
      const newBloatware: Bloatware = {
        id: idCounter.current++,
        type: type.type,
        icon: type.icon,
        x: Math.random() * 80 + 10,
        y: -10,
        speed: Math.random() * 1.5 + 0.5,
        points: type.points,
      };
      setBloatwares(prev => [...prev, newBloatware]);
    }, 800);

    return () => clearInterval(spawnInterval);
  }, [isComplete]);

  // Move bloatwares down
  useEffect(() => {
    if (isComplete) return;
    
    const moveInterval = setInterval(() => {
      setBloatwares(prev => {
        const updated = prev
          .map(b => ({ ...b, y: b.y + b.speed }))
          .filter(b => b.y < 100);
        return updated;
      });
    }, 50);

    return () => clearInterval(moveInterval);
  }, [isComplete]);

  // Progress bar (installation)
  useEffect(() => {
    if (isComplete) return;
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsComplete(true);
          if (hitCount.current > 0) {
            addPerfectInstall();
          }
          return 100;
        }
        return prev + (100 / duration / 10);
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [duration, isComplete, addPerfectInstall]);

  // Timer
  useEffect(() => {
    if (isComplete || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isComplete, timeLeft]);

  // Handle click on bloatware
  const handleClick = useCallback((id: number, x: number, y: number, points: number) => {
    setBloatwares(prev => prev.filter(b => b.id !== id));
    const comboBonus = Math.floor(combo / 3) * 5;
    addShooterScore(points + comboBonus);
    destroyBloatware();
    hitCount.current++;
    setCombo(c => c + 1);
    
    // Add hit effect
    setHitEffects(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setHitEffects(prev => prev.filter(e => e.id !== id));
    }, 500);
  }, [addShooterScore, destroyBloatware, combo]);

  // Check for bloatware hitting the "hard drive"
  useEffect(() => {
    const escaped = bloatwares.filter(b => b.y >= 85).length;
    if (escaped > 0) {
      setBloatwares(prev => prev.filter(b => b.y < 85));
      setProgress(prev => Math.max(0, prev - escaped * 5));
      setCombo(0);
    }
  }, [bloatwares]);

  return (
    <div className="space-y-4">
      {/* Header stats */}
      <div className="flex justify-between items-center p-4 border-4 border-primary bg-card">
        <div className="flex gap-6 font-pixel">
          <div className="text-center">
            <div className="text-2xl text-primary neon-glow">{state.shooterScore}</div>
            <div className="text-xs text-muted-foreground">SCORE</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-destructive">{state.bloatwareDestroyed}</div>
            <div className="text-xs text-muted-foreground">DESTROYED</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl ${timeLeft <= 5 ? 'text-destructive animate-pulse' : 'text-neon-yellow'}`}>
              {timeLeft}s
            </div>
            <div className="text-xs text-muted-foreground">TIME</div>
          </div>
          {combo > 2 && (
            <motion.div 
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              key={combo}
            >
              <div className="text-2xl text-secondary neon-glow-pink">{combo}x</div>
              <div className="text-xs text-muted-foreground">COMBO</div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Installation progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-pixel">
          <span className="text-muted-foreground">🐧 INSTALLING LINUX...</span>
          <span className="text-primary neon-glow">{Math.round(progress)}%</span>
        </div>
        <div className="h-4 bg-muted border-2 border-primary overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Game area */}
      <div
        ref={gameAreaRef}
        className="relative h-96 bg-background border-4 border-primary overflow-hidden cursor-crosshair scanline"
      >
        {/* Instructions */}
        {!isComplete && bloatwares.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div className="text-muted-foreground font-pixel">
              <span className="text-4xl block mb-2">🎯</span>
              <p>CLICK THE BLOATWARE!</p>
              <p className="text-sm">DON'T LET THEM REACH THE DRIVE!</p>
            </div>
          </div>
        )}

        {/* Hard drive target area */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-primary/20 flex items-end justify-center pb-2">
          <div className="px-4 py-1 bg-card border-2 border-primary text-xs text-primary font-pixel">
            💾 HARD DRIVE - PROTECT ME!
          </div>
        </div>

        {/* Bloatwares */}
        <AnimatePresence>
          {bloatwares.map(bloatware => (
            <motion.button
              key={bloatware.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 text-4xl hover:scale-125 transition-transform z-10"
              style={{
                left: `${bloatware.x}%`,
                top: `${bloatware.y}%`,
              }}
              onClick={() => handleClick(bloatware.id, bloatware.x, bloatware.y, bloatware.points)}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.8 }}
            >
              <span className="drop-shadow-lg filter">{bloatware.icon}</span>
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-secondary font-pixel whitespace-nowrap">
                +{bloatware.points}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Hit effects */}
        <AnimatePresence>
          {hitEffects.map(effect => (
            <motion.div
              key={effect.id}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              className="absolute pointer-events-none"
              style={{
                left: `${effect.x}%`,
                top: `${effect.y}%`,
              }}
            >
              <span className="text-2xl">💥</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Completion overlay */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-background/90 flex items-center justify-center flex-col"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="text-center"
            >
              <span className="text-6xl">🎉</span>
              <h3 className="text-2xl text-primary neon-glow mt-4 font-pixel">INSTALLATION COMPLETE!</h3>
              <p className="text-muted-foreground mt-2 font-pixel">
                YOU DESTROYED {state.bloatwareDestroyed} THREATS!
              </p>
              <p className="text-lg text-secondary neon-glow-pink mt-2 font-pixel">
                +{state.shooterScore} POINTS
              </p>
              <Button
                onClick={onComplete}
                className="pixel-button mt-6"
              >
                CONTINUE →
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center font-pixel">
        {bloatwareTypes.map(type => (
          <div key={type.type} className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{type.icon}</span>
            <span>{type.name}</span>
            <span className="text-secondary">+{type.points}</span>
          </div>
        ))}
      </div>
    </div>
  );
}