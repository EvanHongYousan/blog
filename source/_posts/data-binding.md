---
title: 数据绑定方案收集
date: 2018-03-12 15:28
---

## 封装属性访问器 

```javascript
//Object.defineProperty(obj, prop, descriptor)  
//obj ，待修改的对象  
//prop ，带修改的属性名称  
//descriptor ，待修改属性的相关描述  
var obj = {};
Object.defineProperty(obj,'a',{  
    set:function(newVal){  
        document.getElementById('a').value = newVal;  
        document.getElementById('b').innerHTML = newVal;  
    }  
});  
    
document.addEventListener('keyup',function(e){  
    obj.a = e.target.value;  
});
```
<!-- more -->

>对象里目前存在的属性描述符有两种主要形式：数据描述符和存取描述符。数据描述符是一个具有值的属性，该值可能是可写的，也可能不是可写的。存取描述符是由getter-setter函数对描述的属性。描述符必须是这两种形式之一；不能同时是两者。

### 数据描述符和存取描述符均具有以下可选键值：

- configurable

当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认为 false。

- enumerable

当且仅当该属性的enumerable为true时，该属性才能够出现在对象的枚举属性中。默认为 false。

### 数据描述符同时具有以下可选键值：

- value

该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined。

- writable

当且仅当该属性的writable为true时，value才能被赋值运算符改变。默认为 false。

### 存取描述符同时具有以下可选键值：

- get

一个给属性提供 getter 的方法，如果没有 getter 则为 undefined。该方法返回值被用作属性值。默认为 undefined。

- set

一个给属性提供 setter 的方法，如果没有 setter 则为 undefined。该方法将接受唯一参数，并将该参数的新值分配给该属性。默认为 undefined。

>如果一个描述符不具有value,writable,get 和 set 任意一个关键字，那么它将被认为是一个数据描述符。如果一个描述符同时有(value或writable)和(get或set)关键字，将会产生一个异常。

## angular 1.x 的数据绑定原理

在未引入angluar1.x的情况下，要实现angular1.x的数据绑定设计，大概会是下面这样：

```javascript
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>two-way binding</title>
    </head>
    <body onload="init()">
        <button ng-click="inc">
            increase 1
        </button>
        <button ng-click="inc2">
            increase 2
        </button>
        <span style="color:red" ng-bind="counter"></span>
        <span style="color:blue" ng-bind="counter"></span>
        <span style="color:green" ng-bind="counter"></span>

        <script type="text/javascript">
            /* 数据模型区开始 */
            var counter = 0;

            function inc() {
                counter++;
            }

            function inc2() {
                counter+=2;
            }
            /* 数据模型区结束 */

            /* 绑定关系区开始 */
            function init() {
                bind();
            }

            function bind() {
                var list = document.querySelectorAll("[ng-click]");
                for (var i=0; i<list.length; i++) {
                    list[i].onclick = (function(index) {
                        return function() {
                            window[list[index].getAttribute("ng-click")]();
                            apply();
                        };
                    })(i);
                }
            }

            function apply() {
                var list = document.querySelectorAll("[ng-bind='counter']");
                for (var i=0; i<list.length; i++) {
                    list[i].innerHTML = counter;
                }
            }
            /* 绑定关系区结束 */
        </script>
    </body>
</html>
```

## ECMA2015的新特性Proxy

```javascript
let validator = {
  set: function(obj, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid');
      }
    }

    // The default behavior to store the value
    obj[prop] = value;

    // Indicate success
    return true;
  }
};

let person = new Proxy({}, validator);

person.age = 100;
console.log(person.age); // 100
person.age = 'young'; // Throws an exception
person.age = 300; // Throws an exception
```

## 几个被废弃的方案

### 1
Object.observe(obj, callback[, acceptList]) 方法对对象（或者其属性）进行监控观察，一旦其发生变化时，将会执行相应的handler。

现在 Object.observe 将不加入es7 [An update on Object.observe](https://mail.mozilla.org/pipermail/es-discuss/2015-November/044684.html)

### 2
Object.prototype.watch(prop, handler) 方法对对象属性进行监控观察，一旦其发生变化时，将会执行相应的handler。

此方法只在Firefox 58之前的Firefox中实现，其余浏览器及浏览器版本均不实现此方法 [Object.prototype.watch()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/watch)