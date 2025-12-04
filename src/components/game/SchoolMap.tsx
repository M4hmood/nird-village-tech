import { motion } from 'framer-motion';
import { useGame, Room } from '@/context/GameContext';
import { Lock, CheckCircle2, Star, Gamepad2, Trophy } from 'lucide-react';

const difficultyColors = {
  easy: 'border-neon-green text-neon-green',
  medium: 'border-neon-yellow text-neon-yellow',
  hard: 'border-neon-pink text-neon-pink',
};

const difficultyStars = {
  easy: 1,
  medium: 2,
  hard: 3,
};

interface RoomCardProps {
  room: Room;
  isUnlocked: boolean;
  onClick: () => void;
  showTechnical: boolean;
}

function RoomCard({ room, isUnlocked, onClick, showTechnical }: RoomCardProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={!isUnlocked}
      className={`relative p-6 border-4 transition-all text-left ${
        room.completed
          ? 'border-primary bg-primary/20'
          : isUnlocked
          ? 'border-muted bg-card hover:border-primary hover:shadow-neon cursor-pointer'
          : 'border-muted/50 bg-card/50 cursor-not-allowed opacity-60'
      }`}
      whileHover={isUnlocked && !room.completed ? { scale: 1.02, y: -4 } : {}}
      whileTap={isUnlocked ? { scale: 0.98 } : {}}
    >
      {/* Completion badge */}
      {room.completed && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-primary p-1"
        >
          <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
        </motion.div>
      )}
      
      {/* Lock icon for locked rooms */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
      )}

      <div className="flex items-start gap-4">
        <motion.span 
          className="text-4xl"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
        >
          {room.icon}
        </motion.span>
        <div className="flex-1">
          <h3 className="text-lg text-foreground">{room.name}</h3>
          <p className="text-sm text-muted-foreground font-pixel mt-1">
            {showTechnical ? room.technicalDescription : room.description}
          </p>
          
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {/* Difficulty stars */}
            <div className="flex gap-0.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < difficultyStars[room.difficulty]
                      ? 'fill-neon-yellow text-neon-yellow'
                      : 'text-muted'
                  }`}
                />
              ))}
            </div>
            
            {/* Difficulty badge */}
            <span className={`text-xs px-2 py-0.5 border-2 font-pixel uppercase ${difficultyColors[room.difficulty]}`}>
              {room.difficulty}
            </span>
            
            {/* Machine count */}
            <span className="text-xs text-muted-foreground font-pixel">
              🖥️ {room.machines}
            </span>

            {/* Available modes */}
            <div className="flex gap-1">
              {room.modes.includes('arcade') && (
                <Gamepad2 className="w-3 h-3 text-accent" />
              )}
              {room.modes.includes('challenge') && (
                <Trophy className="w-3 h-3 text-secondary" />
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

interface SchoolMapProps {
  onSelectRoom: (roomId: string) => void;
}

export function SchoolMap({ onSelectRoom }: SchoolMapProps) {
  const { state } = useGame();
  
  const completedCount = state.rooms.filter(r => r.completed).length;
  const showTechnical = state.difficultyMode === 'technical';
  
  // Unlock logic: first room always unlocked, subsequent rooms unlock after previous completion
  const isUnlocked = (index: number) => {
    if (index === 0) return true;
    return state.rooms[index - 1]?.completed || false;
  };

  return (
    <div className="space-y-6">
      {/* Map header */}
      <div className="text-center">
        <motion.div
          className="text-6xl mb-4"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🏫
        </motion.div>
        <h2 className="text-2xl text-primary neon-glow">SCHOOL MAP</h2>
        <p className="text-muted-foreground font-pixel mt-2">
          {showTechnical 
            ? 'Select deployment zone. Check hardware specs before proceeding.'
            : 'Choose a room to liberate from Big Tech!'
          }
        </p>
        
        {/* Progress indicator */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="h-3 w-48 bg-muted border-2 border-primary overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / state.rooms.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-sm text-primary font-pixel">
            {completedCount}/{state.rooms.length}
          </span>
        </div>
      </div>

      {/* Room grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {state.rooms.map((room, index) => (
          <RoomCard
            key={room.id}
            room={room}
            isUnlocked={isUnlocked(index)}
            onClick={() => onSelectRoom(room.id)}
            showTechnical={showTechnical}
          />
        ))}
      </div>

      {/* All complete message */}
      {completedCount === state.rooms.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 border-4 border-primary bg-primary/20"
        >
          <span className="text-4xl">🎉</span>
          <h3 className="text-xl text-primary neon-glow mt-2">
            SCHOOL LIBERATED!
          </h3>
          <p className="text-muted-foreground font-pixel">
            {showTechnical 
              ? 'All systems migrated to FOSS stack. Network sovereignty achieved.'
              : 'Every room is now running open-source software!'
            }
          </p>
        </motion.div>
      )}
    </div>
  );
}