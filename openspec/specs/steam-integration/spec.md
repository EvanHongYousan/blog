# steam-integration Specification

## Purpose
TBD - created by archiving change disable-steam-games. Update Purpose after archive.
## Requirements
### Requirement: Steam 游戏库功能已关闭
系统 SHALL 不再提供 Steam 游戏库页面展示功能。hexo-steam-games 插件的所有配置、CI 指令和前端导航入口 MUST 保持注释/关闭状态。`package.json` 中保留依赖声明，如需恢复可取消注释即可。

#### Scenario: Steam 导航入口不可见
- **WHEN** 用户访问博客站点
- **THEN** 导航菜单中不再显示 Steam 入口链接

#### Scenario: CI/CD 构建不执行 Steam 数据拉取
- **WHEN** GitHub Actions 执行部署流程
- **THEN** 不再运行 `hexo steam -u` 指令

#### Scenario: Steam 插件配置已关闭
- **WHEN** Hexo 执行 generate 或 server
- **THEN** hexo-steam-games 插件不生成 steamgames 页面

