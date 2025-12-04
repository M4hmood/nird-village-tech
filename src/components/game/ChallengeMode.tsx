import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame, Challenge } from '@/context/GameContext';
import { Trophy, Clock, Target, Zap, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChallengeModeProps {
  onSelectChallenge: (challengeId: string) => void;
  onBack: () => void;
}

const challengeTypeIcons = {
  speed: Clock,
  accuracy: Target,
  survival: Zap,
  puzzle: Trophy,
};

const difficultyColors = {
  easy: 'text-neon-green border-neon-green',
  medium: 'text-neon-yellow border-neon-yellow',
  hard: 'text-neon-pink border-neon-pink',
};

function ChallengeCard({ 
  challenge, 
  isUnlocked, 
  onClick 
}: { 
  challenge: Challenge; 
  isUnlocked: boolean; 
  onClick: () => void;
}) {
  const Icon = challengeTypeIcons[challenge.type];

  return (
    <motion.button
      onClick={onClick}
      disabled={!isUnlocked}
      className={`relative p-6 border-4 text-left transition-all ${
        challenge.completed
          ? 'border-primary bg-primary/20'
          : isUnlocked
          ? 'border-muted bg-card hover:border-primary'
          : 'border-muted/50 bg-card/50 cursor-not-allowed opacity-60'
      }`}
      whileHover={isUnlocked ? { scale: 1.02, y: -4 } : {}}
      whileTap={isUnlocked ? { scale: 0.98 } : {}}
    >
      {challenge.completed && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-primary p-1"
        >
          <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
        </motion.div>
      )}

      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className={`p-3 border-2 ${difficultyColors[challenge.difficulty]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg text-foreground mb-1">{challenge.name}</h3>
          <p className="text-sm text-muted-foreground font-pixel mb-3">{challenge.description}</p>
          
          <div className="flex items-center gap-4 text-xs font-pixel">
            <span className={`px-2 py-1 border ${difficultyColors[challenge.difficulty]}`}>
              {challenge.difficulty.toUpperCase()}
            </span>
            {challenge.timeLimit && (
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {challenge.timeLimit}s
              </span>
            )}
            <span className="text-secondary flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              +{challenge.reward} XP
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export function ChallengeMode({ onSelectChallenge, onBack }: ChallengeModeProps) {
  const { state } = useGame();
  
  const completedCount = state.challenges.filter(c => c.completed).length;
  
  // Unlock logic: first challenge always unlocked, others require previous completion
  const isUnlocked = (index: number) => {
    if (index === 0) return true;
    return state.challenges[index - 1]?.completed || false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="text-6xl mb-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🏆
        </motion.div>
        <h2 className="text-2xl text-secondary neon-glow-pink mb-2">CHALLENGE MODE</h2>
        <p className="text-muted-foreground font-pixel">
          Complete challenges to earn XP and unlock rewards!
        </p>
        
        {/* Progress */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="h-3 w-48 bg-muted border-2 border-primary overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / state.challenges.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-sm text-primary font-pixel">
            {completedCount}/{state.challenges.length}
          </span>
        </div>
      </div>

      {/* Challenge Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {state.challenges.map((challenge, index) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            isUnlocked={isUnlocked(index)}
            onClick={() => onSelectChallenge(challenge.id)}
          />
        ))}
      </div>

      {/* All Complete */}
      {completedCount === state.challenges.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 border-4 border-primary bg-primary/20"
        >
          <span className="text-4xl">🎮</span>
          <h3 className="text-xl text-primary neon-glow mt-2">
            CHALLENGE MASTER!
          </h3>
          <p className="text-muted-foreground font-pixel">
            You've completed all challenges!
          </p>
        </motion.div>
      )}

      {/* Back Button */}
      <div className="flex justify-center">
        <Button onClick={onBack} variant="outline" className="pixel-button">
          BACK TO MAP
        </Button>
      </div>
    </div>
  );
}