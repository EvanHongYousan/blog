# Project Context

## Purpose
这是一个前端开发者（Evan）的个人技术博客，基于 Hexo 静态博客生成器构建。博客内容涵盖前端技术（JavaScript、React、Vue、CSS）、设计模式、单元测试、CI/CD、Web 性能优化、Web 安全等方向。除技术文章外，还整合了豆瓣读书/电影/游戏、B站追番/追剧等娱乐生活内容，形成技术+生活的个人门户。

站点地址：https://evanhongyousan.github.io/

## Tech Stack
- **静态博客框架**：Hexo 3.9.0
- **主题**：NexT（Muse 配色方案）
- **Node.js 版本**：博客项目使用 Node 10.x（通过 `nvm use 10`）；openspec 相关指令使用 Node v22（通过 `nvm use 22`）
- **包管理器**：npm（lockfileVersion 1）
- **Markdown 渲染**：hexo-renderer-markdown-it + markdown-it-emoji
- **样式预处理器**：Stylus（主题）、Sass（hexo-renderer-sass）
- **模板引擎**：Swig（NexT 主题）、EJS
- **部署**：GitHub Actions + hexo-deployer-git → GitHub Pages
- **主要 Hexo 插件**：
  - hexo-generator-feed（RSS 订阅）
  - hexo-generator-search（站内搜索）
  - hexo-generator-sitemap / hexo-generator-robotstxt（SEO）
  - hexo-douban（豆瓣集成）
  - ~~hexo-steam-games（Steam 游戏库）~~（已关闭）
  - hexo-bilibili-bangumi（B站追番/追剧）
  - hexo-symbols-count-time（字数统计和阅读时长）
  - hexo-tag-asset-img（文章资源图片管理）

## Project Conventions

### 目录结构
```
blog/
├── _config.yml              # Hexo 主配置
├── package.json
├── scaffolds/               # 文章模板（post / draft / page）
├── source/
│   ├── _posts/              # 已发布文章（按 年份/月份 组织）
│   ├── _drafts/             # 草稿
│   ├── _data/               # 番剧/影院 JSON 数据
│   ├── about/               # 关于页面
│   ├── categories/          # 分类页面
│   ├── tags/                # 标签页面
│   └── images/              # 站点图片资源
├── themes/next/             # 当前使用的 NexT 主题
└── .github/workflows/       # CI/CD 配置
```

### 文章规范
- **文件命名**：`:year/:month/:title.md`（如 `2025/01/web-safe.md`）
- **URL 永久链接**：`:year/:month/:day/:title/`
- **资源文件夹**：启用 `post_asset_folder: true`，每篇文章有同名资源目录存放图片等
- **Front Matter 字段**：`title`、`date`、`categories`、`tags`
- **语言**：博客语言为中文（zh-CN），文章内容以中文为主

### Architecture Patterns
- Hexo 标准静态博客架构：Markdown 源文件 → Hexo 生成 → 静态 HTML → 部署到 GitHub Pages
- NexT 主题通过 Swig 模板引擎渲染页面
- 插件式扩展：通过 Hexo 插件集成豆瓣、B站等第三方数据源

### Git Workflow
- **主分支**：`master`
- **CI/CD**：每次 push 到仓库时，GitHub Actions 自动执行：
  1. 拉取 B站追番/追剧数据、豆瓣数据
  2. `hexo generate` 生成静态文件
  3. `hexo deploy` 部署到 `EvanHongYousan.github.io` 仓库的 master 分支
- **.gitignore**：忽略 `node_modules/`、`public/`、`db.json`、`package-lock.json`、`*.log`、生成的追番/追剧 JSON 数据

## Domain Context
- 这是一个前端开发者博客，关键词涵盖：JavaScript、ES6、HTML、CSS、React、Vue、单元测试、CI/CD、GA/GTM 数据分析等
- 文章历史从 2017 年至今，活跃期为 2018-2021 年，2025 年有新文章
- 草稿区有 5 篇未完成文章（网络抓包、Promise 实现、GitHub Action 部署、React Hooks/HOC/Render Props、加密算法）

## Important Constraints
- **Node.js 版本（关键）**：本项目需要在两个 Node 版本间切换，使用 nvm 管理：
  - **运行博客项目本身**（`hexo server`、`hexo generate`、`hexo deploy`、`npm install` 等）：必须使用 **Node 10.x**（`nvm use 10`）
  - **运行 openspec 相关指令**：必须使用 **Node v22**（`nvm use 22`）
- **Hexo 版本**：锁定在 3.9.0，是较旧的版本，升级需谨慎评估插件兼容性
- **主题自定义**：NexT 主题代码直接存放在 `themes/next/` 目录下，可能包含自定义修改，升级主题时需注意保留

## External Dependencies
- **GitHub Pages**：静态站点托管（`EvanHongYousan.github.io`）
- **GitHub Actions**：CI/CD 自动构建部署
- **豆瓣 API**：读书/电影/游戏数据（通过 hexo-douban 插件）
- ~~**Steam Web API**：游戏库数据~~（已关闭）
- **Bilibili API**：追番/追剧数据（通过 hexo-bilibili-bangumi 插件）
- **淘宝 npm 镜像**：依赖包下载源（旧版 `registry.npm.taobao.org`）
