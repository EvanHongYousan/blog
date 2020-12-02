---
title: 记录一份统一登陆注册前端组件与bff层开发方案
categories:
  - tech
tags:
  - sso
  - javascript
  - node
  - express
  - iframe
  - postMessage
date: 2020-06-22 20:15:21
---

{% asset_img 1.png %}

对公司而言，需要一个统一用户管理体系，其用户后续可根据相关法规协议应用于公司品牌下的其他业务。
统一登录组件基础搭建，实现用户的登录、注册功能。此标准组件可以应用在品牌下下所有需要用户登录、注册的场景。

<escape><!-- more --></escape>

## 需求详情

- 针对各个业务线的登陆注册行为，提供弹窗型登陆注册组件，以下是组件具体描述：

### 统一登陆注册模块--手机登陆注册

- 目标用户：持有香港手机号码用户
- 场景：
  - 移动端浏览器
  - 桌面端浏览器
- 页面内容：
  - 可配置图片
  - 手机号输入
  - SMS 验证码输入
  - 获取验证码按钮
  - 邮箱输入
  - 昵称输入
  - 用户协议勾选 checkbox
  - 登陆/注册按钮
- 交互点
  - 页面语言根据 与登录前的页面语言一致
  - 手机号校验
  - SMS 验证码校验
  - 点击验证码按钮 60 秒倒计时，弹出 toast 提示‘SMS 验证码已发送至你的手机’
  - 根据手机号是否为已注册手机号，区分用户行为为‘登陆行为’、‘注册行为’
  - 登陆行为
    - 点击登陆按钮校验手机号、sms 验证码
    - 完成校验后登陆成功
  - 注册行为
    - 显示邮箱输入、昵称输入、用户协议勾选 checkbox
    - 邮箱后缀联想，输入@字符后，快速带出常用邮箱后缀，常用邮箱为：@gmail.com;@yahoo.com;@yahoo.com.hk; @hotmail.com
    - 点击注册按钮，校验手机号、sms 验证码、邮箱输入、昵称输入、用户协议勾选 checkbox
    - 完成校验后登陆成功
- 可配置项
  - banner 图（图片 url）
  - 完成登陆后的跳转链接（url），无此项配置则默认跳转 zati 首页
  - 渠道来源 sourceType

### 统一登陆注册模块--邮箱登陆注册

- 目标用户：持有香港手机号码用户
- 场景:
  - 移动端浏览器
  - 桌面端浏览器
- 页面内容：
  - 可配置图片
  - 邮箱输入
  - 邮箱验证码输入
  - 获取验证码按钮
  - 手机号输入 这里手机号是否要验证码校验/是否要输入手机号
  - 昵称输入
  - 用户协议勾选 checkbox
  - 登陆/注册按钮
- 交互点:
  - 页面语言根据 与登录前的页面语言一致
  - 手机号校验
  - SMS 验证码校验
  - 点击验证码按钮 60 秒倒计时，弹出 toast 提示‘SMS 验证码已发送至你的手机’
  - 根据手机号是否为已注册手机号，区分用户行为为‘登陆行为’、‘注册行为’
  - 登陆行为
    - 点击登陆按钮校验手机号、sms 验证码
    - 完成校验后登陆成功
  - 注册行为
    - 显示邮箱输入、昵称输入、用户协议勾选 checkbox
    - 邮箱后缀联想，输入@字符后，快速带出常用邮箱后缀，常用邮箱为：@gmail.com;@yahoo.com;@yahoo.com.hk; @hotmail.com
    - 点击注册按钮，校验手机号、sms 验证码、邮箱输入、昵称输入、用户协议勾选 checkbox
    - 完成校验后登陆成功
- 可配置项
  - banner 图（图片 url）
  - 完成登陆后的跳转链接（url），无此项配置则默认跳转 zati 首页
  - 渠道来源 sourceType

### 设置安全密码模块

- 目标用户：已登陆用户
- 场景：
  - 移动端浏览器
  - 桌面端浏览器
- 页面内容：
  - title
  - 用户手机号
  - 手机验证码输入
  - 获取验证码按钮
  - 安全密码输入框
  - 密码描述
  - 重设密码按钮
- 交互点
  - 页面语言国际化
  - SMS 验证码校验
  - 点击验证码按钮 60 秒倒计时，弹出 toast 提示‘SMS 验证码已发送至你的手机’
  - 校验安全密码格式
  - 设置完毕传递完成事件

### 安全密码验证模块

- 目标用户：已登陆用户
- 场景：
  - 移动端浏览器
  - 桌面端浏览器
- 页面内容：
  - title
  - 安全密码输入框
  - 确定按钮
- 交互点
  - 页面语言国际化
  - 密码校验

### 登出

- 目标用户：已登陆用户
- 场景：
  - 移动端浏览器
  - 桌面端浏览器
- 功能：
  - 调用登出接口
  - 清除登陆态相关 cookie

## 分析与设计

### 关键点

- 统一登陆注册逻辑收拢，则鉴权行为需要被 统一登陆注册组件/buff/服务 收拢，各业务站点不再关注登陆注册逻辑，只关注通过登陆注册组件获取到的票据（token/ticket）
- 各业务站点在不同的网络策略下，其服务层（node）无法直接调用综合金融注册服务
- 需要满足“弹窗登陆注册”体验，避免“页面跳转型登陆注册”

### 方案选型

#### 方案一

- 构建统一登陆站点，收拢登陆注册逻辑
- 统一登陆站点提供登陆注册页面，此页面可实现常见的跳转型登陆注册行为
- 向各业务线提供登陆注册 ui 组件，组件通过 iframe 载入统一登陆站点登陆注册页
- 登陆注册组件与 iframe 中的页面，通过 postmessage api 实现通信
- 各业务线站点引用登陆注册组件获取到票据，业务线站点及后端服务凭借票据至综合金融注册服务获取数据

{% asset_img 2.png %}

#### 方案二

- 构建统一登陆站点，收拢登陆注册逻辑
- 统一登陆站点提供登陆注册相关接口，接口配置允许跨域调用 header 头
- 向各业务线提供登陆注册 ui 组件，ui 组件跨域调用统一登陆站点登陆注册相关接口
- 各业务线站点引用登陆注册组件获取到票据，业务线站点及后端服务凭借票据至综合金融注册服务获取数据

{% asset_img 3.png %}

#### 分析

- 方案一和方案二都需要统一登陆 bff 层作为支撑，且两方案需要的 bff 层实现差异不大
- 方案一和方案二都可接入国际化文案平台：
  - 方案一组件为同源调用文案接口
  - 方案二组件为跨域调用文案接口
- 方案一的一个实现细节点为：弹框调用 iframe 载入登陆注册页，这种弹框在 iOS 移动端中可能有样式异常
  - 这里会有解决样式异常的成本
  - 若解决不了，在 ios 移动端可考虑切换为‘页面跳转登陆注册’形式
- 方案二中组件调用 统一登陆 bff 接口皆为跨域调用
- 更新登陆注册模块时
  - 采用方案一，大部分情况下更新 统一登陆站点即可
  - 采用方案二，所有使用组件的业务站点都需要重新发版，以更新组件
- 方案一和方案二，都依赖 统一登陆 bff 层；一旦 bff 层挂掉，则所有对接了统一登陆注册的业务都挂掉
- postMessage 无法在 ie11 使用，此时需要降级处理

#### 结论

- 采用方案一

#### 实现拆解

- 构建 统一登陆 站点项目，提供登陆注册页面、登陆注册相关接口支持
- 构建 passport ui 组件，供各业务站点调用登陆注册

## 技术选型

- react hooks：前端代码编程范式
- next：ssr 架构
- express：服务层架构

## 引入的组件与服务

- 前端项目脚手架
- 组件
- antd 组件库
- 服务
  - 国际化文案服务
  - 注册服务
- 发布平台
  - 私有 npm
  - 容器云 boom（docker 技术线）
- 注意
  - 脚手架中 sentry 部分需要拆掉（有安全风险）

## 接口

### bff 层

- 国际化文案接口
- 获取验证码
- 注册/登录接口
- 账户升级接口

以上接口参数与 page path 和下面服务参数保持一致

### 国际化文案平台服务

- 国际化文案接口

### 注册服务

- 获取验证码
- 注册/登录接口
- 账户升级接口
- 用户退出登录
- 查询用户信息接口

## 关键逻辑流程

### 登陆注册页整体逻辑

[登陆注册页整体逻辑 mermaid 图](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVERcbuW8gOWniyAgLS0-IGxvZ2luRGlhbG9nW-iwg-i1t-eZu-mZhuazqOWGjOW8ueahhl1cbmxvZ2luRGlhbG9nIC0tPiB86YCJ5oup5omL5py6dGFifCBwaG9uZVRhYlvmiYvmnLp0YWJdXG5sb2dpbkRpYWxvZyAtLT4gfOmAieaLqemCrueusXRhYnwgZW1haWxUYWJb6YKu566xdGFiXVxucGhvbmVUYWIgLS0-IHNlbmRQaG9uZUNvZGVb6aqM6K-B56CB5o6l5Y-jXVxuc2VuZFBob25lQ29kZSAtLT4gaXNQaG9uZUxvZ2lue-aJi-acuuaYr-WQpuW3suazqOWGjH1cbmlzUGhvbmVMb2dpbiAtLT4gfHllc3wgcGhvbmVMb2dpblvmiYvmnLrnmbvpmYbmtYHnqItdXG5pc1Bob25lTG9naW4gLS0-IHxub3wgaXNaQVRJT1JaQUxJRkV75piv5ZCmIFpBVEkg55So5oi35oiWWkEgbGlmZeeUqOaIt31cbmlzWkFUSU9SWkFMSUZFIC0tPiB8bm98IHBob25lUmVnaXN0ZXJb5omL5py65rOo5YaM5rWB56iLXVxuaXNaQVRJT1JaQUxJRkUgLS0-IHx5ZXN8IHVwR3JhZGVQYWdlW-i0puaIt-WNh-e6p-aooeWdl11cbnVwR3JhZGVQYWdlIC0tPiB856Gu6K6k5Y2H57qnfCBnZXRUb2tlblvojrflj5bnmbvpmYbnpajmja5dXG5waG9uZVJlZ2lzdGVyIC0tPiBnZXRUb2tlblxucGhvbmVMb2dpbiAtLT4gZ2V0VG9rZW5cbmVtYWlsVGFiIC0tPiBzZW5kRW1haWxDb2RlW-mqjOivgeeggeaOpeWPo11cbnNlbmRFbWFpbENvZGUgLS0-IGlzRW1haWxMb2dpbnvpgq7nrrHmmK_lkKblt7Lms6jlhox9XG5pc0VtYWlsTG9naW4gLS0-IHx5ZXN8IGVtYWlsTG9naW5b6YKu566x55m76ZmG5rWB56iLXVxuZW1haWxMb2dpbiAtLT4gZ2V0VG9rZW5cbmlzRW1haWxMb2dpbiAtLT4gfG5vfCBpc1pBVElPUlpBTElGRTJ75piv5ZCmIFpBVEkg55So5oi35oiWWkEgbGlmZeeUqOaIt31cbmlzWkFUSU9SWkFMSUZFMiAtLT4gfG5vfCBlbWFpbFJlZ2lzdGVyW-mCrueuseazqOWGjOa1geeoi11cbmlzWkFUSU9SWkFMSUZFMiAtLT4gfHllc3wgdXBHcmFkZVBhZ2UyW-i0puaIt-WNh-e6p-aooeWdl11cbmVtYWlsUmVnaXN0ZXIgIC0tPiBnZXRUb2tlblxudXBHcmFkZVBhZ2UyIC0tPiB856Gu6K6k5Y2H57qnfCBnZXRUb2tlblxuZ2V0VG9rZW4gLS0-IOe7k-adnyIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2V9)

{% asset_img 4.png %}

### 登陆注册行为时序图

[登陆注册行为时序图](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoic2VxdWVuY2VEaWFncmFtXG4gICAg55So5oi3IC0-PiDkuJrliqHnur93ZWJwYWdlOiDlkK_liqjnmbvpmYbms6jlhoxcblx05Lia5Yqh57q_d2VicGFnZS0tPj4r55m76ZmG5rOo5YaM57uE5Lu2OiDosIPotbdcbiAgICDnmbvpmYbms6jlhoznu4Tku7YgLS0-PitpZnJhbWU6IOiwg-i1t1xuICAgIGlmcmFtZSAtPj4gLXphaWYuemEuZ3JvdXAg55m76ZmG5rOo5YaM6aG16Z2iOiDovb3lhaVcbiAgICDnlKjmiLcgLT4-IHphaWYuemEuZ3JvdXAg55m76ZmG5rOo5YaM6aG16Z2iOiDov5vooYznmbvpmYbms6jlhozooYzkuLpcbiAgICBhbHQg55m76ZmG5rOo5YaM5o6l5Y-j6LCD55So5aSx6LSlXG4gICAgICAgIHphaWYuemEuZ3JvdXAg55m76ZmG5rOo5YaM6aG16Z2iIC0-PiDnmbvpmYbms6jlhoznu4Tku7Y6IHBvc3RtZXNzYWdlIGFwaSDkvKDpgJLlpLHotKXkuovku7ZcbiAgICAgICAg55m76ZmG5rOo5YaM57uE5Lu2IC0-PiDkuJrliqHnur93ZWJwYWdlOiDnmbvpmYbms6jlhozlpLHotKXkuovku7ZcbiAgICAgICAg5Lia5Yqh57q_d2VicGFnZSAtPj4g55So5oi3OiDmmL7npLrnmbvpmYblpLHotKXnirbmgIFcbiAgICBlbHNlIOeZu-mZhuazqOWGjOaOpeWPo-iwg-eUqOaIkOWKn1xuICAgICAgICB6YWlmLnphLmdyb3VwIOeZu-mZhuazqOWGjOmhtemdoiAtPj4g55m76ZmG5rOo5YaM57uE5Lu2OiBwb3N0bWVzc2FnZSBhcGkg5Lyg6YCS5oiQ5Yqf5LqL5Lu244CB55m76ZmG5oCB56Wo5o2uXG4gICAgICAgIOeZu-mZhuazqOWGjOe7hOS7tiAtPj4g5Lia5Yqh57q_d2VicGFnZTog55m76ZmG5rOo5YaM5oiQ5Yqf5LqL5Lu244CB55m76ZmG5oCB56Wo5o2u77yM5ZCM5pe25oqK55m76ZmG5oCB56Wo5o2u5YaZ5YWlY29va2llXG4gICAgICAgIOS4muWKoee6v3dlYnBhZ2UgLT4-IOeUqOaItzog5pi-56S655m76ZmG5oiQ5Yqf54q25oCBXG4gICAgZW5kIiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifSwidXBkYXRlRWRpdG9yIjpmYWxzZX0)

{% asset_img 5.png %}

### 安全密码设置页展示逻辑

[安全密码设置页展示逻辑](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVERcbnN0YXJ0IC0tPiBnZXRVc2VySW5mb1vosIPnlKjojrflj5bnlKjmiLfkv6Hmga_mjqXlj6NdXG5nZXRVc2VySW5mbyAtLT5pc0xvZ2lue-aYr-WQpuacieeZu-mZhuaAgX1cbmlzTG9naW4gLS0-IHxub3wganVtcExvZ2luW-i3s-i9rOiHs-eZu-mZhuazqOWGjOmhtV1cbmp1bXBMb2dpbiAtLT4gb3ZlclxuaXNMb2dpbiAtLT4gaXNTZWN1cml0eVvmmK_lkKbnu4_ov4flronlhajlr4bnoIHpqozor4FdXG5pc1NlY3VyaXR5IC0tPiB8bm98IGp1bXBTZWN1cml0eVvot7Povazoh7Plronlhajlr4bnoIHpqozor4FdXG5qdW1wU2VjdXJpdHkgLS0-IG92ZXJcbmlzU2VjdXJpdHkgLS0-IHx5ZXN8IHNob3dOb3JtYWxb5bGV56S65a6J5YWo5a-G56CB6L6T5YWl5qGGXVxuc2hvd05vcm1hbCAtLT4gb3ZlclxuIiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifSwidXBkYXRlRWRpdG9yIjpmYWxzZX0)

{% asset_img 6.png %}

### 安全密码设置时序图

[安全密码设置时序图](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoic2VxdWVuY2VEaWFncmFtXG4gICAg55So5oi3IC0-PiDkuJrliqHnur93ZWJwYWdlOiDlkK_liqjlronlhajlr4bnoIHorr7nva5cblx05Lia5Yqh57q_d2VicGFnZS0tPj4remFwYXNzcG9ydOe7hOS7tjog6LCD6LW3XG4gICAgemFwYXNzcG9ydOe7hOS7tiAtLT4-K2lmcmFtZTog6LCD6LW3XG4gICAgaWZyYW1lIC0-PiB6YWlmLnphLmdyb3VwIOWuieWFqOWvhueggeiuvue9rumhtemdojog6L295YWlXG4gICAg55So5oi3IC0-PiB6YWlmLnphLmdyb3VwIOWuieWFqOWvhueggeiuvue9rumhtemdojog6L-b6KGM5a6J5YWo5a-G56CB6K6-572u6KGM5Li6XG4gICAgYWx0IOWuieWFqOWvhueggeiuvue9ruaOpeWPo-iwg-eUqOWksei0pVxuICAgICAgICB6YWlmLnphLmdyb3VwIOWuieWFqOWvhueggeiuvue9rumhtemdoiAtPj4gemFwYXNzcG9ydOe7hOS7tjogcG9zdG1lc3NhZ2UgYXBpIOS8oOmAkuWksei0peS6i-S7tlxuICAgICAgICB6YXBhc3Nwb3J057uE5Lu2IC0-PiDkuJrliqHnur93ZWJwYWdlOiDlronlhajlr4bnoIHorr7nva7lpLHotKXkuovku7ZcbiAgICAgICAg5Lia5Yqh57q_d2VicGFnZSAtPj4g55So5oi3OiDmmL7npLrlronlhajlr4bnoIHorr7nva7lpLHotKXnirbmgIFcbiAgICBlbHNlIOWuieWFqOWvhueggeiuvue9ruaOpeWPo-iwg-eUqOaIkOWKn1xuICAgICAgICB6YWlmLnphLmdyb3VwIOWuieWFqOWvhueggeiuvue9rumhtemdoiAtPj4gemFwYXNzcG9ydOe7hOS7tjogcG9zdG1lc3NhZ2UgYXBpIOS8oOmAkuaIkOWKn-S6i-S7tlxuICAgICAgICB6YXBhc3Nwb3J057uE5Lu2IC0-PiDkuJrliqHnur93ZWJwYWdlOiDlronlhajlr4bnoIHorr7nva7miJDlip_kuovku7ZcbiAgICAgICAg5Lia5Yqh57q_d2VicGFnZSAtPj4g55So5oi3OiDmmL7npLrlronlhajlr4bnoIHorr7nva7miJDlip_nirbmgIFcbiAgICBlbmQiLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)

{% asset_img 7.png %}

### 安全密码验证页展示逻辑

[安全密码验证页展示逻辑](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVERcbnN0YXJ0IC0tPiBnZXRVc2VySW5mb1vosIPnlKjojrflj5bnlKjmiLfkv6Hmga_mjqXlj6NdXG5nZXRVc2VySW5mbyAtLT5pc0xvZ2lue-aYr-WQpuacieeZu-mZhuaAgX1cbmlzTG9naW4gLS0-IHxub3wganVtcExvZ2luW-i3s-i9rOiHs-eZu-mZhuazqOWGjOmhtV1cbmp1bXBMb2dpbiAtLT4gb3ZlclxuaXNMb2dpbiAtLT4gaXNTZWN1cml0eVs15YiG6ZKf5YaF5piv5ZCm57uP6L-H5a6J5YWo5a-G56CB6aqM6K-BXVxuaXNTZWN1cml0eSAtLT4gfG5vfCBzaG93Tm9ybWFsW-WxleekuuWuieWFqOWvhueggei-k-WFpeahhl1cbmlzU2VjdXJpdHkgLS0-IHx5ZXN8IGp1bXBUYXJnZXRb6Lez6L2s6Iez6L-b5YWl5YmN55qE6aG16Z2iXVxuc2hvd05vcm1hbCAtLT4gb3ZlclxuanVtcFRhcmdldCAtLT4gb3ZlclxuIiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifSwidXBkYXRlRWRpdG9yIjpmYWxzZX0)

{% asset_img 8.png %}

### 安全密码验证时序图

[安全密码验证时序图](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoic2VxdWVuY2VEaWFncmFtXG4gICAg55So5oi3IC0-PiDkuJrliqHnur93ZWJwYWdlOiDlkK_liqjlronlhajlr4bnoIHpqozor4Fcblx05Lia5Yqh57q_d2VicGFnZS0tPj4remFwYXNzcG9ydOe7hOS7tjog6LCD6LW3XG4gICAgemFwYXNzcG9ydOe7hOS7tiAtLT4-K2lmcmFtZTog6LCD6LW3XG4gICAgaWZyYW1lIC0-PiB6YWlmLnphLmdyb3VwIOWuieWFqOWvhueggemqjOivgemhtemdojog6L295YWlXG4gICAg55So5oi3IC0-PiB6YWlmLnphLmdyb3VwIOWuieWFqOWvhueggemqjOivgemhtemdojog6L-b6KGM5a6J5YWo5a-G56CB6aqM6K-B6KGM5Li6XG4gICAgYWx0IOWuieWFqOWvhueggemqjOivgeaOpeWPo-iwg-eUqOWksei0pVxuICAgICAgICB6YWlmLnphLmdyb3VwIOWuieWFqOWvhueggemqjOivgemhtemdoiAtPj4gemFwYXNzcG9ydOe7hOS7tjogcG9zdG1lc3NhZ2UgYXBpIOS8oOmAkuWksei0peS6i-S7tlxuICAgICAgICB6YXBhc3Nwb3J057uE5Lu2IC0-PiDkuJrliqHnur93ZWJwYWdlOiDlronlhajlr4bnoIHpqozor4HlpLHotKXkuovku7ZcbiAgICAgICAg5Lia5Yqh57q_d2VicGFnZSAtPj4g55So5oi3OiDmmL7npLrlronlhajlr4bnoIHpqozor4HlpLHotKXnirbmgIFcbiAgICBlbHNlIOWuieWFqOWvhueggemqjOivgeaOpeWPo-iwg-eUqOaIkOWKn1xuICAgICAgICB6YWlmLnphLmdyb3VwIOWuieWFqOWvhueggemqjOivgemhtemdoiAtPj4gemFwYXNzcG9ydOe7hOS7tjogcG9zdG1lc3NhZ2UgYXBpIOS8oOmAkuaIkOWKn-S6i-S7tlxuICAgICAgICB6YXBhc3Nwb3J057uE5Lu2IC0-PiDkuJrliqHnur93ZWJwYWdlOiDlronlhajlr4bnoIHpqozor4HmiJDlip_kuovku7ZcbiAgICAgICAg5Lia5Yqh57q_d2VicGFnZSAtPj4g55So5oi3OiDmmL7npLrlronlhajlr4bnoIHpqozor4HmiJDlip_nirbmgIFcbiAgICBlbmQiLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)

{% asset_img 9.png %}

## 打包方案

- 略

## 资源缓存处理方案

- 略

## 安全

### XSS

#### 国际化文案获取

- 原获取方式：JSONP 调用接口方式获取文案：需要防止参数注入
- 新方式：暂无
