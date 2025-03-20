<template>
  <div class="lesson-detail">
    <!-- Loading state -->
    <BaseLoading v-if="isLoading" message="Loading lesson details..." />

    <!-- Error state -->
    <BaseError v-else-if="error" :message="error">
      <template #actions>
        <button
          class="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          @click="$router.push('/dashboard')"
        >
          Return to Dashboard
        </button>
      </template>
    </BaseError>

    <!-- No lesson found -->
    <BaseError
      v-else-if="!currentLesson"
      message="Lesson not found."
      severity="info"
    >
      <template #actions>
        <button
          class="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="$router.push('/dashboard')"
        >
          Return to Dashboard
        </button>
      </template>
    </BaseError>

    <!-- Lesson content -->
    <div v-else>
      <!-- Lesson header -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <h1 class="text-3xl font-bold">
            {{ currentLesson.title }}
          </h1>
          <button
            class="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
            @click="$router.push('/dashboard')"
          >
            Back to Dashboard
          </button>
        </div>
        <p class="text-gray-600">
          {{ currentLesson.description }}
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
          :lesson-id="lessonId"
          @cancel="showAddExercise = false"
          @exercise-added="handleExerciseAdded"
        />

        <!-- Exercise List -->
        <div
          v-else-if="exercises.length === 0"
          class="text-center py-8 bg-gray-50 rounded"
        >
          No exercises have been added to this lesson yet.
        </div>

        <div v-else class="divide-y">
          <ExerciseItem
            v-for="exercise in exercises"
            :key="exercise.id"
            :exercise="exercise"
            @start="startExercise"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLessonsStore } from "../stores/lessons";
import { useExercisesStore } from "../stores/exercises";
import { useLoading } from "../composables/useLoading";
import { useError } from "../composables/useError";
import AddExercise from "../components/AddExercise.vue";
import ExerciseItem from "../components/ExerciseItem.vue";
import BaseLoading from "../components/BaseLoading.vue";
import BaseError from "../components/BaseError.vue";
import { type Exercise, type Lesson } from "../types/models";

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

// Composables
const { isLoading } = useLoading(true);
const { error, setError, clearError } = useError();

// State
const showAddExercise = ref(false);

// Computed properties
const lessonId = computed(() => {
  const id = Number(route.params.id);
  return isNaN(id) ? -1 : id;
});

const currentLesson = computed<Lesson | null>(() => lessonsStore.currentLesson);
const exercises = computed<Exercise[]>(() => exercisesStore.exercises);

// Load lesson data
const loadLessonData = async () => {
  try {
    isLoading.value = true;
    clearError();

    if (lessonId.value <= 0) {
      setError("Invalid lesson ID");
      return;
    }

    // Fetch lesson details
    const lessonResult = await lessonsStore.fetchLessonById(lessonId.value);

    if (!lessonResult.success) {
      setError(String(lessonResult.error) || "Failed to load lesson");
      return;
    }

    // Fetch exercises for this lesson
    const exercisesResult = await exercisesStore.fetchExercisesByLessonId(
      lessonId.value,
    );

    if (!exercisesResult.success) {
      setError(
        String(exercisesResult.error) ||
          "Failed to load exercises for this lesson",
      );
      return;
    }
  } catch (err: any) {
    setError(err.message || "An unexpected error occurred");
    console.error("Error fetching lesson details:", err);
  } finally {
    isLoading.value = false;
  }
};

// Handle adding a new exercise
const handleExerciseAdded = async () => {
  showAddExercise.value = false;
  // Refresh the exercises list
  await exercisesStore.fetchExercisesByLessonId(lessonId.value);
};

// Navigate to exercise
const startExercise = (exerciseId: number) => {
  router.push(`/exercises/${exerciseId}`);
};

// Fetch lesson data on component mount
onMounted(loadLessonData);
</script>

<style scoped>
.lesson-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
}
</style>
