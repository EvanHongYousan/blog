---
title: 命令行中设置NODE_ENV时mac与windows的差异
date: 2019-12-31 14:23:56
categories: [tech]
tags: [npm, NODE_ENV]
---

<escape><!-- more --></escape>

## 差异

- windows
```
set NODE_ENV=production node xxx.js
```

- mac
```
export NODE_ENV=production node xxx.js
```

## set node_env cross platform

```shell
$ npm install --save-dev cross-env
```

```javascript
{
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js"
  }
}
```