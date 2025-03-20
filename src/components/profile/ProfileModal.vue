<template>
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <!-- Modal backdrop -->
    <div
      class="fixed inset-0 bg-black opacity-50"
      @click="$emit('close')"
    ></div>

    <!-- Modal content -->
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md z-10 relative">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Edit Profile</h2>
          <button
            class="text-gray-400 hover:text-gray-600"
            @click="$emit('close')"
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

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <!-- Avatar -->
          <div class="flex flex-col items-center mb-4">
            <div class="relative">
              <div class="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                <img
                  v-if="previewUrl || formData.avatar_url"
                  :src="previewUrl || formData.avatar_url"
                  alt="Profile avatar"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-gray-500 text-xl"
                >
                  {{ getUserInitials() }}
                </div>
              </div>
              <label
                for="avatar-upload"
                class="absolute bottom-0 right-0 bg-white rounded-full p-1 border cursor-pointer shadow-sm hover:shadow"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleAvatarChange"
              />
            </div>
          </div>

          <!-- Name -->
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Name</label
            >
            <input
              id="name"
              v-model="formData.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your full name"
              required
            />
          </div>

          <!-- Email (readonly) -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Email</label
            >
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              readonly
              disabled
            />
            <p class="mt-1 text-xs text-gray-500">
              Contact support to change your email address
            </p>
          </div>

          <!-- Bio -->
          <div>
            <label
              for="bio"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Bio</label
            >
            <textarea
              id="bio"
              v-model="formData.bio"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell us a bit about yourself"
            ></textarea>
          </div>

          <!-- Website -->
          <div>
            <label
              for="website"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Website</label
            >
            <input
              id="website"
              v-model="formData.website"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://yourdomain.com"
            />
          </div>

          <!-- Submit buttons -->
          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              @click="$emit('close')"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 border border-transparent rounded-md text-white hover:bg-blue-600"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting">Saving...</span>
              <span v-else>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import type { User } from "../../types/models";

// Define props
const props = defineProps<{
  user: User;
}>();

// Define emits
const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", data: Partial<User>): void;
}>();

// State
const formData = reactive<Partial<User>>({
  name: "",
  email: "",
  bio: "",
  avatar_url: "",
  website: "",
  social_links: {},
});

const isSubmitting = ref(false);
const previewUrl = ref<string | null>(null);
const avatarFile = ref<File | null>(null);

// Initialize form data
onMounted(() => {
  Object.assign(formData, props.user);
});

// Methods
const getUserInitials = () => {
  if (!formData.name) return "?";

  return formData.name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};

const handleAvatarChange = (event: Event) => {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files[0]) {
    avatarFile.value = input.files[0];

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(input.files[0]);
  }
};

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;

    // If we have a new avatar file, we would upload it here
    // This would typically involve a call to a file upload service or API
    // For example:
    let avatarUrl = formData.avatar_url;

    if (avatarFile.value) {
      // This is a placeholder for actual file upload logic
      // In a real app, you would use your API to upload the file
      // avatarUrl = await uploadFile(avatarFile.value);

      // For demo purposes, we'll just use the preview URL
      avatarUrl = previewUrl.value;
    }

    // Prepare updated profile data
    const updatedProfile: Partial<User> = {
      ...formData,
      avatar_url: avatarUrl,
    };

    // Emit save event with updated profile
    emit("save", updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
