---
title: 对"数据变化->UI变化"间的逻辑进行解耦(2)--发布/订阅模式介绍与简略使用
date: 2018-02-09 18:12
---

## 问题背景

"数据变化->UI变化"间的逻辑解耦已经完成，显而易见，在web前端层面，被观察者通常是数据模型，观察者通常是web ui组件。

在交互丰富的页面中（比如各种推广活动页），通常会有多个被观察者（每个ajax请求都对应一个被观察者），对应多个观察者（页面ui组件）。

随着数据模型复杂度的提高，这种多对多的关系整理起来会越来越复杂（被观察者会被多个观察者观察，观察者自然也有可能观察多个被观察者），所以，我们需要对此进行解决。
<!-- more -->

## 发布/订阅模式介绍

发布/订阅模式是观察者模式的变体。

在观察者模式中，观察者需要到被观察中进行注册。

在发布/订阅模式中，订阅者（观察者）不需要到发布者（被观察者）中注册，他们之间存在一个一个主题/事件频道。代码可以在频道中定义各种事件，发布者可以通过事件广播参数，订阅者可以通过事件接收参数。

## 发布/订阅模式实现原理

我们可以通过一个实例来了解发布/订阅模式的运行原理。

```javascript
function Publisher() {
    this.topics = {};
    this.subUid = -1;
}

Publisher.prototype.publish = function (topic, args) {

    if (!this.topics[topic]) {
        return false;
    }

    var subscribers = this.topics[topic],
        len = subscribers ? subscribers.length : 0;

    while (len--) {
        subscribers[len].func(topic, args);
    }

    return this;
};

Publisher.prototype.subscribe = function (topic, func) {

    if (!this.topics[topic]) {
        this.topics[topic] = [];
    }

    var token = (++this.subUid).toString();
    this.topics[topic].push({
        token: token,
        func: func
    });
    return token;
};

Publisher.prototype.unsubscribe = function (token) {
    for (var m in this.topics) {
        if (this.topics[m]) {
            for (var i = 0, j = this.topics[m].length; i < j; i++) {
                if (this.topics[m][i].token === token) {
                    this.topics[m].splice(i, 1);
                    return token;
                }
            }
        }
    }
    return this;
};

var Subscriber = function (name) {
    this.name = name;
}

Subscriber.prototype.log = function (topic, message) {
    console.log('I am ' + this.name + ', I receive message from ' + topic + ', the message is: ' + message);
}

var publisher = new Publisher();

var subscriber1 = new Subscriber('subscriber1');
var subscriber2 = new Subscriber('subscriber2');
var subscriber3 = new Subscriber('subscriber3');
var subscriber4 = new Subscriber('subscriber4');
var subscriber5 = new Subscriber('subscriber5');

publisher.subscribe('channer1', subscriber1.log.bind(subscriber1));
publisher.subscribe('channer2', subscriber2.log.bind(subscriber2));
publisher.subscribe('channer3', subscriber3.log.bind(subscriber3));
publisher.subscribe('channer1', subscriber4.log.bind(subscriber4));
publisher.subscribe('channer1', subscriber5.log.bind(subscriber5));

publisher.publish('channer1', 'channer1 is big');
publisher.publish('channer2', 'channer2 is not big');
publisher.publish('channer3', 'channer3 is small');
```

发布/订阅模式使用方式简述完毕。

## 参考

[《JavaScript设计模式与开发实践》](https://book.douban.com/subject/26382780/)

[Learning JavaScript Design Patterns](https://addyosmani.com/resources/essentialjsdesignpatterns/book/)
[Learning JavaScript Design Patterns 中文版](http://www.oschina.net/translate/learning-javascript-design-patterns#introduction)