import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TechMentorProps {
  message: string;
  showTyping?: boolean;
  mood?: 'happy' | 'thinking' | 'excited' | 'proud';
}

const moodEmojis = {
  happy: '😊',
  thinking: '🤔',
  excited: '🎮',
  proud: '🏆',
};

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
    }, 20);

    return () => clearInterval(timer);
  }, [message, showTyping]);

  return (
    <div className="flex items-start gap-4 mb-8">
      {/* Avatar */}
      <motion.div
        className="flex-shrink-0 relative"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-16 h-16 border-4 border-primary bg-card flex items-center justify-center text-3xl shadow-neon">
          🧑‍🔧
        </div>
        <motion.span
          className="absolute -bottom-1 -right-1 text-lg bg-background border-2 border-primary rounded-full w-7 h-7 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {moodEmojis[mood]}
        </motion.span>
      </motion.div>

      {/* Speech bubble */}
      <motion.div
        className="flex-1 max-w-2xl relative"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-card border-4 border-primary p-4 shadow-pixel">
          <p className="text-foreground font-pixel text-lg leading-relaxed">
            {displayedText}
            <AnimatePresence>
              {isTyping && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="inline-block ml-1 text-primary"
                >
                  <span className="animate-blink">▌</span>
                </motion.span>
              )}
            </AnimatePresence>
          </p>
        </div>
        {/* Speech bubble tail */}
        <div className="absolute -left-3 top-6 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-[12px] border-r-primary" />
      </motion.div>
    </div>
  );
}