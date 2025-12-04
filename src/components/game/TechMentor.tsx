import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TechMentorProps {
  message: string;
  showTyping?: boolean;
  mood?: 'happy' | 'thinking' | 'excited' | 'proud';
}

export function TechMentor({ message, showTyping = true, mood = 'happy' }: TechMentorProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(showTyping);

  useEffect(() => {
    if (!showTyping) {
      setDisplayedText(message);
      return;
    }

    setDisplayedText('');
    setIsTyping(true);
    let index = 0;

    const timer = setInterval(() => {
      if (index < message.length) {
        setDisplayedText(message.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [message, showTyping]);

  const getMoodEmoji = () => {
    switch (mood) {
      case 'happy': return '😊';
      case 'thinking': return '🤔';
      case 'excited': return '🎉';
      case 'proud': return '🌟';
      default: return '😊';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-4 mb-6"
    >
      {/* Mentor Avatar */}
      <motion.div
        className="relative flex-shrink-0"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center text-3xl shadow-lg">
          🧑‍🔧
        </div>
        <motion.span
          className="absolute -bottom-1 -right-1 text-xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {getMoodEmoji()}
        </motion.span>
      </motion.div>

      {/* Speech Bubble */}
      <div className="relative flex-1 max-w-2xl">
        <motion.div
          className="bg-card rounded-2xl rounded-bl-none p-4 shadow-card border border-border"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-foreground text-lg leading-relaxed">
            {displayedText}
            <AnimatePresence>
              {isTyping && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="inline-block ml-1"
                >
                  <span className="animate-pulse">▌</span>
                </motion.span>
              )}
            </AnimatePresence>
          </p>
        </motion.div>
        {/* Speech bubble tail */}
        <div className="absolute -left-2 bottom-4 w-4 h-4 bg-card border-l border-b border-border transform rotate-45" />
      </div>
    </motion.div>
  );
}
