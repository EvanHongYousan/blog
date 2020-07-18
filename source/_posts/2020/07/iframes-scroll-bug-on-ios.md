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

- 处理

1. 
    ```html
    <div style="overflow:scroll !important; -webkit-overflow-scrolling:touch !important;">
        <iframe src="YOUR_PAGE_URL" width="600" height="400"></iframe>
    </div>
    ```
2. 触发弹框中 input 元素 blur 事件时，对弹框聚焦
3. 对于可能产生滚动条的子元素，设置子元素的 min-height 大于父元素的 height，尽量使iOS产生scrollView

>问题未彻底解决：在上述三种处理方式叠加后，频繁触发input blur事件，仍有小几率触发弹框无法滚动的现象

- 参考

https://stackoverflow.com/questions/4599153/iframes-and-the-safari-on-the-ipad-how-can-the-user-scroll-the-content

https://segmentfault.com/a/1190000016408566