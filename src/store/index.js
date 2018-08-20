import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activeMenu: 1,
  },
  mutations: {
    changeActiveMenu(state, str) {
      // 改变activeMenu的class状态
      state.activeMenu = str;
    },
  }
})
