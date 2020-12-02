---
title: 处理git无法检测文件名大小写变动问题
date: 2019-12-25 17:53:58
categories: [tech]
tags: [git, bug fix]
---

windows 和 os x 默认不区分文件名大小写

linux 是默认区分文件名大小写

另外观察到，至少在 os x 下，git 默认也不区分文件名大小写

这就很容易带来问题

> 估计和文件系统有关，先不深究
> <escape><!-- more --></escape>

## 问题回溯

代码中，对 api.js 的引用是这么写的

```javascript
import { xxxMethod } from "./Api";
```

在 os x 中运行正常，未报错

部署至 linux 服务器时，就报典型的“can't resolve ./Api ......” 这样的错误

解决方式很明显：文件`api.js` 改名为 `Api.js`

不过，在本地通过编辑器做了文件名更改后，发现 git 未检测到文件名变动，于是要对此进行解决

## 信息搜集

经搜索后，发现有下面几个方法

1. `git mv -f OldFileNameCase newfilenamecase`
1. `git config core.ignorecase false`
1. ```
   Rename FILE.ext to whatever.ext
   Stage that file
   Now rename whatever.ext to file.ext
   Stage that file again
   ```

> 方法 2 也会引来问题，具体请看[解决 Git 默认不区分文件名大小写的问题](https://www.jianshu.com/p/df0b0e8bcf9b)

最后选择了方法 1，问题解决

## 延伸

本次问题出现，说明"文件名建议只使用小写字母，不使用大写字母。"这种规范果然有其出现的原因。

后续制定相关规范时，若无特别原因，都要将其纳入

## 参考

[How do I commit case-sensitive only filename changes in Git?](https://stackoverflow.com/questions/17683458/how-do-i-commit-case-sensitive-only-filename-changes-in-git)
[解决 Git 默认不区分文件名大小写的问题](https://www.jianshu.com/p/df0b0e8bcf9b)
[为什么文件名要小写？](https://www.ruanyifeng.com/blog/2017/02/filename-should-be-lowercase.html)
