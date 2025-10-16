# Bug 修复日志

## 2025-10-16: 页面空白 - Framer Motion 导入错误

### 问题描述
- **现象**: 浏览器打开 http://localhost:5173 显示空白页面
- **报错信息**:
  ```
  scrollReveal.ts:2 Uncaught SyntaxError: The requested module '/node_modules/.vite/deps/framer-motion.js?v=0526b6bb' does not provide an export named 'Variants' (at scrollReveal.ts:2:10)
  ```

### 问题原因
Framer Motion v11.x 版本中，`Variants` 类型不再作为命名导出提供。在新版本中：
- ❌ **错误**: `import { Variants } from 'framer-motion'` (运行时导入)
- ✅ **正确**: `import type { Variant } from 'framer-motion'` (类型导入)

### 解决方案

**文件**: `src/utils/scrollReveal.ts`

**修改前**:
```typescript
import { Variants } from 'framer-motion';
```

**修改后**:
```typescript
import type { Variant } from 'framer-motion';

// 定义 Variants 类型
type Variants = {
  [key: string]: Variant;
};
```

### 技术细节
1. 使用 `type` 关键字导入 `Variant` 类型（单数形式）
2. 手动定义 `Variants` 类型（复数形式）作为 `Variant` 的记录类型
3. 这样既保持了代码兼容性，又符合 TypeScript 类型导入最佳实践

### 验证步骤
1. ✅ Vite HMR 自动热更新成功
2. ✅ 浏览器控制台无错误
3. ✅ 页面正常显示

### 相关文件
- `src/utils/scrollReveal.ts` - 修复了导入错误
- `src/App.tsx` - 使用了 scrollReveal 的动画变体

### 经验教训
1. **类型 vs 值导入**: Framer Motion 的类型应该使用 `import type` 导入，避免运行时错误
2. **版本兼容性**: 升级依赖后需要检查导出变化，特别是类型定义
3. **错误诊断**: 浏览器控制台的错误信息非常关键，能够快速定位问题
4. **HMR 的优势**: Vite 的热模块替换让我们无需重启服务器即可看到修复效果

### 预防措施
更新 CLAUDE.md 中的最佳实践：
- 始终使用 `import type` 导入类型
- Framer Motion v11+ 使用 `Variant`（单数）而非 `Variants`（复数）
