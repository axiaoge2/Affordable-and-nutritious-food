import { motion, AnimatePresence } from 'framer-motion';
import type { Food } from '../types/food';

interface FoodDetailModalProps {
  food: Food | null;
  isOpen: boolean;
  onClose: () => void;
}

const FoodDetailModal = ({ food, isOpen, onClose }: FoodDetailModalProps) => {
  if (!food) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50
                       flex items-center justify-center p-4"
          >
            {/* 模态框内容 */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full
                         max-h-[90vh] overflow-y-auto relative"
            >
              {/* 关闭按钮 */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full
                           bg-apple-gray-100 hover:bg-apple-gray-200
                           flex items-center justify-center z-10
                           transition-colors"
              >
                <span className="text-apple-gray-600 font-bold text-lg">✕</span>
              </motion.button>

              {/* 头部装饰 */}
              <div className="h-32 bg-gradient-to-br from-apple-blue via-purple-500 to-pink-500
                            rounded-t-3xl relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                  style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                />
              </div>

              {/* 内容区域 */}
              <div className="p-8 -mt-16">
                {/* 食物图标 */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-24 h-24 rounded-full bg-white shadow-apple-lg
                           flex items-center justify-center text-6xl mb-6
                           mx-auto"
                >
                  🍜
                </motion.div>

                {/* 标题 */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-bold text-apple-gray-800 text-center mb-2"
                >
                  {food.name}
                </motion.h2>

                {/* 评分 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-2 mb-6"
                >
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className={`text-2xl ${
                          i < Math.floor(food.rating) ? 'text-yellow-400' : 'text-apple-gray-300'
                        }`}
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>
                  <span className="text-apple-gray-600 font-semibold">
                    {food.rating} 分
                  </span>
                </motion.div>

                {/* 描述 */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-center text-apple-gray-600 text-lg mb-8
                           leading-relaxed"
                >
                  {food.description}
                </motion.p>

                {/* 信息卡片 */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* 价格 */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-gradient-to-br from-apple-blue/10 to-purple-500/10
                             rounded-2xl p-4 text-center"
                  >
                    <div className="text-sm text-apple-gray-600 mb-1">价格</div>
                    <div className="text-2xl font-bold text-apple-blue">
                      ¥{food.price}
                    </div>
                    {food.originalPrice && (
                      <div className="text-sm text-apple-gray-400 line-through">
                        ¥{food.originalPrice}
                      </div>
                    )}
                  </motion.div>

                  {/* 性价比 */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-gradient-to-br from-green-500/10 to-emerald-500/10
                             rounded-2xl p-4 text-center"
                  >
                    <div className="text-sm text-apple-gray-600 mb-1">性价比</div>
                    <div className="text-2xl font-bold text-apple-green">
                      {food.pricePerformanceScore}/10
                    </div>
                    <div className="text-sm text-apple-green">
                      超值推荐
                    </div>
                  </motion.div>
                </div>

                {/* 位置 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-apple-gray-50 rounded-2xl p-4 mb-6
                           flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-apple-blue/10
                               flex items-center justify-center text-2xl">
                    📍
                  </div>
                  <div>
                    <div className="text-sm text-apple-gray-600">位置</div>
                    <div className="font-semibold text-apple-gray-800">
                      {food.location}
                    </div>
                  </div>
                </motion.div>

                {/* 标签 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="mb-6"
                >
                  <div className="text-sm text-apple-gray-600 mb-3">特色标签</div>
                  <div className="flex flex-wrap gap-2">
                    {food.tags.map((tag, index) => (
                      <motion.span
                        key={tag}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.9 + index * 0.05 }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="px-4 py-2 bg-apple-gray-100 text-apple-gray-700
                                 rounded-full text-sm font-medium
                                 hover:bg-apple-gray-200 transition-colors"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* 情绪标签 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <div className="text-sm text-apple-gray-600 mb-3">情绪感受</div>
                  <div className="flex flex-wrap gap-2">
                    {food.emotionTags.map((tag, index) => (
                      <motion.span
                        key={tag}
                        initial={{ scale: 0, opacity: 0, rotate: -180 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ delay: 1 + index * 0.05, type: 'spring' }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100
                                 text-purple-700 rounded-full text-sm font-medium
                                 hover:from-pink-200 hover:to-purple-200 transition-all"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FoodDetailModal;
