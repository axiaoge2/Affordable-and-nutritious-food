import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Food } from '../types/food';
import { getParticleCount } from '../utils/performance';

interface BlindBoxProps {
  onDrawFood: () => Food;
  onResult: (food: Food) => void;
}

const BlindBox = ({ onDrawFood, onResult }: BlindBoxProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnFood, setDrawnFood] = useState<Food | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Performance optimization: adjust particle counts
  const floatingParticles = getParticleCount(3);
  const drawingRings = getParticleCount(2);
  const drawingParticlesPerRing = getParticleCount(6);
  const fireworkParticles = getParticleCount(8);

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
              whileHover={{ scale: 1.08, rotateY: 5 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleDraw}
              className="relative w-72 h-72 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
                         rounded-[32px] shadow-2xl flex items-center justify-center
                         overflow-hidden group perspective-1000"
              style={{
                transformStyle: 'preserve-3d',
                boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
              }}
            >
              {/* 玻璃拟态背景 */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20"></div>

              {/* 网格背景装饰 */}
              <div className="absolute inset-0 opacity-20"
                   style={{
                     backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                     backgroundSize: '20px 20px'
                   }}
              />

              {/* 问号图标 - 3D效果 */}
              <motion.div
                animate={{
                  rotateY: [0, 15, -15, 0],
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-white text-9xl font-bold z-10 drop-shadow-2xl"
                style={{
                  textShadow: '0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.4)',
                  transform: 'translateZ(50px)'
                }}
              >
                ?
              </motion.div>

              {/* 多层光效 - 彩虹扫光 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-200%', '200%'],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 0.5
                }}
              />

              {/* 旋转光环 */}
              <motion.div
                className="absolute inset-0 rounded-[32px]"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  background: 'conic-gradient(from 0deg, transparent 60%, rgba(255, 255, 255, 0.4) 70%, transparent 80%)',
                }}
              />

              {/* 脉冲光环 - 双层 */}
              <motion.div
                className="absolute inset-0 rounded-[32px]"
                animate={{
                  boxShadow: [
                    '0 0 0 0px rgba(139, 92, 246, 0.6), 0 0 0 0px rgba(236, 72, 153, 0.4)',
                    '0 0 0 15px rgba(139, 92, 246, 0), 0 0 0 30px rgba(236, 72, 153, 0)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />

              {/* 悬浮粒子 - 减少数量 */}
              {[...Array(floatingParticles)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: `${30 + i * 20}%`,
                    top: `${20 + (i % 2) * 40}%`,
                    willChange: 'transform, opacity',
                  }}
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                />
              ))}
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

        {/* 抽取中动画 - 增强视觉效果 */}
        {isDrawing && (
          <motion.div
            key="drawing"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex flex-col items-center relative"
          >
            {/* 简化旋转光环 - 减少层数 */}
            {[...Array(drawingRings)].map((_, ring) => (
              <motion.div
                key={ring}
                className="absolute"
                animate={{
                  rotate: ring % 2 === 0 ? 360 : -360,
                }}
                transition={{
                  duration: 3 - ring * 0.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {[...Array(drawingParticlesPerRing)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: ring === 0 ? '12px' : '8px',
                      height: ring === 0 ? '12px' : '8px',
                      left: '50%',
                      top: '50%',
                      marginLeft: ring === 0 ? '-6px' : '-4px',
                      marginTop: ring === 0 ? '-6px' : '-4px',
                      background: `linear-gradient(135deg,
                        ${['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'][i % 4]},
                        ${['#60a5fa', '#a78bfa', '#f472b6', '#34d399'][i % 4]})`,
                      willChange: 'transform, opacity',
                    }}
                    animate={{
                      x: Math.cos((i / drawingParticlesPerRing) * Math.PI * 2) * (100 + ring * 30),
                      y: Math.sin((i / drawingParticlesPerRing) * Math.PI * 2) * (100 + ring * 30),
                      opacity: [0, 0.8, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </motion.div>
            ))}

            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: {
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "linear"
                },
                scale: {
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="w-72 h-72 rounded-[32px] flex items-center justify-center
                         relative overflow-hidden z-10"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
                backgroundSize: '400% 400%',
                boxShadow: '0 30px 60px -15px rgba(139, 92, 246, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.2) inset',
              }}
            >
              {/* 动态渐变背景 */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
                  backgroundSize: '400% 400%',
                }}
              />

              {/* 玻璃拟态层 */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl"></div>

              {/* 旋转的十字星光 */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: [0, 90, 180, 270, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                     style={{ width: '2px', left: '50%', transform: 'translateX(-50%)' }} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-transparent"
                     style={{ height: '2px', top: '50%', transform: 'translateY(-50%)' }} />
              </motion.div>

              {/* 礼物图标 - 3D旋转 */}
              <motion.div
                className="text-white z-10 drop-shadow-2xl"
                style={{
                  fontSize: '96px',
                  textShadow: '0 0 40px rgba(255, 255, 255, 0.9)',
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  rotateY: [0, 360],
                }}
                transition={{
                  scale: {
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  rotateY: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                🎁
              </motion.div>
            </motion.div>

            <motion.p
              animate={{
                opacity: [1, 0.6, 1],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mt-8 text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600
                         bg-clip-text text-transparent"
            >
              🎲 正在为你抽取美食...
            </motion.p>
          </motion.div>
        )}

        {/* 结果展示 - 增强庆祝动效 */}
        {showResult && drawnFood && (
          <motion.div
            key="result"
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.4 }}
            className="w-full max-w-md relative"
          >
            {/* 烟花粒子效果 - 减少数量 */}
            <motion.div className="absolute inset-0 pointer-events-none">
              {[...Array(fireworkParticles)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    background: ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4d96ff'][i % 4],
                    willChange: 'transform, opacity',
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    x: Math.cos((i / fireworkParticles) * Math.PI * 2) * 100,
                    y: Math.sin((i / fireworkParticles) * Math.PI * 2) * 100,
                    opacity: [0, 1, 0],
                    scale: [0, 1.2, 0],
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.08,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>

            <motion.div
              className="card-apple relative overflow-visible"
              initial={{ rotateY: 90, scale: 0.8 }}
              animate={{ rotateY: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring", bounce: 0.3 }}
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
              }}
            >
              {/* 顶部装饰条 */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>
              {/* 关闭按钮 - 增强交互 */}
              <motion.button
                onClick={handleClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-apple-gray-200
                           hover:bg-apple-gray-300 flex items-center justify-center
                           transition-colors z-10"
              >
                <span className="text-apple-gray-600 font-bold">✕</span>
              </motion.button>

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

                {/* 价格信息 - 增强设计 */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-50"></div>
                    <div className="relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                      <span className="text-4xl font-bold text-white drop-shadow-lg">
                        ¥{drawnFood.price}
                      </span>
                    </div>
                  </motion.div>
                  {drawnFood.originalPrice && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-xl text-apple-gray-400 line-through"
                    >
                      ¥{drawnFood.originalPrice}
                    </motion.span>
                  )}
                </div>

                {/* 性价比评分 - 星级展示 */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="inline-flex items-center gap-3 px-6 py-3 mb-6 rounded-2xl
                             bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-200"
                >
                  <span className="text-amber-600 font-bold text-lg">性价比</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className="text-2xl"
                      >
                        {i < Math.floor(drawnFood.pricePerformanceScore / 2) ? '⭐' : '☆'}
                      </motion.span>
                    ))}
                  </div>
                  <span className="text-amber-700 font-semibold">
                    {drawnFood.pricePerformanceScore}/10
                  </span>
                </motion.div>

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

                {/* 再抽一次按钮 - 增加 hover 效果 */}
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0, 113, 227, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleClose();
                    setTimeout(handleDraw, 300);
                  }}
                  className="btn-apple w-full bg-gradient-to-r from-apple-blue to-purple-500
                             text-white font-semibold py-3 px-6 rounded-xl
                             shadow-apple transition-all"
                >
                  <motion.span
                    animate={{
                      opacity: [1, 0.7, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    再抽一次 ✨
                  </motion.span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Wrap with React.memo to prevent unnecessary re-renders
export default memo(BlindBox);
