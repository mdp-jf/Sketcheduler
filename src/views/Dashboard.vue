<template>
  <div class="dashboard">
    <!-- Header and Tabs -->
    <div class="tabs flex border-b mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="[
          'px-4 py-2 font-medium',
          activeTab === tab.id
            ? `border-b-2 border-${tab.color}-500 text-${tab.color}-500`
            : 'text-gray-600',
        ]"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Loading state -->
    <BaseLoading v-if="isLoading" message="Loading your content..." />

    <!-- Error state -->
    <BaseError v-else-if="error" :message="error">
      <template #actions>
        <button
          class="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="loadDashboardData"
        >
          Try Again
        </button>
      </template>
    </BaseError>

    <!-- Tab Content -->
    <component
      :is="currentTabComponent"
      v-else
      @navigation="handleNavigation"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useLessonsStore } from "../stores/lessons";
import { useChallengesStore } from "../stores/challenges";
import { useDrawingsStore } from "../stores/drawings";
import { useLoading } from "../composables/useLoading";
import { useError } from "../composables/useError";
import LessonsTab from "../components/tabs/LessonsTab.vue";
import ChallengesTab from "../components/tabs/ChallengesTab.vue";
import DrawingsTab from "../components/tabs/DrawingsTab.vue";
import BaseLoading from "../components/BaseLoading.vue";
import BaseError from "../components/BaseError.vue";

// Define the component name
defineOptions({
  name: "UserDashboard",
});

// Router
const router = useRouter();

// Stores
const lessonsStore = useLessonsStore();
const challengesStore = useChallengesStore();
const drawingsStore = useDrawingsStore();

// Composables
const { isLoading } = useLoading();
const { error, setError, clearError } = useError();

// Tab definitions
const tabs = [
  { id: "lessons", label: "Lessons", color: "blue", component: LessonsTab },
  {
    id: "challenges",
    label: "Challenges",
    color: "purple",
    component: ChallengesTab,
  },
  {
    id: "drawings",
    label: "My Drawings",
    color: "green",
    component: DrawingsTab,
  },
];

// State
const activeTab = ref("lessons");

// Computed properties
const currentTabComponent = computed(() => {
  const tab = tabs.find((t) => t.id === activeTab.value);
  return tab ? tab.component : null;
});

// Event handlers
const handleNavigation = (path: string) => {
  router.push(path);
};

// Fetch data
const loadDashboardData = async () => {
  try {
    isLoading.value = true;
    clearError();

    // Load all data in parallel for better performance
    const [lessonsResult, challengesResult, drawingsResult] = await Promise.all(
      [
        lessonsStore.fetchLessons(),
        challengesStore.fetchChallenges(),
        drawingsStore.fetchUserDrawings(),
      ],
    );

    // Check for errors in any of the API calls
    if (!lessonsResult.success) {
      setError(String(lessonsResult.error) || "Failed to load lessons");
      return;
    }

    if (!challengesResult.success) {
      setError(String(challengesResult.error) || "Failed to load challenges");
      return;
    }

    if (!drawingsResult.success) {
      setError(String(drawingsResult.error) || "Failed to load drawings");
      return;
    }
  } catch (err: any) {
    setError(err.message || "An unexpected error occurred");
    console.error("Error loading dashboard data:", err);
  } finally {
    isLoading.value = false;
  }
};

// Fetch data on component mount
onMounted(loadDashboardData);
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
</style>
