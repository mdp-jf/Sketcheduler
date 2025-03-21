<template>
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-bold mb-4">Exercise Progress</h2>
      
      <!-- Exercise completion summary -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-blue-50 p-4 rounded-lg">
          <div class="text-3xl font-bold text-blue-600">
            {{ completedExercisesCount }}
          </div>
          <div class="text-sm text-gray-600">Exercises Completed</div>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <div class="text-3xl font-bold text-green-600">
            {{ exerciseCompletionPercentage }}%
          </div>
          <div class="text-sm text-gray-600">Completion Rate</div>
        </div>
        <div class="bg-purple-50 p-4 rounded-lg">
          <div class="text-3xl font-bold text-purple-600">
            {{ averageRating ? averageRating.toFixed(1) : 'N/A' }}
          </div>
          <div class="text-sm text-gray-600">Avg. Self Rating</div>
        </div>
      </div>
  
      <!-- Exercise streak -->
      <div v-if="currentStreak > 0" class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-lg font-semibold">Current Streak</h3>
          <span class="text-sm text-gray-600">Best: {{ bestStreak }} days</span>
        </div>
        <div class="flex items-center">
          <div class="bg-orange-100 text-orange-600 p-3 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
          </div>
          <div>
            <div class="text-lg font-bold">{{ currentStreak }} days</div>
            <div class="text-sm text-gray-600">Keep it going!</div>
          </div>
        </div>
      </div>
  
      <!-- Recent exercises -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-3">Recent Exercises</h3>
        <div v-if="recentExercises.length === 0" class="text-gray-500 italic">
          No completed exercises yet
        </div>
        <div v-else class="space-y-3">
          <div v-for="exercise in recentExercises" :key="exercise.id" class="border rounded-lg p-3">
            <div class="flex justify-between items-start">
              <div>
                <div class="font-medium">{{ exercise.title }}</div>
                <div class="text-sm text-gray-600">{{ formatDate(exercise.completed_at) }}</div>
              </div>
              <div v-if="exercise.self_rating" class="flex items-center">
                <span class="text-yellow-500 mr-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </span>
                <span>{{ exercise.self_rating }}/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Exercise by category -->
      <div>
        <h3 class="text-lg font-semibold mb-3">Exercises by Category</h3>
        <div v-if="categoryCounts.length === 0" class="text-gray-500 italic">
          No categories to display
        </div>
        <div v-else class="space-y-3">
          <div v-for="category in categoryCounts" :key="category.name" class="border rounded-lg p-3">
            <div class="flex justify-between mb-1">
              <span class="font-medium">{{ category.name }}</span>
              <span class="text-sm">{{ category.completed }} / {{ category.total }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                class="bg-indigo-600 h-2.5 rounded-full" 
                :style="`width: ${Math.min(100, (category.completed / category.total) * 100)}%`"
              ></div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- View all exercises button -->
      <div class="mt-6 text-center">
        <button 
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="$emit('view-all')"
        >
          View All Exercises
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits, computed } from 'vue';
  import type { Exercise, UserExerciseProgress } from '../../types/models';
  
  // Define props
  interface CategoryCount {
    name: string;
    completed: number;
    total: number;
  }
  
  interface ExerciseProgressProps {
    recentExercises: UserExerciseProgress[];
    totalExercises: number;
    completedExercises: UserExerciseProgress[];
    categoryCounts: CategoryCount[];
    currentStreak: number;
    bestStreak: number;
  }
  
  const props = defineProps<ExerciseProgressProps>();
  
  // Define emits
  defineEmits<{
    (e: 'view-all'): void;
  }>();
  
  // Computed properties
  const completedExercisesCount = computed(() => props.completedExercises.length);
  
  const exerciseCompletionPercentage = computed(() => {
    if (props.totalExercises === 0) return 0;
    return Math.round((props.completedExercises.length / props.totalExercises) * 100);
  });
  
  const averageRating = computed(() => {
    const exercisesWithRating = props.completedExercises.filter(
      exercise => exercise.self_rating !== null && exercise.self_rating !== undefined
    );
    
    if (exercisesWithRating.length === 0) return null;
    
    const sum = exercisesWithRating.reduce(
      (total, exercise) => total + (exercise.self_rating || 0), 
      0
    );
    
    return sum / exercisesWithRating.length;
  });
  
  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  </script>