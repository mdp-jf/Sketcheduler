<template>
  <div class="dashboard">
    <!-- Widget Layout based on user customization -->
    <template v-for="widget in sortedVisibleWidgets" :key="widget.id">
      <!-- Welcome Message Widget -->
      <WelcomeMessage
        v-if="widget.id === 'welcome' && userStats"
        :user-stats="userStats"
        :user-name="userName"
        @action="handleNavigation"
      />

      <!-- Quick Access Buttons Widget -->
      <QuickAccessButtons
        v-if="widget.id === 'quickAccess'"
        @session-start="handleSessionStart"
      />

      <!-- User Stats and Recent Activity Widgets -->
      <div
        v-if="widget.id === 'stats' || widget.id === 'activity'"
        class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
      >
        <!-- User stats -->
        <div v-if="widget.id === 'stats'" class="lg:col-span-2">
          <ProfileStatsCard v-if="userStats" :user-stats="userStats" />
        </div>

        <!-- Recent activity -->
        <div
          v-if="widget.id === 'activity'"
          :class="{
            'lg:col-span-1': widgetSettings['stats']?.visible,
            'lg:col-span-3': !widgetSettings['stats']?.visible,
          }"
        >
          <ProfileActivityCard
            v-if="recentActivity && recentActivity.length > 0"
            :activities="recentActivity"
          />
        </div>
      </div>

      <!-- Tab Content Widget -->
      <div v-if="widget.id === 'tabContent'" class="mb-6">
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

    <!-- Dashboard Settings Component -->
    <DashboardSettings @update:settings="updateWidgetSettings" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useLessonsStore } from "../stores/lessons";
import { useChallengesStore } from "../stores/challenges";
import { useDrawingsStore } from "../stores/drawings";
import { useUserStore } from "../stores/user";
import { useLoading } from "../composables/useLoading";
import { useError } from "../composables/useError";
import { useLocalStorage } from "@vueuse/core";
import LessonsTab from "../components/tabs/LessonsTab.vue";
import ChallengesTab from "../components/tabs/ChallengesTab.vue";
import DrawingsTab from "../components/tabs/DrawingsTab.vue";
import ProfileStatsCard from "../components/profile/StatsCard.vue";
import ProfileActivityCard from "../components/profile/ActivityCard.vue";
import WelcomeMessage from "../components/dashboard/WelcomeMessage.vue";
import QuickAccessButtons from "../components/dashboard/QuickAccessButtons.vue";
import DashboardSettings, {
  type WidgetSettings,
} from "../components/dashboard/DashboardSettings.vue";
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
const userStore = useUserStore();

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
const userStats = computed(() => userStore.userStats);
const recentActivity = computed(() => userStore.userActivity);
const userName = computed(
  () => userStore.userProfile?.name || userStore.userProfile?.username || null,
);

// Dashboard widget settings
const widgetSettings = useLocalStorage<WidgetSettings>(
  "dashboard-widget-settings",
  {
    welcome: { visible: true, order: 1 },
    quickAccess: { visible: true, order: 2 },
    stats: { visible: true, order: 3 },
    activity: { visible: true, order: 4 },
    tabContent: { visible: true, order: 5 },
  },
);

// Update widget settings when changed in the settings component
const updateWidgetSettings = (newSettings: WidgetSettings) => {
  widgetSettings.value = newSettings;
};

// Compute sorted visible widgets for display order
const sortedVisibleWidgets = computed(() => {
  const widgetDefinitions = [
    { id: "welcome", name: "Welcome Message" },
    { id: "quickAccess", name: "Quick Access" },
    { id: "stats", name: "Progress Stats" },
    { id: "activity", name: "Recent Activity" },
    { id: "tabContent", name: "Tab Content" },
  ];

  return widgetDefinitions
    .filter((widget) => widgetSettings.value[widget.id]?.visible)
    .sort((a, b) => {
      return (
        (widgetSettings.value[a.id]?.order || 99) -
        (widgetSettings.value[b.id]?.order || 99)
      );
    });
});

// Computed properties
const currentTabComponent = computed(() => {
  const tab = tabs.find((t) => t.id === activeTab.value);
  return tab ? tab.component : null;
});

// Event handlers
const handleNavigation = (path: string) => {
  router.push(path);
};

// Handle session start from quick access buttons
const handleSessionStart = (type: string, id?: string) => {
  console.log(`Starting ${type} session`, id);
  // You could add analytics tracking here
  // or any other side effects when a session starts
};

// Fetch data
const loadDashboardData = async () => {
  try {
    isLoading.value = true;
    clearError();

    // Load all data in parallel for better performance
    const [
      lessonsResult,
      challengesResult,
      drawingsResult,
      statsResult,
      activityResult,
    ] = await Promise.all([
      lessonsStore.fetchLessons(),
      challengesStore.fetchChallenges(),
      drawingsStore.fetchUserDrawings(),
      userStore.fetchUserStats(),
      userStore.fetchUserActivity(),
    ]);

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

    if (!statsResult.success) {
      console.error("Failed to load user stats:", statsResult.error);
      // Continue even if stats fail - non-critical
    }

    if (!activityResult.success) {
      console.error("Failed to load user activity:", activityResult.error);
      // Continue even if activity fails - non-critical
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
