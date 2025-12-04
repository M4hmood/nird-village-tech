import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export function ProgressBar({ currentStep, totalSteps, labels }: ProgressBarProps) {
  const defaultLabels = ['Start', 'Machine', 'Repair', 'OS', 'Customize', 'Results'];
  const stepLabels = labels || defaultLabels;

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="relative flex items-center justify-between">
        {/* Background line */}
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-muted -translate-y-1/2 rounded-full" />
        
        {/* Progress line */}
        <motion.div
          className="absolute left-0 top-1/2 h-1 gradient-hero -translate-y-1/2 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* Steps */}
        {stepLabels.slice(0, totalSteps).map((label, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={index} className="relative z-10 flex flex-col items-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isCompleted
                    ? 'gradient-hero text-primary-foreground'
                    : isCurrent
                    ? 'bg-card border-2 border-primary text-primary shadow-lg'
                    : 'bg-muted text-muted-foreground'
                }`}
                initial={{ scale: 0.8 }}
                animate={{ scale: isCurrent ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
              </motion.div>
              <span
                className={`mt-2 text-xs font-medium transition-colors ${
                  isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
