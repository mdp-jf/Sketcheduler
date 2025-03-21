import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import HomeView from "../views/HomeView.vue";
import { supabase } from "../lib/supabase";
import { useMaintenanceMode } from "../composables/useMaintenanceMode";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/sign-in",
  },
  {
    path: "/home",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: "/sign-in",
    name: "signin",
    component: () => import("../views/SignIn.vue"),
  },
  {
    path: "/sign-up",
    name: "signup",
    component: () => import("../views/SignUp.vue"),
  },
  {
    path: "/account",
    name: "account",
    component: () => import("../views/AccountSettings.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("../views/UserProfile.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/Dashboard.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/lessons/:id",
    name: "lessonDetail",
    component: () => import("../views/LessonDetail.vue"),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/maintenance",
    name: "maintenance",
    component: () => import("../views/MaintenanceView.vue"),
  },
  {
    path: "/exercise-tracking",
    name: "ExerciseTracking",
    component: () => import("../views/ExerciseTrackingView.vue"),
  },
  {
    path: "/challenge-tracking",
    name: "ChallengeTracking",
    component: () => import("../views/ChallengeTrackingView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  try {
    const { isInMaintenance } = useMaintenanceMode();
    const { data } = await supabase.auth.getSession();
    const currentUser = data.session?.user || null;
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

    // Prevent access to signup page when in maintenance mode
    if (to.name === "signup" && isInMaintenance.value) {
      next("/maintenance");
      return;
    }

    // Redirect authenticated users away from auth pages
    if ((to.name === "signin" || to.name === "signup") && currentUser) {
      next("/home");
      return;
    }

    // Handle protected routes
    if (requiresAuth && !currentUser) {
      next("/sign-in");
    } else {
      next();
    }
  } catch (error) {
    console.error("Error in navigation guard:", error);
    next("/sign-in");
  }
});

export default router;
