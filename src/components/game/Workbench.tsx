import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface Slot {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const motherboardSlots: Slot[] = [
  { id: 'ram-slot', name: 'RAM Slot', x: 20, y: 15, width: 15, height: 8 },
  { id: 'storage-slot', name: 'SATA Port', x: 70, y: 70, width: 18, height: 10 },
  { id: 'cpu-slot', name: 'CPU Socket', x: 40, y: 40, width: 20, height: 20 },
  { id: 'pcie-slot', name: 'PCIe Slot', x: 15, y: 70, width: 25, height: 8 },
  { id: 'battery-slot', name: 'Battery Bay', x: 70, y: 20, width: 18, height: 15 },
];

interface WorkbenchProps {
  onComplete: () => void;
}

export function Workbench({ onComplete }: WorkbenchProps) {
  const { state, placeComponent, addMistake, spendBudget } = useGame();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  const availableItems = state.availableComponents.filter(
    c => !Object.values(state.placedComponents).includes(c.id)
  );

  const isComplete = Object.keys(state.placedComponents).length >= 3;

  const handleDragStart = useCallback((componentId: string) => {
    setDraggedItem(componentId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setHoveredSlot(null);
  }, []);

  const handleDrop = useCallback((slotId: string) => {
    if (!draggedItem) return;
    
    const component = state.availableComponents.find(c => c.id === draggedItem);
    if (!component) return;

    // Check budget
    if (!spendBudget(component.cost)) {
      setFeedback({ type: 'error', message: 'Not enough budget! 💸' });
      toast.error('Not enough budget for this component!');
      setTimeout(() => setFeedback(null), 2000);
      return;
    }

    const success = placeComponent(draggedItem, slotId);
    
    if (success) {
      setFeedback({ type: 'success', message: `${component.name} installed! ✨` });
      toast.success(`${component.name} installed correctly!`);
    } else {
      addMistake();
      setFeedback({ type: 'error', message: 'Wrong slot! Try again! ⚡' });
      toast.error("That doesn't go there! Try another slot.");
    }
    
    setTimeout(() => setFeedback(null), 2000);
    setDraggedItem(null);
    setHoveredSlot(null);
  }, [draggedItem, state.availableComponents, placeComponent, addMistake, spendBudget]);

  const getSlotComponent = (slotId: string) => {
    const componentId = state.placedComponents[slotId];
    return state.availableComponents.find(c => c.id === componentId);
  };

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="flex justify-between items-center p-4 bg-card rounded-xl border border-border">
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">€{state.budget}</div>
            <div className="text-xs text-muted-foreground">Budget</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{state.workbenchMistakes}</div>
            <div className="text-xs text-muted-foreground">Mistakes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {Object.keys(state.placedComponents).length}/3
            </div>
            <div className="text-xs text-muted-foreground">Installed</div>
          </div>
        </div>
        
        {isComplete && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={onComplete}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors"
          >
            Continue →
          </motion.button>
        )}
      </div>

      {/* Feedback message */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-xl text-center font-bold ${
              feedback.type === 'success' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                : 'bg-red-500/20 text-red-400 border border-red-500/50'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle2 className="inline w-5 h-5 mr-2" /> : <AlertTriangle className="inline w-5 h-5 mr-2" />}
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Motherboard */}
        <div className="relative aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-4 border-slate-600 overflow-hidden">
          {/* Circuit pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id="circuit" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 20h40M20 0v40" stroke="#4ade80" strokeWidth="0.5" fill="none"/>
                <circle cx="20" cy="20" r="2" fill="#4ade80"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#circuit)"/>
            </svg>
          </div>

          {/* Slots */}
          {motherboardSlots.map(slot => {
            const placedComponent = getSlotComponent(slot.id);
            const isHovered = hoveredSlot === slot.id && draggedItem;
            
            return (
              <motion.div
                key={slot.id}
                className={`absolute rounded-lg border-2 transition-all flex items-center justify-center ${
                  placedComponent
                    ? 'bg-primary/30 border-primary'
                    : isHovered
                    ? 'bg-yellow-500/30 border-yellow-500 scale-110'
                    : 'bg-slate-700/50 border-slate-500 border-dashed'
                }`}
                style={{
                  left: `${slot.x}%`,
                  top: `${slot.y}%`,
                  width: `${slot.width}%`,
                  height: `${slot.height}%`,
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setHoveredSlot(slot.id);
                }}
                onDragLeave={() => setHoveredSlot(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(slot.id);
                }}
                animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
              >
                {placedComponent ? (
                  <span className="text-2xl">{placedComponent.icon}</span>
                ) : (
                  <span className="text-[10px] text-slate-400 text-center px-1">{slot.name}</span>
                )}
              </motion.div>
            );
          })}

          {/* Central chip decoration */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slate-700 rounded border-2 border-slate-500 flex items-center justify-center">
            <span className="text-xs text-slate-400 font-mono">CPU</span>
          </div>
        </div>

        {/* Inventory */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">🧰 Component Inventory</h3>
          <p className="text-sm text-muted-foreground">
            Drag components to the correct slots on the motherboard. Install at least 3 to continue!
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {availableItems.map(component => (
              <motion.div
                key={component.id}
                draggable
                onDragStart={() => handleDragStart(component.id)}
                onDragEnd={handleDragEnd}
                className={`p-4 rounded-xl bg-card border-2 border-border cursor-grab active:cursor-grabbing transition-all ${
                  draggedItem === component.id ? 'opacity-50 scale-95' : 'hover:border-primary hover:shadow-lg'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-3xl mb-2">{component.icon}</div>
                <div className="font-bold text-foreground text-sm">{component.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  💰 €{component.cost}
                </div>
                <div className="text-xs text-green-400 mt-1">
                  🌱 -{component.impact.environmental}kg CO₂
                </div>
              </motion.div>
            ))}
          </div>

          {availableItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <span className="text-4xl">✅</span>
              <p className="mt-2">All components placed!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
