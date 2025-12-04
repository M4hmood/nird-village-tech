import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = ['MODE', 'MAP', 'INSPECT', 'BUILD', 'OS', 'INSTALL', 'CONFIG', 'DONE'];

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="mb-8">
      {/* Step indicators */}
      <div className="flex justify-between mb-2">
        {stepLabels.slice(0, totalSteps).map((label, index) => (
          <div key={label} className="flex flex-col items-center">
            <motion.div
              className={`w-8 h-8 border-2 flex items-center justify-center text-xs font-pixel ${
                index < currentStep
                  ? 'border-primary bg-primary text-primary-foreground'
                  : index === currentStep
                  ? 'border-primary text-primary animate-pulse'
                  : 'border-muted text-muted-foreground'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: index === currentStep ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {index < currentStep ? '✓' : index + 1}
            </motion.div>
            <span className={`text-xs mt-1 font-pixel hidden md:block ${
              index <= currentStep ? 'text-primary' : 'text-muted-foreground'
            }`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted border-2 border-primary overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}