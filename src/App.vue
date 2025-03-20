<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  console.log("App mounted, initializing auth store");
  await authStore.initialize();

  console.log("Auth initialized, user is:", authStore.user?.email);

  // If user is logged in but on sign-in page, redirect to home
  if (
    authStore.isAuthenticated() &&
    (window.location.pathname === "/sign-in" ||
      window.location.pathname === "/")
  ) {
    router.push("/home");
  }
});
</script>

<template>
  <router-view />
</template>
