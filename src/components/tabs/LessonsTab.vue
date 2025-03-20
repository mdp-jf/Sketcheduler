<template>
  <div class="lessons-container">
    <div class="flex justify-between mb-6">
      <h2 class="text-xl font-bold">Lessons</h2>
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        @click="showAddLesson = !showAddLesson"
      >
        {{ showAddLesson ? "Cancel" : "Add New Lesson" }}
      </button>
    </div>

    <!-- Add Lesson Form -->
    <AddLesson
      v-if="showAddLesson"
      @cancel="showAddLesson = false"
      @lesson-added="handleLessonAdded"
    />

    <!-- Lessons List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-if="lessons.length === 0" class="col-span-full text-center py-8">
        No lessons available yet.
      </div>
      <div
        v-for="lesson in lessons"
        :key="lesson.id"
        class="bg-white p-4 rounded-lg shadow"
      >
        <h3 class="font-bold text-lg mb-2">{{ lesson.title }}</h3>
        <p class="text-gray-600 mb-3">{{ lesson.description }}</p>
        <button
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          @click="navigateToLesson(lesson.id)"
        >
          View Lesson
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useLessonsStore } from "../../stores/lessons";
import AddLesson from "../../components/AddLesson.vue";
import type { Lesson } from "../../types/models";

// Define emits
const emit = defineEmits<{
  (e: "navigation", path: string): void;
}>();

// Store
const lessonsStore = useLessonsStore();

// State
const showAddLesson = ref(false);

// Computed properties
const lessons = computed<Lesson[]>(() => lessonsStore.lessons);

// Handle adding a new lesson
const handleLessonAdded = () => {
  showAddLesson.value = false;
};

// Navigation
const navigateToLesson = (lessonId: number) => {
  emit("navigation", `/lessons/${lessonId}`);
};
</script>
