import React, { createContext, useContext, useState, ReactNode } from 'react';

export type MachineType = 'laptop' | 'desktop' | 'thin-client' | 'tablet' | null;
export type UserRole = 'student' | 'teacher' | 'admin' | 'technician' | 'library' | null;
export type DifficultyMode = 'simple' | 'technical';
export type GameMode = 'story' | 'arcade' | 'challenge';

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
  description?: string;
  technicalInfo?: string;
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
  technicalDescription?: string;
  requiredDistro: string[];
  completed: boolean;
  machines: number;
  // Game modes available for this room
  modes: GameMode[];
  // High scores per mode
  highScores: Record<GameMode, number>;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'speed' | 'accuracy' | 'survival' | 'puzzle';
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
  targetScore: number;
  reward: number;
  completed: boolean;
}

export interface GameState {
  step: number;
  currentPhase: 'mode-select' | 'map' | 'inspect' | 'workbench' | 'os' | 'shooter' | 'customize' | 'result' | 'challenge';
  difficultyMode: DifficultyMode;
  gameMode: GameMode;
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
  // XP and leveling
  playerLevel: number;
  totalXP: number;
  xpToNextLevel: number;
  // Room/Level system
  currentRoom: string | null;
  rooms: Room[];
  // Challenges
  challenges: Challenge[];
  currentChallenge: string | null;
  // Workbench state
  placedComponents: Record<string, string>;
  availableComponents: RepairComponent[];
  workbenchMistakes: number;
  workbenchTimeBonus: number;
  // Shooter state
  shooterScore: number;
  bloatwareDestroyed: number;
  perfectInstalls: number;
  // Combo system
  currentCombo: number;
  maxCombo: number;
  // Score
  score: {
    environmental: number;
    money: number;
    autonomy: number;
    hardware: number;
  };
  totalCarbonSaved: number;
  totalMoneySaved: number;
  totalMachinesFixed: number;
  showLevelUp: boolean;
}

interface GameContextType {
  state: GameState;
  setStep: (step: number) => void;
  setPhase: (phase: GameState['currentPhase']) => void;
  setDifficultyMode: (mode: DifficultyMode) => void;
  setGameMode: (mode: GameMode) => void;
  selectMachine: (machine: MachineType) => void;
  selectRole: (role: UserRole) => void;
  selectOS: (os: string) => void;
  setCustomizations: (customizations: GameState['customizations']) => void;
  resetGame: () => void;
  // Room functions
  selectRoom: (roomId: string) => void;
  completeRoom: (roomId: string) => void;
  // Challenge functions
  startChallenge: (challengeId: string) => void;
  completeChallenge: (challengeId: string, score: number) => void;
  // Workbench functions
  placeComponent: (componentId: string, slotId: string) => boolean;
  removeComponent: (slotId: string) => void;
  addMistake: () => void;
  addTimeBonus: (seconds: number) => void;
  // Budget functions
  spendBudget: (amount: number) => boolean;
  addResistance: (amount: number) => void;
  // Shooter functions
  addShooterScore: (points: number) => void;
  destroyBloatware: () => void;
  addPerfectInstall: () => void;
  // Combo functions
  incrementCombo: () => void;
  resetCombo: () => void;
  // XP functions
  addXP: (amount: number) => void;
  // Calculations
  calculateSavings: () => { carbon: number; money: number };
  dismissLevelUp: () => void;
}

const initialRooms: Room[] = [
  {
    id: 'library',
    name: 'Library',
    icon: '📚',
    difficulty: 'easy',
    description: 'Fix 3 web-browsing PCs for quiet study',
    technicalDescription: 'Deploy lightweight Linux distros with minimal RAM usage (<512MB). Configure restricted browser kiosk mode.',
    requiredDistro: ['Endless OS', 'Linux Mint'],
    completed: false,
    machines: 3,
    modes: ['story', 'arcade'],
    highScores: { story: 0, arcade: 0, challenge: 0 }
  },
  {
    id: 'classroom',
    name: 'Classroom',
    icon: '🏫',
    difficulty: 'easy',
    description: 'Set up student workstations',
    technicalDescription: 'Install educational software stack. Configure user permissions and parental controls via PAM.',
    requiredDistro: ['Linux Mint', 'Ubuntu LTS'],
    completed: false,
    machines: 4,
    modes: ['story', 'arcade', 'challenge'],
    highScores: { story: 0, arcade: 0, challenge: 0 }
  },
  {
    id: 'admin',
    name: 'Admin Office',
    icon: '🗄️',
    difficulty: 'medium',
    description: 'Secure systems for school records',
    technicalDescription: 'Full disk encryption with LUKS. Configure AppArmor profiles. Set up automated backups via rsync.',
    requiredDistro: ['Debian'],
    completed: false,
    machines: 2,
    modes: ['story', 'challenge'],
    highScores: { story: 0, arcade: 0, challenge: 0 }
  },
  {
    id: 'teachers',
    name: 'Teachers Lounge',
    icon: '☕',
    difficulty: 'medium',
    description: 'Multimedia stations for lesson prep',
    technicalDescription: 'Configure PulseAudio for multimedia. Install codec packs. Set up network shares via Samba.',
    requiredDistro: ['Ubuntu LTS'],
    completed: false,
    machines: 3,
    modes: ['story', 'arcade'],
    highScores: { story: 0, arcade: 0, challenge: 0 }
  },
  {
    id: 'lab',
    name: 'Computer Lab',
    icon: '🔬',
    difficulty: 'hard',
    description: 'High-performance machines for coding',
    technicalDescription: 'Compile custom kernel for hardware optimization. Configure Docker environments. Set up IDE with LSP servers.',
    requiredDistro: ['Arch Linux', 'Ubuntu LTS'],
    completed: false,
    machines: 5,
    modes: ['story', 'arcade', 'challenge'],
    highScores: { story: 0, arcade: 0, challenge: 0 }
  },
];

const initialComponents: RepairComponent[] = [
  {
    id: 'ram',
    name: 'RAM Stick',
    icon: '🧠',
    targetSlot: 'ram-slot',
    cost: 30,
    description: 'More memory = more tabs!',
    technicalInfo: 'DDR4-3200 8GB DIMM. Install in paired slots for dual-channel. Check ECC compatibility.',
    impact: { environmental: 15, money: 30, lifespan: 2 }
  },
  {
    id: 'ssd',
    name: 'SSD Drive',
    icon: '💾',
    targetSlot: 'storage-slot',
    cost: 50,
    description: 'Super fast storage!',
    technicalInfo: 'SATA III 256GB SSD. Sequential read: 550MB/s. Enable TRIM via fstrim.timer.',
    impact: { environmental: 20, money: 50, lifespan: 3 }
  },
  {
    id: 'thermal',
    name: 'Thermal Paste',
    icon: '🌡️',
    targetSlot: 'cpu-slot',
    cost: 5,
    description: 'Keeps the CPU cool',
    technicalInfo: 'Arctic MX-4 compound. Apply pea-sized amount. Clean old paste with isopropyl alcohol.',
    impact: { environmental: 5, money: 5, lifespan: 1 }
  },
  {
    id: 'wifi',
    name: 'WiFi Card',
    icon: '📶',
    targetSlot: 'pcie-slot',
    cost: 15,
    description: 'Wireless connectivity',
    technicalInfo: 'Intel AX200 WiFi 6. Check kernel module: iwlwifi. May need firmware from linux-firmware.',
    impact: { environmental: 10, money: 15, lifespan: 2 }
  },
  {
    id: 'battery',
    name: 'New Battery',
    icon: '🔋',
    targetSlot: 'battery-slot',
    cost: 40,
    description: 'Hours of unplugged use',
    technicalInfo: '6-cell Li-ion 4400mAh. Calibrate with full discharge cycle. Check tlp for power management.',
    impact: { environmental: 25, money: 40, lifespan: 2 }
  },
];

const initialChallenges: Challenge[] = [
  {
    id: 'speed-run',
    name: 'Speed Technician',
    description: 'Fix a PC in under 60 seconds!',
    type: 'speed',
    difficulty: 'easy',
    timeLimit: 60,
    targetScore: 100,
    reward: 50,
    completed: false,
  },
  {
    id: 'perfect-install',
    name: 'Perfect Install',
    description: 'Install Linux with zero bloatware!',
    type: 'accuracy',
    difficulty: 'medium',
    targetScore: 500,
    reward: 100,
    completed: false,
  },
  {
    id: 'bloatware-blitz',
    name: 'Bloatware Blitz',
    description: 'Destroy 50 bloatware in survival mode!',
    type: 'survival',
    difficulty: 'hard',
    targetScore: 50,
    reward: 200,
    completed: false,
  },
  {
    id: 'component-master',
    name: 'Component Master',
    description: 'Place all components correctly without mistakes!',
    type: 'puzzle',
    difficulty: 'medium',
    targetScore: 200,
    reward: 150,
    completed: false,
  },
];

const initialState: GameState = {
  step: 0,
  currentPhase: 'mode-select',
  difficultyMode: 'simple',
  gameMode: 'story',
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
  playerLevel: 1,
  totalXP: 0,
  xpToNextLevel: 100,
  currentRoom: null,
  rooms: initialRooms,
  challenges: initialChallenges,
  currentChallenge: null,
  placedComponents: {},
  availableComponents: initialComponents,
  workbenchMistakes: 0,
  workbenchTimeBonus: 0,
  shooterScore: 0,
  bloatwareDestroyed: 0,
  perfectInstalls: 0,
  currentCombo: 0,
  maxCombo: 0,
  score: {
    environmental: 0,
    money: 0,
    autonomy: 0,
    hardware: 0,
  },
  totalCarbonSaved: 0,
  totalMoneySaved: 0,
  totalMachinesFixed: 0,
  showLevelUp: false,
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

  const setDifficultyMode = (difficultyMode: DifficultyMode) => {
    setState(prev => ({ ...prev, difficultyMode }));
  };

  const setGameMode = (gameMode: GameMode) => {
    setState(prev => ({ ...prev, gameMode }));
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
      totalMachinesFixed: prev.totalMachinesFixed + 1,
    }));
    addXP(500);
  };

  const startChallenge = (challengeId: string) => {
    setState(prev => ({ ...prev, currentChallenge: challengeId, currentPhase: 'challenge' }));
  };

  const completeChallenge = (challengeId: string, score: number) => {
    setState(prev => {
      const challenge = prev.challenges.find(c => c.id === challengeId);
      const isNewComplete = challenge && score >= challenge.targetScore && !challenge.completed;

      return {
        ...prev,
        challenges: prev.challenges.map(c =>
          c.id === challengeId && score >= c.targetScore
            ? { ...c, completed: true }
            : c
        ),
        totalXP: isNewComplete ? prev.totalXP + (challenge?.reward || 0) : prev.totalXP,
        currentChallenge: null,
      };
    });
  };

  const placeComponent = (componentId: string, slotId: string): boolean => {
    const component = state.availableComponents.find(c => c.id === componentId);
    if (!component) return false;

    const isCorrect = component.targetSlot === slotId;

    if (isCorrect) {
      setState(prev => {
        const newPlaced = { ...prev.placedComponents, [slotId]: componentId };
        const placedCount = Object.keys(newPlaced).length;
        const comboBonus = prev.currentCombo * 5;
        return {
          ...prev,
          placedComponents: newPlaced,
          currentCombo: prev.currentCombo + 1,
          maxCombo: Math.max(prev.maxCombo, prev.currentCombo + 1),
          score: {
            ...prev.score,
            environmental: prev.score.environmental + component.impact.environmental + comboBonus,
            hardware: placedCount * 20,
          },
          totalCarbonSaved: prev.totalCarbonSaved + (component.impact.environmental * 5),
          totalMoneySaved: prev.totalMoneySaved + (600 - component.cost),
        };
      });
      addXP(10);
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
    setState(prev => ({
      ...prev,
      workbenchMistakes: prev.workbenchMistakes + 1,
      currentCombo: 0,
    }));
  };

  const addTimeBonus = (seconds: number) => {
    setState(prev => ({ ...prev, workbenchTimeBonus: prev.workbenchTimeBonus + seconds }));
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
      currentCombo: prev.currentCombo + 1,
      maxCombo: Math.max(prev.maxCombo, prev.currentCombo + 1),
    }));
    addXP(5);
  };

  const addPerfectInstall = () => {
    setState(prev => ({ ...prev, perfectInstalls: prev.perfectInstalls + 1 }));
  };

  const incrementCombo = () => {
    setState(prev => ({
      ...prev,
      currentCombo: prev.currentCombo + 1,
      maxCombo: Math.max(prev.maxCombo, prev.currentCombo + 1),
    }));
  };

  const resetCombo = () => {
    setState(prev => ({ ...prev, currentCombo: 0 }));
  };

  const addXP = (amount: number) => {
    setState(prev => {
      let newXP = prev.totalXP + amount;
      let newLevel = prev.playerLevel;
      let newXPToNext = prev.xpToNextLevel;

      while (newXP >= newXPToNext) {
        newXP -= newXPToNext;
        newLevel += 1;
        newXPToNext = Math.floor(newXPToNext * 1.5);
      }

      return {
        ...prev,
        totalXP: newXP,
        playerLevel: newLevel,
        xpToNextLevel: newXPToNext,
        showLevelUp: (newLevel > prev.playerLevel) || prev.showLevelUp,
      };
    });
  };

  const dismissLevelUp = () => {
    setState(prev => ({ ...prev, showLevelUp: false }));
  };

  const calculateSavings = () => {
    const placedCount = Object.keys(state.placedComponents).length;
    return {
      carbon: 250 + (placedCount * 50) - (state.workbenchMistakes * 10) + (state.maxCombo * 5),
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
        setDifficultyMode,
        setGameMode,
        selectMachine,
        selectRole,
        selectOS,
        setCustomizations,
        resetGame,
        selectRoom,
        completeRoom,
        startChallenge,
        completeChallenge,
        placeComponent,
        removeComponent,
        addMistake,
        addTimeBonus,
        spendBudget,
        addResistance,
        addShooterScore,
        destroyBloatware,
        addPerfectInstall,
        incrementCombo,
        resetCombo,
        addXP,
        calculateSavings,
        dismissLevelUp,
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