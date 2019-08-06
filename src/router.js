import Vue from 'vue'
import Router from 'vue-router'
// import Home from './views/Home.vue'
import Game from './views/Game.vue'
import Admin from './views/Admin'
import Scoreboard from './views/Scoreboard'
import PageNotFound from './views/PageNotFound'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: Home
    // },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/',
      name: 'login',
      component: () => import(/* webpackChunkName: "about" */ './views/Login.vue')
    },
    {
      path: '/game',
      name: 'game',
      component: Game
    },
    {
      path: '/scoreboard',
      name: 'scoreboard',
      component: Scoreboard
    },
    {
      path: '/admin-panel',
      name: 'admin',
      component: Admin
    },
    {
      path: '*',
      name: 'notfound',
      component: PageNotFound
    },
  ]
})
