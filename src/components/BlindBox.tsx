import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Food } from '../types/food';

interface BlindBoxProps {
  onDrawFood: () => Food;
  onResult: (food: Food) => void;
}

const BlindBox = ({ onDrawFood, onResult }: BlindBoxProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnFood, setDrawnFood] = useState<Food | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleDraw = () => {
    if (isDrawing) return;

    setIsDrawing(true);
    setShowResult(false);
    setDrawnFood(null);

    // 模拟抽取过程
    setTimeout(() => {
      const food = onDrawFood();
      setDrawnFood(food);
      setIsDrawing(false);

      // 延迟显示结果
      setTimeout(() => {
        setShowResult(true);
        onResult(food);
      }, 500);
    }, 2000);
  };

  const handleClose = () => {
    setShowResult(false);
    setDrawnFood(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px]">
      {/* 盲盒按钮 */}
      <AnimatePresence mode="wait">
        {!isDrawing && !showResult && (
          <motion.div
            key="box"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex flex-col items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDraw}
              className="relative w-64 h-64 bg-gradient-to-br from-apple-blue to-purple-500
                         rounded-3xl shadow-apple-lg flex items-center justify-center
                         overflow-hidden group"
            >
              {/* 盲盒装饰 */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

              {/* 问号图标 */}
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-white text-8xl font-bold z-10"
              >
                ?
              </motion.div>

              {/* 光效 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </motion.button>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-2xl font-semibold text-apple-gray-700"
            >
              点击抽取今日美食
            </motion.p>
          </motion.div>
        )}

        {/* 抽取中动画 */}
        {isDrawing && (
          <motion.div
            key="drawing"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: {
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                },
                scale: {
                  duration: 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="w-64 h-64 bg-gradient-to-br from-apple-blue to-purple-500
                         rounded-3xl shadow-apple-lg flex items-center justify-center"
            >
              <div className="text-white text-6xl">🎁</div>
            </motion.div>

            <motion.p
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="mt-8 text-2xl font-semibold text-apple-gray-700"
            >
              抽取中...
            </motion.p>
          </motion.div>
        )}

        {/* 结果展示 */}
        {showResult && drawnFood && (
          <motion.div
            key="result"
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="card-apple relative">
              {/* 关闭按钮 */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-apple-gray-200
                           hover:bg-apple-gray-300 flex items-center justify-center
                           transition-colors"
              >
                ✕
              </button>

              {/* 食物信息 */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>

                <h2 className="text-3xl font-bold text-apple-gray-800 mb-2">
                  {drawnFood.name}
                </h2>

                <p className="text-apple-gray-600 mb-4">
                  {drawnFood.description}
                </p>

                {/* 价格信息 */}
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-3xl font-bold text-apple-blue">
                    ¥{drawnFood.price}
                  </span>
                  {drawnFood.originalPrice && (
                    <span className="text-lg text-apple-gray-400 line-through">
                      ¥{drawnFood.originalPrice}
                    </span>
                  )}
                </div>

                {/* 性价比评分 */}
                <div className="inline-block bg-apple-green/10 px-4 py-2 rounded-full mb-4">
                  <span className="text-apple-green font-semibold">
                    性价比: {drawnFood.pricePerformanceScore}/10
                  </span>
                </div>

                {/* 位置 */}
                <div className="flex items-center justify-center gap-2 text-apple-gray-600 mb-4">
                  <span>📍</span>
                  <span>{drawnFood.location}</span>
                </div>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {drawnFood.tags.map((tag, index) => (
                    <motion.span
                      key={tag}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="px-3 py-1 bg-apple-gray-100 text-apple-gray-700
                                 rounded-full text-sm"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>

                {/* 情绪标签 */}
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {drawnFood.emotionTags.map((tag, index) => (
                    <motion.span
                      key={tag}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100
                                 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>

                {/* 再抽一次按钮 */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleClose();
                    setTimeout(handleDraw, 300);
                  }}
                  className="btn-apple w-full"
                >
                  再抽一次
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlindBox;
