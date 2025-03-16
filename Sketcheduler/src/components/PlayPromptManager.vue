<template>
    <div class="manager-container">
      <h2>50% Rule Drawing Prompts</h2>
      
      <!-- Add new prompt form -->
      <div class="form-container">
        <div class="input-group">
          <label for="newPrompt">Add idea for fun drawing time:</label>
          <input
            type="text"
            id="newPrompt"
            v-model="newPrompt"
            placeholder="e.g., Draw your favorite animal"
            @keyup.enter="addPrompt"
          />
        </div>
        <button @click="addPrompt" :disabled="!newPrompt.trim()">Add Prompt</button>
      </div>
      
      <!-- Get random prompt -->
      <div class="action-container">
        <button class="action-button" @click="getRandomPrompt" :disabled="!prompts.length">
          Get Play Drawing Prompt
        </button>
        <div v-if="currentPrompt" class="result-card">
          <h3>Your play prompt:</h3>
          <p>{{ currentPrompt }}</p>
        </div>
      </div>
      
      <!-- Prompt list -->
      <div class="list-container" v-if="prompts.length">
        <h3>Your Drawing Prompts ({{ prompts.length }})</h3>
        <ul class="prompt-list">
          <li v-for="(prompt, index) in prompts" :key="index" class="prompt-item">
            <span>{{ prompt }}</span>
            <button class="delete-btn" @click="removePrompt(index)">×</button>
          </li>
        </ul>
      </div>
      <div v-else class="empty-message">
        <p>No drawing prompts added yet.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useLocalStorage } from '../composables/useLocalStorage';
  
  // Load prompts from localStorage
  const prompts = useLocalStorage('drawingTrackerPrompts', []);
  const newPrompt = ref('');
  const currentPrompt = ref('');
  
  // Add new prompt to the list
  const addPrompt = () => {
    if (newPrompt.value.trim()) {
      prompts.value.push(newPrompt.value.trim());
      newPrompt.value = '';
    }
  };
  
  // Remove prompt from the list
  const removePrompt = (index) => {
    prompts.value.splice(index, 1);
  };
  
  // Get a random prompt from the pool
  const getRandomPrompt = () => {
    if (prompts.value.length > 0) {
      const randomIndex = Math.floor(Math.random() * prompts.value.length);
      currentPrompt.value = prompts.value[randomIndex];
      
      // Increment play counter in localStorage
      incrementCounter('playCount');
    }
  };
  
  // Helper function to increment counters
  const incrementCounter = (counterName) => {
    try {
      let count = parseInt(localStorage.getItem(counterName)) || 0;
      count++;
      localStorage.setItem(counterName, count.toString());
    } catch (error) {
      console.error(`Error updating ${counterName}:`, error);
    }
  };
  </script>
  
  <style scoped>
  .manager-container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .form-container {
    margin-bottom: 1.5rem;
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
    padding: 0.75rem 1rem;
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
  
  .action-container {
    margin: 1.5rem 0;
  }
  
  .action-button {
    width: 100%;
    padding: 1rem;
    font-size: 1.1rem;
    background-color: #9b59b6;
  }
  
  .action-button:hover {
    background-color: #8e44ad;
  }
  
  .result-card {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #f5f7fa;
    border-radius: 6px;
    border-left: 4px solid #9b59b6;
  }
  
  .list-container {
    margin-top: 2rem;
  }
  
  .prompt-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .prompt-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    border-bottom: 1px solid #eee;
  }
  
  .prompt-item:last-child {
    border-bottom: none;
  }
  
  .delete-btn {
    background: none;
    color: #e74c3c;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0 0.5rem;
  }
  
  .delete-btn:hover {
    color: #c0392b;
  }
  
  .empty-message {
    padding: 1rem;
    text-align: center;
    color: #7f8c8d;
  }
  </style>