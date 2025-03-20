<template>
  <div class="flex justify-center items-center p-4">
    <div
      class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
    ></div>
    <span class="ml-2">{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  message: {
    type: String,
    default: "Loading...",
  },
});
</script>
