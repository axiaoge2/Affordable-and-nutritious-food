import { motion, AnimatePresence } from 'framer-motion';
import type { Achievement } from '../types/achievement';

interface AchievementDetailModalProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementDetailModal: React.FC<AchievementDetailModalProps> = ({ achievement, onClose }) => {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-md mx-4 rounded-3xl bg-white/80 backdrop-blur-2xl p-8 border border-white/60 shadow-2xl"
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              ✕
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              <motion.div
                className="text-5xl"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
              >
                {achievement.icon}
              </motion.div>

              <h3 className="text-2xl font-semibold text-gray-800">
                {achievement.title}
              </h3>

              <p className="text-gray-600">{achievement.description}</p>

              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>解锁进度</span>
                  <span>
                    {Math.round((achievement.progress / achievement.requirement) * 100)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(achievement.progress / achievement.requirement) * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {achievement.progress} / {achievement.requirement}
                </p>
              </div>

              {achievement.unlocked && achievement.unlockedAt && (
                <div className="text-sm text-gray-500">
                  解锁时间：{new Date(achievement.unlockedAt).toLocaleString()}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
