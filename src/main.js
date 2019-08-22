import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import Vant from 'vant'
import 'vant/lib/index.css'
import './styles/index.less'
import VeeValidate from 'vee-validate'

Vue.config.productionTip = false

Vue.use(Vant)
Vue.use(VeeValidate)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
