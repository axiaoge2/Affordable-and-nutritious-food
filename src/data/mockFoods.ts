import type { Food } from '../types/food';
import { FoodCategory, EmotionTag } from '../types/food';

// Mock 食物数据 - 面向学生的高性价比食物
export const mockFoods: Food[] = [
  {
    id: '1',
    name: '黄焖鸡米饭',
    description: '份量足，鸡肉嫩滑，配菜丰富，性价比超高',
    price: 15,
    originalPrice: 20,
    category: FoodCategory.LUNCH,
    location: '学校南门美食街',
    rating: 4.5,
    tags: ['份量大', '营养均衡', '学生最爱'],
    emotionTags: [EmotionTag.COMFORT, EmotionTag.ENERGETIC],
    pricePerformanceScore: 9.2,
  },
  {
    id: '2',
    name: '兰州拉面',
    description: '正宗牛肉拉面，汤浓味美，一碗管饱',
    price: 12,
    originalPrice: 15,
    category: FoodCategory.LUNCH,
    location: '二食堂一楼',
    rating: 4.3,
    tags: ['汤足面多', '牛肉给力', '实惠'],
    emotionTags: [EmotionTag.COMFORT, EmotionTag.NOSTALGIC],
    pricePerformanceScore: 8.8,
  },
  {
    id: '3',
    name: '蛋包饭',
    description: '治愈系美食，软嫩的蛋皮包裹炒饭，配特制酱汁',
    price: 14,
    originalPrice: 18,
    category: FoodCategory.DINNER,
    location: '校门口日式料理',
    rating: 4.7,
    tags: ['颜值高', '口感好', '拍照好看'],
    emotionTags: [EmotionTag.HAPPY, EmotionTag.COMFORT],
    pricePerformanceScore: 8.5,
  },
  {
    id: '4',
    name: '煎饼果子',
    description: '早餐神器，现做现卖，酥脆可口',
    price: 8,
    originalPrice: 10,
    category: FoodCategory.BREAKFAST,
    location: '宿舍楼下小推车',
    rating: 4.6,
    tags: ['方便快捷', '料足', '经典早餐'],
    emotionTags: [EmotionTag.ENERGETIC, EmotionTag.NOSTALGIC],
    pricePerformanceScore: 9.5,
  },
  {
    id: '5',
    name: '麻辣烫',
    description: '自选食材，想吃什么拿什么，暖胃又暖心',
    price: 18,
    originalPrice: 25,
    category: FoodCategory.DINNER,
    location: '三食堂二楼',
    rating: 4.4,
    tags: ['自由搭配', '暖胃', '麻辣爽口'],
    emotionTags: [EmotionTag.EXCITING, EmotionTag.COMFORT],
    pricePerformanceScore: 8.7,
  },
  {
    id: '6',
    name: '鸡蛋灌饼',
    description: '外酥里嫩，鸡蛋香浓，配上生菜和酱料超满足',
    price: 6,
    originalPrice: 8,
    category: FoodCategory.BREAKFAST,
    location: '北门早餐摊',
    rating: 4.5,
    tags: ['性价比王', '好吃不贵', '管饱'],
    emotionTags: [EmotionTag.ENERGETIC, EmotionTag.HAPPY],
    pricePerformanceScore: 9.8,
  },
  {
    id: '7',
    name: '奶茶（大杯）',
    description: '网红奶茶店，口感丝滑，大杯超值',
    price: 12,
    originalPrice: 15,
    category: FoodCategory.DRINK,
    location: '图书馆对面奶茶店',
    rating: 4.6,
    tags: ['大杯', '奶香浓郁', '解压必备'],
    emotionTags: [EmotionTag.HAPPY, EmotionTag.RELAXING],
    pricePerformanceScore: 8.3,
  },
  {
    id: '8',
    name: '肉夹馍',
    description: '陕西风味，肉质酥烂，馍脆肉香，吃一个就饱',
    price: 10,
    originalPrice: 13,
    category: FoodCategory.LUNCH,
    location: '西门小吃街',
    rating: 4.4,
    tags: ['肉多', '经典小吃', '扛饿'],
    emotionTags: [EmotionTag.COMFORT, EmotionTag.ENERGETIC],
    pricePerformanceScore: 9.0,
  },
  {
    id: '9',
    name: '双皮奶',
    description: '甜品界的性价比之王，口感细腻香甜',
    price: 8,
    originalPrice: 12,
    category: FoodCategory.DESSERT,
    location: '一食堂甜品窗口',
    rating: 4.7,
    tags: ['香滑细腻', '甜而不腻', '治愈系'],
    emotionTags: [EmotionTag.HAPPY, EmotionTag.RELAXING],
    pricePerformanceScore: 8.9,
  },
  {
    id: '10',
    name: '盖浇饭',
    description: '多种口味可选，菜量大，米饭管够',
    price: 13,
    originalPrice: 16,
    category: FoodCategory.LUNCH,
    location: '二食堂三楼',
    rating: 4.2,
    tags: ['选择多', '管饱', '性价比高'],
    emotionTags: [EmotionTag.COMFORT, EmotionTag.ENERGETIC],
    pricePerformanceScore: 8.6,
  },
  {
    id: '11',
    name: '烤冷面',
    description: '东北特色小吃，酸甜可口，份量十足',
    price: 9,
    originalPrice: 12,
    category: FoodCategory.SNACK,
    location: '体育场旁小吃摊',
    rating: 4.5,
    tags: ['酸甜口', '有嚼劲', '特色小吃'],
    emotionTags: [EmotionTag.EXCITING, EmotionTag.HAPPY],
    pricePerformanceScore: 9.1,
  },
  {
    id: '12',
    name: '沙县小吃套餐',
    description: '拌面+炖罐+饮料，经典组合，吃不腻',
    price: 16,
    originalPrice: 20,
    category: FoodCategory.DINNER,
    location: '东门沙县小吃',
    rating: 4.3,
    tags: ['套餐划算', '选择多', '全国连锁'],
    emotionTags: [EmotionTag.COMFORT, EmotionTag.NOSTALGIC],
    pricePerformanceScore: 8.4,
  },
  {
    id: '13',
    name: '手抓饼',
    description: '现烤现卖，加蛋加肠，层次丰富',
    price: 7,
    originalPrice: 9,
    category: FoodCategory.BREAKFAST,
    location: '宿舍区早餐车',
    rating: 4.4,
    tags: ['现做', '层次丰富', '快手早餐'],
    emotionTags: [EmotionTag.ENERGETIC, EmotionTag.HAPPY],
    pricePerformanceScore: 9.3,
  },
  {
    id: '14',
    name: '凉皮',
    description: '夏日解暑神器，麻酱香浓，爽口开胃',
    price: 8,
    originalPrice: 10,
    category: FoodCategory.SNACK,
    location: '南门小吃街',
    rating: 4.5,
    tags: ['解暑', '爽口', '酸辣开胃'],
    emotionTags: [EmotionTag.RELAXING, EmotionTag.EXCITING],
    pricePerformanceScore: 8.8,
  },
  {
    id: '15',
    name: '烧烤串串（10串）',
    description: '深夜食堂，烤得香脆入味，夜宵首选',
    price: 20,
    originalPrice: 28,
    category: FoodCategory.SNACK,
    location: '校外夜市',
    rating: 4.6,
    tags: ['夜宵', '香气扑鼻', '社交必备'],
    emotionTags: [EmotionTag.EXCITING, EmotionTag.HAPPY],
    pricePerformanceScore: 8.2,
  },
];

// 根据ID获取食物
export const getFoodById = (id: string): Food | undefined => {
  return mockFoods.find(food => food.id === id);
};

// 随机获取一个食物
export const getRandomFood = (): Food => {
  const randomIndex = Math.floor(Math.random() * mockFoods.length);
  return mockFoods[randomIndex];
};

// 根据类别筛选食物
export const getFoodsByCategory = (category: FoodCategory): Food[] => {
  return mockFoods.filter(food => food.category === category);
};

// 根据性价比分数排序
export const getFoodsByPricePerformance = (minScore: number = 0): Food[] => {
  return mockFoods
    .filter(food => food.pricePerformanceScore >= minScore)
    .sort((a, b) => b.pricePerformanceScore - a.pricePerformanceScore);
};
