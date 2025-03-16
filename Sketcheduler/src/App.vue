<template>
  <div class="app-container">
    <Authentication v-if="!isAuthenticated" @login="handleLogin" />
    
    <div v-if="isAuthenticated" class="app-content">
      <header class="app-header">
        <h1>Drawing Tracker</h1>
        <div class="user-actions">
          <button class="logout-btn" @click="handleLogout">Logout</button>
        </div>
      </header>
      
      <main>
        <ProgressTracker />
        
        <div class="trackers-container">
          <CourseTracker />
        </div>
        
        <div class="drawing-actions">
          <div class="section">
            <ExerciseManager />
          </div>
          <div class="section">
            <PlayPromptManager />
          </div>
        </div>
      </main>
      
      <footer class="app-footer">
        <p>Draw a Box Tracker - Created with Vue.js</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Authentication from './components/Authentication.vue';
import ProgressTracker from './components/ProgressTracker.vue';
import CourseTracker from './components/CourseTracker.vue';
import ExerciseManager from './components/ExerciseManager.vue';
import PlayPromptManager from './components/PlayPromptManager.vue';

const isAuthenticated = ref(false);

// Handle login
const handleLogin = () => {
  console.log('Login event received in App.vue');
  isAuthenticated.value = true;
};

// Handle logout
const handleLogout = () => {
  localStorage.removeItem('drawingTrackerAuth');
  isAuthenticated.value = false;
};

// Check auth on mount
onMounted(() => {
  const storedAuth = localStorage.getItem('drawingTrackerAuth');
  if (storedAuth === 'true') {
    isAuthenticated.value = true;
  }
});
</script>

<style>
/* Global styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: #f5f7fa;
  color: #2c3e50;
  line-height: 1.6;
}

h1, h2, h3 {
  font-weight: 600;
  margin-bottom: 1rem;
}

h1 {
  font-size: 2rem;
}

h2 {
  font-size: 1.5rem;
}

h3 {
  font-size: 1.25rem;
}

/* Component specific styles */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 2rem;
}

main {
  flex: 1;
}

.trackers-container {
  margin-bottom: 2rem;
}

.drawing-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.section {
  display: flex;
  flex-direction: column;
}

.app-footer {
  margin-top: 2rem;
  padding: 1.5rem 0;
  border-top: 1px solid #eee;
  text-align: center;
  color: #7f8c8d;
  font-size: 0.875rem;
}

.logout-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #c0392b;
}

@media (max-width: 768px) {
  .drawing-actions {
    grid-template-columns: 1fr;
  }
}
</style>