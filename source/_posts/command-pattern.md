---
title: 命令模式的构建与使用
date: 2018-09-03 20:06:58
tags: [设计模式]
---

设计模式的精髓，就是解耦；而命令模式的所作的事情，就是对请求的发出者和请求的接收者进行解耦。
<escape><!-- more --></escape>

## 命令模式使用场景

有时候需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道被请求的操作是什么，此时希望用一种松耦合的方式来设计软件，使得请求发送者和请求接收者能够消除彼此之间的耦合关系。

## 一个命令模式的简单例子

首先是几个按钮的绘制：
```javascript
<body>
<button id="button1">点击按钮 1</button>
<button id="button2">点击按钮 2</button>
<button id="button3">点击按钮 3</button>
</body>

<script>
var button1 = document.getElementById( 'button1' ), 
var button2 = document.getElementById( 'button2' ), 
var button3 = document.getElementById( 'button3' );
</script>
```

然后定义一个setCommand函数，setCommand函数负责往按钮上面安装命令：

```javascript
var setCommand = function(button, command){
    button.onclick = function(){
        command.execute();
    };
};
```

定义两个功能对象：

```javascript
var MenuBar = {
    refresh: function () {
        console.log('refresh menu');
    }
};
var SubMenu = {
    add: function () {
        console.log('add menu');
    },
    del: function () {
        console.log('del menu');
    }
};
```

定义几个命令对象：

```javascript
function RefreshCommand(receiver){
    this.receiver = receiver;
}
RefreshCommand.prototype.execute = function(){
    this.receiver.refresh();
};

function AddCommand(receiver){
    this.receiver = receiver;
}
RefreshCommand.prototype.execute = function(){
    this.receiver.add();
};

function DelCommand(receiver){
    this.receiver = receiver;
}
RefreshCommand.prototype.execute = function(){
    this.receiver.del();
};
```

最后，通过命令对象，把命令接收者（功能对象）和命令请求者（按钮）联系起来：

```javascript
var refreshMenuBarCommand = new RefreshMenuBarCommand( MenuBar ); 
var addSubMenuCommand = new AddSubMenuCommand( SubMenu );
var delSubMenuCommand = new DelSubMenuCommand( SubMenu );
setCommand( button1, refreshMenuBarCommand ); 
setCommand( button2, addSubMenuCommand ); 
setCommand( button3, delSubMenuCommand );
```

## javascript中的命令模式

```javascript
var bindClick = function (button, func) {
    button.onclick = func;
};

var MenuBar = {
    refresh: function () {
        console.log('refresh menu');
    }
};
var SubMenu = {
    add: function () {
        console.log('add menu');
    },
    del: function () {
        console.log('del menu');
    }
};
bindClick(button1, MenuBar.refresh);
bindClick(button2, SubMenu.add);
bindClick(button3, SubMenu.del);
```

可以看到，上面这段代码中，并没有command和receiver两个概念。

原因就是，相对于简单例子中的传统命令模式实现，javascript版命令模式实现利用了高阶函数特性(函数可作为参数被传递，函数可作为返回值被输出)。

## 撤销命令

首先是一种最简单的撤销：针对上一步的操作，再做一次'反向操作'。下面是一些简单例子的罗列：

1. 移动了一个dom元素，则作undo操作时，就把dom元素移回原来的位置（做移动操作时，需要记录下移动前的位置）
1. 输入了一段文本，则作undo操作时，就把输入的文本删去（做输入操作时，需要记录下当前输入的文本）

下面是一个例子：

```html
<body>
    <div id="ball" style="position:absolute;background:#000;width:50px;height:50px"></div> 
    输入小球移动后的位置:<input id="pos"/>
    <button id="moveBtn">开始移动</button>
    <button id="cancelBtn">cancel</cancel> <!--增加取消按钮-->
</body>
```

```javascript
var ball = document.getElementById('ball');
var pos = document.getElementById('pos');
var moveBtn = document.getElementById('moveBtn');
var MoveCommand = function (receiver, pos) {
this.receiver = receiver;
    this.pos = pos;
};
MoveCommand.prototype.execute = function () {
    this.receiver.start('left', this.pos, 1000, 'strongEaseOut');
};
var moveCommand;
moveBtn.onclick = function () {
    var animate = new Animate(ball);
    moveCommand = new MoveCommand(animate, pos.value); 
    moveCommand.execute();
};
```

添加一个undo按钮：

```html
<button id="cancelBtn">cancel</cancel> <!--增加取消按钮-->
```

添加undo操作：

```javascript
MoveCommand.prototype.undo = function(){
    this.receiver.start( 'left', this.oldPos, 1000, 'strongEaseOut' ); // 回到小球移动前记录的位置
};
```

移动操作(execute方法)也需要改写：

```javascript
MoveCommand.prototype.execute = function () {
    this.receiver.start('left', this.pos, 1000, 'strongEaseOut');
    this.oldPos = this.receiver.dom.getBoundingClientRect()[this.receiver.propertyName]; 11 // 记录小球开始移动前的位置
};
```

关联undo按钮和undo操作：

```javascript
var cancelBtn = document.getElementById( 'cancelBtn' );
cancelBtn.onclick = function(){ 
    moveCommand.undo();
};
```

## 撤销和重做

针对撤销功能的实现，上面的是对上一步操作做反向操作，但其实我们也可以换一种思路：把整个环境初始化，然后把做过的操作重新执行一遍，执行到准备撤销的前一步操作为止。

下面是一个利用重做功能去完成撤销功能的例子：

```html
<html>

<body>
    <button id="replay">播放录像</button>
    <button id="undo">撤销上一步</button>
</body>
<script>
    var Ryu = {
        attack: function () {
            console.log('攻击');
        },
        defense: function () {
            console.log('防御');
        },
        jump: function () {
            console.log('跳跃');
        },
        crouch: function () {
            console.log('蹲下');
        }
    };

    var makeCommand = function (receiver, state) {  // 创建命令
        if (!state) {
            return false;
        }
        return function () {
            receiver[state]();
        }
    };

    var commands = {
        "119": "jump",//w
        "115": "crouch",//s
        "97": "defense",//a
        "100": "attack"//d
    };

    var commandStack = [];  // 保存命令的堆栈

    document.onkeypress = function (ev) {
        var keyCode = ev.keyCode;
        var command = makeCommand(Ryu, commands[keyCode]);
        if (command) {
            command();
            commandStack.push(command);
        }
    }

    document.getElementById('replay').onclick = function () { // 点击播放录像
        var command;
        while (command = commandStack.shift()) {
            command();
        }
    };

    document.getElementById('undo').onclick = function () {
        var command;
        commandStack.pop();//删掉最后一步
        while (command = commandStack.shift()) {
            command();
        }
    };
</script>

</html>
```