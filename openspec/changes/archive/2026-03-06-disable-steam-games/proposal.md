# Change: 关闭 hexo-steam-games 相关功能

## Why
hexo-steam-games 插件依赖 Steam Web API，该 API 访问不稳定，且 Steam 游戏库页面已不再需要展示。需要彻底关闭该插件的所有配置、CI/CD 指令以及前端导航入口，避免构建失败和无效页面链接。

## What Changes
- 注释 `_config.yml` 中 steam 相关配置段
- 注释 `themes/next/_config.yml` 中 steam 导航菜单入口和社交链接
- 从 `.github/workflows/main.yml` 部署指令中移除 `hexo steam -u`
- 更新 `openspec/project.md` 中关于 Steam 的描述

## Impact
- Affected specs: 无现有 spec（首次变更）
- Affected code:
  - `_config.yml`（行 169-183）：steam 插件主配置
  - `themes/next/_config.yml`（行 167）：导航菜单 steam 入口
  - `themes/next/_config.yml`（行 203）：社交链接 Steam
  - `.github/workflows/main.yml`（行 46）：部署指令中的 `hexo steam -u`
  - `openspec/project.md`：项目文档中的 Steam 相关描述
- 注意：`package.json` 中的 `hexo-steam-games` 依赖暂不移除，仅关闭功能，以便未来可快速恢复
