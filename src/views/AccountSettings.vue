<template>
  <div class="account-settings">
    <h1 class="text-2xl font-bold mb-6">Account Settings</h1>

    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-bold mb-4">Authentication</h2>

      <!-- Change Password Form -->
      <form class="mb-6" @submit.prevent="changePassword">
        <div class="space-y-4">
          <div>
            <label
              for="current-password"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Current Password
            </label>
            <input
              id="current-password"
              v-model="passwordForm.currentPassword"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              for="new-password"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <input
              id="new-password"
              v-model="passwordForm.newPassword"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              for="confirm-password"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              v-model="passwordForm.confirmPassword"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div v-if="passwordError" class="text-red-500 text-sm">
            {{ passwordError }}
          </div>

          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :disabled="changingPassword"
          >
            <span v-if="changingPassword">Changing Password...</span>
            <span v-else>Change Password</span>
          </button>
        </div>
      </form>

      <div class="border-t pt-4">
        <h3 class="text-lg font-medium mb-2">Email Address</h3>
        <p class="text-gray-600 mb-2">
          Your current email address is <strong>{{ userEmail }}</strong>
        </p>
        <p class="text-sm text-gray-500">
          To change your email address, please contact support.
        </p>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-bold mb-4">Data & Privacy</h2>

      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-medium mb-2">Download Your Data</h3>
          <p class="text-gray-600 mb-2">
            Download all your personal data including your profile, drawings,
            and activity history.
          </p>
          <button
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            :disabled="isExporting"
            @click="downloadData"
          >
            <span v-if="isExporting">Preparing Export...</span>
            <span v-else>Download Data</span>
          </button>
        </div>

        <div class="border-t pt-4">
          <h3 class="text-lg font-medium mb-2 text-red-600">Delete Account</h3>
          <p class="text-gray-600 mb-2">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>
          <button
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            @click="confirmDelete = true"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Account Confirmation Modal -->
    <div
      v-if="confirmDelete"
      class="fixed inset-0 flex items-center justify-center z-50"
    >
      <div
        class="fixed inset-0 bg-black opacity-50"
        @click="confirmDelete = false"
      ></div>
      <div
        class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-10 relative"
      >
        <h3 class="text-xl font-bold mb-4 text-red-600">Delete Account</h3>
        <p class="mb-4 text-gray-700">
          Are you sure you want to delete your account? All your data will be
          permanently removed. This action cannot be undone.
        </p>
        <div class="mb-4">
          <label
            for="confirm-deletion"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Type "DELETE" to confirm
          </label>
          <input
            id="confirm-deletion"
            v-model="deleteConfirmation"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
            placeholder="DELETE"
          />
        </div>
        <div class="flex justify-end space-x-3">
          <button
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            @click="confirmDelete = false"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 bg-red-500 border border-transparent rounded-md text-white hover:bg-red-600"
            :disabled="deletingAccount || deleteConfirmation !== 'DELETE'"
            @click="deleteAccount"
          >
            <span v-if="deletingAccount">Deleting...</span>
            <span v-else>Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useToastStore } from "../stores/toast";
import { useUserStore } from "../stores/user";

// Define component name
defineOptions({
  name: "AccountSettingsView",
});

// Router
const router = useRouter();

// Stores
const authStore = useAuthStore();
const toastStore = useToastStore();
const userStore = useUserStore();

// State
const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const passwordError = ref("");
const changingPassword = ref(false);
const confirmDelete = ref(false);
const deletingAccount = ref(false);
const isExporting = ref(false);
const deleteConfirmation = ref("");

// Computed
const userEmail = computed(() => authStore.user?.email || "");

// Methods
const changePassword = async () => {
  try {
    // Reset error
    passwordError.value = "";

    // Validate passwords
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      passwordError.value = "New passwords do not match";
      return;
    }

    if (passwordForm.value.newPassword.length < 6) {
      passwordError.value = "New password must be at least 6 characters";
      return;
    }

    // Set loading state
    changingPassword.value = true;

    // Call the store method
    const response = await userStore.changePassword(
      passwordForm.value.currentPassword,
      passwordForm.value.newPassword,
    );

    if (!response.success) {
      throw new Error(response.error);
    }

    // Show success message
    toastStore.success("Password changed successfully");

    // Reset form
    passwordForm.value.currentPassword = "";
    passwordForm.value.newPassword = "";
    passwordForm.value.confirmPassword = "";
  } catch (error: any) {
    passwordError.value = error.message || "Failed to change password";
  } finally {
    changingPassword.value = false;
  }
};

const downloadData = async () => {
  try {
    isExporting.value = true;

    const response = await userStore.exportUserData();

    if (!response.success) {
      throw new Error(response.error);
    }

    // Create download link and trigger download
    const dataStr = JSON.stringify(response.data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(dataBlob);
    downloadLink.download = `user-data-export-${new Date().toISOString()}.json`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    toastStore.success("Data downloaded successfully");
  } catch (error: any) {
    toastStore.error(error.message || "Failed to export data");
  } finally {
    isExporting.value = false;
  }
};

const deleteAccount = async () => {
  try {
    if (deleteConfirmation.value !== "DELETE") {
      throw new Error("Please type DELETE to confirm account deletion");
    }

    deletingAccount.value = true;

    const response = await userStore.deleteAccount();

    if (!response.success) {
      throw new Error(response.error);
    }

    // Sign out and redirect
    await authStore.signOut();
    toastStore.success("Your account has been deleted");
    router.push("/sign-in");
  } catch (error: any) {
    toastStore.error(error.message || "Failed to delete account");
  } finally {
    deletingAccount.value = false;
    confirmDelete.value = false;
  }
};
</script>

<style scoped>
.account-settings {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}
</style>
