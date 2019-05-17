import Vue from 'vue'
import Router from 'vue-router'
// import Home from './views/Home.vue'
import Game from './views/Game.vue'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: Home
    // },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
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
      component: () => import(/* webpackChunkName: "about" */ './views/Scoreboard.vue')
    }
  ]
})
