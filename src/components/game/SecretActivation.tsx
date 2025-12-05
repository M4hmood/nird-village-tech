import React, { useEffect, useState } from 'react';

/**
 * SecretActivation Component
 * 
 * This component listens for secret key sequences to activate the hidden game.
 * 
 * ACTIVATION SEQUENCES:
 * 1. Konami Code: ArrowUp, ArrowUp, ArrowDown, ArrowDown, ArrowLeft, ArrowRight, ArrowLeft, ArrowRight, b, a
 * 2. S.N.A.K.E: s, n, a, k, e
 */

interface SecretActivationProps {
  onActivated: () => void;
}

const ACTIVATION_SEQUENCES = [
  {
    name: 'Konami Code',
    keys: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
  },
  {
    name: 'SNAKE',
    keys: ['s', 'n', 'a', 'k', 'e']
  }
];

const SecretActivation: React.FC<SecretActivationProps> = ({ onActivated }) => {
  const [keySequence, setKeySequence] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase() === event.key 
        ? event.key.toLowerCase() 
        : event.key;

      // Build the sequence
      const newSequence = [...keySequence, key];

      // Check against all activation sequences
      for (const sequence of ACTIVATION_SEQUENCES) {
        const maxLen = Math.max(sequence.keys.length, newSequence.length);
        const currentSeq = newSequence.slice(-maxLen);
        
        if (JSON.stringify(currentSeq) === JSON.stringify(sequence.keys.slice(-currentSeq.length))) {
          if (currentSeq.length === sequence.keys.length) {
            onActivated();
            setKeySequence([]);
            return;
          }
        }
      }

      // Keep sequence from growing too large
      if (newSequence.length > Math.max(...ACTIVATION_SEQUENCES.map(s => s.keys.length))) {
        setKeySequence(newSequence.slice(-Math.max(...ACTIVATION_SEQUENCES.map(s => s.keys.length))));
      } else {
        setKeySequence(newSequence);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keySequence, onActivated]);

  return null; // This component is invisible - just listens for events
};

export default SecretActivation;
