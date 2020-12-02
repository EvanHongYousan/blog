---
title: redis 持久化
date: 2019-07-09 15:40:58
categories: [tech]
tags: [redis]
---

Redis 的数据全部在内存里，如果突然宕机，数据就会全部丢失，因此必须有一种机制来保证 Redis 的数据不会因为故障而丢失，这种机制就是 Redis 的持久化机制。
<escape><!-- more --></escape>

{% asset_img overview.png %}
