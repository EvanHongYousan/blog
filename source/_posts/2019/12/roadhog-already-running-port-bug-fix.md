---
title: 处理跑roadhog开发构建时抛出的“端口已被占用”提示
date: 2019-12-26 18:17:12
categories: [tech]
tags: [webpack, roadhog, bug fix]
---

跑 roadhog 开发环境构建时，roadhog 抛出

```
? Something is already running on port 8000.
Would you like to run the app on another port instead? (Y/n)
```

但我检查后发现 8000 端口并未被占用

<escape><!-- more --></escape>

## 解决

添加 host：

```
127.0.0.1 localhost
```

于是 roadhog 的服务可正常监听 8000 了

## 原理猜测

我把上面那个 host 取消，在命令行中 ping 了一下 localhost

```
ping localhost
ping: cannot resolve localhost: Unknown host
```

发现解析失败

估计是 roadhog 内部执行某操作时，直接使用了“localhost”，但 localhost 在 mac 上会解析失败，于是导致问题出现
