import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';

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
  const { addShooterScore, destroyBloatware, state } = useGame();
  const [bloatwares, setBloatwares] = useState<Bloatware[]>([]);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isComplete, setIsComplete] = useState(false);
  const [hitEffects, setHitEffects] = useState<{ id: number; x: number; y: number }[]>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);

  // Spawn bloatware
  useEffect(() => {
    if (isComplete) return;
    
    const spawnInterval = setInterval(() => {
      const type = bloatwareTypes[Math.floor(Math.random() * bloatwareTypes.length)];
      const newBloatware: Bloatware = {
        id: idCounter.current++,
        type: type.type,
        icon: type.icon,
        x: Math.random() * 80 + 10, // 10-90% of width
        y: -10,
        speed: Math.random() * 1.5 + 0.5, // 0.5-2 speed
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
          .filter(b => b.y < 100); // Remove if past bottom
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
          return 100;
        }
        return prev + (100 / duration / 10); // Complete in 'duration' seconds
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [duration, isComplete]);

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
    addShooterScore(points);
    destroyBloatware();
    
    // Add hit effect
    setHitEffects(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setHitEffects(prev => prev.filter(e => e.id !== id));
    }, 500);
  }, [addShooterScore, destroyBloatware]);

  // Check for bloatware hitting the "hard drive"
  useEffect(() => {
    const hitCount = bloatwares.filter(b => b.y >= 85).length;
    if (hitCount > 0) {
      setBloatwares(prev => prev.filter(b => b.y < 85));
      // Penalty: slow down progress
      setProgress(prev => Math.max(0, prev - hitCount * 5));
    }
  }, [bloatwares]);

  return (
    <div className="space-y-4">
      {/* Header stats */}
      <div className="flex justify-between items-center p-4 bg-card rounded-xl border border-border">
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{state.shooterScore}</div>
            <div className="text-xs text-muted-foreground">Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{state.bloatwareDestroyed}</div>
            <div className="text-xs text-muted-foreground">Destroyed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{timeLeft}s</div>
            <div className="text-xs text-muted-foreground">Time Left</div>
          </div>
        </div>
      </div>

      {/* Installation progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">🐧 Installing Linux...</span>
          <span className="text-primary font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="h-4 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-green-400"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Game area */}
      <div
        ref={gameAreaRef}
        className="relative h-96 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 rounded-2xl overflow-hidden border-2 border-primary/30 cursor-crosshair"
      >
        {/* Scanlines effect */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
          }} />
        </div>

        {/* Instructions */}
        {!isComplete && bloatwares.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div className="text-muted-foreground">
              <span className="text-4xl block mb-2">🎯</span>
              <p>Click the falling bloatware to destroy it!</p>
              <p className="text-sm">Don't let them reach the hard drive!</p>
            </div>
          </div>
        )}

        {/* Hard drive target area */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-primary/30 to-transparent flex items-end justify-center pb-2">
          <div className="px-4 py-1 bg-slate-800 rounded border border-slate-600 text-xs text-slate-400">
            💾 Hard Drive - Protect me!
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
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-red-400 font-bold whitespace-nowrap">
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
            className="absolute inset-0 bg-background/80 flex items-center justify-center flex-col"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="text-center"
            >
              <span className="text-6xl">🎉</span>
              <h3 className="text-2xl font-bold text-foreground mt-4">Installation Complete!</h3>
              <p className="text-muted-foreground mt-2">
                You destroyed {state.bloatwareDestroyed} bloatware threats!
              </p>
              <p className="text-lg font-bold text-primary mt-2">
                +{state.shooterScore} points
              </p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={onComplete}
                className="mt-6 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors"
              >
                Continue →
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center">
        {bloatwareTypes.map(type => (
          <div key={type.type} className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{type.icon}</span>
            <span>{type.name}</span>
            <span className="text-primary">+{type.points}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
