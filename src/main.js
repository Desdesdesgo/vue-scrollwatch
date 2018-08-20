import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vueScrollwatch from "./lib/vue-scrollwatch"
Vue.use(vueScrollwatch)
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

