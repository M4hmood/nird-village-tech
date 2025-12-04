import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { Wallet, Shield, Leaf, Zap } from 'lucide-react';

export function ResourceDisplay() {
  const { state } = useGame();
  
  const budgetPercent = (state.budget / state.maxBudget) * 100;
  const resistanceLevel = 
    state.resistanceScore < 50 ? 'Newcomer' :
    state.resistanceScore < 100 ? 'Apprentice' :
    state.resistanceScore < 200 ? 'Defender' :
    state.resistanceScore < 300 ? 'Champion' : 'Legend';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-4 p-4 bg-card/50 backdrop-blur rounded-xl border border-border mb-6"
    >
      {/* Budget */}
      <div className="flex items-center gap-3 flex-1 min-w-[140px]">
        <div className="p-2 rounded-lg bg-yellow-500/20">
          <Wallet className="w-5 h-5 text-yellow-400" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Budget</span>
            <span className="font-bold text-foreground">€{state.budget}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                budgetPercent > 50 ? 'bg-yellow-400' :
                budgetPercent > 20 ? 'bg-orange-400' : 'bg-red-400'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${budgetPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Resistance Score */}
      <div className="flex items-center gap-3 flex-1 min-w-[140px]">
        <div className="p-2 rounded-lg bg-primary/20">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Resistance</div>
          <div className="font-bold text-foreground">{state.resistanceScore}</div>
          <div className="text-xs text-primary">{resistanceLevel}</div>
        </div>
      </div>

      {/* Carbon Saved */}
      <div className="flex items-center gap-3 flex-1 min-w-[140px]">
        <div className="p-2 rounded-lg bg-green-500/20">
          <Leaf className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">CO₂ Saved</div>
          <div className="font-bold text-green-400">{state.totalCarbonSaved}kg</div>
        </div>
      </div>

      {/* XP/Score */}
      <div className="flex items-center gap-3 flex-1 min-w-[140px]">
        <div className="p-2 rounded-lg bg-purple-500/20">
          <Zap className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Total Score</div>
          <div className="font-bold text-purple-400">
            {state.score.environmental + state.score.money + state.score.autonomy + state.score.hardware + state.shooterScore}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
