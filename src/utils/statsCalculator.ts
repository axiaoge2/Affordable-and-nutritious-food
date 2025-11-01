import type { UserStats } from '../types/achievement';
import { FoodCategory } from '../types/food';

export interface AggregatedStats {
  totalDraws: number;
  uniqueFoodsCount: number;
  consecutiveDays: number;
  favoriteCategory: string;
  categoryDistribution: { name: string; value: number }[];
  collectionProgress: { category: string; value: number; total: number }[];
}

const CATEGORY_LABELS: Record<string, string> = {
  [FoodCategory.BREAKFAST]: '早餐',
  [FoodCategory.LUNCH]: '午餐',
  [FoodCategory.DINNER]: '晚餐',
  [FoodCategory.SNACK]: '小吃',
  [FoodCategory.DRINK]: '饮品',
  [FoodCategory.DESSERT]: '甜品',
};

const CATEGORY_TOTALS: Record<string, number> = {
  [FoodCategory.BREAKFAST]: 3,
  [FoodCategory.LUNCH]: 4,
  [FoodCategory.DINNER]: 3,
  [FoodCategory.SNACK]: 3,
  [FoodCategory.DRINK]: 1,
  [FoodCategory.DESSERT]: 1,
};

export const translateCategory = (category: string): string => {
  return CATEGORY_LABELS[category] || category;
};

export const getAggregatedStats = (stats: UserStats): AggregatedStats => {
  const favoriteCategoryEntry = Object.entries(stats.categoryStats)
    .sort(([, a], [, b]) => b - a)[0];

  const favoriteCategory = favoriteCategoryEntry
    ? translateCategory(favoriteCategoryEntry[0])
    : '暂无';

  const categoryDistribution = Object.entries(stats.categoryStats).map(([category, value]) => ({
    name: translateCategory(category),
    value,
  }));

  const collectionProgress = Object.keys(CATEGORY_TOTALS).map(category => ({
    category: translateCategory(category),
    value: stats.categoryStats[category] || 0,
    total: CATEGORY_TOTALS[category],
  }));

  return {
    totalDraws: stats.totalDraws,
    uniqueFoodsCount: stats.uniqueFoodsCount,
    consecutiveDays: stats.consecutiveDays,
    favoriteCategory,
    categoryDistribution,
    collectionProgress,
  };
};
