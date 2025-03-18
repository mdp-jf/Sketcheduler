import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: "/sign-in",
    name: "sign in",
    component: () => import("../views/SignIn.vue"),
  },
  {
    path: "/",
    name: "sign up",
    component: () => import("../views/SignUp.vue"),
  },
  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router