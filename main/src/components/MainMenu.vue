<template>
  <el-menu
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item :index="item.key" v-for="item in menus" :key="item.key" @click="changeMenu(item)">
      <i class="el-icon-menu"></i>
      <span slot="title">
        {{ item.title }}
      </span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    menus: Array
  },
  methods: {
    changeMenu (item) {
      this.$router.push({
        path: item.path
      })
      // console.log('changemenu', item)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
