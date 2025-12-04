import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Challenge } from '@/context/GameContext';
import { Trophy, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PuzzleChallengeProps {
  challenge: Challenge;
  onComplete: (score: number) => void;
}

interface Component {
  id: string;
  name: string;
  icon: string;
  slot: string;
}

const allComponents: Component[] = [
  { id: 'ram', name: 'RAM', icon: '🧠', slot: 'ram-slot' },
  { id: 'ssd', name: 'SSD', icon: '💾', slot: 'storage-slot' },
  { id: 'thermal', name: 'Thermal Paste', icon: '🌡️', slot: 'cpu-slot' },
  { id: 'wifi', name: 'WiFi Card', icon: '📶', slot: 'pcie-slot' },
  { id: 'battery', name: 'Battery', icon: '🔋', slot: 'battery-slot' },
];

const slots = [
  { id: 'ram-slot', name: 'RAM Slot', hint: 'Memory goes here' },
  { id: 'storage-slot', name: 'SATA Port', hint: 'Storage drives connect here' },
  { id: 'cpu-slot', name: 'CPU Socket', hint: 'Apply thermal paste here' },
  { id: 'pcie-slot', name: 'PCIe Slot', hint: 'Expansion cards here' },
  { id: 'battery-slot', name: 'Battery Bay', hint: 'Power storage' },
];

export function PuzzleChallenge({ challenge, onComplete }: PuzzleChallengeProps) {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [mistakes, setMistakes] = useState(0);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ slot: string; correct: boolean } | null>(null);

  const correctPlacements = Object.entries(placed).filter(([slot, comp]) => {
    const component = allComponents.find(c => c.id === comp);
    return component?.slot === slot;
  }).length;

  const allPlaced = Object.keys(placed).length === allComponents.length;
  const perfect = mistakes === 0 && correctPlacements === allComponents.length;
  const score = correctPlacements * 40 - mistakes * 10;

  useEffect(() => {
    if (allPlaced && started && !finished) {
      setFinished(true);
      onComplete(Math.max(0, score));
    }
  }, [allPlaced, started, finished, score, onComplete]);

  const handleDrop = (slotId: string) => {
    if (!draggedItem || placed[slotId]) return;
    
    const component = allComponents.find(c => c.id === draggedItem);
    const isCorrect = component?.slot === slotId;
    
    setFeedback({ slot: slotId, correct: isCorrect });
    setTimeout(() => setFeedback(null), 1000);
    
    if (!isCorrect) {
      setMistakes(m => m + 1);
    }
    
    setPlaced(prev => ({ ...prev, [slotId]: draggedItem }));
    setDraggedItem(null);
  };

  if (!started) {
    return (
      <div className="text-center space-y-6 py-8">
        <Trophy className="w-16 h-16 mx-auto text-neon-yellow" />
        <h3 className="text-2xl text-neon-yellow">PUZZLE CHALLENGE</h3>
        <p className="text-muted-foreground font-pixel">
          Place ALL components in their correct slots.
        </p>
        <p className="text-sm text-secondary">No mistakes = bonus points!</p>
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
          {perfect ? '🏆' : success ? '✅' : '❌'}
        </motion.div>
        <h3 className="text-2xl text-primary neon-glow">
          {perfect ? 'PERFECT!' : success ? 'CHALLENGE COMPLETE!' : 'COULD BE BETTER'}
        </h3>
        <div className="space-y-2">
          <div className="text-4xl text-secondary neon-glow-pink">{score} pts</div>
          <p className="text-muted-foreground font-pixel">
            {correctPlacements}/{allComponents.length} correct • {mistakes} mistakes
          </p>
        </div>
        {success && (
          <p className="text-primary font-pixel">+{challenge.reward} XP earned!</p>
        )}
      </div>
    );
  }

  const availableComponents = allComponents.filter(c => !Object.values(placed).includes(c.id));

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="flex justify-between items-center p-4 border-4 border-neon-yellow bg-card">
        <div className="font-pixel">
          <span className="text-muted-foreground">PLACED</span>
          <span className="text-primary ml-2">{Object.keys(placed).length}/{allComponents.length}</span>
        </div>
        <div className="font-pixel">
          <span className="text-muted-foreground">MISTAKES</span>
          <span className={`ml-2 ${mistakes > 0 ? 'text-destructive' : 'text-primary'}`}>{mistakes}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Slots */}
        <div className="space-y-3">
          <h4 className="text-lg text-primary font-pixel">MOTHERBOARD</h4>
          {slots.map(slot => {
            const placedComp = placed[slot.id];
            const component = allComponents.find(c => c.id === placedComp);
            const isCorrect = component?.slot === slot.id;
            const showFeedback = feedback?.slot === slot.id;

            return (
              <div
                key={slot.id}
                className={`p-4 border-4 transition-all ${
                  placedComp 
                    ? isCorrect 
                      ? 'border-primary bg-primary/20' 
                      : 'border-destructive bg-destructive/20'
                    : 'border-muted border-dashed hover:border-neon-yellow'
                }`}
                onDragOver={e => e.preventDefault()}
                onDrop={() => handleDrop(slot.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    {placedComp ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{component?.icon}</span>
                        <span className="font-pixel">{component?.name}</span>
                      </div>
                    ) : (
                      <div>
                        <span className="font-pixel text-muted-foreground">{slot.name}</span>
                        <p className="text-xs text-muted-foreground/60">{slot.hint}</p>
                      </div>
                    )}
                  </div>
                  {showFeedback && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      {feedback.correct ? (
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      ) : (
                        <XCircle className="w-6 h-6 text-destructive" />
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Components */}
        <div className="space-y-3">
          <h4 className="text-lg text-secondary font-pixel">COMPONENTS</h4>
          {availableComponents.length > 0 ? (
            availableComponents.map(comp => (
              <motion.div
                key={comp.id}
                draggable
                onDragStart={() => setDraggedItem(comp.id)}
                onDragEnd={() => setDraggedItem(null)}
                className={`p-4 border-4 border-muted bg-card cursor-grab active:cursor-grabbing hover:border-secondary ${
                  draggedItem === comp.id ? 'opacity-50' : ''
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-2xl mr-3">{comp.icon}</span>
                <span className="font-pixel">{comp.name}</span>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground font-pixel">
              All components placed!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}