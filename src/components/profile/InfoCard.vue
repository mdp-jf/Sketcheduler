<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">Profile Information</h2>
      <button
        class="text-blue-500 hover:text-blue-700 font-medium"
        @click="$emit('edit')"
      >
        Edit
      </button>
    </div>

    <div class="flex flex-col items-center mb-6">
      <div class="relative mb-4">
        <div class="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
          <img
            v-if="user.avatar_url"
            :src="user.avatar_url"
            :alt="`${user.name}'s avatar`"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center text-gray-500 text-xl"
          >
            {{ getUserInitials() }}
          </div>
        </div>
      </div>
      <h3 class="text-lg font-semibold">{{ user.name }}</h3>
      <p class="text-gray-600">{{ user.email }}</p>
    </div>

    <div class="space-y-4">
      <div v-if="user.bio" class="border-t pt-4">
        <h4 class="text-sm font-medium text-gray-500 mb-2">About Me</h4>
        <p class="text-gray-800">{{ user.bio }}</p>
      </div>

      <div class="border-t pt-4">
        <h4 class="text-sm font-medium text-gray-500 mb-2">Member Since</h4>
        <p class="text-gray-800">{{ formatDate(user.created_at) }}</p>
      </div>

      <div v-if="user.website" class="border-t pt-4">
        <h4 class="text-sm font-medium text-gray-500 mb-2">Website</h4>
        <a
          :href="user.website"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-500 hover:underline"
        >
          {{ formatWebsite(user.website) }}
        </a>
      </div>

      <div v-if="user.social_links" class="border-t pt-4">
        <h4 class="text-sm font-medium text-gray-500 mb-2">Social Links</h4>
        <div class="flex space-x-4">
          <a
            v-for="(link, platform) in user.social_links"
            :key="platform"
            :href="link"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-600 hover:text-blue-500"
          >
            <span>{{ platform }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import type { User } from "../../types/models";

// Define props
const props = defineProps<{
  user: User;
}>();

// Define emits
defineEmits<{
  (e: "edit"): void;
}>();

// Methods
const getUserInitials = () => {
  if (!props.user.name) return "?";

  return props.user.name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatWebsite = (website: string) => {
  return website.replace(/^https?:\/\/(www\.)?/, "");
};
</script>
