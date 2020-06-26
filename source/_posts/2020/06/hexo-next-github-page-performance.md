---
title: hexo next github page 性能优化记录
date: 2020-06-26 11:38:37
categories: [tech]
tags: [性能, cdn, 部署, hexo]
---

{% asset_img rocky.gif %}

<escape><!-- more --></escape>

## step1

站点使用 hexo next 主题，配置文件中已经带了使用 jsDelivr cdn 的资源配置实例，用户启用便可

根目录下`themes\next\_config.yml`文件中，vendors项下，所有资源皆可配置使用 jsDelivr cdn

```javascript
vendors:
  # Internal path prefix. Please do not edit it.
  _internal: lib

  # Internal version: 3.4.1
  # Example:
  jquery: //cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
  # jquery: //cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
  # jquery:
```

## step2

站点静态资源，也使用 jsDelivr cdn

根目录下`themes\next\_config.yml`

```javascript
# Assets
# css: css
# js: js
# images: images
css: https://cdn.jsdelivr.net/gh/evanhongyousan/evanhongyousan.github.io/css
js: https://cdn.jsdelivr.net/gh/evanhongyousan/evanhongyousan.github.io/js
images: https://cdn.jsdelivr.net/gh/evanhongyousan/evanhongyousan.github.io/images
```

## step3

使用图片懒加载，减少首屏加载时间

项目根目录下，执行 `npm install hexo-lazyload-image --save`

根目录下`_config.yml`

```javascript
# 图片懒加载
lazyload:
  enable: true 
  onlypost: false
```

## step4

### 问题

博客开启了 post_asset_folder 选项

根目录下`_config.yml`

```javascript
post_asset_folder: true
```

并在文章中使用 `{% asset_img 1.png %}`这种方式引用图片，则打包出来的图片，会是这种形式：

```javascript
https://evanhongyousan.github.io/2020/05/23/landing-page-builder-introduct/image2020-5-14_17-40-17.png
```

可以看到图片并不在 `images` 文件夹中，则文章图片并未使用cdn加速

### 处理

执行 `npm install hexo-tag-asset-img --save`

根目录下`_config.yml`

```javascript
asset_img_url: https://cdn.jsdelivr.net/gh/evanhongyousan/evanhongyousan.github.io
```

打包发布后，可以看到文章对图片的引用已经变更：

```javascript
https://cdn.jsdelivr.net/gh/evanhongyousan/evanhongyousan.github.io/2020/05/23/landing-page-builder-introduct/image2020-5-14_17-40-17.png
```

## step 5

完成上述步骤后，可以看到页面加载仍有资源阻塞

```
# 404
https://fonts.googleapis.com/css?family=Lato:300,300italic,400,400italic,700,700italic&display=swap&subset=latin,latin-ext
```

{% asset_img step5.png %}

则使用 fonts.googleapis.com 镜像处理字体资源文件加载失败的问题

根目录下`_config.yml`

```javascript
font:
  # Use custom fonts families or not.
  # Depended options: `external` and `family`.
  enable: true

  # Uri of fonts host, e.g. //fonts.googleapis.com (Default).
  host: //fonts.loli.net
```

## 使用的cdn、插件、镜像

- [jsDelivr](https://www.jsdelivr.com/)
- [hexo-lazyload-image](https://www.npmjs.com/package/hexo-lazyload-image)
- [hexo-tag-asset-img](https://github.com/victor-fdez/hexo-tag-asset-img)
- [fonts.loli.net](https://sb.sb/blog/css-cdn/)