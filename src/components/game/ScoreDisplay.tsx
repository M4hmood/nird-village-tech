import { motion } from 'framer-motion';
import { Leaf, Wallet, Shield, Cpu } from 'lucide-react';

interface ScoreDisplayProps {
  environmental: number;
  money: number;
  autonomy: number;
  hardware: number;
}

export function ScoreDisplay({ environmental, money, autonomy, hardware }: ScoreDisplayProps) {
  const total = environmental + money + autonomy + hardware;

  const categories = [
    { icon: Leaf, label: 'ENVIRONMENTAL', value: environmental, color: 'text-primary', glow: 'neon-glow' },
    { icon: Wallet, label: 'SAVINGS', value: money, color: 'text-neon-yellow', glow: '' },
    { icon: Shield, label: 'AUTONOMY', value: autonomy, color: 'text-accent', glow: 'neon-glow-cyan' },
    { icon: Cpu, label: 'HARDWARE', value: hardware, color: 'text-secondary', glow: 'neon-glow-pink' },
  ];

  return (
    <div className="space-y-6">
      {/* Total score */}
      <motion.div
        className="text-center p-8 border-4 border-primary bg-card"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-lg text-muted-foreground font-pixel mb-2">NIRD RESISTANCE SCORE</h2>
        <motion.div
          className="text-6xl md:text-8xl text-primary neon-glow"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          {total}
        </motion.div>
        <p className="text-muted-foreground font-pixel mt-2">POINTS</p>
      </motion.div>

      {/* Category breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.label}
            className="p-4 border-4 border-muted bg-card text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <cat.icon className={`w-8 h-8 mx-auto mb-2 ${cat.color}`} />
            <div className={`text-2xl ${cat.color} ${cat.glow}`}>{cat.value}</div>
            <p className="text-xs text-muted-foreground font-pixel mt-1">{cat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Rating */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-muted-foreground font-pixel mb-2">RATING</p>
        <div className="text-4xl">
          {total >= 200 ? '⭐⭐⭐' : total >= 100 ? '⭐⭐' : '⭐'}
        </div>
        <p className="text-primary font-pixel mt-2 neon-glow">
          {total >= 200 ? 'TECH MASTER!' : total >= 100 ? 'GOOD JOB!' : 'KEEP PRACTICING!'}
        </p>
      </motion.div>
    </div>
  );
}