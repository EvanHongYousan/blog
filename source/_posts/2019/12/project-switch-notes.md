---
title: 项目交接注意事项
date: 2019-12-31 16:59:06
categories: [tech]
tags: [项目交接, docker, gitlab CI, github action]
---

今天接手老项目，因为环境问题、配置问题浪费了很多时间，于是花了 30 秒考虑该如何尽量杜绝此类问题：

- 要求老项目交接人提供清晰的配置文档、环境说明文档（比如 node、npm 的版本号）
- 要求老项目交接人提供各项环境都配置完成的 docker
- 建立好持续集成，在持续集成机制中有保留完成的环境配置
