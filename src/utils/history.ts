import type { Food } from '../types/food';

export interface HistoryItem {
  id: string;
  food: Food;
  timestamp: number;
  liked: boolean;
  emotions?: string[];
}

const HISTORY_KEY = 'chihao_history';
const MAX_HISTORY = 50;

// 获取历史记录
export const getHistory = (): HistoryItem[] => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// 添加历史记录
export const addToHistory = (
  food: Food,
  liked: boolean,
  emotions?: string[]
): void => {
  const history = getHistory();
  const newItem: HistoryItem = {
    id: `${Date.now()}_${Math.random()}`,
    food,
    timestamp: Date.now(),
    liked,
    emotions
  };

  // 添加到开头，保留最新的记录
  history.unshift(newItem);

  // 限制历史记录数量
  const trimmedHistory = history.slice(0, MAX_HISTORY);

  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
};

// 清空历史记录
export const clearHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY);
};

// 获取统计数据
export const getHistoryStats = () => {
  const history = getHistory();
  const likedItems = history.filter(item => item.liked);

  // 统计最喜欢的食物类别
  const categoryCount: Record<string, number> = {};
  likedItems.forEach(item => {
    const category = item.food.category;
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });

  const favoriteCategory = Object.entries(categoryCount)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || '暂无';

  // 统计最常见的情绪
  const emotionCount: Record<string, number> = {};
  likedItems.forEach(item => {
    item.emotions?.forEach(emotion => {
      emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
    });
  });

  const favoriteEmotion = Object.entries(emotionCount)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || '暂无';

  // 最近7天的抽取趋势
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const recentDraws = history.filter(item => item.timestamp > sevenDaysAgo);

  return {
    totalDraws: history.length,
    likedCount: likedItems.length,
    likeRate: history.length > 0
      ? ((likedItems.length / history.length) * 100).toFixed(1)
      : '0',
    favoriteCategory,
    favoriteEmotion,
    recentDrawsCount: recentDraws.length,
    recentLikedCount: recentDraws.filter(item => item.liked).length
  };
};

// 获取今日统计
export const getTodayStats = () => {
  const history = getHistory();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();

  const todayHistory = history.filter(item => item.timestamp >= todayTimestamp);
  const todayLiked = todayHistory.filter(item => item.liked);

  return {
    drawsToday: todayHistory.length,
    likedToday: todayLiked.length
  };
};
