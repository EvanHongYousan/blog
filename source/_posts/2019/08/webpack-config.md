---
title: webpack config
date: 2019-08-30 23:10:12
categories: [tech]
tags: [webpack]
---

想让源文件加入到构建流程中去被 Webpack 控制，配置 entry。
想自定义输出文件的位置和名称，配置 output。
想自定义寻找依赖模块时的策略，配置 resolve。
想自定义解析和转换文件的策略，配置 module，通常是配置 module.rules 里的 Loader。
其它的大部分需求可能要通过 Plugin 去实现，配置 plugin。

<escape><!-- more --></escape>

{% asset_img overview.png %}
