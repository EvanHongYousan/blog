---
title: invest web团队工作流说明 -- 关于 git工作流、代码校验、单元测试、持续集成的结合
categories:
  - tech
tags:
  - git flow
  - unit test
  - gitlab CI
  - CI
date: 2020-11-25 15:42:06
---


<!-- {% asset_img unit-test-running.gif %} -->
{% asset_img invest_git_flow.png %}

<escape><!-- more --></escape>

## 背景

- 原git开发模式的问题
  - 关键分支未收到严格保护，代码review未收到严格约束
  - sit、uat、master分支管理模式，会导致代码合并风险加大，测试版本和发布版本差异过大
- 各个项目代码风格不统一
- 特性验证的问题
  - 开发人员的开发、上线过程，可以概括为 coding->testing->coding->testing 循环；随着项目复杂度越来越高，testing的成本越来越大
  - 复杂度到达一定程度后，testing成本会大到影响正常迭代
  - 代码review与merge操作，会对开发人员带来越来越大的心智负担
  - 项目特性越来越多，越来越无法重构
- 开发约束问题
  - 本地开发可以绕过约束
- 因为上述问题，进而进行了git开发模式的调整，代码校验与单元测试的添加，持续集成的推进

## git开发模式

- 当前git分支流推进是这个模式

{% asset_img invest_git_flow.png %}

- 里面涉及4种分支与两种角色

### 角色

- owner/master：对merge request单进行审核，在master分支上执行发布前的 git merge --squash 操作，可推送master分支、迭代分支、开发分支
- develop：开发分支负责人，可推送开发分支、迭代分支

### 分支

- master：长期存在，存放生产可靠代码，可以被master角色push，可以被master角色merge
- 迭代分支：在迭代期存在，存放当次迭代的可测试代码，可以被develop角色 push，可以被develop角色 merge，命名实例：iter/yantianyu/202009/add_logs
- 开发分支：在迭代期存在，存放当次迭代中具体需求实现代码，可以被develop角色 push，可以被develop角色 merge，合并入迭代分支后会被删除，命名实例：feature/yantianyu/202009/add_logs
- 紧急补丁分支：非常规迭代期中存在，存放紧急修复代码，合并入master分支后被删除，命名实例：hotfix/yantianyu/202009/passport_fix

### 实施操作

- 迭代开始前，迭代开发负责人/项目开发负责人 从master拉出迭代分支（比如 iter/jack/202008/add_logs）
- 本次迭代中，各需求开发负责人从迭代分支上拉出自己的开发分支
- 迭代分支定期把最新的master分支rebase进来（项目发版后执行rebase操作）
- 具体开发负责人定期把最新的iter分支rebase进来 
- 各需求开发完成后，分支通过merge request合并入迭代分支，然后使用迭代分支进行提测，其中merge request单作为提测单中的code review物料；开发分支合并入迭代分支后，需要被删除，开发人员在迭代分支中拉出新开发分支。GIT 合并多个commit 命令行操作
- 上线阶段，迭代分支先rebase master分支，确保迭代分支合并入master分支时没有冲突。然后提交iter分支合并入master分支的mr

### 合并分支

- 基本概念：master分支是迭代分支、开发分支、紧急补丁分支的上游分支，迭代分支是开发分支的上游分支。紧急补丁分支不是迭代分支的下游分支
- 上游分支获取下游分支代码，使用merge 操作，比如master分支获取iter/yantianyu/202009/add_logs分支代码。在当前规范下：
  - master分支获取iter分支代码，由master角色在master分支上执行 git merge --squash iter，提交后推送至远程。这样操作的目的，是保持master分支上的节点清晰明了
  - iter分支获取feature分支代码，通过提交merge quest 单完成，且merge quest单完成后，及时通知统一迭代分支下各个开发分支负责人，及时 把自身的开发分支rebase至迭代分支的最新节点。这样操作的目的，是为了保持迭代分支中的增量代码，始终被review过，且产生一个code review记录
- 下游分支获取上游分支代码，使用rebase操作，比如开发分支 feature/tianyu.yan/202008/xxxx 获取 iter/202008/xxxx 分支代码。由开发人员自行在开发分支上，执行 git rebase iter/202008/xxxx

### code review

- 使用mr单进行code review, 以下是mr单模版
- mr单会带着CI执行结果，CI运行不成功，则MR单不可合并
- .gitlab/merge_request_templates/BUG_FIX.md
```
### 这个 PR 做了

<!-- 列表 -->

1. xxx
2. xxx
3. 。。。

### 自测报告

| 模块 | 场景 | 表现 | 结果 |
| ---- | ---- | ---- | ---- |
| ?    | ?    | ?    | ok?  |

### 这个 PR 涉及什么模块

<!-- 请填写涉及的模块 -->

### 其它需要 Reviewer 知晓的内容：

<!-- 其它需要补充的内容 -->
```
- .gitlab/merge_request_templates/MERGE_REQUEST.md
```
### 这个 PR 做了 BUG FIX

### 自测报告

<!-- 请填写禅道中真实的 Bug ID -->

| BUG ID                                           | 表现 | 结果 |
| ------------------------------------------------ | ---- | :--: |
| [xxx](http://zen.in.za/zentao/bug-view-xxx.html) | ?    | ok?  |

### 这个 PR 涉及什么模块

<!-- 请填写涉及的模块 -->

```

### git 提交信息规范

- git 提交信息检查会在 pre-commit 阶段进行
- 例子
```
git commit -m 'feat: add footer'
```

```
[
  'docs', // Adds or alters documentation. 仅仅修改了文档，比如README, CHANGELOG, CONTRIBUTE等等
  'chore', // Other changes that don't modify src or test files. 改变构建流程、或者增加依赖库、工具等
  'feat', // Adds a new feature. 新增feature
  'fix', // Solves a bug. 修复bug
  'merge', // Merge branch ? of ?.
  'perf', // Improves performance. 优化相关，比如提升性能、体验
  'refactor', // Rewrites code without feature, performance or bug changes. 代码重构，没有加新功能或者修复bug
  'revert', // Reverts a previous commit. 回滚到上一个版本
  'style', // Improves formatting, white-space. 仅仅修改了空格、格式缩进、逗号等等，不改变代码逻辑
  'test', // Adds or modifies tests. 测试用例，包括单元测试、集成测试等
],
```

## 代码检查

- 代码检查，使用统一eslint规则 eslint-config-zati 
- 代码检查指令会在 pre-commit阶段、CI阶段运行
- pre-commit阶段可被绕过，但CI阶段不可绕过
- CI运行不通过，则此节点代码不可被合并入迭代分支

## 单元测试

{% asset_img unit-test-cost.jpg %}

- 单元测试的确需要一定的成本，以invest h5项目实施情况来看，要达到60%的测试覆盖率，测试代码与生产代码开发成本大致是 1:2

### 单元测试落地

{% asset_img unit-test-running.gif %}

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

### 测试覆盖检查

- 测试覆盖概念说明
  - 行覆盖率（line coverage）
  - 函数覆盖率（function coverage）
  - 分支覆盖率（branch coverage）
  - 语句覆盖率（statement coverage）

- 这是目前全量单元测试覆盖率限制，各个指标未满足覆盖度，则单元测试指令返回失败
```
coverageThreshold: {
  global: {
    branches: 50,
    functions: 60,
    lines: 65,
    statements: 65
  }
}
```

- 当前invest h5项目测试覆盖率情况
```
=============================== Coverage summary ===============================
Statements   : 69.52% ( 1909/2746 )
Branches     : 53.2% ( 623/1171 )
Functions    : 65.72% ( 508/773 )
Lines        : 69.97% ( 1859/2657 )
================================================================================
```

- 可以通过详细报告，查看各文件测试覆盖情况
{% asset_img test_coverage.gif %}

## 当前 git工作流、代码校验、单元测试、持续集成的结合

### 现状

{% asset_img ivnest_web_work_flow.png %}

### 待完成事项

- 接入统一code lint规则 eslint-config-zati
- CI根据最新gitlab特性进行调整
- 对接CD