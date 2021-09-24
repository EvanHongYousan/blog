---
title: 地球转动动画效果预研
categories: [tech]
tags: [animation, 动画, thress3d.js]
---

接下来需要做一个visa的活动，产品、设计希望在活动页中实现一个地球自转的动画

<escape><!-- more --></escape>

## 动画播放

### SVGA

{% asset_img image2021-9-24_11-55-11.png %}

- SVGA 是一种同时兼容 iOS / Android / Flutter / Web 多个平台的动画格式，此解决方案由国内的yy团队输出。
- 设计师在使用ae制作完动画后，使用svga提供的工具，可以把动画转化为svga格式 https://svga.io/designer.html
- 前端使用svga的播放器，在页面中对svga文件进行播放
- 文档：https://svga.io/

{% asset_img intro-flow.jpeg %}

### Lottie

{% asset_img image2021-9-24_11-53-20.png %}

- Lottie支持多平台，此方案由airbnb团队输出
- 设计师在使用ae制作完动画后，使用bodymovin插件，把动画转为为json数据导出 https://github.com/airbnb/lottie-web
- 前端开发使用Lottie提供的库载入json，即可在页面播放动画
- 文档：https://airbnb.design/lottie/

### 对比

- svga在页面生成动画时，生成的是canvas标签，在canvas中进行动画生成与计算
- Lottie在页面生成动画时，生成svg标签，通过变化svg标签的css3相关属性来进行动画生成与展示
- 就实际生成效果，Lottie生成的动画帧数更高
- 针对动画文件体积大小，svga导出的动画文件比Lottie导出的json文件提交小很多

## 动画实现

### three3d.js

demo：http://9.135.218.65:8081/

{% asset_img Kapture_2021-09-24_at_11.57.20.gif %}

- Three3D.js是一款开源的主流3D绘图JS引擎（名字Three就是3D的含义），原作者为Mr.Doob，项目地址为：https://github.com/mrdoob/three.js/。
- 针对本次的地球自转动画，设计需要输出地球贴图素材，由前端开发根据素材使用three3d的api把动画编写出来

素材示例：

{% asset_img image2021-9-24_12-8-58.png %}

#### 分析

- 使用动画引擎库，则可以更方便地在动画中加入各种交互
- 动画效果改由程序计算得出，动画性能方面调校起来更为方便直观
- 开发资源的投入比“动画播放”的方案要高