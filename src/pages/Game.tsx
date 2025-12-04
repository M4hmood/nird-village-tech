import { useGame } from '@/context/GameContext';
import { ProgressBar } from '@/components/game/ProgressBar';
import { TechMentor } from '@/components/game/TechMentor';
import { SchoolMap } from '@/components/game/SchoolMap';
import { PCInspection } from '@/components/game/PCInspection';
import { Workbench } from '@/components/game/Workbench';
import { BloatwareShooter } from '@/components/game/BloatwareShooter';
import { OSCard } from '@/components/game/OSCard';
import { ScoreDisplay } from '@/components/game/ScoreDisplay';
import { ResourceDisplay } from '@/components/game/ResourceDisplay';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Home, RotateCcw, Map } from 'lucide-react';

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

const phaseSteps: Record<string, number> = {
  map: 0,
  inspect: 1,
  workbench: 2,
  os: 3,
  shooter: 4,
  customize: 5,
  result: 6,
};

export default function Game() {
  const { 
    state, 
    setPhase, 
    selectMachine, 
    selectRoom,
    selectOS, 
    setCustomizations, 
    resetGame,
    completeRoom,
    calculateSavings,
  } = useGame();
  const navigate = useNavigate();

  const currentStep = phaseSteps[state.currentPhase] || 0;

  const mentorMessages: Record<string, string> = {
    map: "Welcome to the school! 🏫 Choose a room to liberate from Big Tech. Each room has different challenges!",
    inspect: "Let's diagnose this machine! 🔍 Check the specs and issues before we start repairs.",
    workbench: "Time for the fun part! 🔧 Drag components to the correct slots on the motherboard. Be careful - wrong placements cost time!",
    os: "The hardware is ready! 🐧 Now choose the right Linux distribution for this room's needs.",
    shooter: "Installing Linux... but wait! 👾 Big Tech bloatware is trying to sneak in! Click to destroy them!",
    customize: "Almost there! 🎨 Let's customize this machine for its new purpose.",
    result: "Mission accomplished! 🎉 You've saved another computer from the e-waste pile!"
  };

  const handleRoomSelect = (roomId: string) => {
    selectRoom(roomId);
    setPhase('inspect');
  };

  const handleMachineSelect = (type: typeof state.machine) => {
    selectMachine(type);
  };

  const handleWorkbenchComplete = () => {
    setPhase('os');
  };

  const handleOSSelect = (os: string) => {
    selectOS(os);
    setPhase('shooter');
  };

  const handleShooterComplete = () => {
    setPhase('customize');
  };

  const handleCustomizationComplete = () => {
    if (state.currentRoom) {
      completeRoom(state.currentRoom);
    }
    setPhase('result');
  };

  const handleBackToMap = () => {
    setPhase('map');
  };

  const handleRestart = () => {
    resetGame();
    navigate('/');
  };

  const savings = calculateSavings();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Progress */}
        <ProgressBar currentStep={currentStep} totalSteps={7} />

        {/* Resources */}
        {state.currentPhase !== 'map' && <ResourceDisplay />}

        {/* Mentor */}
        <TechMentor
          message={mentorMessages[state.currentPhase]}
          mood={state.currentPhase === 'result' ? 'proud' : state.currentPhase === 'shooter' ? 'excited' : 'happy'}
        />

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentPhase}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            {/* Map Phase */}
            {state.currentPhase === 'map' && (
              <SchoolMap onSelectRoom={handleRoomSelect} />
            )}

            {/* Inspection Phase */}
            {state.currentPhase === 'inspect' && (
              <PCInspection 
                onSelectMachine={handleMachineSelect}
                onContinue={() => setPhase('workbench')}
              />
            )}

            {/* Workbench Phase */}
            {state.currentPhase === 'workbench' && (
              <Workbench onComplete={handleWorkbenchComplete} />
            )}

            {/* OS Selection Phase */}
            {state.currentPhase === 'os' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {osOptions.map((os, index) => (
                  <OSCard
                    key={os.role}
                    {...os}
                    isSelected={state.selectedOS === os.role}
                    onClick={() => handleOSSelect(os.role)}
                    index={index}
                  />
                ))}
              </div>
            )}

            {/* Shooter Phase */}
            {state.currentPhase === 'shooter' && (
              <BloatwareShooter onComplete={handleShooterComplete} />
            )}

            {/* Customization Phase */}
            {state.currentPhase === 'customize' && (
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
                          const newRestrictions = state.customizations.restrictions.includes(restriction)
                            ? state.customizations.restrictions.filter(r => r !== restriction)
                            : [...state.customizations.restrictions, restriction];
                          setCustomizations({ ...state.customizations, restrictions: newRestrictions });
                        }}
                      >
                        {restriction}
                      </Button>
                    ))}
                  </div>
                </div>

                {state.customizations.theme && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center"
                  >
                    <Button variant="hero" onClick={handleCustomizationComplete}>
                      Complete Setup <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                )}
              </div>
            )}

            {/* Results Phase */}
            {state.currentPhase === 'result' && (
              <div>
                <ScoreDisplay
                  environmental={state.score.environmental}
                  money={state.score.money}
                  autonomy={state.score.autonomy + state.shooterScore}
                  hardware={state.score.hardware}
                />
                
                <motion.div
                  className="mt-8 p-6 rounded-2xl bg-card border border-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <h3 className="text-xl font-bold text-foreground mb-4">📋 Mission Summary</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2 text-muted-foreground">
                      <p>🏫 Room liberated: <span className="text-foreground font-medium">{state.rooms.find(r => r.id === state.currentRoom)?.name}</span></p>
                      <p>🖥️ Machine rescued: <span className="text-foreground font-medium">{state.machine}</span></p>
                      <p>🔧 Components installed: <span className="text-foreground font-medium">{Object.keys(state.placedComponents).length}</span></p>
                      <p>🐧 OS installed: <span className="text-foreground font-medium">{osOptions.find(o => o.role === state.selectedOS)?.distro}</span></p>
                    </div>
                    <div className="space-y-2 text-muted-foreground">
                      <p>👾 Bloatware destroyed: <span className="text-foreground font-medium">{state.bloatwareDestroyed}</span></p>
                      <p>🌱 Carbon saved: <span className="text-green-400 font-medium">{savings.carbon}kg CO₂</span></p>
                      <p>💰 Money saved: <span className="text-yellow-400 font-medium">€{savings.money}</span></p>
                      <p>🛡️ Resistance score: <span className="text-primary font-medium">{state.resistanceScore}</span></p>
                    </div>
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
            onClick={state.currentPhase === 'result' ? handleRestart : state.currentPhase === 'map' ? handleRestart : handleBackToMap}
          >
            {state.currentPhase === 'result' ? (
              <>
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Again
              </>
            ) : state.currentPhase === 'map' ? (
              <>
                <Home className="w-4 h-4 mr-2" />
                Home
              </>
            ) : (
              <>
                <Map className="w-4 h-4 mr-2" />
                Back to Map
              </>
            )}
          </Button>

          {state.currentPhase === 'result' && (
            <Button variant="warm" onClick={handleBackToMap}>
              <Map className="w-4 h-4 mr-2" />
              Continue to Next Room
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
