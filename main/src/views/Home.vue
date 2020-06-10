<template>
  <div class="home">
    <h3>{{ this.login ? '已登录' : '未登录' }}</h3>
    <el-switch
      :value="login"
      active-color="#13ce66"
      inactive-color="#ff4949"
      @change="changeLoginStatus"
    >
    </el-switch>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import actions from '@/shared/actions'

export default {
  name: 'Home',
  computed: mapState({
    login: state => state.login
  }),
  methods: {
    changeLoginStatus (val) {
      this.updateLogin(val)
      actions.setGlobalState({ login: val })
    },
    ...mapActions({
      updateLogin: 'updateLogin'
    })
  }
}
</script>
