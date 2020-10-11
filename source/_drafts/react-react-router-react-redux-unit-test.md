---
title: react+react-router+react-redux项目单元测试实践记录
categories: [tech]
tags: [test, 自动化测试, jest, enzyme]
---

{% asset_img 1.png %}

给项目添加测试，并不单纯只是工具使用上的变化和代码量的增加，更为本质的变化，是代码设计上的变化、开发工作模式的变化

ps: 在开始使用typescript的类型约束后，也会有上述变化产生

<escape><!-- more --></escape>

## 前置知识要求

- 熟悉 [react](https://reactjs.org/)
- 熟悉 [jest](https://jestjs.io/)
- 熟悉 [enzyme](https://github.com/enzymejs/enzyme)

## 总体分析

### 执行单元测试主要面对的问题

- 在实现web前端应用前，至少会考虑几个要点
  - 应用运行环境：pc浏览器？移动端浏览器？app内webview？
  - 应用展示内容：banner？文案？按钮？图片？等等
  - 应用交互：点击按钮发生什么？输入文字发生什么？等等
- 故对于web前端应用，其项目代码中，除了纯函数部分，还充斥着大量的io操作（service api调用、bom api调用、dom api）调用
- 下面就针对上述问题，依次处理

## 实践

### 纯函数测试

- 对于纯函数，只需要关注输入与输出即可
- 通常项目中 utils 文件夹中的都是纯函数

#### 实例

- utils/index.tsx

```javascript
function sum(a:number, b:number){
  return a+b
}
export {sum}
```

- utils/index.test.tsx

```javascript
import {sum} from './index'

it('test sum', () => {
    expect(sum(1,2)).toEqual(3)
    expect(sum(2,3)).toEqual(5)
})
```

### 页面展示内容测试

- 在react语境下，页面使用组件进行内容展示
- 则开发人员需要以组件未单位进行测试

#### 实例

- src/components/Banner/index.tsx

```javascript
import React from 'react'

function Banner(): JSX.Element {
  return <div>Banner</div>
}

export default Banner
```

- src/components/Banner/index.test.tsx

```javascript
import React from 'react'
import Banner from './index'
import { shallow } from 'enzyme'

it('should render correctly', () => {
  const wrapper = shallow(<Banner />)
  expect(wrapper.text()).toContain('banner')
})
```

### 交互测试

- 界面作为人机交互入口，直接承载用户输入与机器输出
- 交互实际上就是用户输入和机器输出的体现
- 下面是一个不涉及io操作的交互测试

#### 实例

- src/components/Banner/index.tsx

```javascript
import React, { useState } from 'react'

function Banner(): JSX.Element {
  const [text, setText] = useState('banner')

  const clickHandle = (): void => {
    setText('clicked')
  }
  return (
    <div>
      {text}
      <button id="btn" onClick={clickHandle}>
        click
      </button>
    </div>
  )
}

export default Banner

```

- src/components/Banner/index.test.tsx

```javascript
import React from 'react'
import Banner from './index'
import { shallow } from 'enzyme'

it('click the button and change text', () => {
  const wrapper = shallow(<Banner />)
  expect(wrapper.text()).toContain('banner')
  wrapper.find('#btn').simulate('click')
  expect(wrapper.text()).not.toContain('banner')
  expect(wrapper.text()).toContain('clicked')
})
```

### dom操作交互测试

- 涉及dom操作、bom操作、api操作的部分，可以使用`mock`

#### 实例

- src/components/Banner/index.tsx

```javascript
import React, { useState } from 'react'

function Banner(): JSX.Element {
  const [text, setText] = useState('banner')

  const clickHandle = (): void => {
    setText('clicked')
  }
  return (
    <div>
      {text}
      <button id="btn" onClick={clickHandle}>
        click
      </button>
      <button
        id="jump"
        onClick={(): void => {
          location.href = 'jump success'
        }}
      >
        jump
      </button>
    </div>
  )
}

export default Banner

```

- src/components/Banner/index.test.tsx

```javascript
import React from 'react'
import Banner from './index'
import { shallow } from 'enzyme'

beforeAll(() => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: {
      href: 'mock success'
    }
  })
})

it('test jump', () => {
  const wrapper = shallow(<Banner />)
  expect(window.location.href).toBe('mock success')
  wrapper.find('#jump').simulate('click')
  expect(window.location.href).toBe('jump success')
})
```

### bom操作交互测试

- bom操作和dom类似

#### 实例

- src/components/Banner/index.tsx

```javascript
import React, { useState } from 'react'

function Banner(): JSX.Element {
  const [text, setText] = useState('banner')

  const clickHandle = (): void => {
    setText('clicked')
  }
  return (
    <div>
      {text}
      <button id="btn" onClick={clickHandle}>
        click
      </button>
      <button
        id="jump"
        onClick={(): void => {
          location.href = 'jump success'
        }}
      >
        jump
      </button>
      <button
        id="getUserAgent"
        onClick={(): void => {
          setText(window.navigator.userAgent)
        }}
      >
        jump
      </button>
    </div>
  )
}

export default Banner

```

- src/components/Banner/index.test.tsx

```javascript
import React from 'react'
import Banner from './index'
import { shallow } from 'enzyme'

beforeAll(() => {
  Object.defineProperty(window, 'navigator', {
    writable: true,
    value: {
      userAgent: 'get userAgent success'
    }
  })
})

it('click "get useragen"', () => {
  const wrapper = shallow(<Banner />)
  wrapper.find('#getUserAgent').simulate('click')
  expect(wrapper.text()).toContain('get userAgent success')
})

```

### service api 操作交互测试

- api 相关的mock会有一点差异

#### 实例

- src/components/Banner/index.tsx

```javascript
import React, { useState } from 'react'
import { getUserInfo } from '@/pages/card-mgmt/api'

function Banner(): JSX.Element {
  const [text, setText] = useState('banner')

  const clickHandle = (): void => {
    setText('clicked')
  }
  return (
    <div>
      {text}
      <button id="btn" onClick={clickHandle}>
        click
      </button>
      <button
        id="jump"
        onClick={(): void => {
          location.href = 'jump success'
        }}
      >
        jump
      </button>
      <button
        id="getUserAgent"
        onClick={(): void => {
          setText(window.navigator.userAgent)
        }}
      >
        getUserAgent
      </button>
      <button
        id="getUserInfo"
        onClick={async (): Promise<void> => {
          const result = await getUserInfo()
          setText(result.cnName)
        }}
      >
        getUserInfo
      </button>
    </div>
  )
}

export default Banner

```

- src/components/Banner/index.test.tsx

```javascript
import React from 'react'
import Banner from './index'
import { shallow } from 'enzyme'
import { act } from 'react-dom/test-utils'

jest.mock('@/pages/card-mgmt/api', () => ({
  ...(jest.requireActual('@/pages/card-mgmt/api') as any),
  getUserInfo: jest
    .fn()
    .mockImplementation(() => Promise.resolve({ cnName: '火箭', enName: 'rocket' }))
}))

it('click "get userInfo"', async () => {
  const wrapper = shallow(<Banner />)
  await act(async () => {
    wrapper.find('#getUserInfo').simulate('click')
  })
  expect(wrapper.text()).toContain('火箭')
})

```