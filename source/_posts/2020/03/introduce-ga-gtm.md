---
title: ga、gtm介绍与接入说明
date: 2020-03-26 16:58:50
categories: [tech]
tags: [google analysis, ga, google tag mananger, gtm]
---

Google Analytics Solution是一个完整的数据解决方案，从数据的收集、管理、分析、可视化、优化、到终极目的转化，一气呵成，其中各个产品相互依赖，构成了强大的企业级数字营销整合工具。

{% asset_img 1.png %}

<escape><!-- more --></escape>

## 基础知识
谷歌分析，是Google发布的一款免费的网站分析服务，包括多个报告，可对整个网站的访问者进行多角度的跟踪，并能持续跟踪营销广告系列的效果，GA默认提供的报告如下：
- 行为分析：帮助用户了解网站的哪些部分效果理想、哪些页面比较受欢迎，并据此为网站营造更佳的体验
- 社交分析：可衡量社交媒体计划的成效，分析访问者如何与网站上的分享功能（如 Google +1 按钮）进行互动，如何在不同的社交平台上使用网站内容
- 转化分析：确定吸引了多少客户、销量有多高，以及用户如何与网站互动
- 广告分析：了解社交广告、移动广告、搜索广告和展示广告的效果，以最大限度地发挥广告的作用

## Google Analytics Solution产品线
Google Analytics Solution是一个完整的数据解决方案，从数据的收集、管理、分析、可视化、优化、到终极目的转化，一气呵成，其中各个产品相互依赖，构成了强大的企业级数字营销整合工具。

{% asset_img 1.png %}

- udience Center：整合海量数据的数据管理平台
- Google Tag Manager：代码管理工具，前身是GA中的数据埋点功能，简化了数据采集的工作流量
- Google Analytics：Google Analytics Solution的核心部件
- Data Studio：企业级数据分析和可视化的产品，能够整合不同产品和资源的数据
- Survey：问卷调查工具，获得消费者的信息和看法
- Google Optimize：网页测试和产品优化工具，可以做AB测试和多变量测试
- Attribution：市场归因工具，可以帮助企业分析广告是否有效

## 开发定位

作为开发，在这项工作流中，属于数据的第一道经手人，一般关注Google analysis和Google tag manager即可

## ga（Google Analytics）基本概念
- Sessions（会话）：是指在指定的时间段内在网站上发生的一系列互动，互动可以是页面浏览，事件，社交互动或电子商务等。一个用户可以同时开启多个会话，这些会话可以发生在同一天，也可以在不同的时间
- 数据的3个层级：用户、会话、交互。一个会话可以有多个交互，一个用户可以有多个会话。当用户的行为（例如，用户在网站上加载网页或在移动应用上加载屏幕）触发跟踪代码时，GA就会记录该活动。系统会将每次互动打包为一项匹配（Hits）发送至 GA的服务器。常见的互动类型有页面跟踪匹配，事件跟踪匹配，电子商务跟踪匹配和社交互动匹配。
- 用户识别：Client ID-表示的是唯一的浏览器或设备；User ID-表示的是唯一用户，只有用户登录的时候才会识别到
- 新用户、回访用户、用户和访客
  - 新用户（New User）：用户首次访问站点就被记录为新用户
  - 回访用户（Returning Users）：非首次的访问都是回访用户
  - 用户（Users）：用户数，是新用户和回访用户的去重
  - 新访客（New Visitor）：新用户和新访客在数值相等的，但在技术上的实现是不同的，新访客是一个维度，新用户是字段。
- 跳出率和退出率
  - 跳出率（Bounce Rate）是指该网页是会话中“唯一网页”的会话占由该网页开始的所有会话的百分比。(基于会话)
  - 退出率（Exit）是指该网页是会话中“最后一页”的浏览占该网页总浏览量的百分比。(基于PV)
- 时长：页面时长&会话时长
- 来源、媒介和广告（sem）：来源、媒介和广告系列对应的是Source、Medium和Campaign，主要用于标记流量来源，表示从哪个站点过来的流量，经常用于付费推广，要重点关注（主要的utm跟踪参数）
- 事件：「事件」是指使用者與內容的互動，可針對單一網頁或畫面載入個別進行評估。像是下載、連結點擊、表單提交及影片播放這類動作，都可以做為「事件」來分析，要重点关注

对于上述概念，网上有很丰富的资料，可以使用Google搜索“ga+概念名称”，通过更详细的图文或视频进行理解，这边就不做详细描述了。

对于开发，需要重点理解【事件】概念与【来源、媒介和广告（sem）】概念，这是开发做相关对接涉及到最多的概念。

## ga常见对接场景归纳与对接方式

{% asset_img ga_tag_script.png %}

- 跟踪代码部署：对接ga的基础，此项工作各个站点目前已经默认处理
  - 在GA里选择“管理”→“跟踪信息”→“跟踪代码”，把代码复制到站点中
- 事件上报：对用户的特性交互进行上报
  - 这种上报一般由产品/市场人员提出，并给出上报代码。开发这边把上报代码写入对应事件回调中即可
- 跟踪邮件打开：评估邮件的打开情况，具体邮件中按钮点击的追踪就通过UTM跟踪
  - 使用Measurement Protocol协议，原理是使用img标签发出get请求，具体可看 https://evanhongyousan.github.io/2019/08/29/edm-ga/
- UTM跟踪（sem）：标记流量来源（比如产品、市场人员经常让开发在banner跳转链接中加上 utm_source、utm_medium等参数），经常用于付费推广；
  - 在原有链接的基础上，添加对应参数即可，一般使用工具：https://ga-dev-tools.appspot.com/campaign-url-builder/

## ga后台简单使用

### 三个主要纬度

|字段|说明|
|---|---|
|账号	|ga的入口，整个组织的最高层级，一个google账号可以有100个ga账号|
|媒体资源和应用|网站、移动应用或设备。一个账号可以包含多个媒体资源，上限50。一个媒体资源对应一个网站或应用|
|数据视图|报告的入口。通过这种定义的视图可以查看媒体资源中的数据。一个媒体资源可以有25个数据视图|

{% asset_img three_w.png %}

可以在左上方做三个纬度的切换，在左下方（管理按钮）做三个纬度的管理

{% asset_img three_w_s.png %}

### 报告

{% asset_img report_nav.png %}

- 实时:主要是从不同角度预览目前有多少人在访问网站
  - 具体六种实时报告请看ga说明文档：https://support.google.com/analytics/answer/1638637
- 受众群体:有关用户属性的报告，从各不同的维度去展示用户画像，通过受众群体的数据能更深入的分析网站的访客
  - https://support.google.com/analytics/answer/7162572?hl=zh-Hans
  - https://support.google.com/analytics/answer/1012034?hl=zh-Hans
- 流量获取：流量获取模块主要是流量是从哪些渠道获取的角度去展示数据
  - 之前提到的utm_source、utm_media等utm流量追踪参数，可以在 流量获取 → 所有流量 → 来源/媒介  中看到体现
- 行为：主要是展现用户行为
  - 之前提到的事件上报，可以在 行为 → 事件 中看到体现
  - 另外，站点页面的pvuv数据也是在“行为”中看到
- 转化：包含目标、电子商务、多渠道路径和归因

## gtm（Google Tag Manager）基本概念

gtm属于代码管理工具，对于开发的影响：接入gtm后，事件上报相关代码就可以不再由开发在项目代码中插入，改为在gtm后台中处理。

- 代码（Tag）代码指的是向第三方（比如 Google）发送信息的 JavaScript代码段。如果您不使用诸如 GTM这样的代码管理解决方案，则需要将这些 JavaScript 代码段直接添加到网站的源代码中。
- 触发器（Trigger）触发器是指在运行时结果为“true”或“false”的条件，用于控制该代码在何时触发或不触发。代码必须至少有一个触发器才能触发。
- 变量（Variable）变量分为内置变量和用户自定义变量，内置变量是指一系列预先设定且不可自定义的特殊变量，要使用的时候，您需要将其勾选开启，不同容器类型的内置变量不同的；自定义变量是GTM提供一些变量的格式，根据根据自己的需要去创建。

## gtm常见对接场景归纳与对接方式

- gtm跟踪代码部署：对接gtm的基础，预计会逐步在各站点完成
- ga跟踪代码部署：原来直接部署到项目中的ga代码，改为写入gtm代码容器中，站点接入gtm代码容器
- ga事件上报：ga中的事件上报代码不再写入项目代码中，而是写到gtm的容器中
  - 具体步骤就是在gtm代码容器中选择对应元素，绑定事件，并在事件回调中写入ga上报代码
- 接入其他第三方代码：设定各项事件，然后执行第三方代码

## gtm触发器详细说明

|场景|触发器|说明|
|---|---|---|
|网页浏览|网页浏览|在网络浏览器开始加载网页时立即触发|
||DOM 已准备就绪|在浏览器在 HTML 中完成整页构建且文档对象模型 (DOM) 做好解析准备后触发|
||窗口已加载|在页面（包括图片和脚本等嵌入资源）完全加载后触发|
|点击|所有元素|跟踪网页上任何元素（例如链接、图片、按钮等）获得的点击|
||仅链接|仅跟踪使用 <a> 元素的 HTML 链接（如 <a href="www.google.com">Google.com</a>）获得的点击。|
|其他|元素可见性|当网络浏览器视口显示所选元素时，就会触发 Google 跟踪代码管理器的元素可见性触发器。|
||表单提交|在发送表单时触发|
||历史记录更改|网址片段（井号后面部分）发生更改或网站使用的是 HTML5 pushstate API，那么基于历史记录更改事件的触发器将会触发|
||JavaScript 错误|发生未捕获的 JavaScript 异常 (window.onError) 时触发|
||滚动深度|根据用户向下滚动网页的距离来触发|
||计时器|定时间隔向跟踪代码管理器发送事件|
||YouTube 视频|根据用户与嵌入网页中的 YouTube 视频进行的互动来触发代码|
||自定义事件|跟踪您的网站或移动应用上发生的、未按标准方法处理的互动|
||触发器组|将两个或多个触发器的条件作为一个进行评估|

更详细的说明，请看触发器说明文档：https://support.google.com/tagmanager/answer/7679319?hl=zh-Hans&ref_topic=7679108

## gtm后台简单使用

### gtm后台两个主要纬度

|字段|说明|
|---|---|
|账号|gtm的入口，整个组织的最高层级|
|容器|网站、移动应用或设备。|

### 代码、触发器、变量管理

{% asset_img gtm_back_end.png %}

### 一个实例

- 获取 gtm跟踪代码

{% asset_img e1.png %}
{% asset_img e2.png %}

- 部署入站点，部署成功：

{% asset_img e3.png %}
{% asset_img e4.png %}

- 建个触发器

{% asset_img e5.png %}
{% asset_img e6.png %}
{% asset_img e7.png %}

- 在容器中建立代码

{% asset_img e8.png %}
{% asset_img e9.png %}
{% asset_img e10.png %}
{% asset_img e11.png %}
{% asset_img e12.png %}

- 完成后提交

{% asset_img e13.png %}

- 查看效果

{% asset_img e14.png %}

以上，就是gtm的一个使用实例