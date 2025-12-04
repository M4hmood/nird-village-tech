import { motion } from 'framer-motion';
import { useGame, DifficultyMode, GameMode } from '@/context/GameContext';
import { Gamepad2, BookOpen, Zap, Trophy, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModeSelectorProps {
  onStart: () => void;
}

export function ModeSelector({ onStart }: ModeSelectorProps) {
  const { state, setDifficultyMode, setGameMode } = useGame();

  const difficultyOptions: { mode: DifficultyMode; icon: React.ReactNode; title: string; description: string }[] = [
    {
      mode: 'simple',
      icon: <Sparkles className="w-8 h-8" />,
      title: 'SIMPLE',
      description: 'Fun explanations & easy challenges',
    },
    {
      mode: 'technical',
      icon: <Brain className="w-8 h-8" />,
      title: 'TECHNICAL',
      description: 'Real commands & advanced info',
    },
  ];

  const gameModeOptions: { mode: GameMode; icon: React.ReactNode; title: string; description: string }[] = [
    {
      mode: 'story',
      icon: <BookOpen className="w-8 h-8" />,
      title: 'STORY MODE',
      description: 'Follow the narrative, save the school',
    },
    {
      mode: 'arcade',
      icon: <Gamepad2 className="w-8 h-8" />,
      title: 'ARCADE',
      description: 'Quick play, high scores, endless fun',
    },
    {
      mode: 'challenge',
      icon: <Trophy className="w-8 h-8" />,
      title: 'CHALLENGES',
      description: 'Timed missions & special objectives',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl md:text-3xl text-primary neon-glow mb-2">SELECT MODE</h2>
        <p className="text-muted-foreground font-pixel text-lg">Choose your difficulty and play style</p>
      </motion.div>

      {/* Difficulty Selection */}
      <div className="space-y-4">
        <h3 className="text-lg text-secondary neon-glow-pink text-center">KNOWLEDGE LEVEL</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {difficultyOptions.map((option, index) => (
            <motion.button
              key={option.mode}
              onClick={() => setDifficultyMode(option.mode)}
              className={`p-6 border-4 transition-all ${
                state.difficultyMode === option.mode
                  ? 'border-primary bg-primary/20 shadow-neon'
                  : 'border-muted bg-card hover:border-primary/50'
              }`}
              initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`mb-3 ${state.difficultyMode === option.mode ? 'text-primary' : 'text-muted-foreground'}`}>
                {option.icon}
              </div>
              <h4 className={`text-lg mb-2 ${state.difficultyMode === option.mode ? 'text-primary neon-glow' : 'text-foreground'}`}>
                {option.title}
              </h4>
              <p className="text-sm text-muted-foreground font-pixel">{option.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Game Mode Selection */}
      <div className="space-y-4">
        <h3 className="text-lg text-accent neon-glow-cyan text-center">GAME MODE</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {gameModeOptions.map((option, index) => (
            <motion.button
              key={option.mode}
              onClick={() => setGameMode(option.mode)}
              className={`p-6 border-4 transition-all ${
                state.gameMode === option.mode
                  ? 'border-accent bg-accent/20'
                  : 'border-muted bg-card hover:border-accent/50'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`mb-3 ${state.gameMode === option.mode ? 'text-accent' : 'text-muted-foreground'}`}>
                {option.icon}
              </div>
              <h4 className={`text-sm mb-2 ${state.gameMode === option.mode ? 'text-accent neon-glow-cyan' : 'text-foreground'}`}>
                {option.title}
              </h4>
              <p className="text-xs text-muted-foreground font-pixel">{option.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Player Stats Preview */}
      <motion.div
        className="pixel-card text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex justify-center gap-8 text-sm font-pixel">
          <div>
            <span className="text-muted-foreground">LEVEL</span>
            <p className="text-2xl text-primary neon-glow">{state.playerLevel}</p>
          </div>
          <div>
            <span className="text-muted-foreground">XP</span>
            <p className="text-2xl text-secondary neon-glow-pink">{state.totalXP}</p>
          </div>
          <div>
            <span className="text-muted-foreground">MACHINES FIXED</span>
            <p className="text-2xl text-accent neon-glow-cyan">{state.totalMachinesFixed}</p>
          </div>
        </div>
      </motion.div>

      {/* Start Button */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          onClick={onStart}
          className="pixel-button text-lg animate-pulse-glow"
        >
          <Zap className="w-5 h-5 mr-2" />
          START GAME
        </Button>
      </motion.div>
    </div>
  );
}