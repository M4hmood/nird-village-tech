import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Recycle, Leaf, Users, Sparkles, Gamepad2, Zap } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    { icon: Recycle, title: 'REPAIR', description: 'Give old PCs new life' },
    { icon: Leaf, title: 'SUSTAIN', description: 'Reduce e-waste & carbon' },
    { icon: Users, title: 'EMPOWER', description: 'Free software for all' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden scanline">
      {/* Retro grid background */}
      <div className="fixed inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(hsl(120 100% 50% / 0.3) 1px, transparent 1px),
              linear-gradient(90deg, hsl(120 100% 50% / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative">
        {/* Neon glow effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl"
            style={{ background: 'hsl(120 100% 50% / 0.1)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl"
            style={{ background: 'hsl(330 100% 60% / 0.1)' }}
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          {/* Header badge */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary text-sm font-pixel">
              <Sparkles className="w-4 h-4" />
              NIRD INITIATIVE
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl text-center mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-foreground">TECH</span>
            <span className="block text-primary neon-glow">RESCUE</span>
            <span className="block text-secondary neon-glow-pink text-2xl md:text-3xl mt-2">MISSION</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-12 font-pixel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join the resistance! Repair old computers, install Linux, 
            and build a sustainable digital village.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            className="flex justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              onClick={() => navigate('/game')}
              className="pixel-button text-lg animate-pulse-glow group"
            >
              <Gamepad2 className="w-5 h-5 mr-2" />
              <span>INSERT COIN</span>
              <motion.span
                className="ml-2"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                ▶
              </motion.span>
            </Button>
          </motion.div>

          {/* Animated character */}
          <motion.div
            className="flex justify-center mb-16"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div
              className="relative"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "steps(4)" }}
            >
              <div className="w-32 h-32 border-4 border-primary bg-card flex items-center justify-center text-6xl shadow-neon">
                🧑‍🔧
              </div>
              <motion.div
                className="absolute -top-2 -right-2 text-3xl"
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "steps(4)" }}
              >
                🔧
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -left-2 text-2xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "steps(3)" }}
              >
                💻
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="p-6 border-4 border-muted bg-card hover:border-primary transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 0 30px hsl(120 100% 50% / 0.3)' }}
              >
                <div className="w-12 h-12 border-2 border-primary flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm font-pixel">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* High Score teaser */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-muted-foreground font-pixel text-sm">
              <Zap className="w-4 h-4 inline mr-1 text-secondary" />
              3 GAME MODES • CHALLENGES • LEADERBOARDS
            </p>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground text-sm font-pixel border-t-2 border-muted">
        <p>BUILT WITH 💚 FOR SUSTAINABLE DIGITAL EDUCATION</p>
        <p className="text-xs mt-2 animate-blink">PRESS START</p>
      </footer>
    </div>
  );
}