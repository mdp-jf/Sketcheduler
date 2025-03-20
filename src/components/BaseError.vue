<template>
  <div :class="['p-4 rounded-lg flex items-start', severityClasses]">
    <div class="flex-shrink-0 mr-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="w-5 h-5"
      >
        <circle cx="12" cy="12" r="10" />
        <line v-if="severity === 'error'" x1="12" y1="8" x2="12" y2="12" />
        <line v-if="severity === 'error'" x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <div>
      <h3 v-if="title" class="font-medium">{{ title }}</h3>
      <div class="mt-1">{{ message }}</div>
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  severity: {
    type: String,
    default: "error",
    validator: (value: string) =>
      ["error", "warning", "info", "success"].includes(value),
  },
  title: {
    type: String,
    default: "",
  },
  message: {
    type: String,
    required: true,
  },
});

const severityClasses = computed(() => {
  switch (props.severity) {
    case "error":
      return "bg-red-50 text-red-700";
    case "warning":
      return "bg-yellow-50 text-yellow-700";
    case "info":
      return "bg-blue-50 text-blue-700";
    case "success":
      return "bg-green-50 text-green-700";
    default:
      return "bg-red-50 text-red-700";
  }
});
</script>
