---
title: vue2项目单元测试对接实践记录
date: 2021-05-30 16:25:35
categories:
tags:
---

虽然现在vue已经来到最新的vue3，但仍然有许多vue2项目在不断迭代维护中。因为时代背景的原因（其实也就几年前），当时起这些vue2项目时，单元测试并不被重视。随着业务压力的增大，对版本质量的要求变高，单元测试终于被提上日程，且单元测试开始成为普遍共识。

这次就给一个已经运行几年的vue2项目加上单元测试。当中遇到了一些问题，但其实也是写单元测试会遇到的常见问题，在此做个实践记录

{% asset_img maxresdefault.jpeg %}

<escape><!-- more --></escape>

## 阅读前提

- 熟悉 [vue2](https://cn.vuejs.org/v2/guide/)
- 熟悉 [jest](https://jestjs.io/)
- 熟悉 [Vue Test Utils](https://vue-test-utils.vuejs.org/zh/guides/)

## 项目特点说明

- 项目已经运行几年
- 本次针对项目中前端部分的其中一个模块做单元测试接入，此模块为重要业务模块
- 模块的主要技术栈为vue2，绝大部分代码基于vue2技术栈
- 模块中夹杂了一些jquery代码，同时也有一些直接操作dom、bom的代码

## 分析与设计

- 对于测试框架，因为本人对jest更为熟悉的关系，本次直接使用jest进行单元测试框架接入
- 对于vue2的单元测试工具库选择，其[官方文档](https://cn.vuejs.org/v2/cookbook/unit-testing-vue-components.html)中推荐的是 [Vue Test Utils](https://vue-test-utils.vuejs.org/zh/guides/)，则本次直接使用 Vue Test Utils
- 项目中和业务逻辑相关的代码，都是vue2代码，单元测试主要对这部分逻辑进行测试覆盖
- 项目中基于jquery的代码，主要和动画效果相关（重构方面的产出），这部分可不做测试覆盖
- 代码也基于typescript，jest中要做相关转码配置

## 起步

### 依赖安装

首先，要先安装好本次接入单元测试的相关依赖

```bash
# unit testing
vue add @vue/unit-jest
```

或者

```bash
# 安装 Jest 和 Vue Test Utils
npm install --save-dev jest @vue/test-utils
# 安装 babel-jest 、 vue-jest 和 7.0.0-bridge.0 版本的 babel-core
npm install --save-dev babel-jest vue-jest babel-core@7.0.0-bridge.0
# 安装 jest-serializer-vue
npm install --save-dev jest-serializer-vue
```

另外，项目为typescript项目，还需要安装typescript转码依赖

```javascript
npm install --save-dev jest-preset-typescript ts-jest @vue/cli-plugin-unit-jest @babel/preset-typescript
```

至此，依赖安装完成

>如果需要快速体验的话，也可以直接使用官方文档里的脚手架
  ```bash
  git clone https://github.com/vuejs/vue-test-utils-getting-started
  cd vue-test-utils-getting-started
  npm install
  ```

### 配置

jest的配置可以直接在package.json中写，或者新建文件 `jest.config.js`

- jest.config.js:

```javascript
module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/no-babel',
  globals: {
    'ts-jest': {
      babelConfig: true,
    }
  },
  // 测试覆盖配置
  "coverageThreshold": {
    "global": {
      "branches": 10, // 逻辑分支（if else之类）覆盖不可低于10%，否则抛出错误
      "functions": 10, // 函数覆盖不可低于10%，否则抛出错误
      "lines": 10,  // 代码行数覆盖不可低于10%，否则抛出错误
      "statements": 10  // 代码块行数覆盖不可低于10%，否则抛出错误
    }
  },
  moduleFileExtensions: [
    'ts',
    'js',
    'json',
    'vue',
  ],
  // 转码配置
  transform: {
    // process TypeScript files
    "^.+\\.ts$": "ts-jest",
    // process *.vue files with vue-jest
    ".*\\.(vue)$": "vue-jest"
  },
  testURL: 'http://localhost/',
  // 测试代码文件匹配
  testMatch: ['**/*.spec.[jt]s?(x)'],
  moduleDirectories: [
    "node_modules"
  ],
  // 初始化文件路径
  setupFiles: ['./jest.setup.js'],
  // 会被计算测试覆盖率的文件
  collectCoverageFrom: ['static/js/app/creditcard/**', '!./**/*.snap'],
  // 测试报告产出形式
  coverageReporters: ["json", "lcov", "text", "clover", "text-summary"],
  // 测试快照序列化工具库
  snapshotSerializers: ["jest-serializer-vue"]
  // testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
};
```
 
## 具体测试代码

完成依赖安装和基本配置后，接下来就是具体单元测试代码的接入

### 纯函数测试

- 对于纯函数，只需要关注输入与输出即可
- 通常项目中 utils 文件夹中的都是纯函数

#### 实例

- utils/index.tsx

```javascript
function sum(a: number, b: number) {
  return a + b;
}
export { sum };
```

- utils/index.test.tsx

```javascript
import { sum } from "./index";

it("test sum", () => {
  expect(sum(1, 2)).toEqual(3);
  expect(sum(2, 3)).toEqual(5);
});
```

### 页面展示内容测试

- 在 vue2 语境下，页面使用组件进行内容展示
- 则开发人员需要以组件为单位进行测试

#### 实例

- src/components/info.vue

```vue
<template>
    <div>
        info
    </div>
</template>
<script>
export default {
    props: [],
    components: {
    },
    data() {
        return {
        }
    },
    methods: {}
}
</script>
```

- src/components/info.spec.tsx

```javascript
import { shallowMount } from '@vue/test-utils'
import info from './info.vue'

describe('info.vue', () => {
    it('renders 1', () => {
    const wrapper = shallowMount(info, {
      propsData: {}
    })
    expect(wrapper.text()).toMatch('info')
    expect(wrapper).toMatchSnapshot()
  })
})
```

### 组件方法测试

#### 实例

- src/components/info.vue

```vue
<template>
    <div>
        info
    </div>
</template>
<script>
export default {
    props: [],
    components: {
    },
    data() {
        return {
        }
    },
    methods: {
        sum(num1, num2) {
            return num1 + num2
        }
    }
}
</script>
```

- src/components/info.spec.tsx

```javascript
import { shallowMount } from '@vue/test-utils'
import info from './info.vue'

describe('info.vue', () => {
    it('methods -- sum', () => {
    const wrapper = shallowMount(info, {
      propsData: {}
    })
    expect((wrapper.vm as any).sum(1, 2)).toBe(3)
  })
})
```

### 组件状态测试

#### 实例

- src/components/info.vue

```vue
<template>
    <div>
        info
    </div>
</template>
<script>
export default {
    props: [],
    components: {
    },
    data() {
        return {
            ttt: 1
        }
    },
    methods: {
        sum(num1, num2) {
            return num1 + num2
        },
        setTTT(num) {
            this.ttt = num
        }
    }
}
</script>
```

- src/components/info.spec.tsx

```javascript
import { shallowMount } from '@vue/test-utils'
import info from './info.vue'

describe('info.vue', () => {
    it('methods -- sum', () => {
    const wrapper = shallowMount(info, {
      propsData: {}
    })
    expect((wrapper.vm as any).ttt).toBe(1)
    expect((wrapper.vm as any).setTTT(555)).toBeUndefined()
    expect((wrapper.vm as any).ttt).toBe(555)
  })
})
```

### 组件属性测试

从这里开始引入mock的概念

#### 实例

- src/components/info.vue

```vue
<template>
    <div>
        info
    </div>
</template>
<script>
export default {
    props: ['callBack'],
    components: {
    },
    data() {
        return {
            ttt: 1
        }
    },
    methods: {
        sum(num1, num2) {
            return num1 + num2
        },
        setTTT(num) {
            this.ttt = num
        },
        callCB(event) {
            this.callBack(event)
        }
    }
}
</script>
```

- src/components/info.spec.tsx

```javascript
import { shallowMount } from '@vue/test-utils'
import info from './info.vue'

describe('info.vue', () => {
    it('methods -- callCB', () => {
    const mockCB = jest.fn()
    const wrapper = shallowMount(info, {
      propsData: {
          callBack: mockCB
      }
    })
    expect((wrapper.vm as any).callCB(111)).toBeUndefined()
    expect(mockCB).toBeCalled()
  })
})
```

### 涉及dom属性或bom属性的测试

运行测试时，组件运行在jest-dom环境中（或开发人员配置的其它dom环境甚至node环境），而实际的业务代码有可能会在全局作用域或上层作用域中挂载一些属性在dom节点/window节点下，则组件中可以直接运行 `window.xxx.xxx` 这样的代码

但这样的代码，在进行测试时，会报错 `xxx is not defined`

此时，就要对组件中依赖到的对象进行mock

#### 实例

- src/components/info.vue

```vue
<template>
    <div>
        info
    </div>
</template>
<script>
export default {
    props: ['callBack'],
    components: {
    },
    data() {
        return {}
    },
    methods: {
        getTheXXX() {
            return window.abc.xxx
        }
    }
}
</script>
```

- src/components/info.spec.tsx

```javascript
import { shallowMount } from '@vue/test-utils'
import info from './info.vue'

beforeAll(() => {
  Object.defineProperty(window, "abc", {
    writable: true,
    value: {
      xxx: 'xxx'
    },
  });
})

describe('info.vue', () => {
    it('methods -- getTheXXX', () => {
    const wrapper = shallowMount(info, {
      propsData: {}
    })
    expect((wrapper.vm as any).getTheXXX()).toBe('xxx')
  })
})
```

### 涉及 service api 的测试

页面交互经常会涉及service api调用。有部分业界人士会直接启动一个mock server，测试时组件就直接向mock server请求数据，然后验证组件的状态变化是否符合期待

但也有部分业界人士比较习惯直接对http client进行mock。jest在这方面也提供了特性

#### 实例

- src/components/info.vue

```vue
<template>
    <div>
        info
    </div>
</template>
<script>
import api from './api.ts'
export default {
    props: [],
    components: {
    },
    data() {
        return {}
    },
    methods: {
        async getUserInfo() {
            return await api.getUserInfo()
        }
    }
}
</script>
```

- src/components/info.spec.tsx

```javascript
import { shallowMount } from '@vue/test-utils'
import info from './info.vue'

jest.mock('./api.ts', () => ({
  getUserInfo: jest.fn().mockImplementation(() => Promise.resolve('userInfo)),
}))

describe('info.vue', () => {
    it('methods -- getUserInfo', () => {
    const wrapper = shallowMount(info, {
      propsData: {}
    })
    expect((wrapper.vm as any).getUserInfo()).toBe('userInfo')
  })
})
```

## 运行测试

### 全量测试

```bash
npx jest
```

可以看到全量测试运行结果

{% asset_img npxJestSilent.gif %}

### 全量测试并输出测试覆盖报告

```bash
npx jest --coverage
```

{% asset_img npxJestSilentCoverage.gif %}

指令跑完后，在项目根目录下会生成 `coverage` 文件夹，里面的 `lcov-report` 文件夹包含html、js、css文件，可构建成一个静态站点，看到被测试代码的详细覆盖情况

{% asset_img coverageOfHtml.gif %}

### watch模式下运行测试

针对变更文件进行测试，且每次文件变更并保存后触发测试

```bash
npx jest --watch
```

## 成本说明

当前信用卡业务前端部分被统计的代码行数为2771行，单元测试覆盖行数为1259行，单元测试行覆盖率为45.43%
以下是详细的测试覆盖推进细节：

- 行覆盖率 0% → 37%，时间为 2021.05.06 ~ 2021.05.14，除去其他工作占用时间，投入至单元测试的大概是5个工作日。
  - 其中两个工作日为单元测试框架对接和组件最简单的测试对接，完成后单元测试覆盖大概有20%。20% ~ 37%的覆盖则是代码中的逻辑覆盖，耗时3个工作日
- 行覆盖率 37% → 45%，时间为 2021.05.17 ~ 2021.05.21，除去其他工作占用时间，投入至单元测试的大概是1.5个工作日

综上:
- 0 ~ 20%时，效率为 10%（277.1行）/工作日
- 20% ~ 37% 时，效率为 5.6%（155.2行）/工作日
- 37% ~ 45% 时，效率为5.3%（146.9行）/工作日

> 以上特指项目中的js、ts源码，不包含css、html等其他代码
> jest中的Istanbul进行代码行数统计时，使用一套内部规则进行计算，并不受源码的回车换行符影响。故编辑器中显示代码文件的行数，和jest产出的测试覆盖报告的的代码行数并不是一个概念
## 参考

- [vue2](https://cn.vuejs.org/v2/guide/)
- [jest](https://jestjs.io/)
- [Vue Test Utils](https://vue-test-utils.vuejs.org/zh/guides/)