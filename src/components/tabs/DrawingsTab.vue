<template>
  <div class="drawings-container">
    <div class="flex justify-between mb-6">
      <h2 class="text-xl font-bold">My Drawings</h2>
      <button
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        @click="navigateToNewDrawing"
      >
        New Drawing
      </button>
    </div>

    <div v-if="drawings.length === 0" class="text-center py-8">
      You haven't created any drawings yet.
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="drawing in drawings"
        :key="drawing.id"
        class="bg-white p-4 rounded-lg shadow"
      >
        <div
          v-if="drawing.image_url"
          class="bg-gray-100 h-48 mb-3 flex items-center justify-center"
        >
          <img
            :src="drawing.image_url"
            alt="Drawing"
            class="max-h-full max-w-full object-contain"
          />
        </div>
        <div
          v-else
          class="bg-gray-100 h-48 mb-3 flex items-center justify-center"
        >
          <span class="text-gray-400">Image Preview</span>
        </div>
        <p class="text-sm text-gray-600 mb-1">
          {{ drawing.drawing_prompts?.prompt_text || "Free Drawing" }}
        </p>
        <p class="text-xs text-gray-500">
          {{ formatDate(drawing.created_at) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDrawingsStore } from "../../stores/drawings";
import type { Drawing } from "../../types/models";

// Define emits
const emit = defineEmits<{
  (e: "navigation", path: string): void;
}>();

// Store
const drawingsStore = useDrawingsStore();

// Computed properties
const drawings = computed<Drawing[]>(() => drawingsStore.drawings);

// Event handlers
const navigateToNewDrawing = () => {
  emit("navigation", "/drawings/new");
};

// Format date helper
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};
</script>
