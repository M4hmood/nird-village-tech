import { motion } from 'framer-motion';
import { Leaf, Coins, Zap, Cpu } from 'lucide-react';

interface ScoreDisplayProps {
  environmental: number;
  money: number;
  autonomy: number;
  hardware: number;
  animate?: boolean;
}

export function ScoreDisplay({ environmental, money, autonomy, hardware, animate = true }: ScoreDisplayProps) {
  const totalScore = environmental + money + autonomy + hardware;
  const maxScore = 400;
  const percentage = Math.min((totalScore / maxScore) * 100, 100);

  const getResistanceLevel = () => {
    if (percentage >= 80) return { level: 'Legendary', emoji: '🏆', color: 'text-secondary' };
    if (percentage >= 60) return { level: 'Expert', emoji: '⭐', color: 'text-primary' };
    if (percentage >= 40) return { level: 'Skilled', emoji: '🎯', color: 'text-accent' };
    return { level: 'Apprentice', emoji: '🌱', color: 'text-muted-foreground' };
  };

  const resistance = getResistanceLevel();

  const stats = [
    { label: 'Environmental Impact', value: environmental, icon: Leaf, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Money Saved', value: money, icon: Coins, color: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'Digital Autonomy', value: autonomy, icon: Zap, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Hardware Reused', value: hardware, icon: Cpu, color: 'text-foreground', bg: 'bg-muted' },
  ];

  return (
    <div className="space-y-6">
      {/* Main Score */}
      <motion.div
        className="text-center"
        initial={animate ? { scale: 0 } : {}}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-hero text-primary-foreground mb-4"
          animate={{ boxShadow: ['0 0 20px hsl(152 60% 42% / 0.3)', '0 0 40px hsl(152 60% 42% / 0.5)', '0 0 20px hsl(152 60% 42% / 0.3)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-3xl">{resistance.emoji}</span>
          <div className="text-left">
            <div className="text-sm opacity-90">NIRD Resistance Level</div>
            <div className="text-2xl font-bold">{resistance.level}</div>
          </div>
        </motion.div>

        <motion.div
          className="text-6xl font-bold text-foreground"
          initial={animate ? { opacity: 0, y: 20 } : {}}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {totalScore}
          <span className="text-2xl text-muted-foreground">/{maxScore}</span>
        </motion.div>
      </motion.div>

      {/* Progress Bar */}
      <div className="relative h-4 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 gradient-hero rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className={`p-4 rounded-xl ${stat.bg} border border-border`}
            initial={animate ? { opacity: 0, y: 20 } : {}}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
            </div>
            <motion.div
              className={`text-3xl font-bold ${stat.color}`}
              initial={animate ? { opacity: 0 } : {}}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              +{stat.value}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
