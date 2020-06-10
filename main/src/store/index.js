import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login: false
  },
  mutations: {
    setLogin (state, status) {
      state.login = status
    }
  },
  actions: {
    updateLogin ({ commit }, status) {
      commit('setLogin', status)
    }
  },
  modules: {
  }
})
