---
title: 关于redis的一些总结
date: 2019-07-07 10:30:00
categories: [tech]
tags: [redis]
---

Redis（Remote Dictionary Server )，即远程字典服务，是一个开源的使用 ANSI C 语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value 数据库，并提供多种语言的 API。

<escape><!-- more --></escape>

## 持久化

{% asset_img redis-datapersistence.png %}

## 线程 io 模型

{% asset_img redis-io.png %}

## 主从同步

{% asset_img redis-master-slave.png %}

## 管道

{% asset_img redis-pipe.png %}

## 通信协议

{% asset_img redis-protocol.png %}

## PubSub

{% asset_img redis-PubSub.png %}

## 事务

{% asset_img redis-transaction.png %}

## 小对象压缩

{% asset_img redis-ziplist.png %}
