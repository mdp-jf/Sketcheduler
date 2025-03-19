<template>
  <div class="dashboard">
    <!-- Header and Tabs -->
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
      <button 
        @click="activeTab = 'challenges'" 
        :class="[
          'px-4 py-2 font-medium',
          activeTab === 'challenges' ? 'border-b-2 border-purple-500 text-purple-500' : 'text-gray-600'
        ]"
      >
        Challenges
      </button>
      <button 
        @click="activeTab = 'drawings'" 
        :class="[
          'px-4 py-2 font-medium',
          activeTab === 'drawings' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-600'
        ]"
      >
        My Drawings
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="lessonsStore.loading || challengesStore.loading || drawingsStore.loading" class="flex justify-center p-8">
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
      <!-- Debug info -->
      <div class="mb-4 p-2 bg-gray-100 rounded">
        <p>Challenges loading: {{ challengesStore.loading }}</p>
        <p>Challenges count: {{ challengesStore.challenges.length }}</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-if="challengesStore.challenges.length === 0" class="col-span-full text-center py-8">
          No challenges available yet.
        </div>
        <div 
          v-for="challenge in challengesStore.challenges" 
          :key="challenge.id" 
          class="bg-white p-4 rounded-lg shadow"
        >
          <h3 class="font-bold text-lg mb-2">{{ challenge.title }}</h3>
          <p class="text-gray-600 mb-2">{{ challenge.description }}</p>
          <div class="flex justify-between items-center mt-4">
            <span class="text-sm">Target: {{ challenge.target_count }}</span>
            <button 
              @click="navigateToChallenge(challenge.id)" 
              class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              View Challenge
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Drawings Tab -->
    <div v-else-if="activeTab === 'drawings'" class="drawings-container">
      <!-- Debug info -->
      <div class="mb-4 p-2 bg-gray-100 rounded">
        <p>Drawings loading: {{ drawingsStore.loading }}</p>
        <p>Drawings count: {{ drawingsStore.drawings.length }}</p>
      </div>
      
      <div class="flex justify-between mb-6">
        <h2 class="text-xl font-bold">My Drawings</h2>
        <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          New Drawing
        </button>
      </div>
      
      <div v-if="drawingsStore.drawings.length === 0" class="text-center py-8">
        You haven't created any drawings yet.
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="drawing in drawingsStore.drawings" 
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
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useLessonsStore } from '../stores/lessons'
  import { useChallengesStore } from '../stores/challenges'
  import { useDrawingsStore } from '../stores/drawings'
  import AddLesson from '../components/AddLesson.vue'
  
  // State
  const activeTab = ref('lessons')
  const showAddLesson = ref(false)
  const router = useRouter()
  
  // Stores
  const lessonsStore = useLessonsStore()
  const challengesStore = useChallengesStore()
  const drawingsStore = useDrawingsStore()
  
  // Fetch data on component mount
  onMounted(async () => {
    console.log("Dashboard mounted, fetching data...")
    
    try {
      // Fetch lessons
      const lessonsResult = await lessonsStore.fetchLessons()
      console.log("Lessons loaded:", lessonsStore.lessons.length)
      
      // Fetch challenges
      const challengesResult = await challengesStore.fetchChallenges()
      console.log("Challenges loaded:", challengesStore.challenges.length)
      
      // Fetch user drawings
      const drawingsResult = await drawingsStore.fetchUserDrawings()
      console.log("Drawings loaded:", drawingsStore.drawings.length)
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
  
  // Navigate to challenge detail
  const navigateToChallenge = (challengeId) => {
    router.push(`/challenges/${challengeId}`)
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