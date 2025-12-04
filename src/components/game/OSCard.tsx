import { motion } from 'framer-motion';
import { Check, Shield, Leaf, Users } from 'lucide-react';

interface OSCardProps {
  name: string;
  distro: string;
  description: string;
  tools: string[];
  benefits: string[];
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

export function OSCard({ name, distro, description, tools, benefits, isSelected, onClick, index }: OSCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-lg'
          : 'border-border bg-card hover:border-primary/50 hover:shadow-card'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isSelected && (
        <motion.div
          className="absolute top-3 right-3 w-6 h-6 rounded-full gradient-hero flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Check className="w-4 h-4 text-primary-foreground" />
        </motion.div>
      )}

      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl gradient-tech flex items-center justify-center text-2xl">
          🐧
        </div>
        <div>
          <h3 className="font-bold text-foreground text-lg">{name}</h3>
          <span className="text-sm text-accent font-medium">{distro}</span>
        </div>
      </div>

      <p className="text-muted-foreground text-sm mb-4">{description}</p>

      <div className="space-y-3">
        <div>
          <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Tools</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {tools.map((tool, i) => (
              <span key={i} className="px-2 py-0.5 bg-accent/10 text-accent rounded text-xs">
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          {benefits.map((benefit, i) => (
            <span key={i} className="flex items-center gap-1 text-xs text-muted-foreground">
              {i === 0 && <Shield className="w-3 h-3 text-primary" />}
              {i === 1 && <Leaf className="w-3 h-3 text-primary" />}
              {i === 2 && <Users className="w-3 h-3 text-primary" />}
              {benefit}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}
