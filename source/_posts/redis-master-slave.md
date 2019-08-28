---
title: redis 主从同步
date: 2019-07-11 15:51:58
tags: [redis]
---

有了主从，当 master 挂掉的时候，运维让从库过来接管，服务就可以继续，否则 master 需要经过数据恢复和重启的过程，这就可能会拖很长的时间，影响线上业务的持续服务。
<escape><!-- more --></escape>

![](/images/redis-master-slave/overview.png)