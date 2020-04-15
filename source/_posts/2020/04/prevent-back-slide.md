---
title: 禁止移动端右滑触发回退 & 禁止浏览器下拉刷新
date: 2020-04-15 11:41:16
categories:
tags:
---

{% asset_img slide.gif %}

在移动端场景中，‘滑动’交互已经是个常见的交互。而在移动端浏览器下，对页面的滑动又有可能触发 `浏览器回退/浏览器下拉刷新`，影响交互结果

<escape><!-- more --></escape>

### 禁止移动端右滑触发回退

```javascript
var xPos = null;
var yPos = null;
window.addEventListener( "touchmove", function ( event ) {
    var touch = event.originalEvent.touches[ 0 ];
    oldX = xPos;
    oldY = yPos;
    xPos = touch.pageX;
    yPos = touch.pageY;
    if ( oldX == null && oldY == null ) {
        return false;
    }
    else {
        if ( Math.abs( oldX-xPos ) > Math.abs( oldY-yPos ) ) {
            event.preventDefault();
            return false;
        }
    }
});
```

压缩版：

```javascript
var xPos=null;var yPos=null;window.addEventListener("touchmove",function(event){var touch=event.originalEvent.touches[0];oldX=xPos;oldY=yPos;xPos=touch.pageX;yPos=touch.pageY;if(oldX==null && oldY==null){return false;}else{if(Math.abs(oldX-xPos)>Math.abs(oldY-yPos)){event.preventDefault();return false;}}});
```

### 禁止浏览器下拉刷新

```css
html,
body {
  /* Disables pull-to-refresh but allows overscroll glow effects. */
  overscroll-behavior-y: contain;
}
```

如果样式设置不生效：

```javascript
(function() {
    var touchStartHandler,
        touchMoveHandler,
        touchPoint;

    // Only needed for touch events on chrome.
    if ((window.chrome || navigator.userAgent.match("CriOS"))
        && "ontouchstart" in document.documentElement) {

        touchStartHandler = function() {
            // Only need to handle single-touch cases
            touchPoint = event.touches.length === 1 ? event.touches[0].clientY : null;
        };

        touchMoveHandler = function(event) {
            var newTouchPoint;

            // Only need to handle single-touch cases
            if (event.touches.length !== 1) {
                touchPoint = null;

                return;
            }

            // We only need to defaultPrevent when scrolling up
            newTouchPoint = event.touches[0].clientY;
            if (newTouchPoint > touchPoint) {
                event.preventDefault();
            }
            touchPoint = newTouchPoint;
        };

        document.addEventListener("touchstart", touchStartHandler, {
            passive: false
        });

        document.addEventListener("touchmove", touchMoveHandler, {
            passive: false
        });

    }
})();
```

### 参考

[Disable web page navigation on swipe(back and forward)](https://stackoverflow.com/questions/30636930/disable-web-page-navigation-on-swipeback-and-forward)

[How to prevent pull-down-to-refresh of mobile chrome](https://stackoverflow.com/questions/36212722/how-to-prevent-pull-down-to-refresh-of-mobile-chrome)