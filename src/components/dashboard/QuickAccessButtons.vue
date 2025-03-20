<template>
  <div class="quick-access-container bg-white rounded-lg shadow p-4 mb-6">
    <h2 class="text-lg font-bold mb-3">Quick Access</h2>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <!-- New Drawing Session Button -->
      <button
        class="quick-action-btn bg-green-50 hover:bg-green-100 border border-green-200 text-green-700"
        @click="startNewDrawing"
      >
        <div class="icon-container bg-green-100">
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <div class="text-container">
          <span class="btn-title">New Drawing</span>
          <span class="btn-subtitle">Start from scratch</span>
        </div>
      </button>

      <!-- Continue Lesson Button -->
      <button
        :disabled="!hasActiveLesson"
        :class="[
          'quick-action-btn border text-blue-700',
          hasActiveLesson
            ? 'bg-blue-50 hover:bg-blue-100 border-blue-200'
            : 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200',
        ]"
        @click="continueLesson"
      >
        <div
          class="icon-container"
          :class="hasActiveLesson ? 'bg-blue-100' : 'bg-gray-100'"
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
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div class="text-container">
          <span class="btn-title">Continue Lesson</span>
          <span class="btn-subtitle">{{
            activeLesson?.title || "No active lesson"
          }}</span>
        </div>
      </button>

      <!-- Active Challenge Button -->
      <button
        :disabled="!hasActiveChallenge"
        :class="[
          'quick-action-btn border text-purple-700',
          hasActiveChallenge
            ? 'bg-purple-50 hover:bg-purple-100 border-purple-200'
            : 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200',
        ]"
        @click="continueChallenge"
      >
        <div
          class="icon-container"
          :class="hasActiveChallenge ? 'bg-purple-100' : 'bg-gray-100'"
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
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div class="text-container">
          <span class="btn-title">Active Challenge</span>
          <span class="btn-subtitle">{{
            activeChallenge?.title || "No active challenge"
          }}</span>
        </div>
      </button>

      <!-- Last Drawing Button -->
      <button
        :disabled="!hasRecentDrawing"
        :class="[
          'quick-action-btn border',
          hasRecentDrawing
            ? 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-yellow-700'
            : 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200',
        ]"
        @click="editLastDrawing"
      >
        <div
          class="icon-container"
          :class="hasRecentDrawing ? 'bg-yellow-100' : 'bg-gray-100'"
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
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </div>
        <div class="text-container">
          <span class="btn-title">Recent Drawing</span>
          <span class="btn-subtitle">{{
            recentDrawing?.title || "No recent drawings"
          }}</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits } from "vue";
import { useLessonsStore } from "../../stores/lessons";
import { useChallengesStore } from "../../stores/challenges";
import { useDrawingsStore } from "../../stores/drawings";
import { useRouter } from "vue-router";

// Stores
const lessonsStore = useLessonsStore();
const challengesStore = useChallengesStore();
const drawingsStore = useDrawingsStore();
const router = useRouter();

// Emits
const emit = defineEmits<{
  (e: "session-start", type: string, id?: string): void;
}>();

// Computed properties
const activeLesson = computed(() => {
  return lessonsStore.inProgressLessons[0] || lessonsStore.nextLesson;
});

const hasActiveLesson = computed(() => {
  return !!activeLesson.value;
});

const activeChallenge = computed(() => {
  return challengesStore.activeChallenge;
});

const hasActiveChallenge = computed(() => {
  return !!activeChallenge.value;
});

const recentDrawing = computed(() => {
  const drawings = drawingsStore.userDrawings;
  return drawings.length > 0 ? drawings[0] : null;
});

const hasRecentDrawing = computed(() => {
  return !!recentDrawing.value;
});

// Action handlers
const startNewDrawing = () => {
  emit("session-start", "new-drawing");
  router.push("/drawing/new");
};

const continueLesson = () => {
  if (!hasActiveLesson.value) return;

  emit("session-start", "lesson", activeLesson.value.id);
  router.push(`/lessons/${activeLesson.value.id}`);
};

const continueChallenge = () => {
  if (!hasActiveChallenge.value) return;

  emit("session-start", "challenge", activeChallenge.value.id);
  router.push(`/challenges/${activeChallenge.value.id}`);
};

const editLastDrawing = () => {
  if (!hasRecentDrawing.value) return;

  emit("session-start", "edit-drawing", recentDrawing.value.id);
  router.push(`/drawing/edit/${recentDrawing.value.id}`);
};
</script>

<style scoped>
.quick-action-btn {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  margin-right: 0.75rem;
}

.text-container {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.btn-title {
  font-weight: 600;
  font-size: 0.875rem;
}

.btn-subtitle {
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

@media (max-width: 768px) {
  .btn-subtitle {
    max-width: 80px;
  }
}
</style>
