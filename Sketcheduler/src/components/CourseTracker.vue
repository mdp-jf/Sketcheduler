<template>
    <div class="course-tracker">
      <h2>Challenge Progress Tracker</h2>
      
      <!-- Challenge selector -->
      <div class="form-container">
        <div class="input-group">
          <label for="challengeSelect">Current Challenge:</label>
          <select id="challengeSelect" v-model="selectedChallenge" @change="updateChallenge">
            <option v-for="(challenge, index) in availableChallenges" :key="index" :value="challenge">
              {{ challenge.name }}
            </option>
            <option value="custom">+ Add Custom Challenge</option>
          </select>
        </div>
        
        <!-- Custom challenge form -->
        <div v-if="showCustomForm" class="custom-challenge-form">
          <div class="input-group">
            <label for="challengeName">Challenge Name:</label>
            <input type="text" id="challengeName" v-model="customChallenge.name" placeholder="e.g., 25 Wheel Challenge" />
          </div>
          <div class="input-group">
            <label for="challengeTotal">Total Items:</label>
            <input type="number" id="challengeTotal" v-model="customChallenge.total" min="1" />
          </div>
          <button @click="addCustomChallenge" :disabled="!isCustomChallengeValid">Add Challenge</button>
        </div>
      </div>
      
      <!-- Current challenge progress -->
      <div class="challenge-container" v-if="currentChallenge.name">
        <h3>{{ currentChallenge.name }}</h3>
        
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
          <div class="progress-text">
            {{ currentChallenge.completed }} / {{ currentChallenge.total }}
            ({{ progressPercentage }}%)
          </div>
        </div>
        
        <div class="actions">
          <button class="increment-btn" @click="incrementCompleted(1)">+1</button>
          <button class="increment-btn" @click="incrementCompleted(5)">+5</button>
          <button class="increment-btn" @click="incrementCompleted(10)">+10</button>
          <button class="decrement-btn" @click="decrementCompleted" :disabled="currentChallenge.completed <= 0">-1</button>
        </div>
      </div>
      
      <!-- No challenge selected message -->
      <div v-else class="empty-message">
        <p>No challenge selected. Choose a challenge from the dropdown or create a custom one.</p>
      </div>
      
      <!-- Challenge management -->
      <div class="challenge-management" v-if="userChallenges.length > 0">
        <h3>Your Custom Challenges</h3>
        <ul class="challenge-list">
          <li v-for="(challenge, index) in userChallenges" :key="index" class="challenge-item">
            <div class="challenge-info">
              <span class="challenge-name">{{ challenge.name }}</span>
              <span class="challenge-progress">{{ challenge.completed }}/{{ challenge.total }}</span>
            </div>
            <button class="delete-btn" @click="removeChallenge(index)">×</button>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue';
  import { useLocalStorage } from '../composables/useLocalStorage';
  
  // Default challenges
  const defaultChallenges = [
    { name: '250 Box Challenge', total: 250, completed: 0 },
    { name: '250 Cylinder Challenge', total: 250, completed: 0 },
    { name: '100 Treasure Chest Challenge', total: 100, completed: 0 },
  ];
  
  // Custom user challenges
  const userChallenges = useLocalStorage('drawingTrackerUserChallenges', []);
  
  // Current challenge
  const currentChallenge = useLocalStorage('drawingTrackerCurrentChallenge', { name: '', total: 0, completed: 0 });
  
  // UI state
  const selectedChallenge = ref(null);
  const showCustomForm = ref(false);
  const customChallenge = ref({ name: '', total: 100, completed: 0 });
  
  // Compute all available challenges (default + user)
  const availableChallenges = computed(() => {
    return [...defaultChallenges, ...userChallenges.value];
  });
  
  // Compute progress percentage
  const progressPercentage = computed(() => {
    if (!currentChallenge.value.total) return 0;
    const percentage = (currentChallenge.value.completed / currentChallenge.value.total) * 100;
    return Math.min(Math.round(percentage), 100);
  });
  
  // Validate custom challenge
  const isCustomChallengeValid = computed(() => {
    return customChallenge.value.name.trim() !== '' && 
           customChallenge.value.total > 0;
  });
  
  // Update selected challenge
  const updateChallenge = () => {
    if (selectedChallenge.value === 'custom') {
      showCustomForm.value = true;
      return;
    }
    
    showCustomForm.value = false;
    currentChallenge.value = { ...selectedChallenge.value };
    
    // Update localStorage overall progress
    updateOverallProgress();
  };
  
  // Add custom challenge
  const addCustomChallenge = () => {
    if (isCustomChallengeValid.value) {
      const newChallenge = { ...customChallenge.value };
      userChallenges.value.push(newChallenge);
      currentChallenge.value = newChallenge;
      showCustomForm.value = false;
      customChallenge.value = { name: '', total: 100, completed: 0 };
      
      // Update overall progress
      updateOverallProgress();
    }
  };
  
  // Remove custom challenge
  const removeChallenge = (index) => {
    // If the challenge being removed is the current challenge, reset current challenge
    if (currentChallenge.value.name === userChallenges.value[index].name) {
      currentChallenge.value = { name: '', total: 0, completed: 0 };
    }
    
    userChallenges.value.splice(index, 1);
  };
  
  // Increment completed items
  const incrementCompleted = (amount) => {
    const newValue = currentChallenge.value.completed + amount;
    currentChallenge.value.completed = Math.min(newValue, currentChallenge.value.total);
    
    // Update the challenge in the userChallenges array if it exists there
    const challengeIndex = userChallenges.value.findIndex(c => c.name === currentChallenge.value.name);
    if (challengeIndex !== -1) {
      userChallenges.value[challengeIndex].completed = currentChallenge.value.completed;
    }
    
    // Update overall progress
    updateOverallProgress();
  };
  
  // Decrement completed items
  const decrementCompleted = () => {
    if (currentChallenge.value.completed > 0) {
      currentChallenge.value.completed--;
      
      // Update the challenge in the userChallenges array if it exists there
      const challengeIndex = userChallenges.value.findIndex(c => c.name === currentChallenge.value.name);
      if (challengeIndex !== -1) {
        userChallenges.value[challengeIndex].completed = currentChallenge.value.completed;
      }
      
      // Update overall progress
      updateOverallProgress();
    }
  };
  
  // Update overall progress in localStorage
  const updateOverallProgress = () => {
    try {
      // Get current lesson based on challenge name (simplified example)
      let currentLesson = "Unknown";
      if (currentChallenge.value.name.includes("Box")) {
        currentLesson = "Lesson 1";
      } else if (currentChallenge.value.name.includes("Cylinder")) {
        currentLesson = "Lesson 2";
      } else if (currentChallenge.value.name.includes("Treasure")) {
        currentLesson = "Lesson 3";
      }
      
      localStorage.setItem('drawingTrackerCurrentLesson', currentLesson);
    } catch (error) {
      console.error('Error updating overall progress:', error);
    }
  };
  
  // Initialize the component
  watch(
    () => availableChallenges.value,
    () => {
      // If there's a current challenge, select it in the dropdown
      if (currentChallenge.value.name) {
        selectedChallenge.value = availableChallenges.value.find(
          c => c.name === currentChallenge.value.name
        ) || null;
      }
    },
    { immediate: true }
  );
  </script>
  
  <style scoped>
  .course-tracker {
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
  
  .input-group input, .input-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .custom-challenge-form {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 6px;
    border: 1px solid #eee;
  }
  
  .challenge-container {
    margin-top: 1.5rem;
  }
  
  .progress-container {
    margin: 1rem 0;
  }
  
  .progress-bar {
    height: 20px;
    background-color: #ecf0f1;
    border-radius: 10px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background-color: #3498db;
    transition: width 0.3s ease;
  }
  
  .progress-text {
    margin-top: 0.5rem;
    text-align: center;
    font-weight: 600;
  }
  
  .actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .increment-btn, .decrement-btn {
    flex: 1;
    padding: 0.5rem;
  }
  
  .increment-btn {
    background-color: #2ecc71;
  }
  
  .increment-btn:hover {
    background-color: #27ae60;
  }
  
  .decrement-btn {
    background-color: #e74c3c;
  }
  
  .decrement-btn:hover {
    background-color: #c0392b;
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
  
  .challenge-management {
    margin-top: 2rem;
    border-top: 1px solid #eee;
    padding-top: 1rem;
  }
  
  .challenge-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .challenge-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    border-bottom: 1px solid #eee;
  }
  
  .challenge-item:last-child {
    border-bottom: none;
  }
  
  .challenge-info {
    display: flex;
    flex-direction: column;
  }
  
  .challenge-name {
    font-weight: 500;
  }
  
  .challenge-progress {
    font-size: 0.875rem;
    color: #7f8c8d;
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