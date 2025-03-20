<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLessonsStore } from "../stores/lessons";
import { useExercisesStore } from "../stores/exercises";
import AddExercise from "../components/AddExercise.vue";

// Define component name
defineOptions({
  name: "LessonDetailView",
});

// Router and route
const route = useRoute();
const router = useRouter();

// Stores
const lessonsStore = useLessonsStore();
const exercisesStore = useExercisesStore();

// State
const showAddExercise = ref(false);
const loading = ref(true);

// Fetch lesson data
onMounted(async () => {
  try {
    loading.value = true;

    const lessonId = Number(route.params.id);

    if (isNaN(lessonId)) {
      router.push("/dashboard");
      return;
    }

    // Fetch lesson details using the store
    const lessonResult = await lessonsStore.fetchLessonById(lessonId);

    if (!lessonResult.success) {
      console.error("Error fetching lesson:", lessonResult.error);
      return;
    }

    // Fetch exercises for this lesson using the store
    await exercisesStore.fetchExercisesByLessonId(lessonId);
  } catch (error) {
    console.error("Error fetching lesson details:", error);
  } finally {
    loading.value = false;
  }
});

// Handle adding a new exercise
const handleExerciseAdded = () => {
  // Hide the add exercise form
  showAddExercise.value = false;
};
</script>

<template>
  <div class="lesson-detail">
    <!-- Loading state -->
    <div
      v-if="loading || lessonsStore.loading || exercisesStore.loading"
      class="flex justify-center p-8"
    >
      Loading lesson details...
    </div>

    <div v-else-if="!lessonsStore.currentLesson" class="text-center py-8">
      Lesson not found.
    </div>

    <div v-else>
      <!-- Debug info -->
      <div class="mb-4 p-2 bg-gray-100 rounded">
        <p>Lesson: {{ lessonsStore.currentLesson.title }}</p>
        <p>Exercises count: {{ exercisesStore.exercises.length }}</p>
      </div>

      <!-- Lesson header -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <h1 class="text-3xl font-bold">
            {{ lessonsStore.currentLesson.title }}
          </h1>
          <button
            class="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
            @click="$router.push('/dashboard')"
          >
            Back to Dashboard
          </button>
        </div>
        <p class="text-gray-600">
          {{ lessonsStore.currentLesson.description }}
        </p>
      </div>

      <!-- Exercises section -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold">Exercises</h2>
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            @click="showAddExercise = !showAddExercise"
          >
            {{ showAddExercise ? "Cancel" : "Add Exercise" }}
          </button>
        </div>

        <!-- Add Exercise Form -->
        <AddExercise
          v-if="showAddExercise"
          :lesson-id="Number(lessonsStore.currentLesson.id)"
          @cancel="showAddExercise = false"
          @exercise-added="handleExerciseAdded"
        />

        <!-- Exercise List -->
        <div v-else>
          <div
            v-if="exercisesStore.exercises.length === 0"
            class="text-center py-8 bg-gray-50 rounded"
          >
            No exercises have been added to this lesson yet.
          </div>

          <div v-else class="divide-y">
            <div
              v-for="exercise in exercisesStore.exercises"
              :key="exercise.id"
              class="py-4 first:pt-0 last:pb-0"
            >
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-medium text-lg">{{ exercise.title }}</h3>
                  <p class="text-gray-600 mt-1">{{ exercise.description }}</p>
                  <div class="mt-2 flex items-center">
                    <span
                      class="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded mr-2"
                    >
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
                <button class="text-blue-500 hover:underline">
                  Start Exercise
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
