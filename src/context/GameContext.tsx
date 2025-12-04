import React, { createContext, useContext, useState, ReactNode } from 'react';

export type MachineType = 'laptop' | 'desktop' | 'thin-client' | 'tablet' | null;
export type UserRole = 'student' | 'teacher' | 'admin' | 'technician' | 'library' | null;

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

export interface GameState {
  step: number;
  machine: MachineType;
  role: UserRole;
  repairs: RepairAction[];
  selectedOS: string | null;
  customizations: {
    theme: string;
    apps: string[];
    restrictions: string[];
  };
  score: {
    environmental: number;
    money: number;
    autonomy: number;
    hardware: number;
  };
}

interface GameContextType {
  state: GameState;
  setStep: (step: number) => void;
  selectMachine: (machine: MachineType) => void;
  selectRole: (role: UserRole) => void;
  completeRepair: (repairId: string) => void;
  selectOS: (os: string) => void;
  setCustomizations: (customizations: GameState['customizations']) => void;
  resetGame: () => void;
}

const initialState: GameState = {
  step: 0,
  machine: null,
  role: null,
  repairs: [
    { id: 'ram', name: 'Add RAM', icon: '🧠', completed: false, impact: { environmental: 15, money: 30, lifespan: 2 } },
    { id: 'ssd', name: 'Replace with SSD', icon: '💾', completed: false, impact: { environmental: 20, money: 50, lifespan: 3 } },
    { id: 'clean', name: 'Clean Dust', icon: '🧹', completed: false, impact: { environmental: 10, money: 0, lifespan: 1 } },
    { id: 'battery', name: 'Replace Battery', icon: '🔋', completed: false, impact: { environmental: 25, money: 40, lifespan: 2 } },
    { id: 'thermal', name: 'Apply Thermal Paste', icon: '🌡️', completed: false, impact: { environmental: 5, money: 5, lifespan: 1 } },
  ],
  selectedOS: null,
  customizations: {
    theme: '',
    apps: [],
    restrictions: [],
  },
  score: {
    environmental: 0,
    money: 0,
    autonomy: 0,
    hardware: 0,
  },
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);

  const setStep = (step: number) => {
    setState(prev => ({ ...prev, step }));
  };

  const selectMachine = (machine: MachineType) => {
    setState(prev => ({ ...prev, machine }));
  };

  const selectRole = (role: UserRole) => {
    setState(prev => ({ ...prev, role }));
  };

  const completeRepair = (repairId: string) => {
    setState(prev => {
      const repairs = prev.repairs.map(r =>
        r.id === repairId ? { ...r, completed: !r.completed } : r
      );
      const completedRepairs = repairs.filter(r => r.completed);
      const score = {
        environmental: completedRepairs.reduce((acc, r) => acc + r.impact.environmental, 0),
        money: completedRepairs.reduce((acc, r) => acc + r.impact.money, 0),
        autonomy: prev.score.autonomy,
        hardware: completedRepairs.length * 20,
      };
      return { ...prev, repairs, score };
    });
  };

  const selectOS = (os: string) => {
    setState(prev => ({
      ...prev,
      selectedOS: os,
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

  const resetGame = () => {
    setState(initialState);
  };

  return (
    <GameContext.Provider
      value={{
        state,
        setStep,
        selectMachine,
        selectRole,
        completeRepair,
        selectOS,
        setCustomizations,
        resetGame,
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
