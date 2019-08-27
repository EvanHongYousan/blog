---
title: 迭代器的构建和使用
date: 2018-09-03 19:42
tags: [设计模式]
---

## 本文背景

目前绝大部分语言都内置了迭代器，而当前开发中对于迭代器的使用也很是频繁。今天刚好看到迭代器相关文档，索性对此做下归纳和总结。
<!-- more -->

## 迭代器模式的含义

迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。所以，迭代器模式可以把迭代的过程从业务逻辑中分离出来，完成一次解耦。

## 迭代器模式的简单实现

```javascript
var each = function(ary, callback){
    for(let i = 0; i < ary.length; i++){
        callback(ary[i], i);
    }
};

each([1, 2, 3], function(item, index){
    dosomething(item, index);
});
```

## 内部迭代器和外部迭代器

### 内部迭代器

上面的 each 函数属于内部迭代器，each 函数的内部已经定义好了迭代规则，它完全接手整个迭代过程，外部只需要一次初始调用。

内部迭代器在调用的时候非常方便，外界不用关心迭代器内部的实现，跟迭代器的交互也仅仅是一次初始调用，但这也刚好是内部迭代器的缺点。由于内部迭代器的迭代规则已经被提前规定，上面的 each 函数就无法同时迭代2个数组了。

比如现在有个需求，要判断 2 个数组里元素的值是否完全相等， 如果不改写 each 函数本身 的代码，我们能够入手的地方似乎只剩下 each 的回调函数了，代码如下:

```javascript
var compare = function( ary1, ary2 ){
    if ( ary1.length !== ary2.length ){
        throw new Error ( 'ary1 和 ary2 不相等' ); }
        each( ary1, function( i, n ){
            if ( n !== ary2[ i ] ){
                throw new Error ( 'ary1 和 ary2 不相等' );
            }
        });
        alert ( 'ary1 和 ary2 相等' );
};
compare( [ 1, 2, 3 ], [ 1, 2, 4 ] ); // throw new Error ( 'ary1和ary2不相等' );
```

### 外部迭代器

外部迭代器必须显式地请求迭代下一个元素，下面是一个外部迭代器的实现：

```javascript
var Iterator = function (obj) {
    var current = 0;
    var getCurrItem = function () {
        return obj[current];
    };
    return {
        next: next,
        isDone: isDone,
        getCurrItem: getCurrItem
    }
};
```

下面是compare函数的改写：

```javascript
var compare = function (iterator1, iterator2) {
    while (!iterator1.isDone() && !iterator2.isDone()) {
        if (iterator1.getCurrItem() !== iterator2.getCurrItem()) {
            throw new Error('iterator1 和 iterator2 不相等');
        }
        iterator1.next();
        iterator2.next();
    }
    alert('iterator1 和 iterator2 相等');
}
var iterator1 = Iterator([1, 2, 3]);
var iterator2 = Iterator([1, 2, 3]);
compare(iterator1, iterator2); // 输出:iterator1 和 iterator2 相等
```

## 倒序迭代器

针对有一定排列顺序的迭代器，有正序，自然有倒序。如果上面 [迭代器模式的简单实现]一节中的迭代顺序为正序，则倒序会是下面这样：

```javascript
var reverseEach = function (ary, callback) {
    for (var l = ary.length - 1; l >= 0; l--) {
        callback(l, ary[l]);
    }
};
reverseEach([0, 1, 2], function (i, n) {
    console.log(n); // 分别输出:2, 1 ,0
});
```

## 终止迭代器

分析下来，迭代器有必要提供一个停止迭代的方式，以避免资源的浪费。下面是一个终止迭代的方式：

```javascript
var each = function (ary, callback) {
    for (var i = 0, l = ary.length; i < l; i++) {
        if (callback(i, ary[i]) === false) {// callback 的执行结果返回 false，提前终止迭代
            break;
        }
    }
};
each([1, 2, 3, 4, 5], function (i, n) {
    if (n > 3) {
        return false;
    }
    console.log(n);
    // n大于3的时候终止循环 // 分别输出:1, 2, 3
});
```

## 迭代器模式的一个应用举例

不同浏览器环境下，获取到上传对象的方式是不同的：

```javascript
var getActiveUploadObj = function () {
    try {
        return new ActiveXObject("TXFTNActiveX.FTNUpload");
    } catch (e) {
        return false;
    }
};
var getFlashUploadObj = function () {
    if (supportFlash()) { // supportFlash 函数未提供
        // IE 上传控件
    }
    var str = '<object type="application/x-shockwave-flash"></object>';
    return $(str).appendTo($('body'));
    return false;
};

var getFormUpladObj = function () {
    var str = '<input name="file" type="file" class="ui-file"/>'; // 表单上传
    return $(str).appendTo($('body'));
};
```

如果要通过迭代器获取上传对象的话，大概是这个样子：

```javascript
var iteratorUploadObj = function () {
    for (var i = 0, fn; fn = arguments[i++];) {
        var uploadObj = fn();
        if (uploadObj !== false) {
            return uploadObj;
        }
    }
};
var uploadObj = iteratorUploadObj(getActiveUploadObj, getFlashUploadObj, getFormUpladObj);
```