import { motion } from 'framer-motion';
import { useGame, MachineType } from '@/context/GameContext';
import { AlertTriangle, CheckCircle, Cpu, HardDrive, MemoryStick, Battery, Wifi } from 'lucide-react';

interface MachineSpec {
  type: MachineType;
  name: string;
  emoji: string;
  year: number;
  cpu: string;
  ram: string;
  storage: string;
  condition: 'poor' | 'fair' | 'good';
  issues: string[];
}

const machineSpecs: MachineSpec[] = [
  { 
    type: 'laptop', 
    name: 'Old School Laptop', 
    emoji: '💻', 
    year: 2014,
    cpu: 'Intel Core i3-4000M',
    ram: '4GB DDR3',
    storage: 'HDD 320GB (5400rpm)',
    condition: 'fair',
    issues: ['Slow boot time (10+ minutes)', 'Battery holds 30min charge', 'Fan very loud']
  },
  { 
    type: 'desktop', 
    name: 'Computer Lab Tower', 
    emoji: '🖥️', 
    year: 2012,
    cpu: 'Intel Core 2 Duo E7500',
    ram: '2GB DDR2',
    storage: 'HDD 160GB',
    condition: 'poor',
    issues: ['Takes 15min to boot', 'Crashes when opening browser', 'Very dusty inside']
  },
  { 
    type: 'thin-client', 
    name: 'Thin Client Terminal', 
    emoji: '📦', 
    year: 2015,
    cpu: 'Intel Atom D525',
    ram: '1GB DDR3',
    storage: 'Flash 8GB',
    condition: 'fair',
    issues: ['Limited storage', 'No WiFi', 'Needs network boot']
  },
  { 
    type: 'tablet', 
    name: 'Android Tablet', 
    emoji: '📱', 
    year: 2016,
    cpu: 'ARM Cortex-A53',
    ram: '2GB',
    storage: '16GB eMMC',
    condition: 'poor',
    issues: ['Cracked screen', 'Battery swelling', 'OS outdated']
  },
];

interface PCInspectionProps {
  onSelectMachine: (type: MachineType) => void;
  onContinue: () => void;
}

export function PCInspection({ onSelectMachine, onContinue }: PCInspectionProps) {
  const { state } = useGame();
  
  const selectedSpec = machineSpecs.find(m => m.type === state.machine);

  const conditionColors = {
    poor: 'text-red-400 bg-red-500/20',
    fair: 'text-yellow-400 bg-yellow-500/20',
    good: 'text-green-400 bg-green-500/20',
  };

  return (
    <div className="space-y-6">
      {/* Machine selection grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {machineSpecs.map((machine, index) => (
          <motion.button
            key={machine.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelectMachine(machine.type)}
            className={`p-4 rounded-xl border-2 transition-all text-center ${
              state.machine === machine.type
                ? 'bg-primary/20 border-primary shadow-lg shadow-primary/20'
                : 'bg-card border-border hover:border-primary/50'
            }`}
          >
            <span className="text-4xl block mb-2">{machine.emoji}</span>
            <span className="text-sm font-medium text-foreground">{machine.name}</span>
            <span className="text-xs text-muted-foreground block mt-1">{machine.year}</span>
          </motion.button>
        ))}
      </div>

      {/* Detailed inspection panel */}
      {selectedSpec && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-card rounded-2xl border border-border overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 bg-muted/30 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{selectedSpec.emoji}</span>
              <div>
                <h3 className="font-bold text-foreground">{selectedSpec.name}</h3>
                <p className="text-sm text-muted-foreground">Manufactured: {selectedSpec.year}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${conditionColors[selectedSpec.condition]}`}>
              {selectedSpec.condition.toUpperCase()}
            </span>
          </div>

          {/* Specs */}
          <div className="p-4 grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" /> Specifications
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-muted/30 rounded">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Cpu className="w-4 h-4" /> CPU
                  </span>
                  <span className="text-foreground">{selectedSpec.cpu}</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/30 rounded">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <MemoryStick className="w-4 h-4" /> RAM
                  </span>
                  <span className="text-foreground">{selectedSpec.ram}</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/30 rounded">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <HardDrive className="w-4 h-4" /> Storage
                  </span>
                  <span className="text-foreground">{selectedSpec.storage}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" /> Detected Issues
              </h4>
              <div className="space-y-2">
                {selectedSpec.issues.map((issue, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-2 p-2 bg-red-500/10 rounded text-sm"
                  >
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-red-300">{issue}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Verdict */}
          <div className="p-4 bg-muted/30 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>💡</span>
                <span>This PC can be saved! A few upgrades will give it 3-5 more years of life.</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onContinue}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90"
              >
                Start Repairs →
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
