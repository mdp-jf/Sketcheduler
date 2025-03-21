<template>
  <div class="challenge-tracking-container">
    <h1 class="text-2xl font-bold mb-6">My Challenge Progress</h1>

    <!-- Loading state -->
    <BaseLoading v-if="isLoading" message="Loading your challenge data..." />

    <!-- Error state -->
    <BaseError v-else-if="error" :message="error">
      <template #actions>
        <button
          class="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="loadData"
        >
          Try Again
        </button>
      </template>
    </BaseError>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Challenge progress card -->
      <div class="lg:col-span-2">
        <ChallengeProgressCard
          :active-challenges="activeChallenges"
          :completed-challenges="completedChallenges"
          :challenge-submissions="challengeSubmissions"
          :completion-by-month="completionByMonth"
          @view-details="viewChallengeDetails"
          @add-submission="startChallengeSubmission"
          @view-all="showAllChallenges = true"
        />
      </div>

      <!-- Side bar with challenge stats and suggestions -->
      <div class="lg:col-span-1">
        <!-- Challenge Summary Stats -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-xl font-bold mb-4">Challenge Summary</h2>

          <div class="space-y-4">
            <!-- Completion Rate -->
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm text-gray-600">Completion Rate</span>
                <span class="text-sm font-medium"
                  >{{ challengeSummary.completionRate }}%</span
                >
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  class="bg-purple-600 h-2.5 rounded-full"
                  :style="`width: ${challengeSummary.completionRate}%`"
                ></div>
              </div>
            </div>

            <!-- Last Completed Challenge -->
            <div
              v-if="challengeSummary.lastCompletedChallenge"
              class="border-t pt-4"
            >
              <h3 class="text-sm font-medium text-gray-600 mb-2">
                Last Completed Challenge
              </h3>
              <div class="bg-purple-50 rounded-lg p-3">
                <div class="font-medium">
                  {{ challengeSummary.lastCompletedChallenge.title }}
                </div>
                <div class="text-xs text-gray-600 mt-1">
                  Completed
                  {{
                    formatDate(
                      challengeSummary.lastCompletedChallenge.completed_at,
                    )
                  }}
                </div>
              </div>
            </div>

            <!-- Achievement Milestones -->
            <div class="border-t pt-4">
              <h3 class="text-sm font-medium text-gray-600 mb-2">
                Achievement Milestones
              </h3>
              <div class="space-y-2">
                <div class="flex items-center">
                  <div
                    :class="[
                      'w-6 h-6 flex items-center justify-center rounded-full mr-2',
                      challengeSummary.totalCompleted >= 1
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200',
                    ]"
                  >
                    <svg
                      v-if="challengeSummary.totalCompleted >= 1"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <span class="text-sm">First Challenge Completed</span>
                </div>

                <div class="flex items-center">
                  <div
                    :class="[
                      'w-6 h-6 flex items-center justify-center rounded-full mr-2',
                      challengeSummary.totalCompleted >= 5
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200',
                    ]"
                  >
                    <svg
                      v-if="challengeSummary.totalCompleted >= 5"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <span class="text-sm">5 Challenges Completed</span>
                </div>

                <div class="flex items-center">
                  <div
                    :class="[
                      'w-6 h-6 flex items-center justify-center rounded-full mr-2',
                      challengeSummary.totalCompleted >= 10
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200',
                    ]"
                  >
                    <svg
                      v-if="challengeSummary.totalCompleted >= 10"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <span class="text-sm">10 Challenges Completed</span>
                </div>

                <div class="flex items-center">
                  <div
                    :class="[
                      'w-6 h-6 flex items-center justify-center rounded-full mr-2',
                      challengeSummary.totalSubmissions >= 50
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200',
                    ]"
                  >
                    <svg
                      v-if="challengeSummary.totalSubmissions >= 50"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <span class="text-sm">50+ Submissions</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommended Challenges -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold mb-4">Recommended Challenges</h2>

          <div
            v-if="recommendedChallenges.length === 0"
            class="text-gray-500 italic py-4"
          >
            No recommended challenges available
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="challenge in recommendedChallenges"
              :key="challenge.id"
              class="border rounded-lg p-3"
            >
              <div class="font-medium mb-1">{{ challenge.title }}</div>
              <div class="text-xs text-gray-600 mb-2">
                <span
                  class="inline-block px-2 py-1 bg-gray-100 rounded text-gray-700"
                >
                  {{ challenge.difficulty }}
                </span>
              </div>
              <p class="text-sm text-gray-600 mb-3">
                {{ truncateText(challenge.description, 100) }}
              </p>
              <button
                class="w-full px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm"
                @click="startChallenge(challenge.id)"
              >
                Start Challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- All Challenges Modal -->
    <div
      v-if="showAllChallenges"
      class="fixed inset-0 flex items-center justify-center z-50"
    >
      <div
        class="fixed inset-0 bg-black opacity-50"
        @click="showAllChallenges = false"
      ></div>
      <div
        class="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl z-10 relative max-h-[90vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">All Challenges</h2>
          <button
            class="text-gray-500 hover:text-gray-700"
            @click="showAllChallenges = false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Filter controls -->
        <div class="mb-4 flex flex-wrap gap-3">
          <div class="relative">
            <input
              v-model="challengeFilter"
              type="text"
              placeholder="Filter challenges..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <select
            v-model="difficultyFilter"
            class="px-3 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <select
            v-model="statusFilter"
            class="px-3 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="">All Statuses</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <!-- Challenges table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Challenge
                </th>
                <th
                  class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Difficulty
                </th>
                <th
                  class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Progress
                </th>
                <th
                  class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="filteredChallenges.length === 0">
                <td colspan="5" class="px-4 py-4 text-gray-500 text-center">
                  No challenges match your filters
                </td>
              </tr>
              <tr
                v-for="challenge in filteredChallenges"
                :key="challenge.id"
                class="hover:bg-gray-50"
              >
                <td class="px-4 py-3">
                  <div class="font-medium text-gray-900">
                    {{ challenge.title }}
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    {{ truncateText(challenge.description, 60) }}
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-gray-500">
                  {{ capitalizeFirstLetter(challenge.difficulty) }}
                </td>
                <td class="px-4 py-3">
                  <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      class="bg-purple-600 h-2.5 rounded-full"
                      :style="`width: ${getChallengeProgress(challenge.id)}%`"
                    ></div>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    {{ formatChallengeProgress(challenge.id) }}
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span
                    :class="[
                      'px-2 py-1 text-xs rounded-full',
                      getChallengeStatusClass(challenge.id),
                    ]"
                  >
                    {{ getChallengeStatus(challenge.id) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <button
                    class="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm"
                    @click="viewChallengeDetails(challenge.id)"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useChallengesStore } from "../stores/challenges";
import { useLoading } from "../composables/useLoading";
import { useError } from "../composables/useError";
import ChallengeProgressCard from "../components/challenge/ChallengeProgressCard.vue";
import BaseLoading from "../components/BaseLoading.vue";
import BaseError from "../components/BaseError.vue";

// Define component name
defineOptions({
  name: "ChallengeTrackingView",
});

// Router
const router = useRouter();

// Stores
const challengesStore = useChallengesStore();

// Composables
const { isLoading } = useLoading(true);
const { error, setError, clearError } = useError();

// State
const showAllChallenges = ref(false);
const challengeFilter = ref("");
const difficultyFilter = ref("");
const statusFilter = ref("");

// Computed properties
const activeChallenges = computed(
  () => challengesStore.activeChallengesWithDetails,
);
const completedChallenges = computed(
  () => challengesStore.completedChallengesWithDetails,
);
const challengeSubmissions = computed(
  () => challengesStore.challengeSubmissions,
);
const completionByMonth = computed(() => challengesStore.completionByMonth);
const challengeSummary = computed(() => challengesStore.challengeSummary);

// Recommended challenges - not started challenges filtered by difficulty
const recommendedChallenges = computed(() => {
  const allChallenges = challengesStore.challenges;

  // Get IDs of challenges with progress
  const progressIds = new Set(
    challengesStore.userChallengeProgress.map((item) => item.challenge_id),
  );

  // Filter for challenges that have not been started
  const notStarted = allChallenges.filter(
    (challenge) => !progressIds.has(challenge.id),
  );

  // Sort by difficulty (beginner first)
  const sorted = [...notStarted].sort((a, b) => {
    const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
    return (
      (difficultyOrder[a.difficulty] || 99) -
      (difficultyOrder[b.difficulty] || 99)
    );
  });

  // Return up to 3 recommended challenges
  return sorted.slice(0, 3);
});

// Filtered challenges for the modal
const filteredChallenges = computed(() => {
  let result = [...challengesStore.challenges];

  // Filter by text search
  if (challengeFilter.value) {
    const searchLower = challengeFilter.value.toLowerCase();
    result = result.filter(
      (challenge) =>
        challenge.title.toLowerCase().includes(searchLower) ||
        (challenge.description &&
          challenge.description.toLowerCase().includes(searchLower)),
    );
  }

  // Filter by difficulty
  if (difficultyFilter.value) {
    result = result.filter(
      (challenge) =>
        challenge.difficulty.toLowerCase() ===
        difficultyFilter.value.toLowerCase(),
    );
  }

  // Filter by status
  if (statusFilter.value) {
    const progressMap = new Map(
      challengesStore.userChallengeProgress.map((p) => [
        p.challenge_id,
        p.status,
      ]),
    );

    result = result.filter((challenge) => {
      const status = progressMap.get(challenge.id) || "not_started";
      return status === statusFilter.value;
    });
  }

  return result;
});

// Helper functions
const truncateText = (text: string | undefined, maxLength: number): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getChallengeProgress = (challengeId: number): number => {
  const progress = challengesStore.userChallengeProgress.find(
    (p) => p.challenge_id === challengeId,
  );
  if (!progress) return 0;

  const challenge = challengesStore.challenges.find(
    (c) => c.id === challengeId,
  );
  if (!challenge) return 0;

  return Math.min(
    100,
    Math.round((progress.current_count / challenge.target_count) * 100),
  );
};

const formatChallengeProgress = (challengeId: number): string => {
  const progress = challengesStore.userChallengeProgress.find(
    (p) => p.challenge_id === challengeId,
  );
  if (!progress) return "0/0";

  const challenge = challengesStore.challenges.find(
    (c) => c.id === challengeId,
  );
  if (!challenge) return "0/0";

  return `${progress.current_count}/${challenge.target_count}`;
};

const getChallengeStatus = (challengeId: number): string => {
  const progress = challengesStore.userChallengeProgress.find(
    (p) => p.challenge_id === challengeId,
  );
  if (!progress) return "Not Started";

  switch (progress.status) {
    case "completed":
      return "Completed";
    case "in_progress":
      return "In Progress";
    case "not_started":
      return "Not Started";
    default:
      return "Unknown";
  }
};

const getChallengeStatusClass = (challengeId: number): string => {
  const progress = challengesStore.userChallengeProgress.find(
    (p) => p.challenge_id === challengeId,
  );
  if (!progress) return "bg-gray-100 text-gray-800";

  switch (progress.status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "in_progress":
      return "bg-purple-100 text-purple-800";
    case "not_started":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Action handlers
const viewChallengeDetails = (challengeId: number) => {
  router.push(`/challenges/${challengeId}`);
};

const startChallengeSubmission = (challengeId: number) => {
  router.push(`/challenges/${challengeId}/submit`);
};

const startChallenge = (challengeId: number) => {
  router.push(`/challenges/${challengeId}`);
};

// Load all necessary data
const loadData = async () => {
  try {
    isLoading.value = true;
    clearError();

    // Load all challenge data
    const result = await challengesStore.fetchAllChallengeData();

    if (!result.success) {
      throw new Error(String(result.error) || "Failed to load challenge data");
    }
  } catch (err: any) {
    setError(err.message || "An unexpected error occurred");
    console.error("Error loading challenge data:", err);
  } finally {
    isLoading.value = false;
  }
};

// Load data on mount
onMounted(loadData);
</script>

<style scoped>
.challenge-tracking-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
</style>
