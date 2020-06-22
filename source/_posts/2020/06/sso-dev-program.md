---
title: 记录一份统一登陆注册前端组件与bff层开发方案
date: 2020-06-22 20:15:21
categories: [tech]
tags: [sso, javascript, node, exporess, iframe, postMessage]
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
  - SMS验证码输入
  - 获取验证码按钮
  - 邮箱输入
  - 昵称输入
  - 用户协议勾选checkbox
  - 登陆/注册按钮
- 交互点
  - 页面语言根据 与登录前的页面语言一致 
  - 手机号校验
  - SMS验证码校验
  - 点击验证码按钮60秒倒计时，弹出toast提示‘SMS验证码已发送至你的手机’
  - 根据手机号是否为已注册手机号，区分用户行为为‘登陆行为’、‘注册行为’
  - 登陆行为
    - 点击登陆按钮校验手机号、sms验证码
    - 完成校验后登陆成功
  - 注册行为
    - 显示邮箱输入、昵称输入、用户协议勾选checkbox
    - 邮箱后缀联想，输入@字符后，快速带出常用邮箱后缀，常用邮箱为：@gmail.com;@yahoo.com;@yahoo.com.hk; @hotmail.com
    - 点击注册按钮，校验手机号、sms验证码、邮箱输入、昵称输入、用户协议勾选checkbox
    - 完成校验后登陆成功
- 可配置项
  - banner图（图片url）
  - 完成登陆后的跳转链接（url），无此项配置则默认跳转zati首页
  - 渠道来源sourceType

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
  - 用户协议勾选checkbox
  - 登陆/注册按钮
- 交互点:
  - 页面语言根据 与登录前的页面语言一致 
  - 手机号校验
  - SMS验证码校验
  - 点击验证码按钮60秒倒计时，弹出toast提示‘SMS验证码已发送至你的手机’
  - 根据手机号是否为已注册手机号，区分用户行为为‘登陆行为’、‘注册行为’
  - 登陆行为
    - 点击登陆按钮校验手机号、sms验证码
    - 完成校验后登陆成功
  - 注册行为
    - 显示邮箱输入、昵称输入、用户协议勾选checkbox
    - 邮箱后缀联想，输入@字符后，快速带出常用邮箱后缀，常用邮箱为：@gmail.com;@yahoo.com;@yahoo.com.hk; @hotmail.com
    - 点击注册按钮，校验手机号、sms验证码、邮箱输入、昵称输入、用户协议勾选checkbox
    - 完成校验后登陆成功
- 可配置项
  - banner图（图片url）
  - 完成登陆后的跳转链接（url），无此项配置则默认跳转zati首页
  - 渠道来源sourceType

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
  - SMS验证码校验
  - 点击验证码按钮60秒倒计时，弹出toast提示‘SMS验证码已发送至你的手机’
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
  - 清除登陆态相关cookie

## 分析与设计

### 关键点

- 统一登陆注册逻辑收拢，则鉴权行为需要被 统一登陆注册组件/buff/服务 收拢，各业务站点不再关注登陆注册逻辑，只关注通过登陆注册组件获取到的票据（token/ticket）
- 各业务站点在不同的网络策略下，其服务层（node）无法直接调用综合金融注册服务
- 需要满足“弹窗登陆注册”体验，避免“页面跳转型登陆注册”

### 方案选型

#### 方案一

- 构建统一登陆站点，收拢登陆注册逻辑
- 统一登陆站点提供登陆注册页面，此页面可实现常见的跳转型登陆注册行为
- 向各业务线提供登陆注册ui组件，组件通过iframe载入统一登陆站点登陆注册页
- 登陆注册组件与iframe中的页面，通过postmessage api实现通信
- 各业务线站点引用登陆注册组件获取到票据，业务线站点及后端服务凭借票据至综合金融注册服务获取数据

{% asset_img 2.png %}

#### 方案二

- 构建统一登陆站点，收拢登陆注册逻辑
- 统一登陆站点提供登陆注册相关接口，接口配置允许跨域调用header头
- 向各业务线提供登陆注册ui组件，ui组件跨域调用统一登陆站点登陆注册相关接口
- 各业务线站点引用登陆注册组件获取到票据，业务线站点及后端服务凭借票据至综合金融注册服务获取数据

{% asset_img 3.png %}

#### 分析

- 方案一和方案二都需要统一登陆 bff层作为支撑，且两方案需要的bff层实现差异不大
- 方案一和方案二都可接入国际化文案平台：
  - 方案一组件为同源调用文案接口
  - 方案二组件为跨域调用文案接口
- 方案一的一个实现细节点为：弹框调用iframe载入登陆注册页，这种弹框在iOS移动端中可能有样式异常
  - 这里会有解决样式异常的成本
  - 若解决不了，在ios移动端可考虑切换为‘页面跳转登陆注册’形式
- 方案二中组件调用 统一登陆 bff 接口皆为跨域调用
- 更新登陆注册模块时
  - 采用方案一，大部分情况下更新 统一登陆站点即可
  - 采用方案二，所有使用组件的业务站点都需要重新发版，以更新组件
- 方案一和方案二，都依赖 统一登陆 bff层；一旦bff层挂掉，则所有对接了统一登陆注册的业务都挂掉 
- postMessage 无法在ie11使用，此时需要降级处理

#### 结论
- 采用方案一

#### 实现拆解

- 构建 统一登陆 站点项目，提供登陆注册页面、登陆注册相关接口支持
- 构建 passport ui组件，供各业务站点调用登陆注册

## 技术选型

- react hooks：前端代码编程范式
- next：ssr架构
- express：服务层架构

## 引入的组件与服务

- 前端项目脚手架
- 组件
- antd 组件库
- 服务
  - 国际化文案服务
  - 注册服务
- 发布平台
  - 私有npm
  - 容器云boom（docker技术线）
- 注意
  - 脚手架中sentry部分需要拆掉（有安全风险）

## 接口

### bff层

- 国际化文案接口
- 获取验证码
- 注册/登录接口
- 账户升级接口

以上接口参数与page path和下面服务参数保持一致

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

[登陆注册页整体逻辑mermaid图](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVERcbuW8gOWniyAgLS0-IGxvZ2luRGlhbG9nW-iwg-i1t-eZu-mZhuazqOWGjOW8ueahhl1cbmxvZ2luRGlhbG9nIC0tPiB86YCJ5oup5omL5py6dGFifCBwaG9uZVRhYlvmiYvmnLp0YWJdXG5sb2dpbkRpYWxvZyAtLT4gfOmAieaLqemCrueusXRhYnwgZW1haWxUYWJb6YKu566xdGFiXVxucGhvbmVUYWIgLS0-IHNlbmRQaG9uZUNvZGVb6aqM6K-B56CB5o6l5Y-jXVxuc2VuZFBob25lQ29kZSAtLT4gaXNQaG9uZUxvZ2lue-aJi-acuuaYr-WQpuW3suazqOWGjH1cbmlzUGhvbmVMb2dpbiAtLT4gfHllc3wgcGhvbmVMb2dpblvmiYvmnLrnmbvpmYbmtYHnqItdXG5pc1Bob25lTG9naW4gLS0-IHxub3wgaXNaQVRJT1JaQUxJRkV75piv5ZCmIFpBVEkg55So5oi35oiWWkEgbGlmZeeUqOaIt31cbmlzWkFUSU9SWkFMSUZFIC0tPiB8bm98IHBob25lUmVnaXN0ZXJb5omL5py65rOo5YaM5rWB56iLXVxuaXNaQVRJT1JaQUxJRkUgLS0-IHx5ZXN8IHVwR3JhZGVQYWdlW-i0puaIt-WNh-e6p-aooeWdl11cbnVwR3JhZGVQYWdlIC0tPiB856Gu6K6k5Y2H57qnfCBnZXRUb2tlblvojrflj5bnmbvpmYbnpajmja5dXG5waG9uZVJlZ2lzdGVyIC0tPiBnZXRUb2tlblxucGhvbmVMb2dpbiAtLT4gZ2V0VG9rZW5cbmVtYWlsVGFiIC0tPiBzZW5kRW1haWxDb2RlW-mqjOivgeeggeaOpeWPo11cbnNlbmRFbWFpbENvZGUgLS0-IGlzRW1haWxMb2dpbnvpgq7nrrHmmK_lkKblt7Lms6jlhox9XG5pc0VtYWlsTG9naW4gLS0-IHx5ZXN8IGVtYWlsTG9naW5b6YKu566x55m76ZmG5rWB56iLXVxuZW1haWxMb2dpbiAtLT4gZ2V0VG9rZW5cbmlzRW1haWxMb2dpbiAtLT4gfG5vfCBpc1pBVElPUlpBTElGRTJ75piv5ZCmIFpBVEkg55So5oi35oiWWkEgbGlmZeeUqOaIt31cbmlzWkFUSU9SWkFMSUZFMiAtLT4gfG5vfCBlbWFpbFJlZ2lzdGVyW-mCrueuseazqOWGjOa1geeoi11cbmlzWkFUSU9SWkFMSUZFMiAtLT4gfHllc3wgdXBHcmFkZVBhZ2UyW-i0puaIt-WNh-e6p-aooeWdl11cbmVtYWlsUmVnaXN0ZXIgIC0tPiBnZXRUb2tlblxudXBHcmFkZVBhZ2UyIC0tPiB856Gu6K6k5Y2H57qnfCBnZXRUb2tlblxuZ2V0VG9rZW4gLS0-IOe7k-adnyIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2V9)

{% asset_img 4.png %}
