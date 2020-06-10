<template>
  <section style="padding: 20px; color: red;">
    <h3>
      {{ this.ifLogin ? '已登录' : '未登录' }}
    </h3>
    <a-button @click="logOut">登出</a-button>
  </section>
</template>
<script>
import actions from "@/shared/actions";
export default {
  name: "Home",
  data() {
    return {
      ifLogin: false
    };
  },
  mounted() {
    // 注册观察者函数
    // onGlobalStateChange 第二个参数为 true，表示立即执行一次观察者函数
    actions.onGlobalStateChange(state => {
      console.log('子应用监听全局state变化', state)
      this.ifLogin = state.login
    }, true);
  },
  methods: {
    logOut () {
      this.ifLogin = false
      actions.setGlobalState({ login: false })
    }
  }
}
</script>