<template>
  <div class="bg-white rounded-lg shadow p-6 mb-6">
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <div v-if="messageType === 'welcome'" class="text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        </div>
        <div v-else-if="messageType === 'progress'" class="text-green-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div v-else-if="messageType === 'challenge'" class="text-purple-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
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
        <div v-else class="text-yellow-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
      </div>

      <div class="ml-4">
        <h2 class="text-xl font-bold mb-2">{{ welcomeTitle }}</h2>
        <p class="text-gray-700">{{ welcomeMessage }}</p>

        <div v-if="suggestion" class="mt-4">
          <div class="flex items-center">
            <span class="text-sm font-medium text-gray-600 mr-2"
              >Suggestion:</span
            >
            <button
              class="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
              @click="handleSuggestion"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";
import type { UserStats } from "../../types/models";

const props = defineProps<{
  userStats: UserStats;
  userName?: string;
}>();

const emit = defineEmits<{
  (e: "action", path: string): void;
}>();

// Calculate what type of message to show based on user stats
const messageType = computed(() => {
  const stats = props.userStats;

  // New user welcome
  if (stats.completedLessons === 0) {
    return "welcome";
  }

  // Active challenges focus
  if (stats.activeChallengeSummary && stats.activeChallengeSummary.length > 0) {
    return "challenge";
  }

  // Progress celebration
  if (stats.completedLessons > 0 && stats.lessonCompletionPercentage >= 25) {
    return "progress";
  }

  // Default to suggestion
  return "suggestion";
});

// Generate welcome title based on message type
const welcomeTitle = computed(() => {
  const name = props.userName || "Artist";

  switch (messageType.value) {
    case "welcome":
      return `Welcome, ${name}!`;
    case "progress":
      return `Great progress, ${name}!`;
    case "challenge":
      return `Challenge time, ${name}!`;
    default:
      return `Ready to draw, ${name}?`;
  }
});

// Generate welcome message based on user stats
const welcomeMessage = computed(() => {
  const stats = props.userStats;

  switch (messageType.value) {
    case "welcome":
      return "Welcome to your drawing journey! Start with your first lesson to begin building your skills.";

    case "progress":
      if (stats.lessonCompletionPercentage >= 75) {
        return `Impressive work! You've completed ${stats.completedLessons} lessons (${stats.lessonCompletionPercentage}% of the curriculum). You're well on your way to mastery!`;
      } else {
        return `You've completed ${stats.completedLessons} lessons so far. Keep up the great work!`;
      }

    case "challenge": {
      const activeChallenge = stats.activeChallengeSummary[0];
      return `You're working on "${activeChallenge.title}" (${activeChallenge.current_count}/${activeChallenge.target_count}). Keep going!`;
    }

    default:
      if (stats.totalDrawings > 0) {
        return `You've created ${stats.totalDrawings} drawings and spent ${Math.round(stats.totalHoursDrawing)} hours practicing. What would you like to work on today?`;
      } else {
        return "Ready to start your drawing practice? Choose a lesson below to begin.";
      }
  }
});

// Generate suggestion based on user stats
const suggestion = computed(() => {
  const stats = props.userStats;

  switch (messageType.value) {
    case "welcome":
      return "Start your first lesson";

    case "challenge":
      return "Continue challenge";

    case "progress":
      if (stats.lessonCompletionPercentage < 100) {
        return "Continue next lesson";
      }
      return null;

    default:
      if (
        stats.activeChallengeSummary &&
        stats.activeChallengeSummary.length > 0
      ) {
        return "Work on challenge";
      } else if (stats.lessonCompletionPercentage < 100) {
        return "Continue learning";
      }
      return "Explore drawings";
  }
});

// Handle suggestion button click
const handleSuggestion = () => {
  switch (messageType.value) {
    case "welcome":
    case "progress":
      emit("action", "/lessons");
      break;

    case "challenge":
      emit("action", "/challenges");
      break;

    default:
      if (suggestion.value === "Explore drawings") {
        emit("action", "/drawings");
      } else if (suggestion.value === "Work on challenge") {
        emit("action", "/challenges");
      } else {
        emit("action", "/lessons");
      }
  }
};
</script>
