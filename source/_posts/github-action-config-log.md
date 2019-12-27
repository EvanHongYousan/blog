---
title: github action配置记录
date: 2019-12-27 10:23:00
categories: [tech]
tags: [iframe, bug fix]
---

前两天看到个关键词是“github action”，经查询了解到是github的持续集成服务，今天来进行配置尝试 
<escape><!-- more --></escape>

## 配置项目说明

|  项目   | 说明  |
|  ----  | ----  |
| https://github.com/EvanHongYousan/blog  | blog源码 |
| https://github.com/EvanHongYousan/EvanHongYousan.github.io  | 静态文件 |

## 步骤

- 执行 ```ssh-keygen -f blog-deploy-key```,在 ```.ssh/ ```文件中 生成一组 公钥(blog-deploy-key.pub)与私钥（blog-deploy-key）
- 进入EvanHongYousan.github.io项目，```setting -> deploy keys -> add deploy key```,命名```p_rsa```，把 blog-deploy-key.pub 中的内容填入
  > 这里注意，需要把```Allow write access```选项钩上
- 进入blog项目，```setting -> Secrets -> add a new secret```,命名```s_rsa```,把 blog-deploy-key 中的内容填入
- hexo中的发布配置，改为ssh形式
```yml
deploy:
  type: git
  repo: git@github.com:EvanHongYousan/EvanHongYousan.github.io.git #https://bitbucket.org/JohnSmith/johnsmith.bitbucket.io
  branch: master #published
  message:
```
- 最后在blog项目，新建 ```.github/workflows/main.yml``` 文件
```
name: Deploy Blog

on: [push] # 当有新push时运行

jobs:
  build: # 一项叫做build的任务

    runs-on: ubuntu-latest # 在最新版的Ubuntu系统下运行
    
    steps:
    - name: Checkout # 将仓库内master分支的内容下载到工作目录
      uses: actions/checkout@v1 # 脚本来自 https://github.com/actions/checkout
      
    - name: Use Node.js 10.x # 配置Node环境
      uses: actions/setup-node@v1 # 配置脚本来自 https://github.com/actions/setup-node
      with:
        node-version: "10.x"
    
    - name: Setup Hexo env
      env:
        ACTION_DEPLOY_KEY: ${{ secrets.s_rsa }} #s_rsa就是填入私钥时的命名
      run: |
        # set up private key for deploy
        mkdir -p ~/.ssh/
        echo "$ACTION_DEPLOY_KEY" | tr -d '\r' > ~/.ssh/id_rsa # 配置秘钥
        chmod 600 ~/.ssh/id_rsa
        ssh-keyscan github.com >> ~/.ssh/known_hosts
        # set git infomation
        git config --global user.name 'EvanHongYousan' # 换成你自己的邮箱和名字
        git config --global user.email '1370204201@qq.com'
        # install dependencies
        npm i -g hexo-cli # 安装hexo
        npm i
  
    - name: Deploy
      run: |
        # publish
        hexo generate && hexo deploy # 执行部署程序
```

## 参考

[如何正确的使用 GitHub Actions 实现 Hexo 博客的 CICD](https://hdj.me/github-actions-hexo-cicd/)

