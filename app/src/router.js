import Vue from 'vue'
import Router from 'vue-router'

import Authed from './middleware/Authed'
import RequiresKeyword from './middleware/RequiresKeyword'
import SearchController from './controllers/SearchController'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  globalMiddleware: [],
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: {
        middleware: [Authed],
        controller: [SearchController, 'home']
      }
    },
    {
      path: '/results',
      name: 'results',
      component: () => import('@/views/Results.vue'),
      meta: {
        middleware: [Authed, RequiresKeyword],
        controller: [SearchController, 'results']
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue')
    }
  ]
})
