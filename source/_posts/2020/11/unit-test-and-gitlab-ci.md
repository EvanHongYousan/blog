---
title: 单元测试与持续集成实践记录
categories:
  - tech
tags:
  - unit test
  - CI
  - react
  - jest
  - enzyme
  - react-testing-library
date: 2020-11-19 20:31:29
---


{% asset_img top.png %}

<escape><!-- more --></escape>

## 背景

- 特性验证的问题
  - 开发人员在进行开发、上线过程中，基本可以认为是 coding->testing->coding->testing的循环。
  - 随着项目复杂度越来越高，testing的成本自然越来越大。
  - 复杂度到达一定程度后，代码变更导致的testing成本会大到影响正常迭代，此时项目无法维护
  - 代码review与merge操作，会对开发人员带来越来越大的心智负担
  - 随着时间的推移，项目特性越来越多，越来越无法重构
- 重复行为问题
  - 各项目测试环境发布次数不少，带来不少重复操作
- 开发约束问题
  - 本地开发可以绕过约束 -- 需要提供线上约束

{% asset_img too-busy-to-improve.png %}

## 分析

- 针对coding和testing：coding是不明确的工作，每次都会有不一样的内容；而testing则是明确的工作，每次都是重复工作
- 则针对testing的自动化，可以极大的释放生产力

## 单元测试落地

{% asset_img unit-test-cost.jpg %}

- 给项目添加单元测试，并不单纯只是工具使用上的变化和代码量的增加，更为本质的变化，是代码设计上的变化、开发工作模式的变化
- 上述变化，基本可以用一个词描述 -- 学习成本

### 前端项目的单元测试落地针对的实际问题

- 在实现web前端应用前，至少会考虑几个要点
  - 应用运行环境：pc浏览器？移动端浏览器？app内webview？
  - 应用展示内容：banner？文案？按钮？图片？等等
  - 应用交互：点击按钮发生什么？输入文字发生什么？等等
- 故对于web前端应用，其项目代码中，除了纯函数部分，还充斥着大量的io操作（service api调用、bom api调用、dom api）调用
- 上述实现，就是一个个实际的测试用例

### 具体实践

- 针对上述问题对应的测试用例，基本可以分为以下几种：
  - 纯函数测试：测试工具类纯函数是否符合预期
  - 展示性测试：用于测试组件内容是否正常展示，展示的各项内容是否完整、正确
  - 交互性测试：用于测试组件涉及的交互，是否可以正常输出，正常输出，并对输入、输出做校验
  - 快照测试：快照测试让开发人员明确自身对组件的修改，会有多大的波及度，具体可看[Snapshot Testing](https://jestjs.io/docs/en/snapshot-testing)

- 其中交互测试是成本最高的测试，可以再细分为下面几种：
  - 涉及dom操作的交互测试
  - 涉及bom操作的交互测试
  - 涉及service api的操作交互测试

- 另外，针对当前团队技术栈，还需要在redux场景下进行测试

- 上述测试用例具体实践方式，可以看 [react+react-router+react-redux项目单元测试实践记录](https://evanhongyousan.github.io/2020/10/11/react-react-router-react-redux-unit-test/)

- 在具体实际中，针对一个组件的测试代码，其交互测试与其他测试测试代码对比，一般会是6:1

### 成本与收益

- 通过上面的论述，基本可以得出单元测试具体的成本描述
  - 基于当前技术栈单元测试学习成本
  - 测试代码开发成本

- 另外也有单元测试具体的收益描述
  - 测试代码投入成本越高，则验证的成本越低
  - 项目迭代过程中，保证新特性不影响已有特性
  - 项目重构过程中，保证已有特性不受影响

## 持续集成落地

- 持续集成投入很低，但收益很高 
- 持续集成，一般与git工作流结合使用，主要完成以下几个特性
  - 代码推送后，完成code lint\unit test，给出报告
  - 代码请求合并前，完成code lint\unit test，给出报告，有效减少review人的心智负担
  - 代码review完成后，进行自动化部署

{% asset_img top.png %}

### 具体实践

- 当前团队使用gitlab服务进行版本管理，则可以使用gitlab ci 对接 gitlab runner完成持续集成

#### gitlab-runner 安装

- 申请好机器后，在机器下载的gitlab runner
```
sudo wget -O /usr/local/bin/gitlab-runner https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-linux-386
```

- 给Gitlab-runner添加执行权限：
```
sudo chmod +x /usr/local/bin/gitlab-runner
```

- 创建一个 GitLab CI 用户
```
sudo useradd --comment 'GitLab Runner' --create-home gitlab-runner --shell /bin/bash
```

- 安装并启动服务
```
sudo gitlab-runner install --user=gitlab-runner --working-directory=/home/gitlab-runner
sudo gitlab-runner start
```

#### gitlab-runner 注册

- runner启动后，需要注册入gitlab服务中

- 开始注册
```
sudo gitlab-runner register
```

- 填入Gitlab URL：
```
Please enter the gitlab-ci coordinator URL (e.g. https://gitlab.com )
```

- 然后输入注册Runner所需要的token
  - token会分为两种：Shared Runner（针对所有项目），Specific Runner （针对特定项目）
```
Please enter the gitlab-ci token for this runner
```

- 输入Runner的tags
```
Please enter the gitlab-ci tags for this runner (comma separated)
fe-ci
```

- 选择Runner的执行者
```
Please enter the executor: ssh, docker+machine, docker-ssh+machine, kubernetes, docker, parallels, virtualbox, docker-ssh, shell:
shell
```

- 如果一切正常
```
Runner registered successfully. Feel free to start it, but if it's running already the config should be automatically reloaded!
```

- 最后回到gitlab，使用admin权限账号管理runner，找到 'fe-ci' runner，在runner中对对应项目启用，则runner配置完成

#### .gitlab-ci.yml 文件

- 在项目根目录下创建 .gitlab-ci.yml 文件。以下是一份实例

```
stages:
  - install
  - codelint
  - test

cache:
  paths:
    - node_modules/

install:node_modules:
  stage: install
  script:
    - npm install
  tags:
    - fe-ci

codelint:
  stage: codelint
  script:
    - npm run lint
  tags:
    - fe-ci

test:coverage:
  stage: test
  script:
    - npm run test:coverage
  tags:
    - fe-ci
```

- 可以看到ci脚本分为三个阶段
  - install: npm install -- 安装依赖（node_modules）
  - codelint: npm run lint -- 代码校验
  - test:coverage : npm run test:coverage -- 全量单元测试并输出测试覆盖情况
- `cache: ...` 部分表示 node_modules 需要缓存
- `tags: - fe-ci` 表示此阶段指定使用 tags为 'fe-ci' 的runner进行执行

#### 配置完成后实际运行

- 代码推送后自动运行code lint和unit test
{% asset_img ci_run_1.png %}
- 在merge request settings中打开pipeline相关的约束
{% asset_img mergeSetting.png %}
- 则后续的merge request单，会需要pipeline运行成功后才能进行合并
{% asset_img mr_result.png %}


## 参考
[react+react-router+react-redux项目单元测试实践记录](https://evanhongyousan.github.io/2020/10/11/react-react-router-react-redux-unit-test/)
[Gitlab自动部署之二：安装GITLAB-RUNNER](https://juejin.cn/post/6844903826256822285)