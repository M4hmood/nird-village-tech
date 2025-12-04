import { motion } from 'framer-motion';
import { useGame, Room } from '@/context/GameContext';
import { Lock, CheckCircle2, Star } from 'lucide-react';

const difficultyColors = {
  easy: 'bg-green-500/20 border-green-500/50 text-green-400',
  medium: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
  hard: 'bg-red-500/20 border-red-500/50 text-red-400',
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
}

function RoomCard({ room, isUnlocked, onClick }: RoomCardProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={!isUnlocked}
      className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
        room.completed
          ? 'bg-primary/20 border-primary/50'
          : isUnlocked
          ? 'bg-card border-border hover:border-primary hover:shadow-lg hover:shadow-primary/20 cursor-pointer'
          : 'bg-muted/30 border-muted cursor-not-allowed opacity-60'
      }`}
      whileHover={isUnlocked && !room.completed ? { scale: 1.02, y: -4 } : {}}
      whileTap={isUnlocked ? { scale: 0.98 } : {}}
    >
      {/* Completion badge */}
      {room.completed && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-primary rounded-full p-1"
        >
          <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
        </motion.div>
      )}
      
      {/* Lock icon for locked rooms */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-2xl">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
      )}

      <div className="flex items-start gap-4">
        <span className="text-4xl">{room.icon}</span>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground">{room.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{room.description}</p>
          
          <div className="flex items-center gap-3 mt-3">
            {/* Difficulty stars */}
            <div className="flex gap-0.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < difficultyStars[room.difficulty]
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted'
                  }`}
                />
              ))}
            </div>
            
            {/* Difficulty badge */}
            <span className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColors[room.difficulty]}`}>
              {room.difficulty}
            </span>
            
            {/* Machine count */}
            <span className="text-xs text-muted-foreground">
              🖥️ {room.machines} machines
            </span>
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
        <h2 className="text-2xl font-bold text-foreground">School Map</h2>
        <p className="text-muted-foreground mt-2">
          Choose a room to liberate from Big Tech!
        </p>
        
        {/* Progress indicator */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="h-2 w-48 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / state.rooms.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-sm text-muted-foreground">
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
          />
        ))}
      </div>

      {/* All complete message */}
      {completedCount === state.rooms.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 bg-primary/20 rounded-2xl border-2 border-primary"
        >
          <span className="text-4xl">🎉</span>
          <h3 className="text-xl font-bold text-primary mt-2">
            School Liberation Complete!
          </h3>
          <p className="text-muted-foreground">
            Every room is now running open-source software!
          </p>
        </motion.div>
      )}
    </div>
  );
}
