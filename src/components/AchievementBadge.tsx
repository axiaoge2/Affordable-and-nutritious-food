import { motion } from 'framer-motion';
import type { Achievement } from '../types/achievement';
import { AchievementRarity } from '../types/achievement';

interface AchievementBadgeProps {
  achievement: Achievement;
  onClick?: () => void;
}

const rarityColors: Record<string, { border: string; bg: string; glow: string; text: string }> = {
  [AchievementRarity.COMMON]: {
    border: 'border-gray-300',
    bg: 'from-gray-100 to-gray-200',
    glow: 'shadow-gray-300/50',
    text: 'text-gray-600',
  },
  [AchievementRarity.RARE]: {
    border: 'border-blue-400',
    bg: 'from-blue-100 to-blue-200',
    glow: 'shadow-blue-400/50',
    text: 'text-blue-600',
  },
  [AchievementRarity.EPIC]: {
    border: 'border-purple-400',
    bg: 'from-purple-100 to-purple-200',
    glow: 'shadow-purple-400/50',
    text: 'text-purple-600',
  },
  [AchievementRarity.LEGENDARY]: {
    border: 'border-yellow-400',
    bg: 'from-yellow-100 to-yellow-200',
    glow: 'shadow-yellow-400/50',
    text: 'text-yellow-600',
  },
};

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement, onClick }) => {
  const colors = rarityColors[achievement.rarity];
  const isUnlocked = achievement.unlocked;
  const progressPercent = (achievement.progress / achievement.requirement) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={isUnlocked ? { scale: 1.05, y: -5 } : { scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative cursor-pointer rounded-3xl p-6
        border-2 ${isUnlocked ? colors.border : 'border-gray-200'}
        bg-gradient-to-br ${isUnlocked ? colors.bg : 'from-gray-50 to-gray-100'}
        ${isUnlocked ? `shadow-xl ${colors.glow}` : 'shadow-md'}
        backdrop-blur-xl overflow-hidden
        transition-all duration-300
      `}
    >
      {isUnlocked && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'easeInOut',
          }}
        />
      )}

      <div className="relative z-10 flex flex-col items-center text-center space-y-3">
        <motion.div
          className={`text-5xl ${!isUnlocked && 'opacity-30 grayscale'}`}
          animate={
            isUnlocked
              ? {
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: isUnlocked ? Infinity : 0,
            repeatDelay: 2,
          }}
        >
          {achievement.icon}
        </motion.div>

        <h3
          className={`
            text-lg font-bold
            ${isUnlocked ? colors.text : 'text-gray-400'}
          `}
        >
          {achievement.title}
        </h3>

        <p className={`text-sm ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
          {achievement.description}
        </p>

        <div className="w-full space-y-1">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${
                isUnlocked
                  ? 'from-green-400 to-green-500'
                  : 'from-blue-400 to-purple-400'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-gray-500">
            {achievement.progress} / {achievement.requirement}
          </p>
        </div>

        {!isUnlocked && (
          <div className="absolute top-3 right-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm">🔒</span>
            </div>
          </div>
        )}

        {isUnlocked && achievement.unlockedAt && (
          <p className="text-xs text-gray-400">
            解锁于 {new Date(achievement.unlockedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </motion.div>
  );
};
