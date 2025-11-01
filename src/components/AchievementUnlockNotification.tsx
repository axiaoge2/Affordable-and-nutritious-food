import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import type { Achievement } from '../types/achievement';

interface AchievementUnlockNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementUnlockNotification: React.FC<AchievementUnlockNotificationProps> = ({
  achievement,
  onClose,
}) => {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ y: -200, opacity: 0, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -200, opacity: 0, scale: 0.5 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
        >
          <motion.div
            className="bg-gradient-to-br from-yellow-100 via-yellow-50 to-orange-100 rounded-3xl p-6 shadow-2xl border-4 border-yellow-400 min-w-[320px] overflow-hidden"
            animate={{
              boxShadow: [
                '0 20px 60px rgba(251, 191, 36, 0.4)',
                '0 20px 80px rgba(251, 191, 36, 0.6)',
                '0 20px 60px rgba(251, 191, 36, 0.4)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            />

            <div className="relative z-10">
              <div className="text-center mb-3">
                <motion.div
                  className="inline-block text-yellow-600 font-bold text-sm uppercase tracking-wider"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
                >
                  🎉 成就解锁 🎉
                </motion.div>
              </div>

              <div className="flex items-center gap-4">
                <motion.div
                  className="text-6xl"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {achievement.icon}
                </motion.div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {achievement.description}
                  </p>
                </div>
              </div>

              <motion.button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
              >
                ✕
              </motion.button>
            </div>

            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
