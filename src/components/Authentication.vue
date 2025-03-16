<template>
  <div class="auth-container" v-if="!isAuthenticated">
    <h2>Drawing Tracker Login</h2>
    <div class="input-group">
      <label for="password">Password:</label>
      <input 
        type="password" 
        id="password" 
        v-model="password" 
        @keyup.enter="login"
      />
    </div>
    <button @click="login" :disabled="!password">Login</button>
    <p class="error-message" v-if="showError">Incorrect password</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import CryptoJS from 'crypto-js';

// Use a simple password hash for authentication
// In a production app, you'd use a proper backend auth system
const HASH = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'; // Hash for "password123"
const password = ref('');
const showError = ref(false);
const isAuthenticated = ref(false);

// Define emit for login event
const emit = defineEmits(['login']);

// Check if previously authenticated
const checkAuth = () => {
  const storedAuth = localStorage.getItem('drawingTrackerAuth');
  if (storedAuth === 'true') {
    isAuthenticated.value = true;
    // Emit login event to parent
    emit('login');
  }
};

// Run on component load
checkAuth();

// Login function
const login = () => {
  // Create a SHA-256 hash of the entered password
  const hashedPassword = CryptoJS.SHA256(password.value).toString();
  
  if (hashedPassword === HASH) {
    isAuthenticated.value = true;
    localStorage.setItem('drawingTrackerAuth', 'true');
    showError.value = false;
    
    // Emit login event to parent
    emit('login');
  } else {
    showError.value = true;
    setTimeout(() => {
      showError.value = false;
    }, 3000);
  }
  
  // Clear password field
  password.value = '';
};

// Expose to parent component
defineExpose({ isAuthenticated });
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.input-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #2980b9;
}

button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  margin-top: 1rem;
  text-align: center;
}
</style>