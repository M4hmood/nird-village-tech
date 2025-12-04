import { useGame } from '@/context/GameContext';
import { ProgressBar } from '@/components/game/ProgressBar';
import { TechMentor } from '@/components/game/TechMentor';
import { MachineCard } from '@/components/game/MachineCard';
import { RepairStep } from '@/components/game/RepairStep';
import { OSCard } from '@/components/game/OSCard';
import { ScoreDisplay } from '@/components/game/ScoreDisplay';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Home, RotateCcw } from 'lucide-react';

const machines = [
  { type: 'laptop' as const, name: 'Old Laptop', emoji: '💻', description: 'A trusty portable that needs some love', specs: ['Core i3', '4GB RAM', 'HDD 320GB'] },
  { type: 'desktop' as const, name: 'School Desktop', emoji: '🖥️', description: 'Classic tower PC from the computer lab', specs: ['Core 2 Duo', '2GB RAM', 'HDD 160GB'] },
  { type: 'thin-client' as const, name: 'Thin Client', emoji: '📦', description: 'Compact machine perfect for basic tasks', specs: ['Atom', '1GB RAM', 'Flash 8GB'] },
  { type: 'tablet' as const, name: 'Old Tablet', emoji: '📱', description: 'Android tablet with a cracked screen', specs: ['ARM', '2GB RAM', '16GB Storage'] },
];

const osOptions = [
  { role: 'student', name: 'Student Station', distro: 'Linux Mint', description: 'Perfect for learning and homework with a friendly interface', tools: ['LibreOffice', 'Firefox', 'GCompris', 'Scratch'], benefits: ['Privacy', 'Light', 'Educational'] },
  { role: 'teacher', name: 'Teacher Suite', distro: 'Ubuntu LTS', description: 'Full-featured system for lesson planning and presentations', tools: ['LibreOffice', 'GIMP', 'OBS', 'Moodle'], benefits: ['Stable', 'Versatile', 'Secure'] },
  { role: 'admin', name: 'Admin Workstation', distro: 'Debian', description: 'Rock-solid system for school administration', tools: ['Thunderbird', 'KeePassXC', 'Remmina'], benefits: ['Reliable', 'Secure', 'Long-term'] },
  { role: 'technician', name: 'Tech Expert', distro: 'Arch Linux', description: 'Advanced system for IT maintenance', tools: ['Terminal', 'Clonezilla', 'Wireshark'], benefits: ['Powerful', 'Flexible', 'Current'] },
  { role: 'library', name: 'Public Access', distro: 'Endless OS', description: 'Simple kiosk mode for library computers', tools: ['Browser', 'Ebooks', 'Wikipedia'], benefits: ['Simple', 'Safe', 'Offline'] },
];

const themes = ['🌊 Ocean Blue', '🌲 Forest Green', '🌅 Sunset Orange', '🌙 Night Mode', '🎨 High Contrast'];
const appPackages = ['📚 Education Pack', '🎨 Creative Suite', '🔬 Science Tools', '🎮 Coding Games', '📖 E-Reader'];
const restrictions = ['🔒 No Social Media', '⏰ Time Limits', '🛡️ Safe Browse', '📵 No Downloads'];

export default function Game() {
  const { state, setStep, selectMachine, completeRepair, selectOS, setCustomizations, resetGame } = useGame();
  const navigate = useNavigate();

  const mentorMessages = [
    "Welcome, young technician! 🌟 I'm your Tech Mentor. Together, we'll rescue old computers and give them a new purpose. Ready to build a resistant digital village?",
    "Great choice! Now let's pick a machine to save. Each one has its own story and potential. Which one speaks to you?",
    "Excellent! Now comes the fun part - diagnosis and repair! Toggle each action to fix this machine. Every repair makes a difference! 🔧",
    "The machine is ready for a new brain! Choose the right operating system based on who will use this computer. Open-source means freedom! 🐧",
    "Almost done! Let's customize the experience. Pick a theme, select useful apps, and set up any restrictions needed for school use.",
    "Mission accomplished! 🎉 Look at what you've achieved! You're now a true digital resistance hero!"
  ];

  const canProceed = () => {
    switch (state.step) {
      case 1: return state.machine !== null;
      case 2: return state.repairs.some(r => r.completed);
      case 3: return state.selectedOS !== null;
      case 4: return state.customizations.theme !== '';
      default: return true;
    }
  };

  const handleNext = () => {
    if (state.step < 5) setStep(state.step + 1);
  };

  const handleBack = () => {
    if (state.step > 0) setStep(state.step - 1);
  };

  const handleRestart = () => {
    resetGame();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Progress */}
        <ProgressBar currentStep={state.step} totalSteps={6} />

        {/* Mentor */}
        <TechMentor
          message={mentorMessages[state.step]}
          mood={state.step === 5 ? 'proud' : state.step === 0 ? 'excited' : 'happy'}
        />

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={state.step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            {/* Step 0: Introduction */}
            {state.step === 0 && (
              <div className="text-center py-12">
                <motion.div
                  className="text-8xl mb-6"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🏘️
                </motion.div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Build Your Digital Village
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Old computers don't have to become e-waste. With the right skills and open-source tools, 
                  we can extend their life and empower schools with sustainable technology.
                </p>
              </div>
            )}

            {/* Step 1: Machine Selection */}
            {state.step === 1 && (
              <div className="grid md:grid-cols-2 gap-4">
                {machines.map((machine) => (
                  <MachineCard
                    key={machine.type}
                    {...machine}
                    isSelected={state.machine === machine.type}
                    onClick={() => selectMachine(machine.type)}
                  />
                ))}
              </div>
            )}

            {/* Step 2: Repair */}
            {state.step === 2 && (
              <div className="space-y-3">
                {state.repairs.map((repair, index) => (
                  <RepairStep
                    key={repair.id}
                    repair={repair}
                    onToggle={() => completeRepair(repair.id)}
                    index={index}
                  />
                ))}
                <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary font-medium">Current Impact Score</span>
                    <span className="text-2xl font-bold text-primary">
                      {state.score.environmental + state.score.money + state.score.hardware}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: OS Selection */}
            {state.step === 3 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {osOptions.map((os, index) => (
                  <OSCard
                    key={os.role}
                    {...os}
                    isSelected={state.selectedOS === os.role}
                    onClick={() => selectOS(os.role)}
                    index={index}
                  />
                ))}
              </div>
            )}

            {/* Step 4: Customization */}
            {state.step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-3">Choose a Theme</h3>
                  <div className="flex flex-wrap gap-2">
                    {themes.map((theme) => (
                      <Button
                        key={theme}
                        variant={state.customizations.theme === theme ? 'default' : 'game'}
                        onClick={() => setCustomizations({ ...state.customizations, theme })}
                      >
                        {theme}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-foreground mb-3">App Packages</h3>
                  <div className="flex flex-wrap gap-2">
                    {appPackages.map((app) => (
                      <Button
                        key={app}
                        variant={state.customizations.apps.includes(app) ? 'default' : 'game'}
                        onClick={() => {
                          const apps = state.customizations.apps.includes(app)
                            ? state.customizations.apps.filter(a => a !== app)
                            : [...state.customizations.apps, app];
                          setCustomizations({ ...state.customizations, apps });
                        }}
                      >
                        {app}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-foreground mb-3">School Restrictions</h3>
                  <div className="flex flex-wrap gap-2">
                    {restrictions.map((restriction) => (
                      <Button
                        key={restriction}
                        variant={state.customizations.restrictions.includes(restriction) ? 'default' : 'game'}
                        onClick={() => {
                          const restrictions = state.customizations.restrictions.includes(restriction)
                            ? state.customizations.restrictions.filter(r => r !== restriction)
                            : [...state.customizations.restrictions, restriction];
                          setCustomizations({ ...state.customizations, restrictions });
                        }}
                      >
                        {restriction}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Results */}
            {state.step === 5 && (
              <div>
                <ScoreDisplay
                  environmental={state.score.environmental}
                  money={state.score.money}
                  autonomy={state.score.autonomy}
                  hardware={state.score.hardware}
                />
                
                <motion.div
                  className="mt-8 p-6 rounded-2xl bg-card border border-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <h3 className="text-xl font-bold text-foreground mb-4">📋 Mission Summary</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p>🖥️ Machine rescued: <span className="text-foreground font-medium">{machines.find(m => m.type === state.machine)?.name}</span></p>
                    <p>🔧 Repairs completed: <span className="text-foreground font-medium">{state.repairs.filter(r => r.completed).length}</span></p>
                    <p>🐧 OS installed: <span className="text-foreground font-medium">{osOptions.find(o => o.role === state.selectedOS)?.distro}</span></p>
                    <p>🎨 Theme: <span className="text-foreground font-medium">{state.customizations.theme}</span></p>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={state.step === 5 ? handleRestart : handleBack}
            disabled={state.step === 0}
          >
            {state.step === 5 ? (
              <>
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Again
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </>
            )}
          </Button>

          {state.step === 5 ? (
            <Button variant="warm" onClick={() => navigate('/')}>
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          ) : (
            <Button
              variant="hero"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {state.step === 0 ? "Let's Go!" : 'Continue'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
