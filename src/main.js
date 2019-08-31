import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import Vant from 'vant'
import 'vant/lib/index.css'
import './styles/index.less'
import VeeValidate, { Validator } from 'vee-validate'
import zhCN from 'vee-validate/dist/locale/zh_CN'

import { relativeTime } from '@/utils/date'
Vue.config.productionTip = false

Vue.filter('relativeTime', relativeTime)

Vue.use(Vant)
Vue.use(VeeValidate, {
  events: '' // 禁用默认的事件校验
})

Validator.localize('zh_CN', zhCN)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
