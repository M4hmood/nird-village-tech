import { useGame } from '@/context/GameContext';
import { ProgressBar } from '@/components/game/ProgressBar';
import { TechMentor } from '@/components/game/TechMentor';
import { ModeSelector } from '@/components/game/ModeSelector';
import { SchoolMap } from '@/components/game/SchoolMap';
import { PCInspection } from '@/components/game/PCInspection';
import { Workbench } from '@/components/game/Workbench';
import { BloatwareShooter } from '@/components/game/BloatwareShooter';
import { OSCard } from '@/components/game/OSCard';
import { ScoreDisplay } from '@/components/game/ScoreDisplay';
import { ResourceDisplay } from '@/components/game/ResourceDisplay';
import { ChallengeMode } from '@/components/game/ChallengeMode';
import { ArcadeMode } from '@/components/game/ArcadeMode';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Home, RotateCcw, Map, Gamepad2 } from 'lucide-react';

const osOptions = [
  { role: 'student', name: 'Student Station', distro: 'Linux Mint', description: 'Perfect for learning and homework', technicalDescription: 'Cinnamon DE, apt package manager, educational repos enabled', tools: ['LibreOffice', 'Firefox', 'GCompris', 'Scratch'], benefits: ['Privacy', 'Light', 'Educational'] },
  { role: 'teacher', name: 'Teacher Suite', distro: 'Ubuntu LTS', description: 'Full-featured for lesson planning', technicalDescription: 'GNOME 42, Snap/Flatpak support, PPAs for multimedia', tools: ['LibreOffice', 'GIMP', 'OBS', 'Moodle'], benefits: ['Stable', 'Versatile', 'Secure'] },
  { role: 'admin', name: 'Admin Workstation', distro: 'Debian', description: 'Rock-solid for administration', technicalDescription: 'Minimal install, UFW firewall, unattended-upgrades', tools: ['Thunderbird', 'KeePassXC', 'Remmina'], benefits: ['Reliable', 'Secure', 'Long-term'] },
  { role: 'technician', name: 'Tech Expert', distro: 'Arch Linux', description: 'Advanced for IT maintenance', technicalDescription: 'Rolling release, pacman/AUR, systemd-boot', tools: ['Terminal', 'Clonezilla', 'Wireshark'], benefits: ['Powerful', 'Flexible', 'Current'] },
  { role: 'library', name: 'Public Access', distro: 'Endless OS', description: 'Simple kiosk mode for libraries', technicalDescription: 'OSTree-based, read-only root, Flatpak apps only', tools: ['Browser', 'Ebooks', 'Wikipedia'], benefits: ['Simple', 'Safe', 'Offline'] },
];

const themes = ['🌊 Ocean', '🌲 Forest', '🌅 Sunset', '🌙 Night', '🎨 Retro'];
const appPackages = ['📚 Education', '🎨 Creative', '🔬 Science', '🎮 Coding', '📖 Reader'];
const restrictions = ['🔒 No Social', '⏰ Time Limit', '🛡️ Safe Mode', '📵 No Downloads'];

const phaseSteps: Record<string, number> = {
  'mode-select': 0,
  map: 1,
  inspect: 2,
  workbench: 3,
  os: 4,
  shooter: 5,
  customize: 6,
  result: 7,
  challenge: 3,
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
    addXP,
  } = useGame();
  const navigate = useNavigate();

  const currentStep = phaseSteps[state.currentPhase] || 0;

  const getMentorMessage = () => {
    const messages: Record<string, { simple: string; technical: string }> = {
      'mode-select': {
        simple: "Hey there, tech hero! 🎮 Ready to save some computers? Pick your style!",
        technical: "Welcome, technician. Select your expertise level and preferred game mode to begin system recovery operations.",
      },
      map: {
        simple: "Welcome to the school! 🏫 Each room needs your help. Which one first?",
        technical: "School network topology loaded. Select a deployment zone. Each zone has specific hardware requirements and distro compatibility.",
      },
      inspect: {
        simple: "Let's check this computer! 🔍 See what's broken before we fix it.",
        technical: "Running hardware diagnostics. Check lspci, lsusb, and dmesg outputs to identify failing components.",
      },
      workbench: {
        simple: "Time for repairs! 🔧 Drag parts to the right spots. Don't mix them up!",
        technical: "Component installation phase. Match form factors: DDR4 to DIMM slots, SATA to storage bay, M.2 to NVMe slot.",
      },
      os: {
        simple: "Hardware ready! 🐧 Pick the best Linux for this room.",
        technical: "Storage formatted. Select appropriate distro based on use case, hardware specs, and maintenance requirements.",
      },
      shooter: {
        simple: "Installing Linux... but watch out! 👾 Big Tech bloatware incoming!",
        technical: "Package installation in progress. Intercept and terminate proprietary telemetry and adware processes.",
      },
      customize: {
        simple: "Almost done! 🎨 Make it look cool and add the right apps.",
        technical: "Post-install configuration. Set DE theme, install flatpaks from approved repos, configure PAM and polkit rules.",
      },
      result: {
        simple: "Mission complete! 🎉 You saved another computer from the junkyard!",
        technical: "Deployment successful. System metrics logged. Environmental impact calculated based on lifecycle analysis.",
      },
      challenge: {
        simple: "Challenge time! 🏆 Show off your skills!",
        technical: "Challenge mode engaged. Performance metrics will be recorded and compared against baseline benchmarks.",
      },
    };
    const phase = state.currentPhase;
    return messages[phase]?.[state.difficultyMode] || messages[phase]?.simple || "Let's go!";
  };

  const handleModeStart = () => {
    if (state.gameMode === 'challenge') {
      setPhase('challenge');
    } else {
      setPhase('map');
    }
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
      addXP(100);
    }
    setPhase('result');
  };

  const handleArcadeGameOver = (score: number) => {
    addXP(Math.floor(score / 10));
    setPhase('result');
  };

  const handleBackToMap = () => {
    setPhase('map');
  };

  const handleBackToModeSelect = () => {
    setPhase('mode-select');
  };

  const handleRestart = () => {
    resetGame();
    navigate('/');
  };

  const savings = calculateSavings();

  return (
    <div className="min-h-screen bg-background scanline">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Progress */}
        {state.currentPhase !== 'mode-select' && (
          <ProgressBar currentStep={currentStep} totalSteps={8} />
        )}

        {/* Resources */}
        {!['mode-select', 'map', 'challenge'].includes(state.currentPhase) && <ResourceDisplay />}

        {/* Mentor */}
        <TechMentor
          message={getMentorMessage()}
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
            {/* Mode Selection */}
            {state.currentPhase === 'mode-select' && (
              <ModeSelector onStart={handleModeStart} />
            )}

            {/* Challenge Mode */}
            {state.currentPhase === 'challenge' && (
              <ChallengeMode onBack={handleBackToModeSelect} />
            )}

            {/* Map Phase */}
            {state.currentPhase === 'map' && (
              <>
                {state.gameMode === 'arcade' ? (
                  <ArcadeMode 
                    onGameOver={handleArcadeGameOver}
                    onBack={handleBackToModeSelect}
                  />
                ) : (
                  <SchoolMap onSelectRoom={handleRoomSelect} />
                )}
              </>
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
                    description={state.difficultyMode === 'technical' ? os.technicalDescription : os.description}
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
                  <h3 className="text-lg text-primary neon-glow mb-3">THEME</h3>
                  <div className="flex flex-wrap gap-2">
                    {themes.map((theme) => (
                      <Button
                        key={theme}
                        variant={state.customizations.theme === theme ? 'default' : 'outline'}
                        onClick={() => setCustomizations({ ...state.customizations, theme })}
                        className="border-2"
                      >
                        {theme}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg text-secondary neon-glow-pink mb-3">APP PACKAGES</h3>
                  <div className="flex flex-wrap gap-2">
                    {appPackages.map((app) => (
                      <Button
                        key={app}
                        variant={state.customizations.apps.includes(app) ? 'default' : 'outline'}
                        onClick={() => {
                          const apps = state.customizations.apps.includes(app)
                            ? state.customizations.apps.filter(a => a !== app)
                            : [...state.customizations.apps, app];
                          setCustomizations({ ...state.customizations, apps });
                        }}
                        className="border-2"
                      >
                        {app}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg text-accent neon-glow-cyan mb-3">RESTRICTIONS</h3>
                  <div className="flex flex-wrap gap-2">
                    {restrictions.map((restriction) => (
                      <Button
                        key={restriction}
                        variant={state.customizations.restrictions.includes(restriction) ? 'default' : 'outline'}
                        onClick={() => {
                          const newRestrictions = state.customizations.restrictions.includes(restriction)
                            ? state.customizations.restrictions.filter(r => r !== restriction)
                            : [...state.customizations.restrictions, restriction];
                          setCustomizations({ ...state.customizations, restrictions: newRestrictions });
                        }}
                        className="border-2"
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
                    <Button onClick={handleCustomizationComplete} className="pixel-button animate-pulse-glow">
                      COMPLETE SETUP <ArrowRight className="w-4 h-4 ml-2" />
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
                  className="mt-8 p-6 border-4 border-primary bg-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <h3 className="text-xl text-primary neon-glow mb-4">MISSION REPORT</h3>
                  <div className="grid md:grid-cols-2 gap-4 font-pixel">
                    <div className="space-y-2 text-muted-foreground">
                      <p>🏫 Room: <span className="text-foreground">{state.rooms.find(r => r.id === state.currentRoom)?.name || 'Arcade'}</span></p>
                      <p>🖥️ Machine: <span className="text-foreground">{state.machine || 'Various'}</span></p>
                      <p>🔧 Components: <span className="text-foreground">{Object.keys(state.placedComponents).length}</span></p>
                      <p>🐧 OS: <span className="text-foreground">{osOptions.find(o => o.role === state.selectedOS)?.distro || 'N/A'}</span></p>
                    </div>
                    <div className="space-y-2 text-muted-foreground">
                      <p>👾 Bloatware: <span className="text-foreground">{state.bloatwareDestroyed}</span></p>
                      <p>🌱 Carbon: <span className="text-primary">{savings.carbon}kg CO₂</span></p>
                      <p>💰 Saved: <span className="text-secondary">€{savings.money}</span></p>
                      <p>🛡️ Resistance: <span className="text-accent">{state.resistanceScore}</span></p>
                      <p>🔥 Max Combo: <span className="text-neon-orange">{state.maxCombo}x</span></p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t-4 border-primary">
          <Button
            variant="outline"
            onClick={
              state.currentPhase === 'result' ? handleRestart : 
              state.currentPhase === 'mode-select' ? handleRestart :
              state.currentPhase === 'map' ? handleBackToModeSelect :
              handleBackToMap
            }
            className="border-2"
          >
            {state.currentPhase === 'result' ? (
              <>
                <RotateCcw className="w-4 h-4 mr-2" />
                PLAY AGAIN
              </>
            ) : state.currentPhase === 'mode-select' ? (
              <>
                <Home className="w-4 h-4 mr-2" />
                HOME
              </>
            ) : state.currentPhase === 'map' ? (
              <>
                <Gamepad2 className="w-4 h-4 mr-2" />
                MODES
              </>
            ) : (
              <>
                <Map className="w-4 h-4 mr-2" />
                MAP
              </>
            )}
          </Button>

          {state.currentPhase === 'result' && (
            <Button onClick={handleBackToMap} className="pixel-button">
              <Map className="w-4 h-4 mr-2" />
              NEXT ROOM
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}