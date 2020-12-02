---
title: "【译】Gatsby vs Next.JS - What, Why and When?"
categories:
  - tech
tags:
  - 翻译
  - gatsby
  - next.js
date: 2020-07-05 18:40:57
---

{% asset_img 1.jpeg %}

好吧，首先，我离题了，我是这两个“框架”的忠实粉丝。我经常在 Twitter 或 Instagram 上看到对它们的赞赏，但是，在谈论这些工具时我被问得最多的问题是：哪个更好？

我应该使用 Next.JS 吗？但是我听说 Gatsby 也很 🔥，也许我应该使用 Gatsby？

因此，我想对此进行一些更深入的讨论，并希望得出一些更明确的选择。

<escape><!-- more --></escape>

让我们开始吧！

{% asset_img 2.gif %}

## 一份对于 Gatsby 和 Next 的介绍

那么，除了以前听人提起过但从未真正了解过的流行语外，Gatsby 和 Next 是什么？

用最基本的话来说，create-react-app 会给你创建一个 React 项目的 boilerplate，而这两个框架将为你创建一个应用奠定基础。

不过，他们已经脱离了 create-react-app，在某种意义上，他们并没有被归类为 boilerplate，而是工具箱，打好了基础，然后给你一套如何建造房子的说明。

总结一下：

create-react-app - 为 React 项目奠定基础。剩下的就看你的了。

Gatsby & Next - 奠定 React 项目的基础。给你指导你应该如何在它们之上构建。

...

可是 那很奇怪？他们俩都做...同一件事？

有点。

乍一看，它们看上去都非常相似：

- 提供一个模板应用
- 生成令人难以置信的高性能、可访问性和 SEO 友好型网站。
- 创建开箱即用的单页应用。
- 拥有非常棒的开发者体验。

但实际上，它们有着本质上的区别。

## 服务器端渲染 vs 静态生成

{% asset_img 3.gif %}

OK，我们将要开始获取一些技术知识点，请紧跟我的思路...不会很糟糕的！

Gatsby 是一款静态网站生成工具。静态网站生成器在构建时生成静态 HTML。它不使用服务器。

Next.JS 主要是一个服务器端渲染页面的工具。每当有新的请求进来时，它都会利用服务器动态生成 HTML。

当然，两者都可以在客户端调用 API。根本的区别是 Next 需要服务器才能运行。Gatsby 完全可以在没有任何服务器的情况下运行。

Gatsby 只是在构建时生成纯 HTML/CSS/JS，而 Next 则在运行时生成 HTML/CSS/JS。所以每次有新的请求进来，它都会从服务器上创建一个新的 HTML 页面。

我不打算在这里太深入地了解每个人的优点和缺点，然而，为了更深入地阅读，请查看这篇文章。- https://dev.to/stereobooster/server-side-rendering-or-ssr-what-is-it-for-and-when-to-use-it-2cpg

## 数据处理

这两个工具之间的另一个根本区别是它们处理数据的方式。

Gatsby 告诉你应该如何处理应用中的数据。

Next.js 则完全由你自己来决定。

{% asset_img 4.gif %}

### 这到底是什么意思？

Gatsby 使用的是一种叫做 GraphQL 的东西。GraphQL 是一种查询语言，如果你熟悉 SQL，它们的工作方式非常相似。用户将使用一种特殊的语法，在组件中描述用户想要的数据，然后这些数据将会被提供。

当组件需要时，Gatsby 会在浏览器中提供这些数据。

一个例子：

```javascript
import React from "react";
import { graphql } from "gatsby";
export default ({ data }) => (
  <div>
    <h1>About {data.site.siteMetadata.title}</h1>
    <p>We're a very cool website you should return to often.</p>
  </div>
);
export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
```

在上面的例子中，你可以看到我们有一个查询来获取标题，然后在组件中显示标题。太棒了！

Gatsby 还有很多针对各种数据源的插件，这（理论上）使得它很容易针对很多数据源进行整合。一些数据源插件的例子是 Contentful、Wordpress、MongoDB 和 Forestry。这允许你做一些事情，比如把你的网站挂到一个 CMS 上，并对内容进行外部控制。

当为生产构建时，不再使用 GraphQL，而是将数据持久化为 JSON 文件。

... 好吧，酷。

Next.js 则是另一种方式：如何管理数据完全由你自己决定。你必须在自己的架构上决定如何管理数据。

这样做的好处是，你不会被捆绑在任何你想或不想使用的技术上。

## 那我该怎么选择呢？

你应该使用 Gatsby 还是 Next，很大程度上取决于你的实际情况，因为其实他们都很酷。

### 何时使用 Next.JS

如果你有很多内容，或者你希望你的内容随着时间的推移会有很大的增长，那么静态生成的网页并不是你最好的解决方案。原因是，如果你有很多内容，建立网站需要很多时间。

当创建一个有数千页的非常大的应用时，重建速度会相当慢。而且如果你必须在点击发布后等待一大段时间才能上线，这不是一个完美的解决方案。

因此，如果您的网站内容随着时间的推移会不断增长，那么 Next.JS 是您的最佳选择。

另外，如果您希望在访问数据方面有更多的自由，那么 Next.JS 值得一提。

在这里值得一提的是，Next 的文档是我见过的最好的文档。它有一个交互：在您浏览完一节内容时，会对你进行测验，以确保你能跟上:)真棒! 👏

### 何时使用 Gatsby

在创建小型网站和博客时，我倾向于使用 Gatsby，这是我个人的喜好。它的生态系统非常适合连接到 CMS（简直是轻而易举），并且有一些很棒的指南，告诉你如何去使用它。

在我看来，Gatsby 更容易上手和运行，这一点值得记住。同样，文档的水平也很高，里面有很多教程，可以跟着学。

Gatsby 还附带了一些 "入门 "模板，以及一个相对较新的特性"主题"，这些都使得一个功能齐全的网络应用能够快速地建立和运行。

---

原文: [Gatsby vs Next.JS - What, Why and When?](https://dev.to/jameesy/gatsby-vs-next-js-what-why-and-when-4al5)

作者: [James Bedford](https://dev.to/jameesy)

译者: Evan
