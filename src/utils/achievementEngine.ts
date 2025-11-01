import type { Achievement, UserStats, AchievementNotification } from '../types/achievement';
import { achievementsConfig } from '../data/achievements';
import { getHistory } from './history';
import { loadUserPreference } from './recommendation';

const USER_STATS_KEY = 'chihao_user_stats';
const ACHIEVEMENT_NOTIFICATIONS_KEY = 'chihao_achievement_notifications';

export const initUserStats = (): UserStats => {
  return {
    totalDraws: 0,
    uniqueFoodsCount: 0,
    uniqueFoodIds: [],
    consecutiveDays: 0,
    lastVisitDate: '',
    visitDates: [],
    categoryStats: {},
    emotionFeedbackCount: 0,
    likedCount: 0,
    dislikedCount: 0,
    achievements: achievementsConfig.map(a => ({ ...a })),
    totalAchievementsUnlocked: 0,
  };
};

export const loadUserStats = (): UserStats => {
  try {
    const stored = localStorage.getItem(USER_STATS_KEY);
    if (stored) {
      const stats = JSON.parse(stored);
      const updatedAchievements = achievementsConfig.map(configAch => {
        const existingAch = stats.achievements?.find((a: Achievement) => a.id === configAch.id);
        return existingAch || { ...configAch };
      });
      return {
        ...stats,
        achievements: updatedAchievements,
      };
    }
  } catch (error) {
    console.error('Failed to load user stats:', error);
  }
  return initUserStats();
};

export const saveUserStats = (stats: UserStats): void => {
  try {
    localStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save user stats:', error);
  }
};

export const calculateConsecutiveDays = (visitDates: string[]): number => {
  if (visitDates.length === 0) return 0;

  const sortedDates = [...visitDates].sort().reverse();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let consecutive = 0;
  const currentDate = new Date(today);

  for (const dateStr of sortedDates) {
    const visitDate = new Date(dateStr);
    visitDate.setHours(0, 0, 0, 0);

    if (visitDate.getTime() === currentDate.getTime()) {
      consecutive++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (visitDate.getTime() < currentDate.getTime()) {
      break;
    }
  }

  return consecutive;
};

export const recordVisit = (): void => {
  const stats = loadUserStats();
  const today = new Date().toISOString().split('T')[0];

  if (!stats.visitDates.includes(today)) {
    stats.visitDates.push(today);
    stats.lastVisitDate = today;
    stats.consecutiveDays = calculateConsecutiveDays(stats.visitDates);
    saveUserStats(stats);
  }
};

export const updateUserStats = (): UserStats => {
  const stats = loadUserStats();
  const history = getHistory();
  const preference = loadUserPreference();

  stats.totalDraws = history.length;

  const uniqueFoodIds = new Set<string>();
  const categoryStats: Record<string, number> = {};
  let emotionFeedbackCount = 0;
  let likedCount = 0;
  let dislikedCount = 0;

  history.forEach(item => {
    uniqueFoodIds.add(item.food.id);

    const category = item.food.category;
    categoryStats[category] = (categoryStats[category] || 0) + 1;

    if (item.emotions && item.emotions.length > 0) {
      emotionFeedbackCount++;
    }

    if (item.liked) {
      likedCount++;
    } else {
      dislikedCount++;
    }
  });

  stats.uniqueFoodsCount = uniqueFoodIds.size;
  stats.uniqueFoodIds = Array.from(uniqueFoodIds);
  stats.categoryStats = categoryStats;
  stats.emotionFeedbackCount = emotionFeedbackCount;
  stats.likedCount = likedCount;
  stats.dislikedCount = dislikedCount;

  const categoriesExplored = Object.keys(categoryStats).length;

  const hasHighValueFood = history.some(
    item => item.food.pricePerformanceScore >= 9.0
  );

  const preferenceMaturity =
    preference.interactions.filter(i => i.liked).length >= 5 &&
    Object.values(preference.categoryPreference).some(weight => weight > 2);

  const achievements = stats.achievements.map(achievement => {
    const newAch = { ...achievement };

    switch (achievement.id) {
      case 'first-draw':
        newAch.progress = Math.min(stats.totalDraws, 1);
        if (stats.totalDraws >= 1 && !newAch.unlocked) {
          newAch.unlocked = true;
          newAch.unlockedAt = Date.now();
        }
        break;

      case 'food-explorer-10':
        newAch.progress = Math.min(stats.uniqueFoodsCount, 10);
        if (stats.uniqueFoodsCount >= 10 && !newAch.unlocked) {
          newAch.unlocked = true;
          newAch.unlockedAt = Date.now();
        }
        break;

      case 'food-explorer-50':
        newAch.progress = Math.min(stats.uniqueFoodsCount, 50);
        if (stats.uniqueFoodsCount >= 50 && !newAch.unlocked) {
          newAch.unlocked = true;
          newAch.unlockedAt = Date.now();
        }
        break;

      case 'food-explorer-100':
        newAch.progress = Math.min(stats.uniqueFoodsCount, 100);
        if (stats.uniqueFoodsCount >= 100 && !newAch.unlocked) {
          newAch.unlocked = true;
          newAch.unlockedAt = Date.now();
        }
        break;

      case 'all-categories':
        newAch.progress = categoriesExplored;
        if (categoriesExplored >= 6 && !newAch.unlocked) {
          newAch.unlocked = true;
          newAch.unlockedAt = Date.now();
        }
        break;

      case 'rare-hunter':
        newAch.progress = hasHighValueFood ? 1 : 0;
        if (hasHighValueFood && !newAch.unlocked) {
          newAch.unlocked = true;
          newAch.unlockedAt = Date.now();
        }
        break;

      case 'streak-3':
        newAch.progress = Math.min(stats.consecutiveDays, 3);
        if (stats.consecutiveDays >= 3 && !newAch.unlocked) {
          newAch.unlocked = true;
          newAch.unlockedAt = Date.now();
        }
        break;

      case 'streak-7':
        newAch.progress = Math.min(stats.consecutiveDays, 7);
        if (stats.consecutiveDays >= 7 && !newAch.unlocked) {
          newAch.unlocked = true;
          newAch.unlockedAt = Date.now();
        }
        break;

      case 'streak-30':
        newAch.progress = Math.min(stats.consecutiveDays, 30);
        if (stats.consecutiveDays >= 30 && !newAch.unlocked) {
          newAch.unlocked = true;
          newAch.unlockedAt = Date.now();
        }
        break;

      case 'draw-master-50':
        newAch.progress = Math.min(stats.totalDraws, 50);
        if (stats.totalDraws >= 50 && !newAch.unlocked) {
          newAch.unlocked = true;
          newAch.unlockedAt = Date.now();
        }
        break;

      case 'draw-master-100':
        newAch.progress = Math.min(stats.totalDraws, 100);
        if (stats.totalDraws >= 100 && !newAch.unlocked) {
          newAch.unlocked = true;
          newAch.unlockedAt = Date.now();
        }
        break;

      case 'draw-master-500':
        newAch.progress = Math.min(stats.totalDraws, 500);
        if (stats.totalDraws >= 500 && !newAch.unlocked) {
          newAch.unlocked = true;
          newAch.unlockedAt = Date.now();
        }
        break;

      case 'emotion-feedback-20':
        newAch.progress = Math.min(stats.emotionFeedbackCount, 20);
        if (stats.emotionFeedbackCount >= 20 && !newAch.unlocked) {
          newAch.unlocked = true;
          newAch.unlockedAt = Date.now();
        }
        break;

      case 'emotion-feedback-50':
        newAch.progress = Math.min(stats.emotionFeedbackCount, 50);
        if (stats.emotionFeedbackCount >= 50 && !newAch.unlocked) {
          newAch.unlocked = true;
          newAch.unlockedAt = Date.now();
        }
        break;

      case 'emotion-feedback-100':
        newAch.progress = Math.min(stats.emotionFeedbackCount, 100);
        if (stats.emotionFeedbackCount >= 100 && !newAch.unlocked) {
          newAch.unlocked = true;
          newAch.unlockedAt = Date.now();
        }
        break;

      case 'preference-mastery':
        newAch.progress = preferenceMaturity ? 1 : 0;
        if (preferenceMaturity && !newAch.unlocked) {
          newAch.unlocked = true;
          newAch.unlockedAt = Date.now();
        }
        break;

      case 'picky-foodie': {
        const minCount = Math.min(stats.likedCount, stats.dislikedCount);
        newAch.progress = Math.min(minCount, 20);
        if (stats.likedCount >= 20 && stats.dislikedCount >= 20 && !newAch.unlocked) {
          newAch.unlocked = true;
          newAch.unlockedAt = Date.now();
        }
        break;
      }
    }

    return newAch;
  });

  stats.achievements = achievements;
  stats.totalAchievementsUnlocked = achievements.filter(a => a.unlocked).length;

  saveUserStats(stats);
  return stats;
};

export const checkNewAchievements = (
  oldStats: UserStats
): { newlyUnlocked: Achievement[]; newStats: UserStats } => {
  const newStats = updateUserStats();
  const newlyUnlocked: Achievement[] = [];

  newStats.achievements.forEach(newAch => {
    const oldAch = oldStats.achievements.find(a => a.id === newAch.id);
    if (newAch.unlocked && (!oldAch || !oldAch.unlocked)) {
      newlyUnlocked.push(newAch);
    }
  });

  return { newlyUnlocked, newStats };
};

export const getAchievementNotifications = (): AchievementNotification[] => {
  try {
    const stored = localStorage.getItem(ACHIEVEMENT_NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const addAchievementNotification = (achievement: Achievement): void => {
  const notifications = getAchievementNotifications();
  notifications.push({
    achievement,
    timestamp: Date.now(),
  });
  localStorage.setItem(ACHIEVEMENT_NOTIFICATIONS_KEY, JSON.stringify(notifications.slice(-10)));
};

export const clearAchievementNotifications = (): void => {
  localStorage.removeItem(ACHIEVEMENT_NOTIFICATIONS_KEY);
};
