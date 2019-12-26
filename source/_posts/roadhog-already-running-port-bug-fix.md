---
title: 处理跑roadhog开发构建时抛出的“端口已被占用”提示
date: 2019-12-26 18:17:12
tags: [webpack, roadhog, bug fix]
---

跑roadhog开发环境构建时，roadhog抛出

```
? Something is already running on port 8000.
Would you like to run the app on another port instead? (Y/n)
```

但我检查后发现8000端口并未被占用

<escape><!-- more --></escape>

## 解决

添加host：

```
127.0.0.1 localhost
```

于是roadhog的服务可正常监听8000了

## 原理猜测

我把上面那个host取消，在命令行中ping了一下localhost

```
ping localhost
ping: cannot resolve localhost: Unknown host
```
发现解析失败

估计是roadhog内部执行某操作时，直接使用了“localhost”，但localhost在mac上会解析失败，于是导致问题出现