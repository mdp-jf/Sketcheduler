<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center"
  >
    <div class="max-w-md w-full mx-auto">
      <!-- Logo/Brand -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold mb-4"
        >
          A
        </div>
        <h2 class="text-3xl font-extrabold text-gray-800">
          Create a new account
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Or
          <RouterLink
            class="font-medium text-blue-600 hover:text-blue-500"
            to="/sign-in"
          >
            sign in to your account
          </RouterLink>
        </p>
      </div>

      <!-- Sign Up Form -->
      <div class="bg-white py-8 px-6 shadow-xl rounded-lg">
        <form class="space-y-6" @submit.prevent="handleSignup">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  class="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                  />
                  <path
                    d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                  />
                </svg>
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  class="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3"
                placeholder="••••••••"
              />
            </div>
            <p class="mt-2 text-xs text-gray-500">
              Password must be at least 6 characters
            </p>
          </div>

          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
              @click="handleSignup"
            >
              Create account
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { supabase } from "../lib/supabase";
import router from "../router/index";
import type { AuthError } from "@supabase/supabase-js";
import { useMaintenanceMode } from "../composables/useMaintenanceMode";

// Inside your setup function:
const { isInMaintenance } = useMaintenanceMode();

const email = ref("");
const password = ref("");

const handleSignup = async () => {
  if (isInMaintenance.value) {
    alert(
      "Registration is temporarily disabled while we're in maintenance. Please check back later.",
    );
    return;
  }

  try {
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        emailRedirectTo: "http://localhost:5174/home",
      },
    });
    if (error) throw error;
    router.push("/sign-in");
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(error.message);
    } else if ((error as AuthError).message) {
      alert((error as AuthError).message || (error as AuthError).message);
    } else {
      alert("An unknown error occurred");
    }
  }
};
</script>
