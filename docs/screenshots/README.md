# 如何添加项目截图

## 📸 拍摄截图

### 方法一：浏览器截图（推荐）

1. 打开项目：http://localhost:5173
2. 按 **F12** 打开开发者工具
3. 点击 **设备工具栏** 图标（或按 Ctrl+Shift+M）
4. 选择设备：**iPhone 12 Pro** 或 **iPad**
5. 按 **Ctrl+Shift+P** 输入 "screenshot"
6. 选择 "Capture full size screenshot"

### 方法二：Windows 截图工具

1. 打开项目：http://localhost:5173
2. 按 **Win + Shift + S**
3. 框选要截图的区域
4. 图片会自动复制到剪贴板
5. 打开画图工具粘贴并保存

### 方法三：第三方工具

- **Snipaste**：https://www.snipaste.com/
- **ShareX**：https://getsharex.com/

## 📁 保存截图

将截图保存到：
```
E:\Claude code test\chihao-app\docs\screenshots\
```

### 建议的截图文件名：

- `home.png` - 首页（盲盒界面）
- `draw-animation.png` - 抽取动画
- `result.png` - 结果展示
- `feedback.png` - 情绪反馈界面
- `stats.png` - 我的喜好统计
- `mobile.png` - 移动端展示（可选）

## 📝 更新 README

截图保存好后，在 README.md 中引用：

```markdown
## 截图

### 主界面
<div align="center">
  <img src="./docs/screenshots/home.png" alt="首页" width="600"/>
  <p><em>盲盒抽取主界面</em></p>
</div>

### 抽取结果
<div align="center">
  <img src="./docs/screenshots/result.png" alt="结果展示" width="600"/>
  <p><em>食物详情展示</em></p>
</div>

### 情绪反馈
<div align="center">
  <img src="./docs/screenshots/feedback.png" alt="情绪反馈" width="600"/>
  <p><em>情绪标签选择</em></p>
</div>
```

## 🚀 提交到 GitHub

```bash
cd "E:\Claude code test\chihao-app"

# 添加截图文件
git add docs/screenshots/

# 提交
git commit -m "📸 添加项目截图"

# 推送
git push
```

## 💡 最佳实践

### 截图尺寸建议：
- **桌面端**：1920x1080 或 1440x900
- **移动端**：375x812 (iPhone 12 Pro)
- **文件大小**：< 500KB（使用工具压缩）

### 图片压缩工具：
- **TinyPNG**：https://tinypng.com/
- **Squoosh**：https://squoosh.app/

### 截图技巧：
1. 使用浅色背景更清晰
2. 确保文字清晰可读
3. 突出核心功能
4. 避免敏感信息

---

完成后，GitHub 上就能看到漂亮的项目截图了！✨
