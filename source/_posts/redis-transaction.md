---
title: redis 事务
date: 2019-07-09 17:06:58
tags: [redis]
---

Redis 的事务使用非常简单，不同于关系数据库，我们无须理解那么多复杂的事务模型，就可以直接使用。不过也正是因为这种简单性，它的事务模型很不严格，这要求我们不能像使用关系数据库的事务一样来使用 Redis。
<escape><!-- more --></escape>

![](/images/redis-transaction/overview.png)