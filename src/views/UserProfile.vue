<template>
  <div class="profile-container">
    <!-- Loading state -->
    <BaseLoading v-if="isLoading" message="Loading your profile..." />

    <!-- Error state -->
    <BaseError v-else-if="error" :message="error">
      <template #actions>
        <button
          class="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="loadUserProfile"
        >
          Try Again
        </button>
      </template>
    </BaseError>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- User info card -->
      <div class="lg:col-span-1">
        <ProfileInfoCard
          v-if="user"
          :user="user"
          @edit="showEditProfileModal = true"
        />
      </div>

      <!-- User stats and activity -->
      <div class="lg:col-span-2">
        <div class="space-y-6">
          <!-- Progress summary -->
          <ProfileStatsCard :user-stats="userStats" />

          <!-- Recent activity -->
          <ProfileActivityCard :activities="recentActivity" />
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <EditProfileModal
      v-if="showEditProfileModal"
      :user="user"
      @close="showEditProfileModal = false"
      @save="handleProfileUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../stores/user";
import { useToastStore } from "../stores/toast";
import { useLoading } from "../composables/useLoading";
import { useError } from "../composables/useError";
import BaseLoading from "../components/BaseLoading.vue";
import BaseError from "../components/BaseError.vue";
import ProfileInfoCard from "../components/profile/InfoCard.vue";
import ProfileStatsCard from "../components/profile/StatsCard.vue";
import ProfileActivityCard from "../components/profile/ActivityCard.vue";
import EditProfileModal from "../components/profile/ProfileModal.vue";
import type { User } from "../types/models";

// Define component name
defineOptions({
  name: "ProfileView",
});

// Stores
const userStore = useUserStore();
const toastStore = useToastStore();

// Composables
const { isLoading } = useLoading(true);
const { error, setError, clearError } = useError();

// State
const showEditProfileModal = ref(false);

// Computed
const user = computed(() => userStore.userProfile);
const userStats = computed(() => userStore.userStats);
const recentActivity = computed(() => userStore.userActivity);

// Load user profile data
const loadUserProfile = async () => {
  try {
    isLoading.value = true;
    clearError();

    // Load user profile, stats, and activity
    const profileResult = await userStore.fetchUserProfile();
    if (!profileResult.success) {
      setError(profileResult.error || "Failed to load user profile");
      return;
    }

    const statsResult = await userStore.fetchUserStats();
    if (!statsResult.success) {
      console.error("Failed to load user stats:", statsResult.error);
      // Continue even if stats fail - non-critical
    }

    const activityResult = await userStore.fetchUserActivity();
    if (!activityResult.success) {
      console.error("Failed to load user activity:", activityResult.error);
      // Continue even if activity fails - non-critical
    }
  } catch (err: any) {
    setError(err.message || "An unexpected error occurred");
    console.error("Error loading user profile:", err);
  } finally {
    isLoading.value = false;
  }
};

// Handle profile update
const handleProfileUpdate = async (updatedProfile: Partial<User>) => {
  try {
    isLoading.value = true;
    const result = await userStore.updateUserProfile(updatedProfile);

    if (result.success) {
      toastStore.success("Profile updated successfully");
      showEditProfileModal.value = false;
    } else {
      toastStore.error(result.error || "Failed to update profile");
    }
  } catch (err: any) {
    toastStore.error(err.message || "An unexpected error occurred");
    console.error("Error updating profile:", err);
  } finally {
    isLoading.value = false;
  }
};

// Load data on mount
onMounted(loadUserProfile);
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
</style>
