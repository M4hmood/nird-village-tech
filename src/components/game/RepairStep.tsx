import { motion } from 'framer-motion';
import { RepairAction } from '@/context/GameContext';
import { Leaf, Coins, Clock } from 'lucide-react';

interface RepairStepProps {
  repair: RepairAction;
  onToggle: () => void;
  index: number;
}

export function RepairStep({ repair, onToggle, index }: RepairStepProps) {
  return (
    <motion.button
      onClick={onToggle}
      className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${
        repair.completed
          ? 'border-primary bg-primary/10'
          : 'border-border bg-card hover:border-primary/50'
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center gap-4">
        {/* Emoji & checkbox */}
        <div className="relative">
          <motion.span
            className="text-3xl"
            animate={repair.completed ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {repair.icon}
          </motion.span>
          {repair.completed && (
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-hero flex items-center justify-center text-xs text-primary-foreground"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              ✓
            </motion.div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h4 className="font-bold text-foreground">{repair.name}</h4>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Leaf className="w-4 h-4 text-primary" />
              +{repair.impact.environmental}%
            </span>
            <span className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-secondary" />
              €{repair.impact.money} saved
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-accent" />
              +{repair.impact.lifespan}yr
            </span>
          </div>
        </div>

        {/* Toggle indicator */}
        <div
          className={`w-12 h-7 rounded-full p-1 transition-colors ${
            repair.completed ? 'bg-primary' : 'bg-muted'
          }`}
        >
          <motion.div
            className="w-5 h-5 rounded-full bg-card shadow-sm"
            animate={{ x: repair.completed ? 20 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </div>
      </div>
    </motion.button>
  );
}
