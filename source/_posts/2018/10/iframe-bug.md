---
title: iframe踩坑记录
date: 2018-10-11 15:32:58
categories: [tech]
tags: [iframe, bug fix]
---

以现代 web 页面最佳实践而言，iframe 是属于应该尽量避免使用的东西。

不过，在人力资源和产出需求相矛盾的情况下，iframe 又是解决这一矛盾的利器。
<escape><!-- more --></escape>

## 背景

在一个纯展示推广页中，有个区域，固定展示之前已经做好的另一页面里的部分内容，且此区域不可滚动。

之前已做好的页面实际上在另一站点，逻辑较为复杂，业务耦合度高，很多业务并未抽出做成公用服务。

当前推广站点若要重构相关内容，花费的代价会比较大。经讨论，决定使用 iframe 载入相关需要展示的页面。

## 问题记录

#### 使用 html2canvas 生成长图用于分享无法实现

- 问题背景：产品希望实时根据页面内容生成长图，引导用户分享长图

- 结论：iframe 里面的内容无法被解析，所以这个需求点只能放弃

#### iOS webview 中无法对 iframe 的高度进行设置

- 问题背景：iframe 载入的目标页面有很多内容，而我们需要的只是其中一小部分。所以我们要根据推广页的宽度，计算出可展示内容的高度，然后对 iframe 的高度作出限制，且 iframe 不可被滚动
- 原因：对 iframe 的 height 属性做设置，在 iOS 中会失效。
- 结论：另行生成一个 style 标签（高度需要实时计算，所以 style 标签由 javascript 生成），里面有 iframe 的高度限制，再插入 head 标签中

#### 安卓 webview 中，iframe onload 事件失效

- 问题背景：产品希望 iframe 载入相关内容时，未载入完全时，展示 loading 动画
- 原因：某些安卓 webview 中，iframe onload 事件失效。iframe 实际已经加载完毕，但一只不触发 onload 事件，于是页面相关区域就一直 loading 中。在用户看来，iframe 区域一直 loading，感觉就是“明显有 bug”。
- 结论：牺牲掉这个 loading 动画，让 webview 一直展示。
