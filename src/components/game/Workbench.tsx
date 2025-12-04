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
  const { state, placeComponent, addMistake, spendBudget, incrementCombo, resetCombo } = useGame();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  const availableItems = state.availableComponents.filter(
    c => !Object.values(state.placedComponents).includes(c.id)
  );

  const isComplete = Object.keys(state.placedComponents).length >= 3;
  const showTechnical = state.difficultyMode === 'technical';

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

    if (!spendBudget(component.cost)) {
      setFeedback({ type: 'error', message: 'NOT ENOUGH BUDGET! 💸' });
      toast.error('Not enough budget for this component!');
      setTimeout(() => setFeedback(null), 2000);
      return;
    }

    const success = placeComponent(draggedItem, slotId);
    
    if (success) {
      setFeedback({ type: 'success', message: `${component.name} INSTALLED! ✨` });
      toast.success(`${component.name} installed correctly!`);
      incrementCombo();
    } else {
      addMistake();
      resetCombo();
      setFeedback({ type: 'error', message: 'WRONG SLOT! TRY AGAIN! ⚡' });
      toast.error("That doesn't go there! Try another slot.");
    }
    
    setTimeout(() => setFeedback(null), 2000);
    setDraggedItem(null);
    setHoveredSlot(null);
  }, [draggedItem, state.availableComponents, placeComponent, addMistake, spendBudget, incrementCombo, resetCombo]);

  const getSlotComponent = (slotId: string) => {
    const componentId = state.placedComponents[slotId];
    return state.availableComponents.find(c => c.id === componentId);
  };

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="flex justify-between items-center p-4 border-4 border-primary bg-card">
        <div className="flex gap-6 font-pixel">
          <div className="text-center">
            <div className="text-2xl text-neon-yellow">€{state.budget}</div>
            <div className="text-xs text-muted-foreground">BUDGET</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl ${state.workbenchMistakes > 0 ? 'text-destructive' : 'text-primary'}`}>
              {state.workbenchMistakes}
            </div>
            <div className="text-xs text-muted-foreground">MISTAKES</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-primary neon-glow">
              {Object.keys(state.placedComponents).length}/3
            </div>
            <div className="text-xs text-muted-foreground">INSTALLED</div>
          </div>
          {state.currentCombo > 1 && (
            <div className="text-center">
              <div className="text-2xl text-secondary neon-glow-pink">{state.currentCombo}x</div>
              <div className="text-xs text-muted-foreground">COMBO</div>
            </div>
          )}
        </div>
        
        {isComplete && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={onComplete}
            className="pixel-button"
          >
            CONTINUE →
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
            className={`p-4 text-center font-pixel border-4 ${
              feedback.type === 'success' 
                ? 'bg-primary/20 text-primary border-primary' 
                : 'bg-destructive/20 text-destructive border-destructive'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle2 className="inline w-5 h-5 mr-2" /> : <AlertTriangle className="inline w-5 h-5 mr-2" />}
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Motherboard */}
        <div className="relative aspect-square bg-card border-4 border-primary overflow-hidden">
          {/* Circuit pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id="circuit" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 20h40M20 0v40" stroke="hsl(120 100% 50%)" strokeWidth="0.5" fill="none"/>
                <circle cx="20" cy="20" r="2" fill="hsl(120 100% 50%)"/>
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
                className={`absolute border-2 transition-all flex items-center justify-center ${
                  placedComponent
                    ? 'bg-primary/30 border-primary'
                    : isHovered
                    ? 'bg-secondary/30 border-secondary scale-110'
                    : 'bg-muted/30 border-muted border-dashed'
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
                  <span className="text-[10px] text-muted-foreground text-center px-1 font-pixel">{slot.name}</span>
                )}
              </motion.div>
            );
          })}

          {/* Central chip decoration */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-muted border-2 border-primary flex items-center justify-center">
            <span className="text-xs text-primary font-pixel">CPU</span>
          </div>
        </div>

        {/* Inventory */}
        <div className="space-y-4">
          <h3 className="text-lg text-primary font-pixel neon-glow">🧰 INVENTORY</h3>
          <p className="text-sm text-muted-foreground font-pixel">
            {showTechnical 
              ? 'Match component form factors to correct slots. DDR4→DIMM, SATA→Storage, PCIe→Expansion'
              : 'Drag components to the correct slots on the motherboard. Install at least 3 to continue!'
            }
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {availableItems.map(component => (
              <motion.div
                key={component.id}
                draggable
                onDragStart={() => handleDragStart(component.id)}
                onDragEnd={handleDragEnd}
                className={`p-4 border-4 bg-card cursor-grab active:cursor-grabbing transition-all ${
                  draggedItem === component.id 
                    ? 'opacity-50 scale-95 border-muted' 
                    : 'border-muted hover:border-primary'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-3xl mb-2">{component.icon}</div>
                <div className="text-foreground text-sm font-pixel">{component.name}</div>
                <div className="text-xs text-neon-yellow font-pixel mt-1">💰 €{component.cost}</div>
                <div className="text-xs text-primary font-pixel mt-1">🌱 -{component.impact.environmental}kg CO₂</div>
                {showTechnical && component.technicalInfo && (
                  <div className="text-[10px] text-muted-foreground font-pixel mt-2 leading-tight">
                    {component.technicalInfo}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {availableItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground font-pixel">
              <span className="text-4xl">✅</span>
              <p className="mt-2">ALL COMPONENTS PLACED!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}