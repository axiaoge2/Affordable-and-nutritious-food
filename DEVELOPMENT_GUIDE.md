# 吃好项目 - 完整开发流程指南

## 📋 目录
1. [环境准备](#1-环境准备)
2. [项目启动](#2-项目启动)
3. [开发调试](#3-开发调试)
4. [功能开发](#4-功能开发)
5. [测试验证](#5-测试验证)
6. [构建部署](#6-构建部署)
7. [常见问题](#7-常见问题)

---

## 1. 环境准备

### 第一步：安装 Node.js
确保已安装 Node.js（建议 18.x 或更高版本）

```bash
# 检查 Node.js 版本
node -v

# 检查 npm 版本
npm -v
```

### 第二步：克隆/进入项目目录
```bash
cd chihao-app
```

### 第三步：安装项目依赖
```bash
# 安装所有依赖包（首次运行需要 3-5 分钟）
npm install

# 如果安装失败，可以先清理后重试
rm -rf node_modules package-lock.json
npm install
```

---

## 2. 项目启动

### 第一步：启动开发服务器
```bash
npm run dev
```

成功后会看到：
```
  VITE v7.1.9  ready in 313 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 第二步：打开浏览器
访问：http://localhost:5173

### 第三步：验证页面加载
你应该看到：
- ✅ 顶部导航栏（"吃好" + "我的喜好"按钮）
- ✅ 中央标题"今天吃什么？"
- ✅ 渐变色盲盒按钮（带动画）
- ✅ 底部三个特色卡片

**如果页面空白：**
1. 按 F12 打开开发者工具
2. 查看 Console 标签的错误信息
3. 按 Ctrl+Shift+R 强制刷新

---

## 3. 开发调试

### 第一步：了解项目结构
```
src/
├── components/          # React 组件
│   ├── BlindBox.tsx          # 盲盒抽取组件
│   └── FeedbackPanel.tsx     # 反馈面板组件
├── data/               # 数据层
│   └── mockFoods.ts          # Mock 食物数据
├── types/              # TypeScript 类型定义
│   └── food.ts               # 食物相关类型
├── utils/              # 工具函数
│   └── recommendation.ts     # 推荐算法
├── App.tsx             # 主应用组件
├── main.tsx            # 应用入口
└── index.css           # 全局样式（Tailwind CSS）
```

### 第二步：开启热更新（HMR）
开发服务器自动启用热更新，修改代码后：
- 保存文件 → 浏览器自动刷新
- 无需手动重启服务器

### 第三步：使用浏览器开发工具
```
F12            - 打开开发者工具
Ctrl+Shift+C   - 元素选择器
Console 标签   - 查看日志和错误
Network 标签   - 查看网络请求
Application    - 查看 LocalStorage（用户偏好数据）
```

---

## 4. 功能开发

### 第一步：添加新食物数据
编辑 `src/data/mockFoods.ts`

```typescript
// 在 mockFoods 数组中添加新食物
{
  id: '16',  // 唯一ID
  name: '麻辣香锅',
  description: '麻辣鲜香，食材丰富，学生党最爱',
  price: 20,
  originalPrice: 28,
  category: FoodCategory.DINNER,
  location: '四食堂二楼',
  rating: 4.6,
  tags: ['麻辣', '份量足', '可自选'],
  emotionTags: [EmotionTag.EXCITING, EmotionTag.HAPPY],
  pricePerformanceScore: 8.9,
}
```

### 第二步：修改推荐算法权重
编辑 `src/utils/recommendation.ts`

在 `calculateMatchScore` 函数中调整权重：
```typescript
// 类别匹配分数 (权重: 30% → 可以改为 40%)
score += categoryScore * 0.4;

// 情绪标签匹配分数 (权重: 30% → 可以改为 25%)
score += emotionScore * 0.25;
```

### 第三步：修改UI样式
编辑 `tailwind.config.js` 修改配色：
```javascript
colors: {
  apple: {
    blue: '#0071e3',  // 可以改为你喜欢的颜色
    green: '#30d158',
    // ...
  }
}
```

或直接在组件中修改 Tailwind 类名：
```tsx
// 修改按钮颜色
className="bg-apple-blue"  // 改为其他颜色类
```

### 第四步：添加新组件
```bash
# 创建新组件文件
touch src/components/FoodList.tsx
```

```typescript
// 编写组件代码
import { motion } from 'framer-motion';
import type { Food } from '../types/food';

interface FoodListProps {
  foods: Food[];
}

const FoodList = ({ foods }: FoodListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {foods.map((food) => (
        <motion.div
          key={food.id}
          className="card-apple"
          whileHover={{ scale: 1.02 }}
        >
          <h3>{food.name}</h3>
          <p>{food.description}</p>
          <span>¥{food.price}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default FoodList;
```

然后在 `App.tsx` 中引入：
```typescript
import FoodList from './components/FoodList';
```

---

## 5. 测试验证

### 第一步：功能测试清单
- [ ] 点击盲盒按钮，能否正常抽取
- [ ] 抽取动画是否流畅（2秒旋转动画）
- [ ] 结果展示是否完整（名称、价格、标签、位置等）
- [ ] 点击"喜欢"按钮，数据是否记录
- [ ] 点击"不喜欢"按钮，数据是否记录
- [ ] 选择情绪标签，偏好是否更新
- [ ] 点击"我的喜好"，统计数据是否正确
- [ ] 交互5次后，推荐是否变为智能推荐

### 第二步：检查 LocalStorage
```javascript
// 在浏览器 Console 中运行
localStorage.getItem('chihao_user_preference')

// 清空用户数据（重新开始测试）
localStorage.removeItem('chihao_user_preference')
```

### 第三步：测试响应式设计
- 调整浏览器窗口大小
- 使用开发者工具的设备模拟器
- 测试手机、平板、桌面端显示效果

### 第四步：性能检查
```bash
# 构建生产版本
npm run build

# 查看构建产物大小
ls -lh dist/assets/
```

---

## 6. 构建部署

### 第一步：构建生产版本
```bash
npm run build
```

成功后会生成 `dist` 目录：
```
dist/
├── index.html
└── assets/
    ├── index-xxx.css    # 压缩后的样式文件
    └── index-xxx.js     # 压缩后的 JS 文件
```

### 第二步：本地预览生产版本
```bash
npm run preview
```

访问提示的地址（通常是 http://localhost:4173）

### 第三步：部署到服务器

**方式一：使用 Vercel（推荐）**
```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录并部署
vercel

# 按提示操作，几秒钟即可部署完成
```

**方式二：使用 Netlify**
```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录并部署
netlify deploy --prod --dir=dist
```

**方式三：传统服务器**
```bash
# 将 dist 目录上传到服务器
# 配置 Nginx 或 Apache 指向 dist 目录
# 确保支持 SPA 路由（所有路由指向 index.html）
```

---

## 7. 常见问题

### Q1: npm install 失败
**解决方案：**
```bash
# 清理缓存
npm cache clean --force

# 删除 node_modules
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 如果还失败，尝试使用淘宝镜像
npm install --registry=https://registry.npmmirror.com
```

### Q2: 页面空白无显示
**解决方案：**
1. 检查浏览器 Console 是否有错误
2. 确认服务器是否正常运行（查看终端输出）
3. 强制刷新：Ctrl+Shift+R
4. 清除浏览器缓存
5. 重启开发服务器：
```bash
# 停止服务器（Ctrl+C）
# 重新启动
npm run dev
```

### Q3: 修改代码不生效
**解决方案：**
1. 确认文件已保存
2. 查看终端是否有编译错误
3. 重启开发服务器
4. 检查是否修改了正确的文件

### Q4: TypeScript 类型错误
**解决方案：**
```bash
# 检查类型错误
npm run build

# 查看详细的 TypeScript 错误信息
npx tsc --noEmit
```

常见类型问题：
- 确保使用 `type` 关键字导入类型：`import type { Food } from './types/food'`
- 确保值（如枚举）使用普通导入：`import { FoodCategory } from './types/food'`

### Q5: 动画不流畅
**解决方案：**
- 检查 framer-motion 是否正确安装
- 降低动画复杂度
- 检查浏览器性能

### Q6: 推荐算法不准确
**调试方法：**
```javascript
// 在浏览器 Console 中运行
import { getUserStats } from './utils/recommendation';
console.log(getUserStats());
```

调整权重参数在 `src/utils/recommendation.ts` 中的 `calculateMatchScore` 函数

---

## 📚 学习资源

- React 官方文档: https://react.dev
- Tailwind CSS 文档: https://tailwindcss.com
- Framer Motion 文档: https://www.framer.com/motion
- TypeScript 手册: https://www.typescriptlang.org
- Vite 文档: https://vitejs.dev

---

## 🎯 快速命令参考

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run preview          # 预览生产版本
npm run lint             # 代码检查

# 调试
npm run build            # 查看编译错误
npx tsc --noEmit         # 查看类型错误

# 清理
rm -rf node_modules      # 删除依赖
rm -rf dist              # 删除构建产物
npm cache clean --force  # 清理 npm 缓存
```

---

## 💡 开发技巧

1. **使用 TypeScript 智能提示**
   - VS Code 会自动提供代码补全
   - 鼠标悬停查看类型定义

2. **使用 Tailwind CSS IntelliSense**
   - 安装 VS Code 插件：Tailwind CSS IntelliSense
   - 获得类名自动补全

3. **使用 React DevTools**
   - 安装 Chrome 扩展：React Developer Tools
   - 查看组件树和 Props/State

4. **使用 Git 版本控制**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

5. **编写注释**
   - 复杂逻辑添加注释
   - 使用 JSDoc 格式注释函数

---

**祝开发顺利！** 🚀
