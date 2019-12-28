---
title: redis 小对象压缩
date: 2019-07-10 20:06:58
categories: [tech]
tags: [redis]
---

Redis 是一个非常耗费内存的数据库，它所有的数据都放在内存里。如果我们不注意节约使用内存，Redis 就会因为我们的无节制使用出现内存不足而崩溃。
<escape><!-- more --></escape>

{% asset_img overview.png %}