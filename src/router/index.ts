import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { supabase } from '../lib/supabase'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: "/sign-in",
    name: "signin",
    component: () => import("../views/SignIn.vue"),
  },
  {
    path: "/",
    name: "signup",
    component: () => import("../views/SignUp.vue"),
  },
  // New routes for the drawing app
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/Dashboard.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/lessons/:id",
    name: "lessonDetail",
    component: () => import("../views/LessonDetail.vue"),
    props: true,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  try {
    const { data } = await supabase.auth.getSession();
    const currentUser = data.session?.user || null;
    
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    if (requiresAuth && !currentUser) {
      next('/sign-in');
    } else {
      next();
    }
  } catch (error) {
    console.error("Error in navigation guard:", error);
    next('/sign-in');
  }
});

export default router