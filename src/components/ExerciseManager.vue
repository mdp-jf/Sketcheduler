<template>
    <div class="manager-container">
      <h2>Warm-up Exercises</h2>
      
      <!-- Add new exercise form -->
      <div class="form-container">
        <div class="input-group">
          <label for="newExercise">Add completed exercise to warm-up pool:</label>
          <input
            type="text"
            id="newExercise"
            v-model="newExercise"
            placeholder="e.g., Lesson 1 - Lines Exercise"
            @keyup.enter="addExercise"
          />
        </div>
        <button @click="addExercise" :disabled="!newExercise.trim()">Add Exercise</button>
      </div>
      
      <!-- Get random warm-up -->
      <div class="action-container">
        <button class="action-button" @click="getRandomExercise" :disabled="!exercises.length">
          Get Warm-up Exercise
        </button>
        <div v-if="currentExercise" class="result-card">
          <h3>Your warm-up:</h3>
          <p>{{ currentExercise }}</p>
        </div>
      </div>
      
      <!-- Exercise list -->
      <div class="list-container" v-if="exercises.length">
        <h3>Your Warm-up Pool ({{ exercises.length }})</h3>
        <ul class="exercise-list">
          <li v-for="(exercise, index) in exercises" :key="index" class="exercise-item">
            <span>{{ exercise }}</span>
            <button class="delete-btn" @click="removeExercise(index)">×</button>
          </li>
        </ul>
      </div>
      <div v-else class="empty-message">
        <p>No warm-up exercises added yet.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useLocalStorage } from '../composables/useLocalStorage';
  
  // Load exercises from localStorage
  const exercises = useLocalStorage('drawingTrackerExercises', []);
  const newExercise = ref('');
  const currentExercise = ref('');
  
  // Add new exercise to the list
  const addExercise = () => {
    if (newExercise.value.trim()) {
      exercises.value.push(newExercise.value.trim());
      newExercise.value = '';
    }
  };
  
  // Remove exercise from the list
  const removeExercise = (index) => {
    exercises.value.splice(index, 1);
  };
  
  // Get a random exercise from the pool
  const getRandomExercise = () => {
    if (exercises.value.length > 0) {
      const randomIndex = Math.floor(Math.random() * exercises.value.length);
      currentExercise.value = exercises.value[randomIndex];
      
      // Increment exercise counter in localStorage
      incrementCounter('exerciseCount');
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
    background-color: #27ae60;
  }
  
  .action-button:hover {
    background-color: #219955;
  }
  
  .result-card {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #f5f7fa;
    border-radius: 6px;
    border-left: 4px solid #27ae60;
  }
  
  .list-container {
    margin-top: 2rem;
  }
  
  .exercise-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .exercise-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    border-bottom: 1px solid #eee;
  }
  
  .exercise-item:last-child {
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