<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-bold mb-4">Recent Activity</h2>

    <div v-if="activities.length === 0" class="text-gray-500 italic py-4">
      No recent activity to display
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="border-b pb-4 last:border-b-0 last:pb-0"
      >
        <div class="flex items-start">
          <!-- Activity type icon -->
          <div class="mr-3 mt-1">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center"
              :class="getActivityTypeClass(activity.activity_type)"
            >
              <span
                v-if="activity.activity_type === 'lesson_completed'"
                class="text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
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
              </span>
              <span
                v-else-if="activity.activity_type === 'challenge_progress'"
                class="text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
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
              </span>
              <span
                v-else-if="activity.activity_type === 'drawing_created'"
                class="text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
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
              </span>
              <span
                v-else-if="activity.activity_type === 'exercise_completed'"
                class="text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </span>
              <span v-else class="text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            </div>
          </div>

          <!-- Activity content -->
          <div class="flex-1">
            <div class="mb-1">
              <span class="font-medium">{{
                formatActivityTitle(activity)
              }}</span>
            </div>
            <p v-if="activity.notes" class="text-gray-600 text-sm mb-2">
              {{ activity.notes }}
            </p>

            <!-- Activity image (if available) -->
            <div
              v-if="activity.image_url"
              class="mt-2 bg-gray-100 rounded-lg overflow-hidden w-full max-w-xs h-32 flex items-center justify-center"
            >
              <img
                :src="activity.image_url"
                alt="Activity"
                class="max-h-full max-w-full object-contain"
              />
            </div>

            <!-- Activity timestamp -->
            <div class="text-xs text-gray-500 mt-2">
              {{ formatTimeAgo(activity.created_at) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activities.length > 0" class="mt-4 text-center">
      <button class="text-blue-500 hover:text-blue-700 text-sm font-medium">
        View All Activity
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import type { UserActivity } from "../../types/models";

// Define props
defineProps<{
  activities: UserActivity[];
}>();

// Methods
const getActivityTypeClass = (type: string): string => {
  switch (type) {
    case "lesson_completed":
      return "bg-blue-500";
    case "challenge_progress":
      return "bg-purple-500";
    case "drawing_created":
      return "bg-green-500";
    case "exercise_completed":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

const formatActivityTitle = (activity: UserActivity): string => {
  switch (activity.activity_type) {
    case "lesson_completed":
      return `Completed "${activity.title}"`;
    case "challenge_progress":
      return `Made progress on "${activity.title}" challenge`;
    case "drawing_created":
      return `Created a new drawing${activity.title ? `: ${activity.title}` : ""}`;
    case "exercise_completed":
      return `Completed exercise: "${activity.title}"`;
    default:
      return activity.title || "Activity";
  }
};

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  // If more than a month ago, show the actual date
  return date.toLocaleDateString();
};
</script>
