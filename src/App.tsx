import { useState } from 'react';
import { motion } from 'framer-motion';
import BlindBox from './components/BlindBox';
import FeedbackPanel from './components/FeedbackPanel';
import FoodDetailModal from './components/FoodDetailModal';
import { ToastContainer } from './components/Toast';
import { ParticleBackground } from './components/ParticleBackground';
import { FloatingActionButton } from './components/FloatingActionButton';
import type { Food } from './types/food';
import { EmotionTag } from './types/food';
import { recommendFood, recordInteraction, getUserStats } from './utils/recommendation';
import { addToHistory, getHistoryStats, clearHistory } from './utils/history';
import { celebrateSuccess } from './utils/confetti';
import { fadeInUp, slideInLeft, slideInRight, staggerContainer, staggerItem, viewport } from './utils/scrollReveal';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

function App() {
  const [currentFood, setCurrentFood] = useState<Food | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // 显示Toast通知
  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const newToast: Toast = {
      id: `${Date.now()}_${Math.random()}`,
      message,
      type
    };
    setToasts(prev => [...prev, newToast]);
  };

  // 移除Toast
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleDrawFood = (): Food => {
    const food = recommendFood();
    showToast(`抽到了 ${food.name}！`, 'success');
    return food;
  };

  const handleResult = (food: Food) => {
    setCurrentFood(food);
    setShowFeedback(true);
    addToHistory(food, false); // 先添加基础记录
  };

  const handleLike = () => {
    if (currentFood) {
      recordInteraction(currentFood.id, true);
      addToHistory(currentFood, true);
      celebrateSuccess(); // 触发五彩纸屑
      showToast('已添加到喜欢列表 ❤️', 'success');
      setShowFeedback(false);
      setCurrentFood(null);
    }
  };

  const handleDislike = () => {
    if (currentFood) {
      recordInteraction(currentFood.id, false);
      addToHistory(currentFood, false);
      showToast('已记录你的偏好', 'info');
      setShowFeedback(false);
      setCurrentFood(null);
    }
  };

  const handleEmotionSelect = (emotion: EmotionTag) => {
    if (currentFood) {
      recordInteraction(currentFood.id, true, emotion);
      addToHistory(currentFood, true, [emotion]);
      celebrateSuccess();
      showToast(`标记为 ${emotion} 的感觉 ✨`, 'success');
      setShowFeedback(false);
      setCurrentFood(null);
    }
  };

  // 查看详情
  const handleViewDetail = () => {
    setShowDetailModal(true);
  };

  const stats = getUserStats();
  const historyStats = getHistoryStats();

  // 悬浮按钮操作
  const floatingActions = [
    {
      icon: '📊',
      label: showStats ? '隐藏统计' : '查看统计',
      onClick: () => setShowStats(!showStats),
      color: 'text-apple-blue'
    },
    {
      icon: '🔄',
      label: '清空历史',
      onClick: () => {
        if (confirm('确定要清空所有历史记录吗？')) {
          clearHistory();
          showToast('历史记录已清空', 'info');
          window.location.reload();
        }
      },
      color: 'text-red-600'
    },
    {
      icon: '🎯',
      label: '立即抽取',
      onClick: () => {
        const food = handleDrawFood();
        handleResult(food);
      },
      color: 'text-apple-green'
    }
  ];

  return (
    <div className="min-h-screen bg-apple-gray-50 relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Toast通知容器 */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* 食物详情模态框 */}
      <FoodDetailModal
        food={currentFood}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />

      {/* Header - Glassmorphism Effect */}
      <header className="bg-white/80 backdrop-blur-2xl shadow-xl sticky top-0 z-50 border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-4xl"
            >
              🍜
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
                         bg-clip-text text-transparent drop-shadow-lg">
              吃好
            </h1>
          </motion.div>

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowStats(!showStats)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500
                       text-white font-semibold shadow-lg hover:shadow-xl
                       transition-all border-2 border-white/30"
          >
            {showStats ? '隐藏统计' : '我的喜好 ✨'}
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats Panel - Glassmorphism */}
        {showStats && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="relative bg-gradient-to-br from-white/70 via-white/60 to-white/50
                       backdrop-blur-2xl rounded-[32px] p-8 shadow-2xl
                       border-2 border-white/40 mb-8 overflow-hidden"
          >
            {/* 装饰性背景渐变 */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600
                           bg-clip-text text-transparent mb-6 flex items-center gap-3"
              >
                <span className="text-4xl">📊</span>
                我的喜好统计
              </motion.h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { value: stats.interactionCount, label: '总互动次数', color: 'from-blue-500 to-cyan-500', icon: '🎯' },
                  { value: stats.likedCount, label: '喜欢的食物', color: 'from-green-500 to-emerald-500', icon: '❤️' },
                  { value: stats.favoriteCategory, label: '最爱类别', color: 'from-orange-500 to-red-500', icon: '🏆' },
                  { value: stats.favoriteEmotion, label: '偏好情绪', color: 'from-purple-500 to-pink-500', icon: '✨' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
                    }}
                    className="relative bg-white/60 backdrop-blur-xl rounded-3xl p-6 text-center
                               border-2 border-white/50 shadow-xl overflow-hidden group"
                  >
                    {/* 悬停渐变背景 */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10`}
                      transition={{ duration: 0.3 }}
                    />

                    <div className="relative z-10">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: index * 0.3,
                          ease: "easeInOut"
                        }}
                        className="text-4xl mb-3"
                      >
                        {stat.icon}
                      </motion.div>
                      <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color}
                                      bg-clip-text text-transparent mb-2`}>
                        {stat.value}
                      </div>
                      <div className="text-sm text-apple-gray-600 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 历史统计 */}
            {historyStats.totalDraws > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 p-4 bg-gradient-to-r from-purple-100/80 to-pink-100/80 backdrop-blur-lg rounded-2xl border border-purple-200/30"
              >
                <h3 className="text-sm font-semibold text-apple-gray-700 mb-3">
                  📊 历史数据
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {historyStats.totalDraws}
                    </div>
                    <div className="text-xs text-apple-gray-600 mt-1">
                      累计抽取
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-pink-600">
                      {historyStats.likeRate}%
                    </div>
                    <div className="text-xs text-apple-gray-600 mt-1">
                      喜欢比率
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">
                      {historyStats.recentDrawsCount}
                    </div>
                    <div className="text-xs text-apple-gray-600 mt-1">
                      近7天抽取
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {stats.interactionCount < 5 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-blue-50 rounded-xl"
              >
                <p className="text-sm text-blue-700 text-center">
                  💡 多与食物互动几次，系统会根据你的喜好智能推荐哦！
                  (当前 {stats.interactionCount}/5)
                </p>
              </motion.div>
            )}
            </div>
          </motion.div>
        )}

        {/* Hero Section - Scroll Reveal */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-12 relative"
        >
          {/* 装饰性图标动画 - 减少数量 */}
          <div className="absolute inset-0 pointer-events-none">
            {['🍕', '🍜', '🍱', '🍔'].map((emoji, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl opacity-15"
                style={{
                  left: `${15 + i * 25}%`,
                  top: `${i % 2 === 0 ? '10%' : '70%'}`,
                  willChange: 'transform, opacity',
                }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </div>

          <motion.h2
            className="relative text-6xl font-bold mb-6"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            今天吃什么？
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl text-apple-gray-600 font-medium"
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
              为学生精选高性价比美食，每一次都是惊喜 🎁
            </span>
          </motion.p>
        </motion.div>

        {/* Blind Box */}
        <div className="mb-8">
          <BlindBox onDrawFood={handleDrawFood} onResult={handleResult} />
        </div>

        {/* Feedback Panel - Glassmorphism */}
        {showFeedback && currentFood && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative bg-gradient-to-br from-white/80 via-white/70 to-white/60
                       backdrop-blur-2xl rounded-[32px] p-8 shadow-2xl
                       border-2 border-white/50 overflow-hidden"
          >
            {/* 装饰性背景 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              {/* 查看详情按钮 */}
              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)'
                }}
                whileTap={{ scale: 0.98 }}
                onClick={handleViewDetail}
                className="w-full mb-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                           text-white font-bold text-lg shadow-xl hover:shadow-2xl
                           transition-all flex items-center justify-center gap-3
                           border-2 border-white/30 relative overflow-hidden group"
              >
                {/* 光泽效果 */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: ['-200%', '200%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <motion.span
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="text-2xl"
                >
                  ✨
                </motion.span>
                <span className="relative z-10">查看食物详情</span>
              </motion.button>

              <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600
                           bg-clip-text text-transparent">
                觉得这个推荐怎么样？
              </h3>

              <FeedbackPanel
                onLike={handleLike}
                onDislike={handleDislike}
                onEmotionSelect={handleEmotionSelect}
                showEmotions={true}
              />
            </div>
          </motion.div>
        )}

        {/* Features - Scroll Reveal with Stagger */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8 mt-16"
        >
          {[
            { icon: '🎲', title: '盲盒式体验', desc: '每次抽取都是惊喜,让选择困难症不再纠结', color: 'from-blue-500 to-purple-500', bgColor: 'from-blue-400/20 to-purple-400/20' },
            { icon: '💰', title: '高性价比', desc: '专为学生群体筛选，好吃不贵才是王道', color: 'from-green-500 to-emerald-500', bgColor: 'from-green-400/20 to-emerald-400/20' },
            { icon: '🎯', title: '智能推荐', desc: '根据你的喜好学习，越用越懂你', color: 'from-orange-500 to-red-500', bgColor: 'from-orange-400/20 to-red-400/20' }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={staggerItem}
              whileHover={{
                y: -15,
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              className="relative bg-white/80 backdrop-blur-xl rounded-[32px] p-8 border-2 border-white/50 shadow-2xl text-center overflow-hidden group"
              style={{
                transformStyle: 'preserve-3d',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* 装饰性背景渐变 */}
              <motion.div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.bgColor} rounded-full blur-2xl`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.5,
                  ease: "easeInOut"
                }}
              />

              {/* Hover gradient effect */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10`}
                transition={{ duration: 0.3 }}
              />

              {/* 图标 - 增强动画 */}
              <motion.div
                className="relative z-10 mb-4 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-xl"
                whileHover={{
                  scale: 1.2,
                  rotate: [0, -15, 15, -15, 0],
                }}
                transition={{ duration: 0.6 }}
              >
                <motion.span
                  className="text-5xl"
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3,
                    ease: "easeInOut"
                  }}
                >
                  {feature.icon}
                </motion.span>
              </motion.div>

              <h3 className={`font-bold text-xl mb-3 relative z-10 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                {feature.title}
              </h3>
              <p className="text-base text-apple-gray-600 relative z-10 leading-relaxed">
                {feature.desc}
              </p>

              {/* 装饰性粒子 - 减少数量 */}
              {[...Array(2)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-br from-white to-gray-300"
                  style={{
                    left: `${30 + i * 40}%`,
                    bottom: `${20 + i * 20}%`,
                    willChange: 'transform, opacity',
                  }}
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.5 + index * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer - 添加淡入效果 */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative text-center py-12 mt-16 overflow-hidden"
      >
        {/* 装饰性背景 */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-100/50 via-pink-100/30 to-transparent"></div>

        <div className="relative z-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            <p className="text-lg font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600
                         bg-clip-text text-transparent mb-2">
              吃好 - 让每一餐都有性价比
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex items-center justify-center gap-2 text-apple-gray-500 text-sm"
          >
            <motion.span
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🍜
            </motion.span>
            <span>用心为学生推荐每一份美食</span>
          </motion.div>
        </div>
      </motion.footer>

      {/* Floating Action Button */}
      <FloatingActionButton actions={floatingActions} />
    </div>
  );
}

export default App;
