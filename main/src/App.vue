<template>
  <div>
    <el-container>
      <el-header style="padding: 0;border-bottom: 1px solid #545c64;">
        <div class="logo">微应用示例</div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <main-menu :menus="menus" />
        </el-aside>
        <el-container>
          <el-main>
            <section class="main-layout">
              <section class="cns-frame-wrapper">
                <!-- 主应用渲染区，用于挂载主应用路由触发的组件 -->
                <router-view v-show="$route.name" />

                <!-- 子应用渲染区，用于挂载子应用节点 -->
                <section v-show="!$route.name" id="frame"></section>
              </section>
            </section>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import MainMenu from '@/components/MainMenu'
import actions from '@/shared/actions'
export default {
  name: 'App',
  components: {
    MainMenu
  },
  data () {
    return {
      menus: [
        {
          key: 'Home',
          title: '主应用主页',
          path: '/'
        },
        {
          key: 'About',
          title: '主应用其他页',
          path: '/about'
        },
        {
          key: 'VueMicroApp',
          title: '微应用主页',
          path: '/vue/#'
        },
        {
          key: 'VueMicroAppList',
          title: '微应用列表页',
          path: '/vue/#/list'
        }
      ]
    }
  },
  computed: mapState({
    login: state => state.login
  }),
  mounted () {
    actions.onGlobalStateChange(state => {
      console.log('父应用接受到state变化', state)
      this.updateLogin(state.login)
    })
  },
  methods: {
    ...mapActions({
      updateLogin: 'updateLogin'
    })
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
}
.logo {
  // width: 200px;
  // height: 60px;
  line-height: 60px;
  // background-color: #545c64;
  // color: #fff;
  text-align: center;
}
</style>
