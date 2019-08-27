---
title: 低成本碰撞动画实现
date: 2018-02-11 15:35:58
tags: [css, html]
---

## 目标效果

![](/images/crashBall-by-css3/crash-ball.gif)
<!-- more -->

## 具体代码

```javascript
<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        html,
        body {
            padding: 0;
            margin: 0;
        }

        .horizontal {
            display: block;
            position: absolute;
            top: 0;
            left: 0;

            -webkit-animation: horizontal 1.4s linear 0s infinite alternate;
            -moz-animation: horizontal 1.4s linear 0s infinite alternate;
            -o-animation: horizontal 1.4s linear 0s infinite alternate;
            animation: horizontal 1.4s linear 0s infinite alternate;
        }

        .vertical {
            display: block;
            position: absolute;
            top: 0;
            left: 0;

            -webkit-animation: vertical 1.1s ease-in 0s infinite alternate;
            -moz-animation: vertical 1.1s ease-in 0s infinite alternate;
            -o-animation: vertical 1.1s ease-in 0s infinite alternate;
            animation: vertical 1.1s ease-in 0s infinite alternate;
        }

        .ball {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: red;
        }
    </style>
</head>

<body>
    <div id="horizontal" class="">
        <div id="vertical" class="">
            <div class="ball"></div>
        </div>
    </div>
    <script src="https://cdn.bootcss.com/jquery/2.0.3/jquery.js"></script>
    <script>
        $ph = $("body").height();
        $pw = $("body").width();
        $ballR = $(".ball").width();

        $("<style></style>").text(
            "@-webkit-keyframes horizontal {0% {transform: translate(0, 0);}100% {transform: translate(" + ($pw -
                $ballR) + "px, 0);}}" +
            "@keyframes horizontal {0% { transform: translate(0, 0);}100% {transform: translate(" + ($pw - $ballR) +
            "px, 0);}}" +
            "@-webkit-keyframes vertical {0% {transform: translate(0, 0);}100% {transform: translate(0, " + ($ph -
                $ballR) + "px);}}" +
            "@keyframes vertical {0% { transform: translate(0, 0);}100% {transform: translate(0, " + ($ph - $ballR) +
            "px);}}"
        ).appendTo($("head"));

        $('#horizontal').addClass('horizontal');
        $('#vertical').addClass('vertical');
    </script>
</body>

</html>
```

## 动画解析

先看html结构：

```javascript
<div id="horizontal" class="">
    <div id="vertical" class="">
        <div class="ball"></div>
    </div>
</div>
```

然后看两个动画：

```javascript
@-webkit-keyframes horizontal {
    0% {
        transform: translate(0, 0);
    }
    100% {
        transform: translate(290px, 0);
    }
}

@keyframes horizontal {
    0% {
        transform: translate(0, 0);
    }
    100% {
        transform: translate(290px);
    }
}

@-webkit-keyframes vertical {
    0% {
        transform: translate(0, 0);
    }
    100% {
        transform: translate(0, 630px);
    }
}

@keyframes vertical {
    0% {
        transform: translate(0, 0);
    }
    100% {
        transform: translate(0, 630px);
    }
}
```

显然，包裹div.ball的两个元素，div#horizontal负责x轴平移，div#vertical负责y轴平移，x轴、y轴两种平移混合，就实现各种斜移。

接下来是动画属性设置：

```javascript
.horizontal {
    display: block;
    position: absolute;
    top: 0;
    left: 0;

    -webkit-animation: horizontal 1.4s linear 0s infinite alternate;
    -moz-animation: horizontal 1.4s linear 0s infinite alternate;
    -o-animation: horizontal 1.4s linear 0s infinite alternate;
    animation: horizontal 1.4s linear 0s infinite alternate;
}

.vertical {
    display: block;
    position: absolute;
    top: 0;
    left: 0;

    -webkit-animation: vertical 1.1s ease-in 0s infinite alternate;
    -moz-animation: vertical 1.1s ease-in 0s infinite alternate;
    -o-animation: vertical 1.1s ease-in 0s infinite alternate;
    animation: vertical 1.1s ease-in 0s infinite alternate;
}
```

对于碰撞运动而言，在y轴上，始终有重力的影响。

所以，y轴动画 animation-timing-function属性被设置为ease-in，从开始到结束逐渐加速(从高处到低处逐渐加速)；然后，animation-direction设置为alternate，则动画正向播完后，会反向播出，则反向播出时，结束到开始回事逐渐减速(从低处到高处逐渐减速)；最后，animation-iteration-count设置为infinite，动画会无限循环。

至于x轴，其不受其他力的影响，所以在x轴方向上，速度不变，所以 animation-timing-function属性被设置为linear，从开始到结束速度不变。其余属性，与y轴一样。

另外，x轴和y轴的具体移动距离，这个由javascript计算得出:

```javascript
$ph = $("body").height();
$pw = $("body").width();
$ballR = $(".ball").width();

$("<style></style>").text(
    "@-webkit-keyframes horizontal {0% {transform: translate(0, 0);}100% {transform: translate(" + ($pw -
        $ballR) + "px, 0);}}" +
    "@keyframes horizontal {0% { transform: translate(0, 0);}100% {transform: translate(" + ($pw - $ballR) +
    "px, 0);}}" +
    "@-webkit-keyframes vertical {0% {transform: translate(0, 0);}100% {transform: translate(0, " + ($ph -
        $ballR) + "px);}}" +
    "@keyframes vertical {0% { transform: translate(0, 0);}100% {transform: translate(0, " + ($ph - $ballR) +
    "px);}}"
).appendTo($("head"));
```

至此，低成本碰撞动画简述完毕。