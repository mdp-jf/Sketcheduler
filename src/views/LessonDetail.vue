<template>
    <div class="lesson-detail">
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center p-8">
        Loading lesson details...
      </div>
      
      <div v-else-if="!lesson" class="text-center py-8">
        Lesson not found.
      </div>
      
      <div v-else>
        <!-- Lesson header -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-2">
            <h1 class="text-3xl font-bold">{{ lesson.title }}</h1>
            <button 
              @click="$router.push('/dashboard')" 
              class="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
            >
              Back to Dashboard
            </button>
          </div>
          <p class="text-gray-600">{{ lesson.description }}</p>
        </div>
        
        <!-- Exercises section -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">Exercises</h2>
            <button 
              @click="showAddExercise = !showAddExercise" 
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {{ showAddExercise ? 'Cancel' : 'Add Exercise' }}
            </button>
          </div>
          
          <!-- Add Exercise Form -->
          <AddExercise 
            v-if="showAddExercise" 
            :lessonId="Number(lesson.id)"
            @cancel="showAddExercise = false"
            @exercise-added="handleExerciseAdded"
          />
          
          <!-- Exercise List -->
          <div v-else>
            <div v-if="exercises.length === 0" class="text-center py-8 bg-gray-50 rounded">
              No exercises have been added to this lesson yet.
            </div>
            
            <div v-else class="divide-y">
              <div 
                v-for="exercise in exercises" 
                :key="exercise.id"
                class="py-4 first:pt-0 last:pb-0"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="font-medium text-lg">{{ exercise.title }}</h3>
                    <p class="text-gray-600 mt-1">{{ exercise.description }}</p>
                    <div class="mt-2 flex items-center">
                      <span class="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded mr-2">
                        Order: {{ exercise.order_number }}
                      </span>
                      <span 
                        v-if="exercise.is_warmup_eligible" 
                        class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                      >
                        Warmup eligible
                      </span>
                    </div>
                  </div>
                  <button class="text-blue-500 hover:underline">Start Exercise</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { lessonServices, exerciseServices } from '../lib/supabaseServices'
  import AddExercise from '../components/AddExercise.vue'
  
  // Types
  interface Lesson {
    id: number
    title: string
    description: string
    order_number: number
    created_at: string
  }
  
  interface Exercise {
    id: number
    lesson_id: number
    title: string
    description: string
    order_number: number
    is_warmup_eligible: boolean
    created_at: string
  }
  
  // Router and route
  const route = useRoute()
  const router = useRouter()
  
  // State
  const lesson = ref<Lesson | null>(null)
  const exercises = ref<Exercise[]>([])
  const loading = ref(true)
  const showAddExercise = ref(false)
  
  // Fetch lesson data
  onMounted(async () => {
    try {
      loading.value = true
      
      const lessonId = Number(route.params.id)
      
      if (isNaN(lessonId)) {
        router.push('/dashboard')
        return
      }
      
      // Fetch lesson details
      const lessonData = await lessonServices.getLessonById(lessonId)
      lesson.value = lessonData
      
      // Fetch exercises for this lesson
      const exercisesData = await exerciseServices.getExercisesByLessonId(lessonId)
      exercises.value = exercisesData
    } catch (error) {
      console.error('Error fetching lesson details:', error)
    } finally {
      loading.value = false
    }
  })
  
  // Handle adding a new exercise
  const handleExerciseAdded = (newExercise: Exercise) => {
    exercises.value.push(newExercise)
    
    // Sort exercises by order number
    exercises.value.sort((a, b) => a.order_number - b.order_number)
    
    // Hide the add exercise form
    showAddExercise.value = false
  }
  </script>
  
  <style scoped>
  .lesson-detail {
    max-width: 900px;
    margin: 0 auto;
    padding: 1rem;
  }
  </style>