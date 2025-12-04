import { motion } from 'framer-motion';
import { MachineType } from '@/context/GameContext';

interface MachineCardProps {
  type: MachineType;
  name: string;
  description: string;
  emoji: string;
  specs: string[];
  isSelected: boolean;
  onClick: () => void;
}

export function MachineCard({ type, name, description, emoji, specs, isSelected, onClick }: MachineCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-lg'
          : 'border-border bg-card hover:border-primary/50 hover:shadow-card'
      }`}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          className="absolute top-3 right-3 w-6 h-6 rounded-full gradient-hero flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <span className="text-primary-foreground text-sm">✓</span>
        </motion.div>
      )}

      {/* Emoji icon */}
      <motion.div
        className="text-5xl mb-4"
        animate={isSelected ? { rotate: [0, -10, 10, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        {emoji}
      </motion.div>

      {/* Content */}
      <h3 className="text-xl font-bold text-foreground mb-2">{name}</h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>

      {/* Specs */}
      <div className="flex flex-wrap gap-2">
        {specs.map((spec, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground"
          >
            {spec}
          </span>
        ))}
      </div>

      {/* Glow effect when selected */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
