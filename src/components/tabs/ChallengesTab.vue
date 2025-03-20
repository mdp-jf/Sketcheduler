<template>
  <div class="challenges-container">
    <div class="flex justify-between mb-6">
      <h2 class="text-xl font-bold">Challenges</h2>
      <button
        class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        @click="navigateToChallenge('create')"
      >
        Create Challenge
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-if="challenges.length === 0"
        class="col-span-full text-center py-8"
      >
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
          <button
            class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            @click="navigateToChallenge(challenge.id)"
          >
            View Challenge
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useChallengesStore } from "../../stores/challenges";
import type { Challenge } from "../../types/models";

// Define emits
const emit = defineEmits<{
  (e: "navigation", path: string): void;
}>();

// Store
const challengesStore = useChallengesStore();

// Computed properties
const challenges = computed<Challenge[]>(() => challengesStore.challenges);

// Navigation
const navigateToChallenge = (challengeId: number | string) => {
  emit("navigation", `/challenges/${challengeId}`);
};
</script>
