# 前端微应用方案

## 技术选型

- [single-spa](https://single-spa.js.org/) 
        > 是一个将多个单页面应用聚合为一个整体应用的 javascript 微前端框架。可兼容多种技术框架，子应用独立运行，独立加载

- [qiankun](https://qiankun.umijs.org/zh/guide)
        > 是一个基于 single-spa 的微前端实现库，旨在帮助大家能更简单、无痛的构建一个生产可用微前端架构系统。简化了single-spa的使用流程

    综上，初步选用qiankun开始初步搭建一个简易的微前端项目

## 步骤

### 构建主应用

1. 用vue/cli初始化一个前端工程
2. 注册微应用

```javascript
// app.js
const apps = [
  /**
     * name: 微应用名称 - 具有唯一性
     * entry: 微应用入口 - 通过该地址加载微应用
     * container: 微应用挂载节点 - 微应用加载完成后将挂载在该节点上
     * activeRule: 微应用触发的路由规则 - 触发路由规则后将加载该微应用
     */
  {
    name: 'VueMicroApp',
    entry: '//localhost:8081',
    container: '#frame',
    activeRule: '/vue/#'
  }
]

export default apps

```

3. 编写简单的父子应用路由匹配逻辑
4. 编写主应用在挂载、卸载子应用是需要触发的钩子函数及全局异常捕获钩子函数

```javascript
import {
  registerMicroApps,
  addGlobalUncaughtErrorHandler,
  start
} from 'qiankun'

// 子应用注册信息
import apps from './apps'

/**
 * 注册子应用
 * 第一个参数 - 子应用的注册信息
 * 第二个参数 - 全局生命周期钩子
 */
registerMicroApps(apps, {
  // qiankun 生命周期钩子 - 加载前
  beforeLoad: (app) => {
    // 加载子应用前，加载进度条
    NProgress.start()
    console.log('before load', app.name)
    return Promise.resolve()
  },
  // qiankun 生命周期钩子 - 挂载后
  afterMount: (app) => {
    // 加载子应用前，进度条加载完成
    NProgress.done()
    console.log('after mount', app.name)
    return Promise.resolve()
  }
})

/**
 * 添加全局的未捕获异常处理器
 */
addGlobalUncaughtErrorHandler((event) => {
  const { message: msg } = event
  // 加载失败时提示
  if (msg && msg.includes('died in status LOADING_SOURCE_CODE')) {
    console.log('子应用加载失败，请检查应用是否可运行')
  }
})

// 导出 qiankun 的启动函数
export default start
```

5. 启动应用
    
### 接入微应用

1. 用vue/cli初始化一个前端工程（可以react或者静态前端工程，接入步骤略有不同，此处以vue示例）
2. 配置微应用挂载方法，编写微应用单独运行或作为微应用的运行逻辑

```javascript
/**
 * 渲染函数
 * 两种情况：主应用生命周期钩子中运行 / 微应用单独启动时运行
 */
function render(props) {
  if (props) {
    // 注入 actions 实例
    console.log('注入actions', props)
    actions.setActions(props);
  }
  // 在 render 中创建 VueRouter，可以保证在卸载微应用时，移除 location 事件监听，防止事件污染
  router = new VueRouter({
    // 运行在主应用中时，添加路由命名空间 /vue
    base: window.__POWERED_BY_QIANKUN__ ? "/vue/" : "/",
    routes,
  });

  // 挂载应用
  instance = new Vue({
    router,
    render: (h) => h(App),
  }).$mount("#app");
}

// 独立运行时，直接挂载应用
if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log("VueMicroApp bootstraped");
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  console.log("VueMicroApp mount", props);
  render(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  console.log("VueMicroApp unmount");
  instance.$destroy();
  instance = null;
  router = null;
}

```

3. 挂载微应用生命周期函数
4. 配置webpack构建规则，详细配置见微应用 *vue.config.js* 文件

```javascript
module.exports = {
  devServer: {
    // 监听端口
    port: 8081,
    // 关闭主机检查，使微应用可以被 fetch
    disableHostCheck: true,
    // 配置跨域请求头，解决开发环境的跨域问题
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    },
    output: {
      // 微应用的包名，这里与主应用中注册的微应用名称一致
      library: "VueMicroApp",
      // 将你的 library 暴露为所有的模块定义下都可运行的方式
      libraryTarget: 'umd',
      // 按需加载相关，设置为 webpackJsonp_VueMicroApp 即可
      jsonpFunction: `webpackJsonp_VueMicroApp`,
    }
  }
}
```

5. 启动应用

### 通讯简单实现

1. 主要api：initGlobalState, setActions, onGlobalStateChange, setGlobalState 具体使用方法运行demo项目查看

## 原理解析

 底层核心通过single-spa实现，借助于 single-spa 模块加载跟底层路由重构的核心逻辑，qiankun实现了自己的一套js/css沙箱隔离方法。具体实现： 通过single-spa 的 html-entry-plugin API加载子应用的HTML，js, css代码。子应用通过代理window对象的方式实现子应用js沙箱隔离，通过全局监听事件来劫持对header元素的操作（其他全局监听事件的劫持略）来改变动态样式挂载的dom节点实现样式隔离，通过自定义实现的一套消息通知机制来实现父子应用的消息传递。
 
 ## 演示
 
 查看本地demo项目
