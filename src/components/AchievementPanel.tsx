import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Achievement, UserStats } from '../types/achievement';
import { AchievementCategory } from '../types/achievement';
import { AchievementBadge } from './AchievementBadge';
import { AchievementDetailModal } from './AchievementDetailModal';
import { StatsCard } from './StatsCard';
import { StatsChart } from './StatsChart';
import { getAggregatedStats } from '../utils/statsCalculator';

interface AchievementPanelProps {
  userStats: UserStats;
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementPanel: React.FC<AchievementPanelProps> = ({ userStats, isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const aggregatedStats = getAggregatedStats(userStats);

  const filteredAchievements = userStats.achievements.filter(ach => 
    selectedCategory === 'all' || ach.category === selectedCategory
  );

  const unlockedCount = userStats.achievements.filter(a => a.unlocked).length;
  const totalCount = userStats.achievements.length;
  const completionRate = Math.round((unlockedCount / totalCount) * 100);

  const categories = [
    { id: 'all', label: '全部', icon: '🎯' },
    { id: AchievementCategory.EXPLORATION, label: '探索', icon: '🔍' },
    { id: AchievementCategory.ACTIVITY, label: '活跃', icon: '⚡' },
    { id: AchievementCategory.PREFERENCE, label: '偏好', icon: '❤️' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="min-h-screen py-8 px-4"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-6xl mx-auto">
              <div className="relative bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-2xl rounded-[32px] p-8 shadow-2xl border border-white/50">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl" />

                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-8">
                    <motion.h2
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3"
                    >
                      <span className="text-5xl">🏆</span>
                      成就与统计
                    </motion.h2>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="text-3xl text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </motion.button>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-6 bg-gradient-to-r from-purple-100/80 to-pink-100/80 backdrop-blur-lg rounded-3xl border border-purple-200/30"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-purple-700">
                          总完成度：{completionRate}%
                        </h3>
                        <p className="text-purple-600 text-sm mt-1">
                          已解锁 {unlockedCount} / {totalCount} 个成就
                        </p>
                      </div>
                      <div className="text-5xl">
                        {completionRate === 100 ? '👑' : completionRate >= 50 ? '🌟' : '🎯'}
                      </div>
                    </div>
                    <div className="w-full h-3 bg-white/60 rounded-full mt-4 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${completionRate}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatsCard
                      icon="🎯"
                      label="总抽取次数"
                      value={aggregatedStats.totalDraws}
                      gradient="from-blue-500 to-cyan-500"
                      delay={0}
                    />
                    <StatsCard
                      icon="🍱"
                      label="尝试美食数"
                      value={aggregatedStats.uniqueFoodsCount}
                      gradient="from-green-500 to-emerald-500"
                      delay={0.1}
                    />
                    <StatsCard
                      icon="🔥"
                      label="连续天数"
                      value={aggregatedStats.consecutiveDays}
                      gradient="from-orange-500 to-red-500"
                      delay={0.2}
                    />
                    <StatsCard
                      icon="⭐"
                      label="最爱类别"
                      value={aggregatedStats.favoriteCategory}
                      gradient="from-purple-500 to-pink-500"
                      delay={0.3}
                    />
                  </div>

                  {aggregatedStats.categoryDistribution.length > 0 && (
                    <div className="mb-8">
                      <StatsChart
                        data={aggregatedStats.categoryDistribution}
                        title="美食类别分布"
                      />
                    </div>
                  )}

                  <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
                    {categories.map((category) => (
                      <motion.button
                        key={category.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(category.id as AchievementCategory | 'all')}
                        className={`
                          px-6 py-3 rounded-2xl font-semibold whitespace-nowrap
                          transition-all border-2
                          ${
                            selectedCategory === category.id
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-white/30 shadow-lg'
                              : 'bg-white/60 text-gray-600 border-gray-200 hover:bg-white/80'
                          }
                        `}
                      >
                        {category.icon} {category.label}
                      </motion.button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAchievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <AchievementBadge
                          achievement={achievement}
                          onClick={() => setSelectedAchievement(achievement)}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {filteredAchievements.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 text-gray-400"
                    >
                      <div className="text-5xl mb-4">🔍</div>
                      <p>该类别暂无成就</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <AchievementDetailModal
            achievement={selectedAchievement}
            onClose={() => setSelectedAchievement(null)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
