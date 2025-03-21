<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-bold mb-4">Challenge Progress</h2>

    <!-- Challenge completion summary -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-purple-50 p-4 rounded-lg">
        <div class="text-3xl font-bold text-purple-600">
          {{ activeCount }}
        </div>
        <div class="text-sm text-gray-600">Active Challenges</div>
      </div>
      <div class="bg-green-50 p-4 rounded-lg">
        <div class="text-3xl font-bold text-green-600">
          {{ completedCount }}
        </div>
        <div class="text-sm text-gray-600">Completed Challenges</div>
      </div>
      <div class="bg-blue-50 p-4 rounded-lg">
        <div class="text-3xl font-bold text-blue-600">
          {{ totalSubmissions }}
        </div>
        <div class="text-sm text-gray-600">Total Submissions</div>
      </div>
    </div>

    <!-- Active challenges -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-3">Active Challenges</h3>
      <div
        v-if="activeChallenges.length === 0"
        class="text-gray-500 italic py-4"
      >
        No active challenges
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="challenge in activeChallenges"
          :key="challenge.id"
          class="border rounded-lg p-4"
        >
          <div class="flex justify-between items-start mb-2">
            <div>
              <div class="font-medium text-lg">{{ challenge.title }}</div>
              <div class="text-sm text-gray-600">
                {{ challenge.description }}
              </div>
            </div>
            <div
              class="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 flex items-center"
            >
              <span
                >{{ challenge.current_count }} /
                {{ challenge.target_count }}</span
              >
            </div>
          </div>

          <!-- Progress bar -->
          <div class="mt-3">
            <div class="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span
                >{{
                  Math.round(
                    (challenge.current_count / challenge.target_count) * 100,
                  )
                }}%</span
              >
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div
                class="bg-purple-600 h-2.5 rounded-full"
                :style="`width: ${Math.min(100, (challenge.current_count / challenge.target_count) * 100)}%`"
              ></div>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="mt-4 flex justify-end space-x-2">
            <button
              class="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
              @click="$emit('view-details', challenge.id)"
            >
              View Details
            </button>
            <button
              class="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm"
              @click="$emit('add-submission', challenge.id)"
            >
              Add Submission
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent completions -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-3">Recently Completed</h3>
      <div
        v-if="recentCompletions.length === 0"
        class="text-gray-500 italic py-4"
      >
        No completed challenges yet
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="challenge in recentCompletions"
          :key="challenge.id"
          class="border rounded-lg p-4 flex flex-col"
        >
          <div class="font-medium mb-1">{{ challenge.title }}</div>
          <div class="text-sm text-gray-600 mb-2">
            Completed {{ formatDate(challenge.completed_at) }}
          </div>

          <div v-if="challenge.image_url" class="mt-auto">
            <img
              :src="challenge.image_url"
              :alt="challenge.title"
              class="w-full h-32 object-cover rounded"
            />
          </div>
          <div v-else class="text-sm text-gray-500 mt-auto italic">
            No image available
          </div>
        </div>
      </div>
    </div>

    <!-- Challenge completion chart -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-3">Completion Timeline</h3>
      <div
        id="challenge-chart"
        class="h-64 bg-gray-50 rounded-lg p-3 flex items-center justify-center"
      >
        <canvas ref="chartCanvas" width="100%" height="100%"></canvas>
      </div>
    </div>

    <!-- View all challenges button -->
    <div class="mt-6 text-center">
      <button
        class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        @click="$emit('view-all')"
      >
        View All Challenges
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, onMounted, ref, watch, computed } from "vue";
import type { ChallengeProgress } from "../../types/models";

// Props interface
interface ChallengeProgressProps {
  activeChallenges: Array<
    ChallengeProgress & { title: string; description: string }
  >;
  completedChallenges: Array<
    ChallengeProgress & {
      title: string;
      completed_at: string;
      image_url?: string;
    }
  >;
  challengeSubmissions: Array<{ count: number; created_at: string }>;
  completionByMonth: Array<{ month: string; count: number }>;
}

// Define props
const props = defineProps<ChallengeProgressProps>();

// Define emits
defineEmits<{
  (e: "view-details", challengeId: number): void;
  (e: "add-submission", challengeId: number): void;
  (e: "view-all"): void;
}>();

// Chart reference
const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chart: any = null;

const activeCount = computed(() => props.activeChallenges.length);
const completedCount = computed(() => props.completedChallenges.length);
const totalSubmissions = computed(() => props.challengeSubmissions.length);
const recentCompletions = computed(() => {
  return props.completedChallenges.slice(0, 4);
});

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Initialize chart
const initChart = () => {
  if (!chartCanvas.value) return;

  // Import Chart.js dynamically to ensure it's only loaded client-side
  import("chart.js").then(({ Chart, registerables }) => {
    Chart.register(...registerables);

    // Get the data in the correct format
    const labels = props.completionByMonth.map((item) => item.month);
    const data = props.completionByMonth.map((item) => item.count);

    // Create the chart
    chart = new Chart(chartCanvas.value, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Challenges Completed",
            data,
            backgroundColor: "rgba(147, 51, 234, 0.5)",
            borderColor: "rgba(147, 51, 234, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
      },
    });
  });
};

// Update chart when data changes
watch(
  () => props.completionByMonth,
  () => {
    if (chart) {
      chart.destroy();
      initChart();
    }
  },
  { deep: true },
);

// Initialize chart on mount
onMounted(() => {
  initChart();
});
</script>
