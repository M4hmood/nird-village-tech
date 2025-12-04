import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Recycle, Leaf, Users, Sparkles } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    { icon: Recycle, title: 'Repair & Reuse', description: 'Give old computers a second life' },
    { icon: Leaf, title: 'Sustainable Tech', description: 'Reduce e-waste and carbon footprint' },
    { icon: Users, title: 'Empower Schools', description: 'Free software for everyone' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-secondary/10 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
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
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Numérique Inclusif, Responsable et Durable
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-center text-foreground mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            NIRD Tech
            <span className="block gradient-hero bg-clip-text text-transparent">
              Rescue Mission
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join the resistance! Learn to repair old computers, install open-source software, 
            and build a sustainable digital village for schools.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            className="flex justify-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              variant="hero"
              size="xl"
              onClick={() => navigate('/game')}
              className="group"
            >
              <span>Start Your Mission</span>
              <motion.span
                className="ml-2"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                →
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
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-32 h-32 rounded-full gradient-hero flex items-center justify-center text-6xl shadow-lg">
                🧑‍🔧
              </div>
              <motion.div
                className="absolute -top-2 -right-2 text-4xl"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔧
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -left-2 text-3xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
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
                className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground text-sm">
        <p>Built with 💚 for sustainable digital education</p>
      </footer>
    </div>
  );
}
