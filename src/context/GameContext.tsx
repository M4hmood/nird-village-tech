import React, { createContext, useContext, useState, ReactNode } from 'react';

export type MachineType = 'laptop' | 'desktop' | 'thin-client' | 'tablet' | null;
export type UserRole = 'student' | 'teacher' | 'admin' | 'technician' | 'library' | null;

// Legacy type for backwards compatibility
export interface RepairAction {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
  impact: {
    environmental: number;
    money: number;
    lifespan: number;
  };
}

export interface RepairComponent {
  id: string;
  name: string;
  icon: string;
  targetSlot: string;
  cost: number;
  impact: {
    environmental: number;
    money: number;
    lifespan: number;
  };
}

export interface Room {
  id: string;
  name: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  requiredDistro: string[];
  completed: boolean;
  machines: number;
}

export interface GameState {
  step: number;
  currentPhase: 'map' | 'inspect' | 'workbench' | 'os' | 'shooter' | 'customize' | 'result';
  machine: MachineType;
  role: UserRole;
  selectedOS: string | null;
  customizations: {
    theme: string;
    apps: string[];
    restrictions: string[];
  };
  // Resource system
  budget: number;
  maxBudget: number;
  resistanceScore: number;
  // Room/Level system
  currentRoom: string | null;
  rooms: Room[];
  // Workbench state
  placedComponents: Record<string, string>;
  availableComponents: RepairComponent[];
  workbenchMistakes: number;
  // Shooter state
  shooterScore: number;
  bloatwareDestroyed: number;
  // Score
  score: {
    environmental: number;
    money: number;
    autonomy: number;
    hardware: number;
  };
  totalCarbonSaved: number;
  totalMoneySaved: number;
}

interface GameContextType {
  state: GameState;
  setStep: (step: number) => void;
  setPhase: (phase: GameState['currentPhase']) => void;
  selectMachine: (machine: MachineType) => void;
  selectRole: (role: UserRole) => void;
  selectOS: (os: string) => void;
  setCustomizations: (customizations: GameState['customizations']) => void;
  resetGame: () => void;
  // Room functions
  selectRoom: (roomId: string) => void;
  completeRoom: (roomId: string) => void;
  // Workbench functions
  placeComponent: (componentId: string, slotId: string) => boolean;
  removeComponent: (slotId: string) => void;
  addMistake: () => void;
  // Budget functions
  spendBudget: (amount: number) => boolean;
  addResistance: (amount: number) => void;
  // Shooter functions
  addShooterScore: (points: number) => void;
  destroyBloatware: () => void;
  // Calculations
  calculateSavings: () => { carbon: number; money: number };
}

const initialRooms: Room[] = [
  { id: 'library', name: 'Library', icon: '📚', difficulty: 'easy', description: 'Fix 3 web-browsing PCs for quiet study', requiredDistro: ['Endless OS', 'Linux Mint'], completed: false, machines: 3 },
  { id: 'classroom', name: 'Classroom', icon: '🏫', difficulty: 'easy', description: 'Set up student workstations', requiredDistro: ['Linux Mint', 'Ubuntu LTS'], completed: false, machines: 4 },
  { id: 'admin', name: 'Admin Office', icon: '🗄️', difficulty: 'medium', description: 'Secure systems for school records', requiredDistro: ['Debian'], completed: false, machines: 2 },
  { id: 'teachers', name: 'Teachers Lounge', icon: '☕', difficulty: 'medium', description: 'Multimedia stations for lesson prep', requiredDistro: ['Ubuntu LTS'], completed: false, machines: 3 },
  { id: 'lab', name: 'Computer Lab', icon: '🔬', difficulty: 'hard', description: 'High-performance machines for coding', requiredDistro: ['Arch Linux', 'Ubuntu LTS'], completed: false, machines: 5 },
];

const initialComponents: RepairComponent[] = [
  { id: 'ram', name: 'RAM Stick', icon: '🧠', targetSlot: 'ram-slot', cost: 30, impact: { environmental: 15, money: 30, lifespan: 2 } },
  { id: 'ssd', name: 'SSD Drive', icon: '💾', targetSlot: 'storage-slot', cost: 50, impact: { environmental: 20, money: 50, lifespan: 3 } },
  { id: 'thermal', name: 'Thermal Paste', icon: '🌡️', targetSlot: 'cpu-slot', cost: 5, impact: { environmental: 5, money: 5, lifespan: 1 } },
  { id: 'wifi', name: 'WiFi Card', icon: '📶', targetSlot: 'pcie-slot', cost: 15, impact: { environmental: 10, money: 15, lifespan: 2 } },
  { id: 'battery', name: 'New Battery', icon: '🔋', targetSlot: 'battery-slot', cost: 40, impact: { environmental: 25, money: 40, lifespan: 2 } },
];

const initialState: GameState = {
  step: 0,
  currentPhase: 'map',
  machine: null,
  role: null,
  selectedOS: null,
  customizations: {
    theme: '',
    apps: [],
    restrictions: [],
  },
  budget: 150,
  maxBudget: 150,
  resistanceScore: 0,
  currentRoom: null,
  rooms: initialRooms,
  placedComponents: {},
  availableComponents: initialComponents,
  workbenchMistakes: 0,
  shooterScore: 0,
  bloatwareDestroyed: 0,
  score: {
    environmental: 0,
    money: 0,
    autonomy: 0,
    hardware: 0,
  },
  totalCarbonSaved: 0,
  totalMoneySaved: 0,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);

  const setStep = (step: number) => {
    setState(prev => ({ ...prev, step }));
  };

  const setPhase = (currentPhase: GameState['currentPhase']) => {
    setState(prev => ({ ...prev, currentPhase }));
  };

  const selectMachine = (machine: MachineType) => {
    setState(prev => ({ ...prev, machine }));
  };

  const selectRole = (role: UserRole) => {
    setState(prev => ({ ...prev, role }));
  };

  const selectOS = (os: string) => {
    setState(prev => ({
      ...prev,
      selectedOS: os,
      resistanceScore: prev.resistanceScore + 30,
      score: { ...prev.score, autonomy: prev.score.autonomy + 30 },
    }));
  };

  const setCustomizations = (customizations: GameState['customizations']) => {
    setState(prev => ({
      ...prev,
      customizations,
      score: { ...prev.score, autonomy: prev.score.autonomy + 20 },
    }));
  };

  const selectRoom = (roomId: string) => {
    setState(prev => ({ ...prev, currentRoom: roomId }));
  };

  const completeRoom = (roomId: string) => {
    setState(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => r.id === roomId ? { ...r, completed: true } : r),
      resistanceScore: prev.resistanceScore + 50,
    }));
  };

  const placeComponent = (componentId: string, slotId: string): boolean => {
    const component = state.availableComponents.find(c => c.id === componentId);
    if (!component) return false;
    
    // Check if correct slot
    const isCorrect = component.targetSlot === slotId;
    
    if (isCorrect) {
      setState(prev => {
        const newPlaced = { ...prev.placedComponents, [slotId]: componentId };
        const placedCount = Object.keys(newPlaced).length;
        return {
          ...prev,
          placedComponents: newPlaced,
          score: {
            ...prev.score,
            environmental: prev.score.environmental + component.impact.environmental,
            hardware: placedCount * 20,
          },
          totalCarbonSaved: prev.totalCarbonSaved + (component.impact.environmental * 5),
          totalMoneySaved: prev.totalMoneySaved + (600 - component.cost),
        };
      });
      return true;
    }
    return false;
  };

  const removeComponent = (slotId: string) => {
    setState(prev => {
      const newPlaced = { ...prev.placedComponents };
      delete newPlaced[slotId];
      return { ...prev, placedComponents: newPlaced };
    });
  };

  const addMistake = () => {
    setState(prev => ({ ...prev, workbenchMistakes: prev.workbenchMistakes + 1 }));
  };

  const spendBudget = (amount: number): boolean => {
    if (state.budget >= amount) {
      setState(prev => ({ ...prev, budget: prev.budget - amount }));
      return true;
    }
    return false;
  };

  const addResistance = (amount: number) => {
    setState(prev => ({ ...prev, resistanceScore: prev.resistanceScore + amount }));
  };

  const addShooterScore = (points: number) => {
    setState(prev => ({ ...prev, shooterScore: prev.shooterScore + points }));
  };

  const destroyBloatware = () => {
    setState(prev => ({ 
      ...prev, 
      bloatwareDestroyed: prev.bloatwareDestroyed + 1,
      resistanceScore: prev.resistanceScore + 5,
    }));
  };

  const calculateSavings = () => {
    const placedCount = Object.keys(state.placedComponents).length;
    return {
      carbon: 250 + (placedCount * 50) - (state.workbenchMistakes * 10),
      money: 560 - state.availableComponents
        .filter(c => state.placedComponents[c.targetSlot] === c.id)
        .reduce((acc, c) => acc + c.cost, 0),
    };
  };

  const resetGame = () => {
    setState(initialState);
  };

  return (
    <GameContext.Provider
      value={{
        state,
        setStep,
        setPhase,
        selectMachine,
        selectRole,
        selectOS,
        setCustomizations,
        resetGame,
        selectRoom,
        completeRoom,
        placeComponent,
        removeComponent,
        addMistake,
        spendBudget,
        addResistance,
        addShooterScore,
        destroyBloatware,
        calculateSavings,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
