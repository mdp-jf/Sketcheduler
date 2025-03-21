<template>
  <div class="exercise-tracking-container">
    <h1 class="text-2xl font-bold mb-6">My Exercise Progress</h1>

    <!-- Loading state -->
    <BaseLoading v-if="isLoading" message="Loading your exercise data..." />

    <!-- Error state -->
    <BaseError v-else-if="error" :message="error">
      <template #actions>
        <button
          class="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="loadData"
        >
          Try Again
        </button>
      </template>
    </BaseError>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Exercise tracking card -->
      <div class="lg:col-span-2">
        <ExerciseTrackingCard
          :recent-exercises="recentExercises"
          :total-exercises="totalExercises"
          :completed-exercises="completedExercises"
          :category-counts="categoryCounts"
          :current-streak="currentStreak"
          :best-streak="bestStreak"
          @view-all="showAllExercises = true"
        />
      </div>

      <!-- Side bar with exercise suggestions -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold mb-4">Suggested Exercises</h2>

          <div
            v-if="suggestedExercises.length === 0"
            class="text-gray-500 italic py-4"
          >
            No suggested exercises available
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="exercise in suggestedExercises"
              :key="exercise.id"
              class="border-b pb-4 last:border-b-0 last:pb-0"
            >
              <div class="flex justify-between">
                <div>
                  <h3 class="font-medium">{{ exercise.title }}</h3>
                  <p class="text-sm text-gray-600 mt-1">
                    {{ truncateText(exercise.description, 60) }}
                  </p>
                </div>
                <button
                  class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 text-sm"
                  @click="startExercise(exercise.id)"
                >
                  Start
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Warmup exercises section -->
        <div
          v-if="warmupExercises.length > 0"
          class="bg-white rounded-lg shadow p-6 mt-6"
        >
          <h2 class="text-xl font-bold mb-4">Daily Warmup</h2>
          <p class="text-gray-600 mb-4">
            Start your practice with a quick warmup exercise
          </p>

          <div class="border rounded-lg p-4 bg-yellow-50">
            <h3 class="font-medium">
              {{ randomWarmupExercise?.exercises?.title }}
            </h3>
            <p class="text-sm text-gray-600 mt-1">
              {{ randomWarmupExercise?.exercises?.description }}
            </p>
            <button
              v-if="randomWarmupExercise"
              class="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 w-full"
              @click="startExercise(randomWarmupExercise.exercise_id)"
            >
              Start Warmup
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- All Exercises Modal -->
    <div
      v-if="showAllExercises"
      class="fixed inset-0 flex items-center justify-center z-50"
    >
      <div
        class="fixed inset-0 bg-black opacity-50"
        @click="showAllExercises = false"
      ></div>
      <div
        class="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl z-10 relative max-h-[90vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">All Exercises</h2>
          <button
            class="text-gray-500 hover:text-gray-700"
            @click="showAllExercises = false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Filter controls -->
        <div class="mb-4 flex flex-wrap gap-3">
          <div class="relative">
            <input
              v-model="exerciseFilter"
              type="text"
              placeholder="Filter exercises..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <select
            v-model="categoryFilter"
            class="px-3 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="">All Categories</option>
            <option
              v-for="category in exerciseCategories"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>

          <select
            v-model="statusFilter"
            class="px-3 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="not_completed">Not Completed</option>
          </select>
        </div>

        <!-- Exercises table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Exercise
                </th>
                <th
                  class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Completed Date
                </th>
                <th
                  class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="filteredExercises.length === 0">
                <td colspan="5" class="px-4 py-4 text-gray-500 text-center">
                  No exercises match your filters
                </td>
              </tr>
              <tr
                v-for="exercise in filteredExercises"
                :key="exercise.id"
                class="hover:bg-gray-50"
              >
                <td class="px-4 py-3">
                  <div class="font-medium text-gray-900">
                    {{ exercise.title }}
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    {{ truncateText(exercise.description, 60) }}
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-gray-500">
                  {{ exercise.category || "Uncategorized" }}
                </td>
                <td class="px-4 py-3">
                  <span
                    :class="[
                      'px-2 py-1 text-xs rounded-full',
                      isExerciseCompleted(exercise.id)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800',
                    ]"
                  >
                    {{
                      isExerciseCompleted(exercise.id)
                        ? "Completed"
                        : "Not Completed"
                    }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-500">
                  {{ getCompletionDate(exercise.id) || "-" }}
                </td>
                <td class="px-4 py-3 text-right">
                  <button
                    class="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                    @click="startExercise(exercise.id)"
                  >
                    {{ isExerciseCompleted(exercise.id) ? "Review" : "Start" }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useExercisesStore } from "../stores/exercises";
import { useLessonsStore } from "../stores/lessons";
import { useLoading } from "../composables/useLoading";
import { useError } from "../composables/useError";
import ExerciseTrackingCard from "../components/exercise/ExerciseTrackingCard.vue";
import BaseLoading from "../components/BaseLoading.vue";
import BaseError from "../components/BaseError.vue";

// Define component name
defineOptions({
  name: "ExerciseTrackingView",
});

// Router
const router = useRouter();

// Stores
const exercisesStore = useExercisesStore();
const lessonsStore = useLessonsStore();

// Composables
const { isLoading } = useLoading(true);
const { error, setError, clearError } = useError();

// State
const showAllExercises = ref(false);
const exerciseFilter = ref("");
const categoryFilter = ref("");
const statusFilter = ref("");

// Computed properties
const recentExercises = computed(() => exercisesStore.recentCompletedExercises);
const totalExercises = computed(() => exercisesStore.totalExercisesCount);
const completedExercises = computed(() => exercisesStore.completedExercises);
const categoryCounts = computed(() => exercisesStore.categoryProgress);
const currentStreak = computed(() => exercisesStore.exerciseStreak.current);
const bestStreak = computed(() => exercisesStore.exerciseStreak.best);
const exerciseCategories = computed(() => exercisesStore.exerciseCategories);
const warmupExercises = computed(() => exercisesStore.warmupExercises);

// Get a random warmup exercise
const randomWarmupExercise = computed(() => {
  if (warmupExercises.value.length === 0) return null;
  const index = Math.floor(Math.random() * warmupExercises.value.length);
  return warmupExercises.value[index];
});

// Get suggested exercises (not completed)
const suggestedExercises = computed(() => {
  // Get all exercises
  const allExercises = exercisesStore.exercises;
  // Get IDs of completed exercises
  const completedIds = new Set(
    completedExercises.value.map((item) => item.exercise_id),
  );

  // Filter for exercises that are not completed
  const notCompleted = allExercises.filter(
    (exercise) => !completedIds.has(exercise.id),
  );

  // Return up to 3 suggested exercises
  return notCompleted.slice(0, 3);
});

// Filtered exercises for the modal
const filteredExercises = computed(() => {
  let result = [...exercisesStore.exercises];

  // Filter by text search
  if (exerciseFilter.value) {
    const searchLower = exerciseFilter.value.toLowerCase();
    result = result.filter(
      (ex) =>
        ex.title.toLowerCase().includes(searchLower) ||
        (ex.description && ex.description.toLowerCase().includes(searchLower)),
    );
  }

  // Filter by category
  if (categoryFilter.value) {
    result = result.filter((ex) => ex.category === categoryFilter.value);
  }

  // Filter by completion status
  if (statusFilter.value) {
    const completedIds = new Set(
      completedExercises.value.map((item) => item.exercise_id),
    );

    if (statusFilter.value === "completed") {
      result = result.filter((ex) => completedIds.has(ex.id));
    } else if (statusFilter.value === "not_completed") {
      result = result.filter((ex) => !completedIds.has(ex.id));
    }
  }

  return result;
});

// Helper functions
const isExerciseCompleted = (exerciseId: number): boolean => {
  return completedExercises.value.some((ex) => ex.exercise_id === exerciseId);
};

const getCompletionDate = (exerciseId: number): string | null => {
  const exercise = completedExercises.value.find(
    (ex) => ex.exercise_id === exerciseId,
  );
  if (!exercise || !exercise.completed_at) return null;

  return new Date(exercise.completed_at).toLocaleDateString();
};

const truncateText = (text: string | undefined, maxLength: number): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Action handlers
const startExercise = (exerciseId: number) => {
  router.push(`/exercises/${exerciseId}`);
};

// Load all necessary data
const loadData = async () => {
  try {
    isLoading.value = true;
    clearError();

    // Load lessons first (we need them to load exercises)
    const lessonsResult = await lessonsStore.fetchLessons();
    if (!lessonsResult.success) {
      throw new Error(String(lessonsResult.error) || "Failed to load lessons");
    }

    // Load all exercises from the first lesson (just to have some exercises to show)
    if (lessonsStore.lessons.length > 0) {
      const firstLessonId = lessonsStore.lessons[0].id;
      const exercisesResult =
        await exercisesStore.fetchExercisesByLessonId(firstLessonId);

      if (!exercisesResult.success) {
        throw new Error(
          String(exercisesResult.error) || "Failed to load exercises",
        );
      }
    }

    // Load warmup exercises
    await exercisesStore.fetchWarmupExercises();

    // Load exercise tracking data
    const trackingResult = await exercisesStore.loadExerciseTrackingData();
    if (!trackingResult.success) {
      throw new Error(
        String(trackingResult.error) || "Failed to load exercise tracking data",
      );
    }
  } catch (err: any) {
    setError(err.message || "An unexpected error occurred");
    console.error("Error loading exercise tracking data:", err);
  } finally {
    isLoading.value = false;
  }
};

// Load data on mount
onMounted(loadData);
</script>

<style scoped>
.exercise-tracking-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
</style>
