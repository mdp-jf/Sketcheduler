<template>
    <div class="home">
      <h1 class="text-2xl font-bold mb-6">Welcome to the Drawing Learning Platform</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-bold mb-4">Get Started</h2>
          <p class="mb-4">Welcome to your drawing learning journey! Use the dashboard to access your lessons, challenges, and drawings.</p>
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
          <button 
            @click="handleSignOut" 
            class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../stores/auth'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const handleSignOut = async () => {
    try {
      const result = await authStore.signOut()
      if (result.success) {
        router.push('/sign-in')
      } else {
        console.error('Error signing out:', result.error)
      }
    } catch (error) {
      console.error('Exception signing out:', error)
    }
  }
  </script>