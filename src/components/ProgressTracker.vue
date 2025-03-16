<template>
    <div class="progress-tracker">
      <h2>Overall Progress</h2>
      
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-icon course-icon">📚</div>
          <div class="stat-info">
            <h3>Current Lesson</h3>
            <p class="stat-value">{{ currentLesson }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon exercise-icon">🏋️</div>
          <div class="stat-info">
            <h3>Exercises Done</h3>
            <p class="stat-value">{{ exerciseCount }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon play-icon">🎨</div>
          <div class="stat-info">
            <h3>Play Sessions</h3>
            <p class="stat-value">{{ playCount }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon balance-icon">⚖️</div>
          <div class="stat-info">
            <h3>50% Rule Balance</h3>
            <p class="stat-value" :class="balanceClass">{{ balancePercentage }}%</p>
            <p class="stat-detail">{{ balanceMessage }}</p>
          </div>
        </div>
      </div>
      
      <div class="progress-actions">
        <button @click="resetStats" class="reset-btn">Reset Statistics</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  
  // Stats
  const currentLesson = ref('Not started');
  const exerciseCount = ref(0);
  const playCount = ref(0);
  
  // Refresh interval for real-time updates
  let refreshInterval;
  
  // Update stats from localStorage
  const updateStats = () => {
    currentLesson.value = localStorage.getItem('drawingTrackerCurrentLesson') || 'Not started';
    exerciseCount.value = parseInt(localStorage.getItem('exerciseCount')) || 0;
    playCount.value = parseInt(localStorage.getItem('playCount')) || 0;
  };
  
  // Compute 50% rule balance
  const balancePercentage = computed(() => {
    if (exerciseCount.value === 0 && playCount.value === 0) return 50;
    
    const total = exerciseCount.value + playCount.value;
    return Math.round((playCount.value / total) * 100);
  });
  
  // Determine balance message and class
  const balanceMessage = computed(() => {
    if (exerciseCount.value === 0 && playCount.value === 0) {
      return 'No data yet';
    }
    
    const diff = Math.abs(balancePercentage.value - 50);
    
    if (diff <= 5) {
      return 'Perfect balance!';
    } else if (balancePercentage.value < 50) {
      return `Need ${diff}% more play time`;
    } else {
      return `Need ${diff}% more coursework`;
    }
  });
  
  const balanceClass = computed(() => {
    const diff = Math.abs(balancePercentage.value - 50);
    
    if (diff <= 5) {
      return 'balance-good';
    } else if (diff <= 15) {
      return 'balance-okay';
    } else {
      return 'balance-bad';
    }
  });
  
  // Reset all stats
  const resetStats = () => {
    if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
      localStorage.setItem('exerciseCount', '0');
      localStorage.setItem('playCount', '0');
      updateStats();
    }
  };
  
  // Setup component
  onMounted(() => {
    updateStats();
    
    // Refresh stats every 2 seconds to keep UI in sync with other components
    refreshInterval = setInterval(updateStats, 2000);
  });
  
  // Cleanup
  onUnmounted(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
  });
  </script>
  
  <style scoped>
  .progress-tracker {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 1rem;
    margin: 1.5rem 0;
  }
  
  .stat-card {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 1.25rem;
    display: flex;
    align-items: center;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .stat-icon {
    font-size: 2rem;
    margin-right: 1rem;
  }
  
  .stat-info {
    flex: 1;
  }
  
  .stat-info h3 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    color: #7f8c8d;
  }
  
  .stat-value {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }
  
  .stat-detail {
    font-size: 0.875rem;
    margin: 0.25rem 0 0;
    color: #7f8c8d;
  }
  
  .course-icon {
    color: #3498db;
  }
  
  .exercise-icon {
    color: #27ae60;
  }
  
  .play-icon {
    color: #9b59b6;
  }
  
  .balance-icon {
    color: #f39c12;
  }
  
  .balance-good {
    color: #27ae60;
  }
  
  .balance-okay {
    color: #f39c12;
  }
  
  .balance-bad {
    color: #e74c3c;
  }
  
  .progress-actions {
    margin-top: 1.5rem;
    display: flex;
    justify-content: flex-end;
  }
  
  .reset-btn {
    background-color: #95a5a6;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .reset-btn:hover {
    background-color: #7f8c8d;
  }
  </style>