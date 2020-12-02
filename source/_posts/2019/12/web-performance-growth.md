---
title: 一次web性能优化实施记录
date: 2019-12-23 19:56:12
categories: [tech]
tags: [webpack, 性能, cdn, 部署, gulp]
---

{% asset_img loading.gif %}
当前 web 应用访问速度过慢，用户等待时间过长，对用户体验造成很大影响。而用户访问 web 页面等待时间过长，会降低用户对品牌的信任度，加大了品牌运营工作的困难度

另外，搜索引擎会降低加载速度过慢站点的权重，使站点曝光率下降

<escape><!-- more --></escape>

### 项目部署配置检查

- 检查当前 cdn 节点部署地区
- 构建出来的文件如何与 cdn 节点部署对应上
- 图片资源是否有压缩，页面是否有很多小请求
- js、css 打包是否有优化空间

### 图片解析压缩优化

#### 压缩

工具选型

- gulp-imagemin
- gulp-smushit
- gulp-tinypng-compress

压缩率对比

- gulp-imagemin:
  - 可处理 jpg、png、svg、gif
  - 整体压缩率 27.5%，针对 svg 压缩率为 44.9%
  - 压缩时间短：2 分钟内
- gulp-smushit:
  - 只能处理 jpg、png、gif，不能处理 svg
  - 压缩率高，57.1%
  - 仔细扣图片细节，能看到一点点色差
  - 压缩时间长：半小时左右
    - 原因：使用 resmush.it 的 api 压缩图片
  - 网络请求断开会直接显示压缩完成，无异常抛出
- gulp-tinypng-compress
  - 压缩时间长：半小时左右
  - 原因：使用https://tinypng.com/的api压缩图片
  - 以使用 API 的方式，每月只能压 500 张
  - 网络请求断开时会有异常抛出

结论

- 最后决定使用 gulp-imagemin 做本地图片压缩

#### 解析

改动背景

- 由 webpack 对资源做统一解析输出管理，可减少开发人员对资源发布目录的管理工作量

目标

- 小图片皆转为 base64 code，以减少 http 请求
- 新的图片解析方式不影响原有图片引用方式

工具确认

- url-loader
- svg-url-loader
- image-webpack-plugin

解析输出 hash name 的影响

- 对同一张图片做解析输出，其 hash name 会保持不变，故浏览器缓存对同一图片可生效

改动说明

- webpack 输出文件夹改为 cdn 文件夹
- gulp 中的 clean task 取消
- gulp 只负责压缩图片，并把图片复制至 cdn 文件夹
- 被 webpack 解析到的图片（jpg、png、gif、svg）会被压缩

对开发的影响

- 后续静态资源（比如图片），可和对应业务 js、css 文件放到同一业务文件夹中，由 webpack 统一解析处理
- 原有图片引用方式仍然生效，但不建议继续使用

### css、js 打包优化

改动背景

- 站点页面在进行载入时，除了当前页面外，也会载入其他页面的 js、css 资源，阻碍了页面的尽快展示

目标

- 在进行页面载入时，只载入页面本身的必须资源

选型

- 多页面架构，每个页面自行引入、管理其资源
- 按路由进行动态加载模块，使非必须模块不影响页面渲染
- 寻找 webpack loader、插件，在 webpack 进行打包时自动按路由对资源做切分

分析

- 当前项目是单页面+ssr 架构项目，已经有一定的代码积累
- 多页面架构控制资源简单，但对当前项目改动太大
- 按路由进行模块动态加载，需要在业务代码中的模块引入处做处理，对当前项目改动也非常大 – import() 语法
- 在查询 webpack 代码分割相关信息过程中，发现业界偏向于以代码功能、类库作为代码分割点，未发现以路由作为代码分割点的解决方案

决策

- 故本次对 css、js 的打包优化，便先遵循业界常用做法：把经常变动的业务代码与不大变动的第三方类库代码分割

改动说明

- 目前，react、react-dom、react-intl、mirrorx、intl、antd、antd-mobile、svgo 这些类库已在项目中被锁死版本号，故这部分类库的 js、css 会被单独抽出合并为 common-vendors.js、common-vendors.css，属于长时间不变动的缓存
- 其余 node_modules 中的类库会被抽出合并为 vendor.js、vendor.css，属于较长时间不变动的缓存
- 剩余业务代码被合并为 app.js、app.css，变动较为频繁

改动影响

- 对用户：在已经访问过站点后，站点若有变动，则只需重新载入变动过的业务代码即可
- 对开发：无影响

### 按需加载 polyfill

改动背景

- 目前站点打包 js，把整个 polyfill 打入。但项目实际并未用到所有 polyfill 提供的特性。

选型

- 方案一：babel6 升级至 babel 7，使用 babel 7 提供的新特性：静态分析项目中的代码，开发者使用到相关特性，再把对应 polyfill 打入
- 方案二：使用第三方 polyfill 服务，引入第三方 polyfill 时，会自动根据浏览器特性针对性注入 polyfill，我们不再把 polyfill 打包进去
- 方案三：方案二改进版 -- 自建 polyfill 服务

分析

- 方案一：项目使用 babel 6 及其配套插件，需要升级到 babel 7，升级过程估计有不少问题，且有些问题可能比较难被发现
- 方案二：工作量小，不易出错。不做静态代码分析，按浏览器特性补齐 polyfill。依赖于第三方服务，第三方服务出问题，我们的站点马上就会挂掉
- 方案三：稳定性比方案二高，其余特性与方案二一致

决策

- 业务对稳定性有高要求的选方案一，否则选方案二
- 本次选方案一

改动说明

- 使用 babel-upgrade 执行 babel 6 到 babel 7 的升级
- webpack 中 babel 相关配置项被改动

改动影响

- 使用 babel 6 打包出来的 js 代码，总大小为 3415KB, 使用 babel 7 且使用 useBuiltIns: usage 配置打包出来的 js 代码，总大小为 2662Kb – js 体积减少 22%
- 对开发：无影响
