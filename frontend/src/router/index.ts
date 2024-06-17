import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AccountsView from '../views/AccountsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: "/accounts",
      name: "accounts",
      component: AccountsView,
    },
    {
      path: "/accounts/:id",
      name: "account",
      component: () => import("../views/AccountView.vue"),
    }
  ]
})

export default router
