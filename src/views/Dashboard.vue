<template>
  <div class="dashboard">
    <!-- Header and Tabs (keep the same) -->
    <div class="tabs flex border-b mb-6">
      <button 
        @click="activeTab = 'lessons'" 
        :class="[
          'px-4 py-2 font-medium',
          activeTab === 'lessons' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'
        ]"
      >
        Lessons
      </button>
      <!-- Other tabs remain the same -->
    </div>

    <!-- Loading state -->
    <div v-if="lessonsStore.loading" class="flex justify-center p-8">
      Loading your content...
    </div>

    <!-- Lessons Tab -->
    <div v-else-if="activeTab === 'lessons'" class="lessons-container">
      <div class="flex justify-between mb-6">
        <h2 class="text-xl font-bold">Lessons</h2>
        <button 
          @click="showAddLesson = !showAddLesson" 
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {{ showAddLesson ? 'Cancel' : 'Add New Lesson' }}
        </button>
      </div>
      
      <!-- Debug info -->
      <div class="mb-4 p-2 bg-gray-100 rounded">
        <p>Loading: {{ lessonsStore.loading }}</p>
        <p>Lessons count: {{ lessonsStore.lessons.length }}</p>
      </div>
      
      <!-- Add Lesson Form -->
      <AddLesson 
        v-if="showAddLesson" 
        @cancel="showAddLesson = false"
        @lesson-added="handleLessonAdded"
      />
      
      <!-- Lessons List -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-if="lessonsStore.lessons.length === 0" class="col-span-full text-center py-8">
          No lessons available yet.
        </div>
        <div 
          v-for="lesson in lessonsStore.lessons" 
          :key="lesson.id" 
          class="bg-white p-4 rounded-lg shadow"
        >
          <h3 class="font-bold text-lg mb-2">{{ lesson.title }}</h3>
          <p class="text-gray-600 mb-3">{{ lesson.description }}</p>
          <button 
            @click="navigateToLesson(lesson.id)" 
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View Lesson
          </button>
        </div>
      </div>
    </div>
  
      <!-- Challenges Tab -->
      <div v-else-if="activeTab === 'challenges'" class="challenges-container">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-if="challenges.length === 0" class="col-span-full text-center py-8">
            No challenges available yet.
          </div>
          <div 
            v-for="challenge in challenges" 
            :key="challenge.id" 
            class="bg-white p-4 rounded-lg shadow"
          >
            <h3 class="font-bold text-lg mb-2">{{ challenge.title }}</h3>
            <p class="text-gray-600 mb-2">{{ challenge.description }}</p>
            <div class="flex justify-between items-center mt-4">
              <span class="text-sm">Target: {{ challenge.target_count }}</span>
              <button class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                View Challenge
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Drawings Tab -->
      <div v-else-if="activeTab === 'drawings'" class="drawings-container">
        <div class="flex justify-between mb-6">
          <h2 class="text-xl font-bold">My Drawings</h2>
          <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            New Drawing
          </button>
        </div>
        
        <div v-if="drawings.length === 0" class="text-center py-8">
          You haven't created any drawings yet.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="drawing in drawings" 
            :key="drawing.id" 
            class="bg-white p-4 rounded-lg shadow"
          >
            <div v-if="drawing.image_url" class="bg-gray-100 h-48 mb-3 flex items-center justify-center">
              <img :src="drawing.image_url" alt="Drawing" class="max-h-full max-w-full object-contain" />
            </div>
            <div v-else class="bg-gray-100 h-48 mb-3 flex items-center justify-center">
              <span class="text-gray-400">Image Preview</span>
            </div>
            <p class="text-sm text-gray-600 mb-1">
              {{ drawing.drawing_prompts?.prompt_text || "Free Drawing" }}
            </p>
            <p class="text-xs text-gray-500">
              {{ formatDate(drawing.created_at) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLessonsStore } from '../stores/lessons'
import AddLesson from '../components/AddLesson.vue'

// State
const activeTab = ref('lessons')
const showAddLesson = ref(false)
const router = useRouter()

// Store
const lessonsStore = useLessonsStore()

// Fetch data on component mount
onMounted(async () => {
  console.log("Dashboard mounted, fetching data...")
  
  try {
    // Fetch lessons
    const result = await lessonsStore.fetchLessons()
    console.log("Lessons loaded:", lessonsStore.lessons.length)
    
    // For now, we'll keep using the original services for challenges and drawings
    // We'll implement those stores in subsequent steps
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
})

// Handle new lesson added
const handleLessonAdded = (newLesson) => {
  // Hide the add lesson form
  showAddLesson.value = false
}

// Navigate to lesson detail
const navigateToLesson = (lessonId) => {
  router.push(`/lessons/${lessonId}`)
}

// Format date helper
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}
</script>
  
  <style scoped>
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }
  </style>