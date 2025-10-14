import { useState } from 'react';
import { motion } from 'framer-motion';
import BlindBox from './components/BlindBox';
import FeedbackPanel from './components/FeedbackPanel';
import type { Food } from './types/food';
import { EmotionTag } from './types/food';
import { recommendFood, recordInteraction, getUserStats } from './utils/recommendation';

function App() {
  const [currentFood, setCurrentFood] = useState<Food | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const handleDrawFood = (): Food => {
    const food = recommendFood();
    return food;
  };

  const handleResult = (food: Food) => {
    setCurrentFood(food);
    setShowFeedback(true);
  };

  const handleLike = () => {
    if (currentFood) {
      recordInteraction(currentFood.id, true);
      setShowFeedback(false);
      setCurrentFood(null);
    }
  };

  const handleDislike = () => {
    if (currentFood) {
      recordInteraction(currentFood.id, false);
      setShowFeedback(false);
      setCurrentFood(null);
    }
  };

  const handleEmotionSelect = (emotion: EmotionTag) => {
    if (currentFood) {
      recordInteraction(currentFood.id, true, emotion);
      setShowFeedback(false);
      setCurrentFood(null);
    }
  };

  const stats = getUserStats();

  return (
    <div className="min-h-screen bg-apple-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-apple sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold bg-gradient-to-r from-apple-blue to-purple-500
                       bg-clip-text text-transparent"
          >
            吃好
          </motion.h1>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowStats(!showStats)}
            className="px-4 py-2 rounded-full bg-apple-gray-100 hover:bg-apple-gray-200
                       text-apple-gray-700 font-medium transition-colors"
          >
            {showStats ? '隐藏' : '我的喜好'}
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats Panel */}
        {showStats && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card-apple mb-8"
          >
            <h2 className="text-2xl font-bold text-apple-gray-800 mb-4">
              我的喜好统计
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-apple-blue">
                  {stats.interactionCount}
                </div>
                <div className="text-sm text-apple-gray-600 mt-1">
                  总互动次数
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-apple-green">
                  {stats.likedCount}
                </div>
                <div className="text-sm text-apple-gray-600 mt-1">
                  喜欢的食物
                </div>
              </div>

              <div className="text-center">
                <div className="text-xl font-bold text-apple-orange">
                  {stats.favoriteCategory}
                </div>
                <div className="text-sm text-apple-gray-600 mt-1">
                  最爱类别
                </div>
              </div>

              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">
                  {stats.favoriteEmotion}
                </div>
                <div className="text-sm text-apple-gray-600 mt-1">
                  偏好情绪
                </div>
              </div>
            </div>

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
          </motion.div>
        )}

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold text-apple-gray-800 mb-4">
            今天吃什么？
          </h2>
          <p className="text-xl text-apple-gray-600">
            为学生精选高性价比美食，每一次都是惊喜
          </p>
        </motion.div>

        {/* Blind Box */}
        <div className="mb-8">
          <BlindBox onDrawFood={handleDrawFood} onResult={handleResult} />
        </div>

        {/* Feedback Panel */}
        {showFeedback && currentFood && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-apple"
          >
            <h3 className="text-xl font-semibold text-apple-gray-800 mb-4 text-center">
              觉得这个推荐怎么样？
            </h3>

            <FeedbackPanel
              onLike={handleLike}
              onDislike={handleDislike}
              onEmotionSelect={handleEmotionSelect}
              showEmotions={true}
            />
          </motion.div>
        )}

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-3 gap-6 mt-16"
        >
          <div className="card-apple text-center">
            <div className="text-4xl mb-3">🎲</div>
            <h3 className="font-semibold text-apple-gray-800 mb-2">
              盲盒式体验
            </h3>
            <p className="text-sm text-apple-gray-600">
              每次抽取都是惊喜，让选择困难症不再纠结
            </p>
          </div>

          <div className="card-apple text-center">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="font-semibold text-apple-gray-800 mb-2">
              高性价比
            </h3>
            <p className="text-sm text-apple-gray-600">
              专为学生群体筛选，好吃不贵才是王道
            </p>
          </div>

          <div className="card-apple text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-semibold text-apple-gray-800 mb-2">
              智能推荐
            </h3>
            <p className="text-sm text-apple-gray-600">
              根据你的喜好学习，越用越懂你
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-apple-gray-500 text-sm">
        <p>吃好 - 让每一餐都有性价比</p>
      </footer>
    </div>
  );
}

export default App;
