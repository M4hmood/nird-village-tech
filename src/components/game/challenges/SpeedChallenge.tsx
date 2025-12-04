import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Challenge } from '@/context/GameContext';
import { Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SpeedChallengeProps {
  challenge: Challenge;
  onComplete: (score: number) => void;
}

const components = [
  { id: 'ram', name: 'RAM', icon: '🧠', slot: 'ram-slot' },
  { id: 'ssd', name: 'SSD', icon: '💾', slot: 'storage-slot' },
  { id: 'thermal', name: 'Thermal Paste', icon: '🌡️', slot: 'cpu-slot' },
];

const slots = [
  { id: 'ram-slot', name: 'RAM Slot' },
  { id: 'storage-slot', name: 'SATA Port' },
  { id: 'cpu-slot', name: 'CPU Socket' },
];

export function SpeedChallenge({ challenge, onComplete }: SpeedChallengeProps) {
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimit || 60);
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const allPlaced = Object.keys(placed).length === components.length;
  const score = allPlaced ? Math.max(0, timeLeft * 2 + 50) : 0;

  useEffect(() => {
    if (!started || finished) return;
    if (timeLeft <= 0) {
      setFinished(true);
      onComplete(score);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, finished, timeLeft, score, onComplete]);

  useEffect(() => {
    if (allPlaced && started && !finished) {
      setFinished(true);
      onComplete(score);
    }
  }, [allPlaced, started, finished, score, onComplete]);

  const handleDrop = useCallback((slotId: string) => {
    if (!draggedItem) return;
    const component = components.find(c => c.id === draggedItem);
    if (component && component.slot === slotId) {
      setPlaced(prev => ({ ...prev, [slotId]: draggedItem }));
    }
    setDraggedItem(null);
  }, [draggedItem]);

  if (!started) {
    return (
      <div className="text-center space-y-6 py-8">
        <Clock className="w-16 h-16 mx-auto text-primary" />
        <h3 className="text-2xl text-primary neon-glow">SPEED CHALLENGE</h3>
        <p className="text-muted-foreground font-pixel">
          Install all components as fast as possible!
        </p>
        <p className="text-lg text-secondary">Time limit: {challenge.timeLimit}s</p>
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
          {allPlaced ? '🎉' : '😢'}
        </motion.div>
        <h3 className="text-2xl text-primary neon-glow">
          {allPlaced ? 'CHALLENGE COMPLETE!' : 'TIME UP!'}
        </h3>
        <div className="text-4xl text-secondary neon-glow-pink">{score} pts</div>
        {allPlaced && score >= challenge.targetScore && (
          <p className="text-primary font-pixel">+{challenge.reward} XP earned!</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timer */}
      <div className="text-center">
        <div className={`text-4xl font-display ${timeLeft <= 10 ? 'text-destructive animate-pulse' : 'text-primary neon-glow'}`}>
          {timeLeft}s
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Slots */}
        <div className="space-y-4">
          <h4 className="text-lg text-primary">SLOTS</h4>
          <div className="space-y-3">
            {slots.map(slot => (
              <div
                key={slot.id}
                className={`p-4 border-4 ${placed[slot.id] ? 'border-primary bg-primary/20' : 'border-muted border-dashed'}`}
                onDragOver={e => e.preventDefault()}
                onDrop={() => handleDrop(slot.id)}
              >
                {placed[slot.id] ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="text-2xl">{components.find(c => c.id === placed[slot.id])?.icon}</span>
                    <span className="font-pixel">{slot.name}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground font-pixel">{slot.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Components */}
        <div className="space-y-4">
          <h4 className="text-lg text-secondary">COMPONENTS</h4>
          <div className="space-y-3">
            {components.filter(c => !Object.values(placed).includes(c.id)).map(component => (
              <motion.div
                key={component.id}
                draggable
                onDragStart={() => setDraggedItem(component.id)}
                onDragEnd={() => setDraggedItem(null)}
                className="p-4 border-4 border-muted bg-card cursor-grab active:cursor-grabbing hover:border-secondary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-2xl mr-2">{component.icon}</span>
                <span className="font-pixel">{component.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}