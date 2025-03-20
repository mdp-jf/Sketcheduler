<template>
  <div class="app-container min-h-screen bg-gray-50">
    <!-- App Header -->
    <header class="bg-white shadow">
      <div
        class="container mx-auto px-4 py-4 flex justify-between items-center"
      >
        <router-link to="/" class="text-xl font-bold text-blue-600">
          Drawing Learning Platform
        </router-link>

        <nav v-if="isAuthenticated" class="space-x-4">
          <router-link
            to="/dashboard"
            class="text-gray-600 hover:text-blue-500"
          >
            Dashboard
          </router-link>
          <router-link to="/profile" class="text-gray-600 hover:text-blue-500">
            Profile
          </router-link>
          <button
            class="text-gray-600 hover:text-red-500"
            @click="handleSignOut"
          >
            Sign Out
          </button>
        </nav>

        <nav v-else class="space-x-4">
          <router-link to="/sign-in" class="text-gray-600 hover:text-blue-500">
            Sign In
          </router-link>
          <router-link
            to="/sign-up"
            class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Sign Up
          </router-link>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-6">
      <div class="container mx-auto px-4 text-center">
        <p>
          © {{ currentYear }} Drawing Learning Platform. All rights reserved.
        </p>
      </div>
    </footer>

    <!-- Toast Container for notifications -->
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { useToastStore } from "./stores/toast";
import ToastContainer from "./components/ToastContainer.vue";

// Router
const router = useRouter();

// Stores
const authStore = useAuthStore();
const toastStore = useToastStore();

// Computed
const currentYear = computed(() => new Date().getFullYear());
const isAuthenticated = computed(() => authStore.isAuthenticated());

// Initialize auth state on app load
onMounted(() => {
  authStore.initialize();
});

// Sign out handler
const handleSignOut = async () => {
  try {
    const result = await authStore.signOut();
    if (result.success) {
      toastStore.success("You have been signed out successfully");
      router.push("/sign-in");
    } else {
      toastStore.error(result.error || "Error signing out. Please try again.");
    }
  } catch (error: any) {
    console.error("Exception signing out:", error);
    toastStore.error(
      error.message || "An unexpected error occurred while signing out",
    );
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Global styles */
body {
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Helvetica,
    Arial,
    sans-serif;
  color: #333;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin-top: 0;
  font-weight: 600;
}
</style>
