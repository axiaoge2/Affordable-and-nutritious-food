// 食物类型枚举
export const FoodCategory = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack',
  DRINK: 'drink',
  DESSERT: 'dessert',
} as const;

export type FoodCategory = typeof FoodCategory[keyof typeof FoodCategory];

// 情绪标签
export const EmotionTag = {
  HAPPY: '开心',
  COMFORT: '治愈',
  ENERGETIC: '元气',
  RELAXING: '放松',
  NOSTALGIC: '怀旧',
  EXCITING: '刺激',
} as const;

export type EmotionTag = typeof EmotionTag[keyof typeof EmotionTag];

// 食物接口
export interface Food {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // 原价，用于计算性价比
  category: FoodCategory;
  location: string; // 位置/店铺
  imageUrl?: string;
  rating: number; // 评分 1-5
  tags: string[]; // 特色标签
  emotionTags: EmotionTag[]; // 情绪标签
  pricePerformanceScore: number; // 性价比分数 1-10
}

// 用户交互记录
export interface UserInteraction {
  foodId: string;
  timestamp: number;
  liked: boolean;
  emotionFeedback?: EmotionTag;
}

// 用户偏好
export interface UserPreference {
  categoryPreference: Record<FoodCategory, number>; // 类目偏好权重
  emotionPreference: Record<EmotionTag, number>; // 情绪标签偏好
  priceRange: [number, number]; // 价格区间偏好
  interactions: UserInteraction[]; // 交互历史
}
