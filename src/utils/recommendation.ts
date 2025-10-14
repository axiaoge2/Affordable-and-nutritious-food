import type { Food, UserPreference, UserInteraction } from '../types/food';
import { FoodCategory, EmotionTag } from '../types/food';
import { mockFoods } from '../data/mockFoods';

// 本地存储的key
const PREFERENCE_KEY = 'chihao_user_preference';

// 初始化用户偏好
const initUserPreference = (): UserPreference => {
  return {
    categoryPreference: {
      [FoodCategory.BREAKFAST]: 1,
      [FoodCategory.LUNCH]: 1,
      [FoodCategory.DINNER]: 1,
      [FoodCategory.SNACK]: 1,
      [FoodCategory.DRINK]: 1,
      [FoodCategory.DESSERT]: 1,
    },
    emotionPreference: {
      [EmotionTag.HAPPY]: 1,
      [EmotionTag.COMFORT]: 1,
      [EmotionTag.ENERGETIC]: 1,
      [EmotionTag.RELAXING]: 1,
      [EmotionTag.NOSTALGIC]: 1,
      [EmotionTag.EXCITING]: 1,
    },
    priceRange: [0, 50],
    interactions: [],
  };
};

// 从本地存储加载偏好
export const loadUserPreference = (): UserPreference => {
  try {
    const stored = localStorage.getItem(PREFERENCE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load user preference:', error);
  }
  return initUserPreference();
};

// 保存偏好到本地存储
export const saveUserPreference = (preference: UserPreference): void => {
  try {
    localStorage.setItem(PREFERENCE_KEY, JSON.stringify(preference));
  } catch (error) {
    console.error('Failed to save user preference:', error);
  }
};

// 记录用户交互
export const recordInteraction = (
  foodId: string,
  liked: boolean,
  emotionFeedback?: EmotionTag
): void => {
  const preference = loadUserPreference();
  const food = mockFoods.find(f => f.id === foodId);

  if (!food) return;

  // 添加交互记录
  const interaction: UserInteraction = {
    foodId,
    timestamp: Date.now(),
    liked,
    emotionFeedback,
  };

  preference.interactions.push(interaction);

  // 更新偏好权重（只在用户喜欢时增加权重）
  if (liked) {
    // 更新类别偏好
    preference.categoryPreference[food.category] += 0.2;

    // 更新情绪标签偏好
    food.emotionTags.forEach(tag => {
      preference.emotionPreference[tag] += 0.3;
    });

    // 如果用户提供了情绪反馈，额外增加该标签的权重
    if (emotionFeedback) {
      preference.emotionPreference[emotionFeedback] += 0.5;
    }

    // 更新价格偏好范围（逐渐调整到用户喜欢的价格区间）
    const currentPrice = food.price;
    const [minPrice, maxPrice] = preference.priceRange;

    if (currentPrice < minPrice) {
      preference.priceRange[0] = Math.max(0, minPrice - 2);
    } else if (currentPrice > maxPrice) {
      preference.priceRange[1] = maxPrice + 2;
    }
  }

  // 保留最近100条交互记录
  if (preference.interactions.length > 100) {
    preference.interactions = preference.interactions.slice(-100);
  }

  saveUserPreference(preference);
};

// 计算食物与用户偏好的匹配分数
const calculateMatchScore = (food: Food, preference: UserPreference): number => {
  let score = 0;

  // 类别匹配分数 (权重: 30%)
  const categoryScore = preference.categoryPreference[food.category] || 1;
  score += categoryScore * 0.3;

  // 情绪标签匹配分数 (权重: 30%)
  let emotionScore = 0;
  food.emotionTags.forEach(tag => {
    emotionScore += preference.emotionPreference[tag] || 1;
  });
  emotionScore = emotionScore / Math.max(food.emotionTags.length, 1);
  score += emotionScore * 0.3;

  // 价格匹配分数 (权重: 20%)
  const [minPrice, maxPrice] = preference.priceRange;
  const priceScore = food.price >= minPrice && food.price <= maxPrice ? 2 : 1;
  score += priceScore * 0.2;

  // 性价比分数 (权重: 20%)
  score += (food.pricePerformanceScore / 10) * 0.2;

  return score;
};

// 推荐食物（基于用户偏好）
export const recommendFood = (): Food => {
  const preference = loadUserPreference();
  const interactionCount = preference.interactions.length;

  // 如果交互次数少于5次，返回随机食物
  if (interactionCount < 5) {
    const randomIndex = Math.floor(Math.random() * mockFoods.length);
    return mockFoods[randomIndex];
  }

  // 计算每个食物的匹配分数
  const foodScores = mockFoods.map(food => ({
    food,
    score: calculateMatchScore(food, preference),
  }));

  // 排序
  foodScores.sort((a, b) => b.score - a.score);

  // 使用加权随机选择（前30%的食物有更高概率被选中）
  const topCount = Math.ceil(foodScores.length * 0.3);
  const topFoods = foodScores.slice(0, topCount);

  // 计算权重总和
  const totalWeight = topFoods.reduce((sum, item) => sum + item.score, 0);

  // 加权随机选择
  let random = Math.random() * totalWeight;
  for (const item of topFoods) {
    random -= item.score;
    if (random <= 0) {
      return item.food;
    }
  }

  // 兜底返回第一个
  return topFoods[0].food;
};

// 获取用户统计信息
export const getUserStats = () => {
  const preference = loadUserPreference();
  const interactionCount = preference.interactions.length;
  const likedCount = preference.interactions.filter(i => i.liked).length;

  // 最喜欢的类别
  const favCategory = Object.entries(preference.categoryPreference)
    .sort(([, a], [, b]) => b - a)[0];

  // 最喜欢的情绪标签
  const favEmotion = Object.entries(preference.emotionPreference)
    .sort(([, a], [, b]) => b - a)[0];

  return {
    interactionCount,
    likedCount,
    favoriteCategory: favCategory?.[0] || 'unknown',
    favoriteEmotion: favEmotion?.[0] || 'unknown',
    priceRange: preference.priceRange,
  };
};

// 重置用户偏好
export const resetUserPreference = (): void => {
  const initial = initUserPreference();
  saveUserPreference(initial);
};
