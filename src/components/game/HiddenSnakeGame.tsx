import React, { useState, useEffect, useCallback } from 'react';
import SnakeGame from './SnakeGame';
import SecretActivation from './SecretActivation';
import { motion, AnimatePresence } from 'framer-motion';
import './HiddenSnakeGame.css';

/**
 * HiddenSnakeGame Component
 * 
 * This component manages the hidden Snake game with a secret activation system.
 * 
 * SECRET ACTIVATION TRIGGER:
 * - Press the sequence: UP, UP, DOWN, DOWN, LEFT, RIGHT, LEFT, RIGHT, B, A (Konami Code variant)
 * - Or press the hidden Easter egg sequence: S, N, A, K, E
 * 
 * To customize the activation sequence, modify the ACTIVATION_SEQUENCES arrays in SecretActivation.tsx
 */

const HiddenSnakeGame: React.FC = () => {
  const [gameActive, setGameActive] = useState(false);
  const [showRevealAnimation, setShowRevealAnimation] = useState(false);

  const handleActivation = useCallback(() => {
    setShowRevealAnimation(true);
    setTimeout(() => {
      setGameActive(true);
      setShowRevealAnimation(false);
    }, 1500); // Animation duration
  }, []);

  const handleCloseGame = useCallback(() => {
    setGameActive(false);
  }, []);

  return (
    <div className="hidden-snake-container">
      <SecretActivation onActivated={handleActivation} />
      
      <AnimatePresence>
        {showRevealAnimation && (
          <motion.div
            className="reveal-animation"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.5 }}
          >
            <div className="comic-reveal">
              <div className="reveal-text">🐍 SNAKE REVEALED! 🐍</div>
              <div className="reveal-subtext">THE GAME IS LIVE</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameActive && (
          <motion.div
            className="snake-game-modal"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4 }}
          >
            <SnakeGame onClose={handleCloseGame} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HiddenSnakeGame;
