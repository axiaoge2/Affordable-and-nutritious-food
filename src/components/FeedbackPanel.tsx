import { motion } from 'framer-motion';
import { EmotionTag } from '../types/food';

interface FeedbackPanelProps {
  onLike: () => void;
  onDislike: () => void;
  onEmotionSelect: (emotion: EmotionTag) => void;
  showEmotions?: boolean;
}

const FeedbackPanel = ({ onLike, onDislike, onEmotionSelect, showEmotions = false }: FeedbackPanelProps) => {
  const emotions = [
    { tag: EmotionTag.HAPPY, emoji: '😊', color: 'from-yellow-400 to-orange-400' },
    { tag: EmotionTag.COMFORT, emoji: '🥰', color: 'from-pink-400 to-red-400' },
    { tag: EmotionTag.ENERGETIC, emoji: '💪', color: 'from-green-400 to-emerald-400' },
    { tag: EmotionTag.RELAXING, emoji: '😌', color: 'from-blue-400 to-cyan-400' },
    { tag: EmotionTag.NOSTALGIC, emoji: '🥺', color: 'from-purple-400 to-pink-400' },
    { tag: EmotionTag.EXCITING, emoji: '🤩', color: 'from-red-400 to-pink-400' },
  ];

  return (
    <div className="space-y-4">
      {/* 喜欢/不喜欢 */}
      <div className="flex gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onDislike}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-apple-gray-200 to-apple-gray-300
                     flex items-center justify-center text-2xl shadow-apple
                     hover:shadow-apple-lg transition-all"
        >
          👎
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onLike}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-apple-green to-green-500
                     flex items-center justify-center text-2xl shadow-apple
                     hover:shadow-apple-lg transition-all"
        >
          👍
        </motion.button>
      </div>

      {/* 情绪标签选择 */}
      {showEmotions && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <p className="text-center text-apple-gray-600 text-sm">
            这个食物给你什么感觉？
          </p>

          <div className="flex flex-wrap gap-2 justify-center">
            {emotions.map((emotion, index) => (
              <motion.button
                key={emotion.tag}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEmotionSelect(emotion.tag)}
                className={`px-4 py-2 rounded-full bg-gradient-to-r ${emotion.color}
                           text-white font-medium shadow-apple hover:shadow-apple-lg
                           transition-all flex items-center gap-2`}
              >
                <span className="text-lg">{emotion.emoji}</span>
                <span className="text-sm">{emotion.tag}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FeedbackPanel;
