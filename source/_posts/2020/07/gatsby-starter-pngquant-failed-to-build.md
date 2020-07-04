---
title: 使用 gatsby cli 问题：pngquant failed to build
tags:
  - gatsby
  - pngquant
date: 2020-07-04 13:26:55
categories:
---

{% asset_img images.png %}

使用 gatsby cli 遇到问题

<escape><!-- more --></escape>

使用 gatsby cli 构建初始项目

```
gatsby new my-blazing-fast-site
```

遇到问题：

```
> pngquant-bin@5.0.2 postinstall /Users/yantianyu/Documents/repo/my-blazing-fast-site/node_modules/pngquant-bin
> node lib/install.js

  ⚠ connect ETIMEDOUT 0.0.0.0:443
  ⚠ pngquant pre-build test failed
  ℹ compiling from source
  ✖ Error: pngquant failed to build, make sure that libpng is installed
    at Promise.all.then.arr (/Users/yantianyu/Documents/repo/my-blazing-fast-site/node_modules/bin-build/node_modules/execa/index.js:231:11)
    at process._tickCallback (internal/process/next_tick.js:68:7)
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! pngquant-bin@5.0.2 postinstall: `node lib/install.js`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the pngquant-bin@5.0.2 postinstall script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
```

- 解决：

https://github.com/gatsbyjs/gatsby/issues/20389

https://gist.github.com/XYShaoKang/ae657eb81279528cca718c678be28215

https://pngquant.org/install.html