<script setup>
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

const loading = ref(false)
const email = ref('')
const errorMsg = ref('')
const successMsg = ref('')

const handleLogin = async () => {
  try {
    errorMsg.value = ''
    successMsg.value = ''
    loading.value = true
    
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
    })
    
    if (error) throw error
    
    successMsg.value = 'Check your email for the login link!'
  } catch (error) {
    if (error instanceof Error) {
      errorMsg.value = error.message
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-container">
    <form class="form-widget" @submit.prevent="handleLogin">
      <h1 class="header">Welcome Back</h1>
      <p class="description">Sign in via magic link with your email</p>
      
      <div v-if="errorMsg" class="error-message mb-4">{{ errorMsg }}</div>
      <div v-if="successMsg" class="success-message mb-4">{{ successMsg }}</div>
      
      <div class="mb-6">
        <label for="email">Email Address</label>
        <input 
          id="email"
          class="inputField" 
          type="email" 
          placeholder="Your email address" 
          v-model="email" 
          required
        />
      </div>
      
      <button
        type="submit"
        class="button primary"
        :disabled="loading"
      >
        {{ loading ? 'Processing...' : 'Send Magic Link' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.error-message {
  padding: 0.75rem;
  background-color: #fee2e2;
  color: #b91c1c;
  border-radius: 0.375rem;
}

.success-message {
  padding: 0.75rem;
  background-color: #d1fae5;
  color: #065f46;
  border-radius: 0.375rem;
}
</style>