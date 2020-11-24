---
title: invest web团队工作流说明 -- 关于 git工作流、代码校验与单元测试、持续集成的结合
categories: [tech]
tags: [git flow, unit test, gitlab ci]
---

{% asset_img invest_git_flow.png %}

<escape><!-- more --></escape>

## 背景

- 原git开发模式的问题
  - 关键分支未收到严格保护，代码review未收到严格约束
  - sit、uat、master分支管理模式，会导致代码合并风险加大，测试版本和发布版本差异过大
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



