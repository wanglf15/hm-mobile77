import Vue from 'vue'
import Vuex from 'vuex'
import { getUser, saveUser } from '@/utils/user'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: getUser()
  },

  mutations: {
    setUser (state, data) {
      state.user = data
      saveUser(state.user)
    }
  },

  actions: {

  }
})
