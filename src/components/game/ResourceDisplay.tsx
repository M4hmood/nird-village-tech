import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { Wallet, Shield, Zap, Star } from 'lucide-react';

export function ResourceDisplay() {
  const { state } = useGame();
  
  const budgetPercent = (state.budget / state.maxBudget) * 100;

  return (
    <motion.div
      className="mb-6 p-4 border-4 border-primary bg-card"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-wrap justify-between items-center gap-4">
        {/* Budget */}
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-neon-yellow" />
          <div className="text-sm font-pixel">
            <span className="text-muted-foreground">BUDGET</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-muted border border-neon-yellow overflow-hidden">
                <motion.div
                  className="h-full bg-neon-yellow"
                  animate={{ width: `${budgetPercent}%` }}
                />
              </div>
              <span className="text-neon-yellow">€{state.budget}</span>
            </div>
          </div>
        </div>

        {/* Resistance */}
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <div className="text-sm font-pixel">
            <span className="text-muted-foreground">RESISTANCE</span>
            <p className="text-primary neon-glow">{state.resistanceScore}</p>
          </div>
        </div>

        {/* Combo */}
        {state.currentCombo > 0 && (
          <motion.div 
            className="flex items-center gap-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            key={state.currentCombo}
          >
            <Zap className="w-5 h-5 text-secondary" />
            <div className="text-sm font-pixel">
              <span className="text-muted-foreground">COMBO</span>
              <p className="text-secondary neon-glow-pink">{state.currentCombo}x</p>
            </div>
          </motion.div>
        )}

        {/* Level */}
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-accent" />
          <div className="text-sm font-pixel">
            <span className="text-muted-foreground">LEVEL</span>
            <p className="text-accent neon-glow-cyan">{state.playerLevel}</p>
          </div>
        </div>

        {/* XP Bar */}
        <div className="flex items-center gap-2">
          <div className="text-sm font-pixel">
            <span className="text-muted-foreground">XP</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-muted border border-secondary overflow-hidden">
                <motion.div
                  className="h-full bg-secondary"
                  animate={{ width: `${(state.totalXP / state.xpToNextLevel) * 100}%` }}
                />
              </div>
              <span className="text-secondary text-xs">{state.totalXP}/{state.xpToNextLevel}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}