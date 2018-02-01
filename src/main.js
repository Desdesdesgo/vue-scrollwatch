import Vue from 'vue'
import App from './App.vue'
import vueScrollwatch from "./lib/vue-scrollwatch"
Vue.use(vueScrollwatch)
new Vue({
  el: '#app',
  render: h => h(App)
})
