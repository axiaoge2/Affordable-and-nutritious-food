export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  unlocked: boolean;
  unlockedAt?: number;
  progress: number;
  requirement: number;
  rarity: AchievementRarity;
}

export const AchievementCategory = {
  EXPLORATION: 'exploration',
  ACTIVITY: 'activity',
  PREFERENCE: 'preference',
} as const;

export type AchievementCategory = typeof AchievementCategory[keyof typeof AchievementCategory];

export const AchievementRarity = {
  COMMON: 'common',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
} as const;

export type AchievementRarity = typeof AchievementRarity[keyof typeof AchievementRarity];

export interface UserStats {
  totalDraws: number;
  uniqueFoodsCount: number;
  uniqueFoodIds: string[];
  consecutiveDays: number;
  lastVisitDate: string;
  visitDates: string[];
  categoryStats: Record<string, number>;
  emotionFeedbackCount: number;
  likedCount: number;
  dislikedCount: number;
  achievements: Achievement[];
  totalAchievementsUnlocked: number;
}

export interface AchievementNotification {
  achievement: Achievement;
  timestamp: number;
}
