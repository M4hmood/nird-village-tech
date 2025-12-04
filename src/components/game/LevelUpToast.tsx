import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';

export function LevelUpToast() {
    const { state, dismissLevelUp } = useGame();

    const handleDismiss = () => {
        console.log("Dismissing level up toast");
        dismissLevelUp();
    };

    return (
        <AnimatePresence>
            {state.showLevelUp && (
                <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 10 }}
                        className="bg-card border-4 border-primary p-8 rounded-xl shadow-2xl text-center relative overflow-hidden max-w-md w-full mx-4"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 animate-pulse" />

                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="mb-4 inline-block"
                        >
                            <Trophy className="w-20 h-20 text-yellow-400 drop-shadow-glow" />
                        </motion.div>

                        <h2 className="text-4xl font-display text-primary neon-glow mb-2">LEVEL UP!</h2>
                        <p className="text-xl font-pixel text-muted-foreground mb-6">
                            You reached Level <span className="text-secondary text-2xl">{state.playerLevel}</span>
                        </p>

                        <Button onClick={handleDismiss} className="pixel-button w-full pointer-events-auto relative z-[110]">
                            AWESOME!
                        </Button>
                    </motion.div>

                    {/* Confetti effects could go here */}
                </div>
            )}
        </AnimatePresence>
    );
}
