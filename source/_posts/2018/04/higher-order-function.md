---
title: 高階函数特性与装饰者模式
date: 2018-04-03 14:32:58
categories: [tech]
tags: [设计模式]
---

## 高階函数特性

- 函数可以作为参数被传递
- 函数可以作为返回值输出
  <escape><!-- more --></escape>

## 高階函数特性使用场景

### 作为参数被传递: 回调函数

```javascript
function callBack(str) {
  console.log(str);
}

function test(str, callback) {
  callback(str);
}

test("test", callBack);
```

### 作为返回值输出: 构建闭包

```javascript
var logPick = (function () {
  var pick = 1;
  return function () {
    console.log(pick);
    pick++;
  };
})();
```

## 装饰者模式介绍

装饰模式是在不必改变原类文件和使用继承的情况下，动态地扩展一个对象的功能。它是通过创建一个包装对象，也就是装饰来包裹真实的对象。

当脚本运行时，在子类中增加行为会影响原有类所有的实例，而装饰者却不然，它能给不同对象各自添加新行为。这就是装饰者模式的好处。

## 装饰者模式使用场景

### 数据统计上报

```javascript
Function.prototype.after = function (afterfn) {
  var _self = this;
  return function () {
    var ret = _self.apply(this, arguments);
    afterfn.apply(this, arguments);
    return ret;
  };
};
var func = function (param) {
  console.log(param);
};
func = func.after(function (param) {
  console.log("report: " + JSON.stringify(param));
});
```

### 改变参数

```javascript
Function.prototype.before = function (beforefn) {
  var _self = this;
  return function () {
    beforefn.apply(this, arguments);
    return _self.apply(this, arguments);
  };
};
var func = function (param) {
  console.log(param);
};
func = func.before(function (param) {
  param.kk = "kk";
  console.log("decorator params");
});
```
