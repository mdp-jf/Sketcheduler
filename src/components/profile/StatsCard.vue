<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-bold mb-4">Your Progress</h2>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-blue-50 p-4 rounded-lg">
        <div class="text-3xl font-bold text-blue-600">
          {{ userStats.completedLessons }}
        </div>
        <div class="text-sm text-gray-600">Lessons Completed</div>
      </div>

      <div class="bg-green-50 p-4 rounded-lg">
        <div class="text-3xl font-bold text-green-600">
          {{ userStats.totalDrawings }}
        </div>
        <div class="text-sm text-gray-600">Drawings Created</div>
      </div>

      <div class="bg-purple-50 p-4 rounded-lg">
        <div class="text-3xl font-bold text-purple-600">
          {{ userStats.completedChallenges }}
        </div>
        <div class="text-sm text-gray-600">Challenges Completed</div>
      </div>

      <div class="bg-yellow-50 p-4 rounded-lg">
        <div class="text-3xl font-bold text-yellow-600">
          {{ Math.round(userStats.totalHoursDrawing) }}
        </div>
        <div class="text-sm text-gray-600">Hours Practicing</div>
      </div>
    </div>

    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-3">Current Challenges</h3>
      <div
        v-if="userStats.activeChallengeSummary.length === 0"
        class="text-gray-500 italic"
      >
        No active challenges
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="(challenge, index) in userStats.activeChallengeSummary"
          :key="index"
          class="border rounded-lg p-3"
        >
          <div class="flex justify-between mb-1">
            <span class="font-medium">{{ challenge.title }}</span>
            <span class="text-sm"
              >{{ challenge.current_count }} /
              {{ challenge.target_count }}</span
            >
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-purple-600 h-2.5 rounded-full"
              :style="`width: ${Math.min(100, (challenge.current_count / challenge.target_count) * 100)}%`"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-3">Lesson Progress</h3>
      <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div
          class="bg-blue-600 h-2.5 rounded-full"
          :style="`width: ${userStats.lessonCompletionPercentage}%`"
        ></div>
      </div>
      <div class="text-sm text-gray-600 text-right">
        {{ userStats.completedLessons }} of {{ userStats.totalLessons }} lessons
        ({{ userStats.lessonCompletionPercentage }}%)
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import type { UserStats } from "../../types/models";

// Define props
defineProps<{
  userStats: UserStats;
}>();
</script>
