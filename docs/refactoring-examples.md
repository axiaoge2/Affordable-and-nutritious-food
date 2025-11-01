# 重构代码示例与实现指南

本文档提供架构重构的详细代码示例，涵盖自定义 Hook、Context API、服务层设计、组件拆分等核心改造点。

---

## 目录

1. [类型系统扩展](#1-类型系统扩展)
2. [服务层设计](#2-服务层设计)
3. [自定义 Hooks](#3-自定义-hooks)
4. [Context 状态管理](#4-context-状态管理)
5. [组件拆分实例](#5-组件拆分实例)
6. [性能优化 Hooks](#6-性能优化-hooks)

---

## 1. 类型系统扩展

### 1.1 统一 Toast 类型定义

```typescript
// src/types/ui.ts
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // 可选的自定义持续时间
}

export interface ModalState {
  isOpen: boolean;
  onClose: () => void;
}

export type AnimationPreset = 'reduced' | 'normal' | 'high';
```

### 1.2 扩展 Stats 类型

```typescript
// src/types/stats.ts
import type { FoodCategory, EmotionTag } from './food';

export interface UserStats {
  interactionCount: number;
  likedCount: number;
  dislikedCount: number;
  favoriteCategory: FoodCategory | 'unknown';
  favoriteEmotion: EmotionTag | 'unknown';
  priceRange: [number, number];
  avgPriceOfLikedFoods?: number;
}

export interface HistoryStats {
  totalDraws: number;
  likedCount: number;
  likeRate: string; // 百分比字符串，如 "78.5"
  favoriteCategory: string;
  favoriteEmotion: string;
  recentDrawsCount: number;
  recentLikedCount: number;
}

export interface TodayStats {
  drawsToday: number;
  likedToday: number;
}
```

---

## 2. 服务层设计

### 2.1 通用 Storage 服务

```typescript
// src/services/storageService.ts

/** 通用 LocalStorage 操作封装，支持类型安全与错误处理 */
export class StorageService {
  /**
   * 读取存储项
   * @param key 存储键
   * @param fallback 读取失败时的回退值
   * @returns 解析后的值或回退值
   */
  static get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch (error) {
      console.warn(`[StorageService] Failed to read key: ${key}`, error);
      return fallback;
    }
  }

  /**
   * 写入存储项
   * @param key 存储键
   * @param value 要存储的值
   */
  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`[StorageService] Failed to write key: ${key}`, error);
      // 可选：触发全局错误通知
      if (this.onQuotaExceeded) {
        this.onQuotaExceeded(key);
      }
    }
  }

  /**
   * 删除存储项
   * @param key 存储键
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`[StorageService] Failed to remove key: ${key}`, error);
    }
  }

  /**
   * 清空所有存储（谨慎使用）
   */
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('[StorageService] Failed to clear storage', error);
    }
  }

  /**
   * 检查存储可用性
   */
  static isAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 存储配额超限回调（可选）
   */
  static onQuotaExceeded?: (key: string) => void;
}
```

### 2.2 UserPreference 服务

```typescript
// src/services/userPreferenceService.ts
import type { UserPreference } from '../types/food';
import { FoodCategory, EmotionTag } from '../types/food';
import { StorageService } from './storageService';

const PREFERENCE_KEY = 'chihao_user_preference';

export class UserPreferenceService {
  private static defaultPreference: UserPreference = {
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

  static load(): UserPreference {
    return StorageService.get(PREFERENCE_KEY, this.defaultPreference);
  }

  static save(preference: UserPreference): void {
    // 限制交互记录数量，避免存储膨胀
    if (preference.interactions.length > 100) {
      preference.interactions = preference.interactions.slice(-100);
    }
    StorageService.set(PREFERENCE_KEY, preference);
  }

  static reset(): void {
    StorageService.set(PREFERENCE_KEY, this.defaultPreference);
  }

  /**
   * 迁移旧版本数据（可选）
   */
  static migrate(): void {
    const pref = this.load();
    // 示例：检查并修复可能缺失的字段
    if (!pref.priceRange) {
      pref.priceRange = [0, 50];
      this.save(pref);
    }
  }
}
```

---

## 3. 自定义 Hooks

### 3.1 useToast Hook

```typescript
// src/hooks/useToast.tsx
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ToastContainer } from '../components/Toast';
import type { Toast } from '../types/ui';

interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type'], duration?: number) => void;
  dismissToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: Toast['type'] = 'info', duration?: number) => {
      const newToast: Toast = {
        id: crypto.randomUUID(),
        message,
        type,
        duration,
      };
      setToasts(prev => [...prev, newToast]);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value = useMemo(
    () => ({ toasts, showToast, dismissToast, clearAll }),
    [toasts, showToast, dismissToast, clearAll]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={dismissToast} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
};
```

### 3.2 useFoodDraw Hook

```typescript
// src/hooks/useFoodDraw.ts
import { useState, useCallback } from 'react';
import type { Food, EmotionTag } from '../types/food';
import { recommendFood, recordInteraction } from '../utils/recommendation';
import { addToHistory } from '../utils/history';

interface UseFoodDrawOptions {
  onAfterDraw?: (food: Food) => void;
  onFeedback?: (food: Food, liked: boolean, emotion?: EmotionTag) => void;
}

interface UseFoodDrawReturn {
  currentFood: Food | null;
  isProcessing: boolean;
  drawFood: () => Food;
  submitLike: (emotion?: EmotionTag) => void;
  submitDislike: () => void;
  reset: () => void;
}

export const useFoodDraw = (options: UseFoodDrawOptions = {}): UseFoodDrawReturn => {
  const { onAfterDraw, onFeedback } = options;
  const [currentFood, setCurrentFood] = useState<Food | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const drawFood = useCallback(() => {
    setIsProcessing(true);
    const food = recommendFood();
    setCurrentFood(food);
    addToHistory(food, false);
    onAfterDraw?.(food);
    setIsProcessing(false);
    return food;
  }, [onAfterDraw]);

  const submitLike = useCallback(
    (emotion?: EmotionTag) => {
      if (!currentFood) return;
      recordInteraction(currentFood.id, true, emotion);
      addToHistory(currentFood, true, emotion ? [emotion] : undefined);
      onFeedback?.(currentFood, true, emotion);
      setCurrentFood(null);
    },
    [currentFood, onFeedback]
  );

  const submitDislike = useCallback(() => {
    if (!currentFood) return;
    recordInteraction(currentFood.id, false);
    addToHistory(currentFood, false);
    onFeedback?.(currentFood, false);
    setCurrentFood(null);
  }, [currentFood, onFeedback]);

  const reset = useCallback(() => {
    setCurrentFood(null);
    setIsProcessing(false);
  }, []);

  return {
    currentFood,
    isProcessing,
    drawFood,
    submitLike,
    submitDislike,
    reset,
  };
};
```

### 3.3 useHistoryStats Hook（带缓存）

```typescript
// src/hooks/useHistoryStats.ts
import { useMemo } from 'react';
import { getHistoryStats, getTodayStats } from '../utils/history';
import type { HistoryStats, TodayStats } from '../types/stats';

interface UseHistoryStatsReturn {
  historyStats: HistoryStats;
  todayStats: TodayStats;
  hasHistory: boolean;
}

/**
 * 封装历史统计数据读取，使用 useMemo 减少不必要的重新计算
 */
export const useHistoryStats = (): UseHistoryStatsReturn => {
  const historyStats = useMemo(() => getHistoryStats(), []);
  const todayStats = useMemo(() => getTodayStats(), []);
  const hasHistory = historyStats.totalDraws > 0;

  return {
    historyStats,
    todayStats,
    hasHistory,
  };
};
```

### 3.4 useModal Hook（通用弹窗管理）

```typescript
// src/hooks/useModal.ts
import { useState, useCallback } from 'react';

interface UseModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useModal = (initialOpen = false): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return { isOpen, open, close, toggle };
};
```

---

## 4. Context 状态管理

### 4.1 UserPreferenceContext

```typescript
// src/contexts/UserPreferenceContext.tsx
import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { UserPreference } from '../types/food';
import { UserPreferenceService } from '../services/userPreferenceService';
import { getUserStats } from '../utils/recommendation';
import type { UserStats } from '../types/stats';

interface UserPreferenceContextValue {
  preference: UserPreference;
  stats: UserStats;
  refreshStats: () => void;
  resetPreference: () => void;
}

const UserPreferenceContext = createContext<UserPreferenceContextValue | null>(null);

export const UserPreferenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preference, setPreference] = useState<UserPreference>(() =>
    UserPreferenceService.load()
  );

  const stats = useMemo(() => getUserStats(), [preference.interactions.length]);

  const refreshStats = useCallback(() => {
    setPreference(UserPreferenceService.load());
  }, []);

  const resetPreference = useCallback(() => {
    UserPreferenceService.reset();
    setPreference(UserPreferenceService.load());
  }, []);

  // 监听 storage 事件，处理多标签页同步（可选）
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'chihao_user_preference') {
        refreshStats();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshStats]);

  const value = useMemo(
    () => ({ preference, stats, refreshStats, resetPreference }),
    [preference, stats, refreshStats, resetPreference]
  );

  return (
    <UserPreferenceContext.Provider value={value}>
      {children}
    </UserPreferenceContext.Provider>
  );
};

export const useUserPreference = (): UserPreferenceContextValue => {
  const ctx = useContext(UserPreferenceContext);
  if (!ctx) {
    throw new Error('useUserPreference must be used within UserPreferenceProvider');
  }
  return ctx;
};
```

---

## 5. 组件拆分实例

### 5.1 拆分 StatsPanel 从 App.tsx

```typescript
// src/components/StatsPanel.tsx
import { motion } from 'framer-motion';
import { useUserPreference } from '../contexts/UserPreferenceContext';
import { useHistoryStats } from '../hooks/useHistoryStats';

interface StatsPanelProps {
  isVisible: boolean;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ isVisible }) => {
  const { stats } = useUserPreference();
  const { historyStats, hasHistory } = useHistoryStats();

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="relative bg-gradient-to-br from-white/70 via-white/60 to-white/50
                 backdrop-blur-2xl rounded-[32px] p-8 shadow-2xl
                 border-2 border-white/40 mb-8 overflow-hidden"
    >
      {/* 装饰性背景渐变 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl" />

      <div className="relative z-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600
                       bg-clip-text text-transparent mb-6 flex items-center gap-3">
          <span className="text-4xl">📊</span>
          我的喜好统计
        </h2>

        {/* 统计卡片 */}
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
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative bg-white/60 backdrop-blur-xl rounded-3xl p-6 text-center
                         border-2 border-white/50 shadow-xl overflow-hidden group"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
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
            </motion.div>
          ))}
        </div>

        {/* 历史统计 */}
        {hasHistory && (
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
                <div className="text-xs text-apple-gray-600 mt-1">累计抽取</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-600">
                  {historyStats.likeRate}%
                </div>
                <div className="text-xs text-apple-gray-600 mt-1">喜欢比率</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-600">
                  {historyStats.recentDrawsCount}
                </div>
                <div className="text-xs text-apple-gray-600 mt-1">近7天抽取</div>
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
  );
};
```

### 5.2 拆分 HeroSection

```typescript
// src/components/HeroSection.tsx
import { motion } from 'framer-motion';
import { fadeInUp } from '../utils/scrollReveal';

const foodEmojis = ['🍕', '🍜', '🍱', '🍔'];

export const HeroSection: React.FC = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="text-center mb-12 relative"
    >
      {/* 装饰性图标动画 */}
      <div className="absolute inset-0 pointer-events-none">
        {foodEmojis.map((emoji, i) => (
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
              ease: 'easeInOut',
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <motion.h2
        className="relative text-6xl font-bold mb-6"
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
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
  );
};
```

### 5.3 简化后的 App.tsx（示例）

```typescript
// src/App.tsx (重构后)
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ToastProvider, useToast } from './hooks/useToast';
import { UserPreferenceProvider } from './contexts/UserPreferenceContext';
import { useFoodDraw } from './hooks/useFoodDraw';
import { useModal } from './hooks/useModal';
import { HeroSection } from './components/HeroSection';
import { StatsPanel } from './components/StatsPanel';
import BlindBox from './components/BlindBox';
import FeedbackPanel from './components/FeedbackPanel';
import FoodDetailModal from './components/FoodDetailModal';
import { ParticleBackground } from './components/ParticleBackground';
import { FloatingActionButton } from './components/FloatingActionButton';
import { celebrateSuccess } from './utils/confetti';
import { clearHistory } from './utils/history';

function AppContent() {
  const { showToast } = useToast();
  const statsModal = useModal(false);
  const detailModal = useModal(false);

  const { currentFood, drawFood, submitLike, submitDislike, reset } = useFoodDraw({
    onAfterDraw: (food) => showToast(`抽到了 ${food.name}！`, 'success'),
    onFeedback: (food, liked, emotion) => {
      if (liked) {
        celebrateSuccess();
        showToast(emotion ? `标记为 ${emotion} 的感觉 ✨` : '已添加到喜欢列表 ❤️', 'success');
      } else {
        showToast('已记录你的偏好', 'info');
      }
    },
  });

  const handleClearHistory = () => {
    if (confirm('确定要清空所有历史记录吗？')) {
      clearHistory();
      showToast('历史记录已清空', 'info');
      window.location.reload(); // 可替换为 refreshStats()
    }
  };

  const floatingActions = [
    { icon: '📊', label: statsModal.isOpen ? '隐藏统计' : '查看统计', onClick: statsModal.toggle, color: 'text-apple-blue' },
    { icon: '🔄', label: '清空历史', onClick: handleClearHistory, color: 'text-red-600' },
    { icon: '🎯', label: '立即抽取', onClick: () => drawFood(), color: 'text-apple-green' },
  ];

  return (
    <div className="min-h-screen bg-apple-gray-50 relative overflow-hidden">
      <ParticleBackground />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-2xl shadow-xl sticky top-0 z-50 border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={statsModal.toggle}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500
                       text-white font-semibold shadow-lg"
          >
            {statsModal.isOpen ? '隐藏统计' : '我的喜好 ✨'}
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <StatsPanel isVisible={statsModal.isOpen} />
        <HeroSection />

        <div className="mb-8">
          <BlindBox onDrawFood={drawFood} onResult={() => {}} />
        </div>

        {currentFood && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-white/80 backdrop-blur-2xl rounded-[32px] p-8 shadow-2xl border-2 border-white/50"
          >
            <button
              onClick={detailModal.open}
              className="w-full mb-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold"
            >
              ✨ 查看食物详情
            </button>
            <FeedbackPanel
              onLike={() => submitLike()}
              onDislike={submitDislike}
              onEmotionSelect={(emotion) => submitLike(emotion)}
              showEmotions
            />
          </motion.div>
        )}
      </main>

      <FoodDetailModal food={currentFood} isOpen={detailModal.isOpen} onClose={detailModal.close} />
      <FloatingActionButton actions={floatingActions} />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <UserPreferenceProvider>
        <AppContent />
      </UserPreferenceProvider>
    </ToastProvider>
  );
}

export default App;
```

---

## 6. 性能优化 Hooks

### 6.1 useReducedMotion Hook

```typescript
// src/hooks/useReducedMotion.ts
import { useEffect, useState } from 'react';

export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};
```

### 6.2 useDevicePerformance Hook

```typescript
// src/hooks/useDevicePerformance.ts
import { useMemo } from 'react';
import { isLowEndDevice, getParticleCount as getOptimalParticleCount } from '../utils/performance';

interface DevicePerformance {
  isLowEnd: boolean;
  particleMultiplier: number;
  getParticleCount: (baseCount: number) => number;
}

export const useDevicePerformance = (): DevicePerformance => {
  const isLowEnd = useMemo(() => isLowEndDevice(), []);

  const particleMultiplier = isLowEnd ? 0.5 : 1;

  const getParticleCount = (baseCount: number) =>
    getOptimalParticleCount(baseCount, isLowEnd ? 'low' : 'auto');

  return {
    isLowEnd,
    particleMultiplier,
    getParticleCount,
  };
};
```

---

## 总结

以上示例覆盖了重构架构的核心改造点：

1. **类型系统**：统一定义 UI 类型与统计类型，提升类型安全性。
2. **服务层**：封装 LocalStorage 操作，支持错误处理与未来迁移。
3. **自定义 Hooks**：`useToast`、`useFoodDraw`、`useHistoryStats`、`useModal` 等解耦业务逻辑，提升复用性。
4. **Context 管理**：`UserPreferenceContext` 提供全局状态共享，减少重复读取。
5. **组件拆分**：将 `App.tsx` 的 UI 模块抽取为独立组件（StatsPanel、HeroSection），降低复杂度。
6. **性能优化**：提供 `useReducedMotion`、`useDevicePerformance` 等 Hook，实现动态性能调优。

这些改造可分阶段实施，优先完成高优先级的 Hooks 与 Context 化，再逐步拆分组件与引入服务层。每个模块均可独立测试，显著提升代码质量与可维护性。
