---
title: 修复 ‘iframes 弹框无法在iOS中上下滚动’问题
date: 2020-07-04 15:30:04
categories: [tech]
tags: [iframe, iOS, scroll, bug fix]
---

```html
<div style="position: fixed;">
     <iframe src="YOUR_PAGE_URL" width="600" height="400"></iframe>
</div>
```

如上，div中的iframe内容超过屏幕长度，却无法滚动

<escape><!-- more --></escape>

- 解决

```html
<div style="overflow:scroll !important; -webkit-overflow-scrolling:touch !important;">
     <iframe src="YOUR_PAGE_URL" width="600" height="400"></iframe>
</div>
```

- 参考

https://stackoverflow.com/questions/4599153/iframes-and-the-safari-on-the-ipad-how-can-the-user-scroll-the-content