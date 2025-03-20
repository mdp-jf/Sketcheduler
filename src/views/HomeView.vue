<template>
  <div class="home">
    <h1 class="text-2xl font-bold mb-6">
      Welcome to the Drawing Learning Platform
    </h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4">Get Started</h2>
        <p class="mb-4">
          Welcome to your drawing learning journey! Use the dashboard to access
          your lessons, challenges, and drawings.
        </p>
        <router-link
          to="/dashboard"
          class="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go to Dashboard
        </router-link>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4">Your Account</h2>
        <p class="mb-4">Manage your account settings or sign out.</p>
        <div class="flex space-x-4">
          <router-link
            to="/account"
            class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Account Settings
          </router-link>
          <button
            class="bg-red-100 text-red-800 px-4 py-2 rounded hover:bg-red-200 disabled:opacity-50"
            :disabled="isSigningOut"
            @click="handleSignOut"
          >
            <span v-if="isSigningOut">
              <span class="inline-block animate-spin mr-1">⟳</span>
              Signing out...
            </span>
            <span v-else>Sign Out</span>
          </button>
        </div>

        <!-- Show error message if sign out fails -->
        <BaseError v-if="signOutError" class="mt-4" :message="signOutError" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useLoading } from "../composables/useLoading";
import { useError } from "../composables/useError";
import BaseError from "../components/BaseError.vue";

// Define component name
defineOptions({
  name: "HomeView",
});

// Router
const router = useRouter();

// Auth store
const authStore = useAuthStore();

// Composables
const { isLoading: isSigningOut } = useLoading();
const { error: signOutError, setError, clearError } = useError();

// Sign out handler
const handleSignOut = async () => {
  try {
    clearError();
    isSigningOut.value = true;

    const result = await authStore.signOut();

    if (result.success) {
      router.push("/sign-in");
    } else {
      setError(result.error || "Failed to sign out. Please try again.");
    }
  } catch (error: any) {
    console.error("Exception signing out:", error);
    setError(
      error.message || "An unexpected error occurred while signing out.",
    );
  } finally {
    isSigningOut.value = false;
  }
};
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
</style>
