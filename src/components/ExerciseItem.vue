<template>
  <div class="py-4 first:pt-0 last:pb-0">
    <div class="flex items-start justify-between">
      <div>
        <h3 class="font-medium text-lg">{{ exercise.title }}</h3>
        <p class="text-gray-600 mt-1">{{ exercise.description }}</p>
        <div class="mt-2 flex items-center">
          <span
            class="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded mr-2"
          >
            Order: {{ exercise.order_number }}
          </span>
          <span
            v-if="exercise.is_warmup_eligible"
            class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
          >
            Warmup eligible
          </span>
        </div>
      </div>
      <button
        class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
        @click="$emit('start', exercise.id)"
      >
        Start Exercise
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// Define the exercise prop with proper TypeScript interface
interface Exercise {
  id: number;
  title: string;
  description: string;
  order_number: number;
  is_warmup_eligible: boolean;
}

defineProps<{
  exercise: Exercise;
}>();

// Define emits
defineEmits<{
  (e: "start", exerciseId: number): void;
}>();
</script>
