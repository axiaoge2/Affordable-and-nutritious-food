import { memo } from 'react';
import { motion } from 'framer-motion';
import { EmotionTag } from '../types/food';
import { getParticleCount } from '../utils/performance';

interface FeedbackPanelProps {
  onLike: () => void;
  onDislike: () => void;
  onEmotionSelect: (emotion: EmotionTag) => void;
  showEmotions?: boolean;
}

const FeedbackPanel = ({ onLike, onDislike, onEmotionSelect, showEmotions = false }: FeedbackPanelProps) => {
  // Performance optimization: adjust particle counts
  const rippleCount = getParticleCount(2);
  const starCount = getParticleCount(4);
  const emotionParticles = getParticleCount(2);

  const emotions = [
    { tag: EmotionTag.HAPPY, emoji: '😊', color: 'from-yellow-400 to-orange-400' },
    { tag: EmotionTag.COMFORT, emoji: '🥰', color: 'from-pink-400 to-red-400' },
    { tag: EmotionTag.ENERGETIC, emoji: '💪', color: 'from-green-400 to-emerald-400' },
    { tag: EmotionTag.RELAXING, emoji: '😌', color: 'from-blue-400 to-cyan-400' },
    { tag: EmotionTag.NOSTALGIC, emoji: '🥺', color: 'from-purple-400 to-pink-400' },
    { tag: EmotionTag.EXCITING, emoji: '🤩', color: 'from-red-400 to-pink-400' },
  ];

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 喜欢/不喜欢 - 增强3D动画 */}
      <div className="flex gap-6 justify-center">
        <motion.button
          whileHover={{
            scale: 1.2,
            rotate: -8,
            y: -5,
          }}
          whileTap={{ scale: 0.85 }}
          onClick={onDislike}
          className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-300 via-gray-200 to-gray-100
                     flex items-center justify-center text-3xl shadow-2xl
                     hover:shadow-3xl transition-all overflow-hidden group"
          style={{
            transformStyle: 'preserve-3d',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
          }}
        >
          {/* 玻璃拟态背景 */}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

          {/* Ripple effect - 减少层数 */}
          {[...Array(rippleCount)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 bg-white/40 rounded-2xl"
              initial={{ scale: 0, opacity: 0.5 }}
              whileHover={{ scale: 1.8 + i * 0.3, opacity: 0 }}
              transition={{ duration: 0.5 + i * 0.15 }}
            />
          ))}

          <motion.span
            className="z-10 drop-shadow-lg"
            whileHover={{
              rotate: [-5, 5, -5],
              scale: 1.2,
            }}
            transition={{ duration: 0.3 }}
          >
            👎
          </motion.span>
        </motion.button>

        <motion.button
          whileHover={{
            scale: 1.2,
            rotate: 8,
            y: -5,
          }}
          whileTap={{ scale: 0.85 }}
          onClick={onLike}
          className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 via-green-400 to-teal-400
                     flex items-center justify-center text-3xl shadow-2xl
                     hover:shadow-3xl transition-all overflow-hidden group"
          style={{
            transformStyle: 'preserve-3d',
            boxShadow: '0 10px 30px rgba(52, 211, 153, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
          }}
        >
          {/* 玻璃拟态背景 */}
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

          {/* Ripple effect - 减少层数 */}
          {[...Array(rippleCount)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 bg-white/40 rounded-2xl"
              initial={{ scale: 0, opacity: 0.6 }}
              whileHover={{ scale: 2 + i * 0.5, opacity: 0 }}
              transition={{ duration: 0.6 + i * 0.2, delay: i * 0.1 }}
            />
          ))}

          {/* 持续脉冲光环 */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            animate={{
              boxShadow: [
                '0 0 0 0px rgba(52, 211, 153, 0.6)',
                '0 0 0 12px rgba(52, 211, 153, 0)',
              ],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />

          {/* 闪烁星星 */}
          {[...Array(starCount)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${20 + i * 20}%`,
                top: `${20 + (i % 2) * 40}%`,
              }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
          ))}

          <motion.span
            className="z-10 drop-shadow-lg"
            whileHover={{
              rotate: [5, -5, 5],
              scale: 1.2,
            }}
            transition={{ duration: 0.3 }}
          >
            👍
          </motion.span>
        </motion.button>
      </div>

      {/* 情绪标签选择 - 增强交互效果 */}
      {showEmotions && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-2"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center text-apple-gray-600 text-sm"
          >
            这个食物给你什么感觉？
          </motion.p>

          <div className="flex flex-wrap gap-3 justify-center">
            {emotions.map((emotion, index) => (
              <motion.button
                key={emotion.tag}
                initial={{ scale: 0, opacity: 0, rotateZ: -180, y: 50 }}
                animate={{ scale: 1, opacity: 1, rotateZ: 0, y: 0 }}
                transition={{
                  delay: 0.1 + index * 0.08,
                  type: "spring",
                  stiffness: 200,
                  damping: 12
                }}
                whileHover={{
                  scale: 1.18,
                  y: -8,
                  rotateZ: [0, -3, 3, 0],
                  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)'
                }}
                whileTap={{ scale: 0.9, y: 0 }}
                onClick={() => onEmotionSelect(emotion.tag)}
                className={`relative px-5 py-3 rounded-2xl bg-gradient-to-br ${emotion.color}
                           text-white font-semibold shadow-xl hover:shadow-2xl
                           transition-all flex items-center gap-2 overflow-hidden
                           border-2 border-white/30`}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* 玻璃拟态层 */}
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

                {/* Shimmer effect - 增强光泽 */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  animate={{
                    x: ['-200%', '200%'],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatDelay: 1.5,
                    ease: "easeInOut"
                  }}
                />

                {/* 脉冲背景 */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  animate={{
                    opacity: [0, 0.3, 0],
                    scale: [0.8, 1.1, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.3
                  }}
                  style={{
                    background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                  }}
                />

                {/* 装饰粒子 - 减少数量 */}
                {[...Array(emotionParticles)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${40 + i * 20}%`,
                      top: `${30 + i * 20}%`,
                      willChange: 'transform, opacity',
                    }}
                    animate={{
                      scale: [0, 1.2, 0],
                      opacity: [0, 0.8, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.5 + index * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                ))}

                <motion.span
                  className="text-2xl z-10 drop-shadow-lg"
                  whileHover={{
                    scale: 1.4,
                    rotate: [0, -15, 15, -15, 0],
                    y: [0, -5, 0],
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {emotion.emoji}
                </motion.span>
                <span className="text-base font-bold z-10 drop-shadow-md">{emotion.tag}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// Wrap with React.memo to prevent unnecessary re-renders
export default memo(FeedbackPanel);
