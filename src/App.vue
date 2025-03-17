<script setup>
import { onMounted, ref } from 'vue'
import Account from './components/Account.vue'
import Auth from './components/Auth.vue'
import { supabase } from './lib/supabase'

const session = ref(null)
const loading = ref(true)

onMounted(() => {
  // Check for active session
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
    loading.value = false
  })

  // Set up auth state listener
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })

  // Clean up subscription on unmount
  return () => subscription.unsubscribe()
})
</script>

<template>
  <div class="app">
    <header class="app-header">
      <div class="container">
        <h1>Supabase + Vue 3</h1>
      </div>
    </header>
    
    <main class="container">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading application...</p>
      </div>
      
      <Account v-else-if="session" :session="session" />
      <Auth v-else />
    </main>
    
    <footer class="app-footer">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} Your Company. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style>
@import './assets/main.css';

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: var(--primary-color);
  color: white;
  padding: 1.5rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

main {
  flex: 1;
  padding: 2rem 0;
}

.app-footer {
  background-color: var(--gray-900);
  color: var(--gray-300);
  padding: 1.5rem 0;
  text-align: center;
  font-size: 0.875rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60vh;
  color: var(--gray-500);
}

.loading-spinner {
  border: 4px solid var(--gray-200);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>