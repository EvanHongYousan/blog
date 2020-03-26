---
title: google analytics过滤器简单使用说明
date: 2020-02-08 20:35:55
categories: [tech]
tags: [用户增长, google analytics, ga过滤器, 用户增长, google analytics solution]
---

{% asset_img 1.gif %}

身担运营、推广职责的人员，通常会对特定的运营类、推广类页面有较为精准的数据统计需求，因为他们在制定相关报表时，经常会以单个运营活动为中心进行数据组织

则上述人员在使用ga时，会希望数据视图只展示某个特定活动的数据，故他们在提相关活动需求时，每个活动都会给出新的ga埋点需求。

但其实，ga本身已经给出了更为优雅的使用方式

<escape><!-- more --></escape>

## ga过滤器的使用

下面以一个实例进行说明

blog 站点 https://evanhongyousan.github.io/ 整站都进行了ga埋点，故可以在ga后台中看到相关上报数据：

{% asset_img 2.png %}

blog站点以blog生成时间来组织相关url，其文章页面url皆以下面这样的格式生成：

```
https://evanhongyousan.github.io/2019/12/29/load-img-step-by-step/
https://域名/年/月/日/文章名称/
```

站点运营人员希望后续专门统计2019年7月下所有文章报表数据，可以这么做：

1. 管理->blog 站点媒体资源 -> 创建数据视图，新数据视图命名为`2019-07's page`
{% asset_img 3.png %}
2. 选择视图`2019-07's page`，过滤器->添加过滤条件
{% asset_img 4.png %}
{% asset_img 5.png %}
3. 2019年7月下所有文章的URL中都带有`/2019/07/`(比如https://evanhongyousan.github.io/2019/07/09/redis-transaction/ )，故过滤条件可以这么设置
{% asset_img 6.png %}

创建了新数据视图并设置好过滤器后，再过几小时，可以看到ga后台中会有相应数据：

{% asset_img 1.gif %}

>ps：google的说明文档 [验证数据视图过滤器](https://support.google.com/analytics/answer/6046990?hl=zh-Hans&ref_topic=1032939) 中，新创建的过滤器需要等待24小时才能产生效果。本次实践只需要几小时即看到效果，原因可能是数据量小。

## 参考

[创建和管理数据视图过滤器](https://support.google.com/analytics/answer/6046990?hl=zh-Hans)

[验证数据视图过滤器](https://support.google.com/analytics/answer/6046990?hl=zh-Hans&ref_topic=1032939)