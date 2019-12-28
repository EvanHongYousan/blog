---
title: 使用ga进行邮件营销跟踪
date: 2019-08-29 21:33:55
categories: [tech]
tags: [用户增长, google analytics, 邮件营销]
---

在非大陆环境下的营销活动中，邮件营销（edm）是不可或缺的一环。而邮件营销的效果，基本可由邮件打开率、邮件链接追踪情况得出。
{% asset_img 7.png %}

<escape><!-- more --></escape>

### ga准备

1. 注册google账号，然后进入https://analytics.google.com/analytics/web/#/
2. 创建媒体资源
    1. 如果是新账号，则需要先新建ga账号{% asset_img 1.png %}
    2. 创建媒体资源{% asset_img 2.png %}
    3. 进入媒体资源设置，获取到跟踪ID{% asset_img 3.png %}
    4. 点击“跟踪信息”，再点击“跟踪代码”，得到代码{% asset_img 4.png %}

至此，准备完成
    

### 邮件打开率

通过img标签，使用ga的[Measurement Protocal Reference](https://developers.google.com/analytics/devguides/collection/protocol/v1/reference)协议，把数据上报至ga server。下面是一个img标签例子：

```javascript
<img src="https://www.google-analytics.com/collect?v=1&tid=UA-XXXXXXXX-1&cid=CLIENT_ID_NUMBER&t=event&ec=email&ea=open&el=recipient_id&cs=newsletter&cm=email&cn=Campaign_Name&z=123456" />
```

各个参数含义

key | value说明
----|----
v | ga版本号码，值为1。必填
tid | ga跟踪ID， 用于区分是要向哪个 Google Analytics（分析）媒体资源发送数据。必填
cid | 每位用户专属的ID，必填
t | 针对特定用户收集的互动数据类型，针对当前文档的场景，可考虑设为emailview。必填
ec | 事件类别，这裡设email
ea | 事件活动，这裡设open
el | 事件标籤
cs | 广告活动来源，这裡设newsletter
cm | 广告活动媒介，这裡同样设email
cn | 广告活动名称
z | 缓存无效化随机数字

更详细的参数参考在[这里](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters)

下面是一个真实例子：

```javascript
https://www.google-analytics.com/collect?v=1&tid=UA-146663661-1&cid=001&t=event&ec=email&ea=open&el=recipient_id&cs=newsletter&cm=email&cn=Campaign_Name&z=123456
```

使用浏览器直接做get请求

{% asset_img 6.png %}

在ga中可以看到

{% asset_img 7.png %}

>当然，使用img标签的缺陷，就在于当邮件系统阻挡图片时，上报会失效

### 邮件链接追踪情况

追踪邮件链接，主要使用[网址产生器](https://support.google.com/analytics/answer/1033867?hl=zh-Hant)
为链接加上get参数标识别。
比如，给
```javascript
https://act.moomoo.com/invite?code=643273466b693964783047384d452b397054794277773d3d&type=promotion
```
加上get参数标识，变成
```javascript
https://act.moomoo.com/invite?code=643273466b693964783047384d452b397054794277773d3d&type=promotion&utm_source=google&utm_medium=email&utm_campaign=invite_act&utm_term=invite%2Bstock&utm_content=invite_link
```

{% asset_img 5.png %}

若目标页面引入了ga跟踪代码，ga跟踪代码会识别到链接上的get参数，进行上报时就会按照参数值进行归类整合

以下是google提供的参数填写说明

key | value说明 | example
----|----|----
utm_source | 广告活动来源：必须提供，表示搜寻引擎、电子报名称或其他来源。 | utm_source=google
utm_medium | 广告活动媒介：必须提供，表示媒介，例如电子邮件或单次点击出价。 | utm_medium=cpc
utm_term | 广告活动字词：用于付费搜寻，表示此广告的关键字。 | utm_term=running+shoes
utm_content | 广告活动内容：用于 A/B 测试和指定内容广告，表示连到同一个网址的不同广告或连结。 | utm_content=logolink 或 utm_content=textlink
utm_campaign | 广告活动名称：用于关键字分析，表示某项产品促销或策略性广告活动。 | utm_campaign=spring_sale

### 与现有业务结合

对于业务事件触发的自动邮件推送，开发人员只需要往邮件模板里添加img标签、跳转链接添加ga参数便可

对于公司内部产品、运营人员的主动推送的营销邮件，也可请求开发人员协助，望html中添加上报。

所以，加上报并不算麻烦，相关工作重点仍然是营销渠道开发与管理维护。

### 引用

[追蹤Email與EDM開信點擊－透過Google Analytics](https://www.analyticsdavis.com/2014/05/email-and-edm-tracking-by-google-analytics.html)