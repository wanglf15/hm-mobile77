import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import home from '@/views/home'
import Tabbar from '@/views/tabbar'
import Search from '@/views/search'
import SearchResult from '@/views/search-result'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      component: Tabbar,
      children: [
        {
          name: 'home',
          path: '/', // 默认子路由
          component: home
        }
      ]
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/search/:q',
      name: 'searchResult',
      component: SearchResult,
      props: true
    }
  ]
})
