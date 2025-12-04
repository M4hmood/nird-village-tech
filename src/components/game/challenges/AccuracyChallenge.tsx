import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Challenge } from '@/context/GameContext';
import { Target, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AccuracyChallengeProps {
  challenge: Challenge;
  onComplete: (score: number) => void;
}

interface TargetItem {
  id: number;
  x: number;
  y: number;
  isGood: boolean;
  emoji: string;
}

const goodItems = ['🐧', '💾', '🔓', '🛡️'];
const badItems = ['📢', '👁️', '💩', '🦠'];

export function AccuracyChallenge({ challenge, onComplete }: AccuracyChallengeProps) {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [targets, setTargets] = useState<TargetItem[]>([]);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [round, setRound] = useState(0);
  const totalRounds = 10;

  const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0;
  const score = hits * 50 - misses * 20;

  const spawnTargets = useCallback(() => {
    const newTargets: TargetItem[] = [];
    const count = 4 + Math.floor(round / 3);
    
    for (let i = 0; i < count; i++) {
      const isGood = Math.random() > 0.4;
      const items = isGood ? goodItems : badItems;
      newTargets.push({
        id: Date.now() + i,
        x: Math.random() * 70 + 15,
        y: Math.random() * 60 + 20,
        isGood,
        emoji: items[Math.floor(Math.random() * items.length)],
      });
    }
    setTargets(newTargets);
  }, [round]);

  useEffect(() => {
    if (started && !finished && round < totalRounds) {
      spawnTargets();
    }
  }, [started, finished, round, spawnTargets]);

  useEffect(() => {
    if (round >= totalRounds && started) {
      setFinished(true);
      onComplete(score);
    }
  }, [round, started, score, onComplete]);

  const handleClick = (target: TargetItem) => {
    if (target.isGood) {
      setMisses(m => m + 1); // Clicking good items is bad
    } else {
      setHits(h => h + 1); // Clicking bad items is good
    }
    setTargets(prev => prev.filter(t => t.id !== target.id));
    
    // Check if round is complete (only bad items remain or all clicked)
    setTimeout(() => {
      setTargets(current => {
        if (current.length === 0 || current.every(t => t.isGood)) {
          setRound(r => r + 1);
          return [];
        }
        return current;
      });
    }, 100);
  };

  const skipRound = () => {
    const missedBad = targets.filter(t => !t.isGood).length;
    setMisses(m => m + missedBad);
    setRound(r => r + 1);
    setTargets([]);
  };

  if (!started) {
    return (
      <div className="text-center space-y-6 py-8">
        <Target className="w-16 h-16 mx-auto text-accent" />
        <h3 className="text-2xl text-accent neon-glow-cyan">ACCURACY CHALLENGE</h3>
        <p className="text-muted-foreground font-pixel">
          Click ONLY the bloatware! Don't click good software.
        </p>
        <div className="flex justify-center gap-4 text-sm font-pixel">
          <div className="text-primary">🐧 Good</div>
          <div className="text-destructive">📢 Bad</div>
        </div>
        <Button onClick={() => setStarted(true)} className="pixel-button animate-pulse-glow">
          START
        </Button>
      </div>
    );
  }

  if (finished) {
    const success = score >= challenge.targetScore;
    return (
      <div className="text-center space-y-6 py-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl">
          {success ? '🎯' : '😵'}
        </motion.div>
        <h3 className="text-2xl text-accent neon-glow-cyan">
          {success ? 'PERFECT ACCURACY!' : 'CHALLENGE FAILED'}
        </h3>
        <div className="space-y-2">
          <div className="text-4xl text-primary neon-glow">{accuracy}%</div>
          <p className="text-muted-foreground font-pixel">Accuracy</p>
        </div>
        <div className="text-2xl text-secondary">{score} pts</div>
        {success && (
          <p className="text-primary font-pixel">+{challenge.reward} XP earned!</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* HUD */}
      <div className="flex justify-between items-center p-4 border-4 border-accent bg-card">
        <div className="font-pixel">
          <span className="text-muted-foreground">ROUND</span>
          <span className="text-accent ml-2">{round + 1}/{totalRounds}</span>
        </div>
        <div className="font-pixel">
          <span className="text-primary">✓ {hits}</span>
          <span className="text-muted-foreground mx-2">/</span>
          <span className="text-destructive">✗ {misses}</span>
        </div>
        <Button onClick={skipRound} variant="outline" size="sm" className="border-2 border-muted">
          SKIP →
        </Button>
      </div>

      {/* Game Area */}
      <div className="relative h-[350px] border-4 border-accent bg-background overflow-hidden">
        {targets.map(target => (
          <motion.button
            key={target.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute text-4xl cursor-crosshair transition-transform hover:scale-125 ${
              target.isGood ? 'hover:ring-2 hover:ring-primary' : 'hover:ring-2 hover:ring-destructive'
            }`}
            style={{ left: `${target.x}%`, top: `${target.y}%`, transform: 'translate(-50%, -50%)' }}
            onClick={() => handleClick(target)}
            whileTap={{ scale: 0 }}
          >
            {target.emoji}
          </motion.button>
        ))}
        
        {targets.length === 0 && round < totalRounds && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground font-pixel animate-pulse">Loading next round...</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-8 text-sm font-pixel">
        <div><span className="text-primary">🐧💾🔓🛡️</span> = DON'T CLICK</div>
        <div><span className="text-destructive">📢👁️💩🦠</span> = CLICK ME</div>
      </div>
    </div>
  );
}