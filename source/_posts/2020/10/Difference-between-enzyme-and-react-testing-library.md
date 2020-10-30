---
title: 【翻译】enzyme 和 react-testing-library 之间的不同
categories:
  - tech
tags:
  - 翻译
  - 自动化测试
  - react
  - enzyme
  - react-testing-library
date: 2020-10-30 20:48:55
---


{% asset_img 1.png %}

<escape><!-- more --></escape>

## Enzyme

Enzyme是由Airbnb推出的流行的测试库。它已经发布了很长一段时间，且react官方文档建议减少使用Enzyme作为编写测试用例的模板。Enzyme的API旨在通过模仿jQuery的API来实现直观和灵活的DOM操作和遍历。

## React Testing Library

React Testing Library -- 一个非常通用的名字，它作为一个测试库，旨在解决与其他测试库不同的用例。React Testing Library迫使你编写不脆弱的测试 -- 测试并不是测试具体实现，而是测试组件的功能。它鼓励编写代码的最佳实践，并使代码具备可测试性，和测试正确的条件。

更新--React Testing Library现在改名为@testing-library/react。

让我们来看看Enzyme与@testing-library/react的一些区别。

## Case 1 - 设置

在Enzyme中，你需要配置适配器，使其与React 16一起工作。还有其他的第三方适配器可以使Enzyme与这些库一起工作。

```javascript
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
```

在 @testing-library/react 中，不需要太多的设置。你必须安装 @testing-library/react npm 模块，然后就可以了。

```javascript
npm install --save-dev react-testing-library
```

## Case 2 概念差异

当你在Enzyme中编写测试时，你有方法检查类的状态属性，检查传递给组件的props是什么。但是如果你是用道具和状态来测试组件，那就意味着你的测试很脆弱。如果明天有人改变了状态变量的名称，那么你的测试就会失败。即使组件的功能是一样的，只是因为组件中使用的状态变量名重名了，测试就会失败。由此可见单元测试的脆性。

而@testing-library/react没有测试状态或道具的方法。相反，它测试的是dom，也就是用户正在与之交互的东西。

@testing-library/react的指导原则之一是

如果涉及到渲染组件，它处理的是DOM节点而不是组件实例，也不应该鼓励处理组件实例。

所以，你没有得到组件实例的方法，也没有自己调用组件的方法。相反，你就像用户一样在DOM上工作。想测试对服务器的异步函数调用吗？从DOM中获取按钮，点击它，模拟API，然后在DOM中检查结果。

## Case 3 没有强制更新()或强制重新渲染组件

在Enzyme中，你有ForceUpdate方法来重新渲染组件。如果你在组件内部窥探一些箭头函数（组件内部的箭头函数是错误的），那么你将不得不强制更新组件。

在@testing-library/react中，你没有任何这样的方法。相反，它只使用DOM进行测试。

## Case 4 没有浅层或深层的渲染

在@testing-library/react中，你没有直接的方法来测试组件的实例。所以，在React测试库中，没有对组件进行浅层或深层的渲染。

## Case 5 约束性

Enzyme不是一个强约束（opionated）的库，它提供了访问组件内部的方法，即组件的实例方法、状态和道具。它提供了访问组件内部的方法，即组件的方法、状态和属性。但是Enzyme也提供了访问组件的DOM的方法，所以通过使用Enzyme，你可以选择测试组件的内部结构，即组件的方法，状态和属性。

所以通过使用Enzyme，你可以选择测试组件的内部，也可以选择不测试。Enzyme并不强制执行任何关于你应该如何测试组件的意见。

@testing-library/react是强约束（opionated）的库。它只提供给你渲染组件和访问DOM的方法，不提供访问组件的方法。它不提供访问组件内部的方法。

## 总结

虽然@testing-library/react的目标是与Enzyme竞争，并鼓励你从用户的角度编写可测试的代码和对应测试，但它们都有用例。你不能用一个代替另一个。有时你确实需要测试组件内部的状态变化或功能，尽管从用户的角度来看，它可能没有意义。在这些情况下，需要用Enzyme来测试实例方法。React Testing Library很适合测试组件的DOM，因为它允许你像用户使用它一样进行测试。

原文: [Difference between enzyme and react-testing-library](https://techdoma.in/react-js-testing/difference-between-enzyme-and-react-testing-library)

译者: Evan