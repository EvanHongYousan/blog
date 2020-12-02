---
title: web性能优化之图片部分
date: 2019-12-28 22:40:01
categories: [tech]
tags: [图片压缩, 性能, webpack]
---

{% asset_img cover.png %}
一般而言，在静态资源中，图片大小占比远大于 js、css 大小占比。对图片压缩的一些体积，可能已经比完整的 js、css 文件要大。故在 web 性能优化范畴中，图片优化是非常重要的组成部分。

<escape><!-- more --></escape>

## 图⽚格式和应用场景

### JPEG

- 特性：不支持透明度
- 非常适合：颜色丰富的照片、彩色图大焦点图、通栏 banner 图；结构不规则的图形。
- 不适合：线条图形和文字、图标图形，因为它的压缩算法不太这些类型的图形；

### PNG

- 特性：无损压缩，支持透明度
- 非常适合：纯色、透明、线条绘图，图标；边缘清晰、有大块相同颜色区域；颜色数较少
  但需要半透明。
- 不适合：彩色图像（体积太大）

### GIF

- 特性：仅支持完全透明和完全不透明
- 非常适合：动画，图标
- 不适合：存储彩色图片（每个像素只有 8 比特）

### Webp

- 特性：无损的 Webp 比 PNG 小 26%，有损的 Webp 比 JPEG 小 25-34％，比 GIF 有更好的动画
- 非常适合：适用于图形和半透明图像
- 不适合：最多处理 256 色，不适合于彩色图片

## 图片优化细则

### 压缩

根据自身项目所属工作流，比如 webpack 或 gulp，搜索`webpack images compress`或`gulp images compress`便可

### 图片尺寸随网络环境变化

不同网络环境（Wifi/4G/3G）下，加载不同尺寸和像素的图片

### 响应式图片

- JavaScript 绑定事件检测窗口大小
- CSS 媒体查询
  ```css
  @media screen and (max-width: 640px) {
    my_image {
      width: 640px;
    }
  }
  ```
- img 标签属性
  ```html
  <img
    srcset="img-320w.jpg, img-640w.jpg 2x, img-960w.jpg 3x"
    src="img-960w.jpg"
    alt="img"
  />
  （x 描述符：表示图像的设备像素比）
  ```

### 逐步加载图像

在清晰的图像加载完成前，先使用统一占位符

- 把图片转换为低质量 base64code：lqip-loader
- 把图片转换为低质量 svg：sqip

### 其余方式

- 小于 10kb 的图片：转换为 base64code：url-loader
- 单一颜色小图标可使用 web font 代替
- Image spriting（雪碧图）
