# Git & GitHub 使用指南

## 📋 目录
1. [前置准备](#1-前置准备)
2. [初始化本地仓库](#2-初始化本地仓库)
3. [创建 GitHub 远程仓库](#3-创建-github-远程仓库)
4. [推送代码到 GitHub](#4-推送代码到-github)
5. [日常开发流程](#5-日常开发流程)
6. [常用命令速查](#6-常用命令速查)

---

## 1. 前置准备

### 第一步：安装 Git
```bash
# 检查 Git 是否已安装
git --version

# 如果未安装，请访问：https://git-scm.com/downloads
```

### 第二步：配置 Git 用户信息（首次使用）
```bash
# 设置用户名（将显示在提交记录中）
git config --global user.name "你的名字"

# 设置邮箱（建议使用 GitHub 注册邮箱）
git config --global user.email "your-email@example.com"

# 查看配置
git config --list
```

### 第三步：生成 SSH 密钥（推荐）
```bash
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "your-email@example.com"

# 按回车使用默认路径，可以设置密码（可选）

# 复制公钥内容
cat ~/.ssh/id_ed25519.pub

# 或者在 Windows 上
type %USERPROFILE%\.ssh\id_ed25519.pub
```

**将公钥添加到 GitHub：**
1. 登录 GitHub
2. 点击右上角头像 → Settings
3. 左侧菜单 → SSH and GPG keys
4. 点击 "New SSH key"
5. 粘贴公钥内容并保存

---

## 2. 初始化本地仓库

### 第一步：创建 .gitignore 文件
```bash
# 在项目根目录创建 .gitignore
cat > .gitignore << 'GITIGNORE'
# 依赖
node_modules/
.pnp
.pnp.js

# 测试
coverage/

# 生产构建
dist/
build/

# 环境变量
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# 日志
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# 编辑器
.vscode/
.idea/
*.swp
*.swo
*~

# 操作系统
.DS_Store
Thumbs.db

# 其他
*.log
.cache/
GITIGNORE
```

### 第二步：初始化 Git 仓库
```bash
# 初始化仓库
git init

# 查看状态
git status
```

### 第三步：添加文件到暂存区
```bash
# 添加所有文件
git add .

# 或者选择性添加
git add src/
git add package.json
git add README.md
```

### 第四步：创建第一次提交
```bash
# 提交代码
git commit -m "🎉 Initial commit: 吃好美食推荐平台"

# 查看提交历史
git log --oneline
```

---

## 3. 创建 GitHub 远程仓库

### 方式一：在 GitHub 网站创建（推荐）

**第一步：登录 GitHub**
访问：https://github.com

**第二步：创建新仓库**
1. 点击右上角 "+" → "New repository"
2. 填写仓库信息：
   - Repository name: `chihao-app`（或其他名字）
   - Description: `高性价比美食推荐平台 - 为学生群体打造`
   - 选择 Public（公开）或 Private（私有）
   - **不要**勾选 "Initialize this repository with a README"（因为本地已有）
3. 点击 "Create repository"

**第三步：复制仓库地址**
创建成功后，GitHub 会显示仓库地址，复制 SSH 地址：
```
git@github.com:你的用户名/chihao-app.git
```

---

## 4. 推送代码到 GitHub

### 第一步：添加远程仓库
```bash
# 添加远程仓库（使用 SSH）
git remote add origin git@github.com:你的用户名/chihao-app.git

# 或使用 HTTPS（需要输入密码）
git remote add origin https://github.com/你的用户名/chihao-app.git

# 查看远程仓库
git remote -v
```

### 第二步：推送代码
```bash
# 推送到 main 分支（首次推送）
git push -u origin main

# 如果提示分支名是 master，可以重命名：
git branch -M main
git push -u origin main
```

### 第三步：验证推送成功
访问你的 GitHub 仓库地址，应该能看到所有文件！

---

## 5. 日常开发流程

### 场景一：修改代码后提交

```bash
# 1. 查看修改状态
git status

# 2. 查看具体修改内容
git diff

# 3. 添加修改到暂存区
git add .                    # 添加所有修改
git add src/App.tsx          # 只添加特定文件

# 4. 提交修改
git commit -m "✨ 添加新功能：食物筛选器"

# 5. 推送到 GitHub
git push
```

### 场景二：查看历史记录

```bash
# 查看提交历史
git log

# 简洁模式
git log --oneline

# 查看最近 5 条
git log -5

# 图形化显示分支
git log --oneline --graph --all
```

### 场景三：撤销修改

```bash
# 撤销工作区的修改（未 add）
git checkout -- src/App.tsx

# 撤销暂存区的修改（已 add，未 commit）
git reset HEAD src/App.tsx

# 撤销上一次提交（保留修改）
git reset --soft HEAD~1

# 撤销上一次提交（删除修改，危险！）
git reset --hard HEAD~1
```

### 场景四：分支管理

```bash
# 查看分支
git branch

# 创建新分支
git branch feature-food-search

# 切换分支
git checkout feature-food-search

# 创建并切换分支（简写）
git checkout -b feature-food-search

# 合并分支
git checkout main
git merge feature-food-search

# 删除分支
git branch -d feature-food-search
```

---

## 6. 常用命令速查

### 基础命令
```bash
git init                  # 初始化仓库
git clone <url>           # 克隆远程仓库
git status                # 查看状态
git add .                 # 添加所有修改
git commit -m "message"   # 提交修改
git push                  # 推送到远程
git pull                  # 拉取远程更新
```

### 分支操作
```bash
git branch                # 查看分支
git branch <name>         # 创建分支
git checkout <name>       # 切换分支
git checkout -b <name>    # 创建并切换分支
git merge <name>          # 合并分支
git branch -d <name>      # 删除分支
```

### 远程操作
```bash
git remote -v             # 查看远程仓库
git remote add origin <url>   # 添加远程仓库
git push -u origin main   # 首次推送
git push                  # 推送
git pull                  # 拉取
git fetch                 # 获取远程更新（不合并）
```

### 撤销操作
```bash
git checkout -- <file>    # 撤销工作区修改
git reset HEAD <file>     # 撤销暂存区修改
git reset --soft HEAD~1   # 撤销提交（保留修改）
git reset --hard HEAD~1   # 撤销提交（删除修改）
```

### 查看历史
```bash
git log                   # 查看提交历史
git log --oneline         # 简洁模式
git log --graph           # 图形化显示
git diff                  # 查看修改内容
git show <commit>         # 查看某次提交详情
```

---

## 💡 最佳实践

### 1. 提交信息规范
使用 Emoji + 简洁描述：

```bash
git commit -m "✨ 添加新功能"
git commit -m "🐛 修复盲盒动画bug"
git commit -m "💄 优化UI样式"
git commit -m "📝 更新文档"
git commit -m "♻️ 重构推荐算法"
git commit -m "🚀 性能优化"
git commit -m "🔧 修改配置文件"
```

常用 Emoji：
- ✨ `:sparkles:` 新功能
- 🐛 `:bug:` Bug修复
- 📝 `:memo:` 文档
- 💄 `:lipstick:` UI/样式
- ♻️ `:recycle:` 重构
- 🚀 `:rocket:` 性能
- 🔧 `:wrench:` 配置

### 2. 忽略敏感文件
确保 `.gitignore` 包含：
- `node_modules/` - 依赖包
- `.env` - 环境变量
- `dist/` - 构建产物

### 3. 及时提交
- 完成一个功能 → 立即提交
- 修复一个bug → 立即提交
- 不要积累太多修改才提交

### 4. 使用分支开发
- `main` - 稳定的主分支
- `dev` - 开发分支
- `feature-xxx` - 功能分支
- `bugfix-xxx` - 修复分支

### 5. 推送前先拉取
```bash
# 避免冲突
git pull
git push
```

---

## 🚨 常见问题

### Q1: 推送失败 "Permission denied"
**原因：** SSH 密钥未配置或不正确

**解决：**
```bash
# 测试 SSH 连接
ssh -T git@github.com

# 如果失败，重新配置 SSH 密钥（见第1步）
```

### Q2: 推送失败 "Updates were rejected"
**原因：** 远程仓库有新的提交

**解决：**
```bash
# 先拉取远程更新
git pull --rebase

# 再推送
git push
```

### Q3: 提交了不该提交的文件
**解决：**
```bash
# 从 Git 中移除，但保留本地文件
git rm --cached <file>

# 添加到 .gitignore
echo "<file>" >> .gitignore

# 提交修改
git commit -m "🔧 移除敏感文件"
git push
```

### Q4: 想修改上一次提交信息
**解决：**
```bash
# 修改最近一次提交
git commit --amend -m "新的提交信息"

# 如果已推送，需要强制推送（谨慎！）
git push --force
```

### Q5: 合并冲突
**解决：**
1. 打开冲突文件
2. 查找 `<<<<<<<`、`=======`、`>>>>>>>` 标记
3. 手动解决冲突
4. 删除标记
5. 添加并提交
```bash
git add .
git commit -m "🔀 解决合并冲突"
```

---

## 🎯 快速开始脚本

将项目推送到 GitHub 的完整流程：

```bash
# 1. 初始化仓库
git init

# 2. 创建 .gitignore
cat > .gitignore << 'EOF'
node_modules/
dist/
.env
.DS_Store
