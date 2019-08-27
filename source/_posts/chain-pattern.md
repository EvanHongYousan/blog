---
title: 职责链模式
date: 2018-07-03 20:06
tags: [设计模式]
---

# 职责链模式

## 定义

使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间 5 的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。
<!-- more -->

## 一个常见的场景

```javascript
if(type1){
    if(type2 === 1){
        //do something
    }
    if(type2 === 2){
        //do something
    }
    if(type2 === 3){
        //do something
    }
} else {
    if(type2 === 4){
        //dom something
    }
}
```

增强一点可读性：

```javascript
if(type1 && type2 === 1){
    //do something
}
if(type1 && type2 === 2){
    //do something
}
if(type1 && type2 === 3){
    //do something
}
if(!type1 && type2 === 4){
    //dom something
}
```

上面的判断逻辑十分常见，是程序后续运营维护的噩梦之一。当业务复杂度开始膨胀后，这样的判断逻辑代码会变得十分难读，修改起来也是非常困难。随着版本的迭代与开发人员的变更，这样的判断逻辑代码最后有可能变成无人敢动的代码块。

## 使用职责链模式进行重构

观察上面的原始代码，可以看到总共有4个判断条件。要把这些判断条件都构造成节点，串联成一个职责链，则这些节点，都必须暴露出一个相同的接口。

先构建4个判断函数

```javascript
function condition1(type1, type2){
    if(type1 && type2 === 1){
    //do something
    } else {
        return 'next';
    }
}
function condition2(type1, type2){
    if(type1 && type2 === 2){
    //do something
    } else {
        return 'next';
    }
}
function condition3(type1, type2){
    if(type1 && type2 === 3){
    //do something
    } else {
        return 'next';
    }
}
function condition4(type1, type2){
    if(!type1 && type2 === 4){
    //do something
    } else {
        return 'next';
    }
}
```

建立节点类，用于实例化节点

```javascript
function Chain(fn){
    this.fn = fn;
    this.nextCall = null;
}
Chain.prototype.setNextCall = function(fn){
    this.nextCall = fn;
};
Chain.prototype.request = function(){
    var ret = this.fn.apply(this, arguments);

    if(ret === 'next'){
        return this.nextCall && this.nextCall.request.apply(this.nextCall, arguments);
    }
};
```

于是，可以构成职责链：

```javascript
var chain1 = new Chain(conditin1);
var chain2 = new Chain(conditin2);
var chain3 = new Chain(conditin3);
var chain4 = new Chain(conditin4);

chain1.setNextCall(chain2);
chain2.setNextCall(chain3);
chain3.setNextCall(chain4);

chain1.request(false, 4);
```

## 异步职责链

当判断函数需要通过异步请求结果才能知道是否调用下一个判断函数时，节点对象自身需要有一个主动调用下一个节点的方法
```javascript
Chain.prototype.next = function(){
    return this.nextCall && this.nextCall.request.apply(this.nextCall, arguments);
};
```

example:
```javascript
function condition5(type1, type2){
    var self = this;
    fetch('/abc.com?type1=' + type1 + '&type2=' + type2).then(function(resp){
        if(resp.code === 0){
            //do something
        } else {
            self.next();
        }
    })
}
var chain5 = new Chain(condition5);
chain5.setNextCall(chain1);
chain5.request(false, 4);
```