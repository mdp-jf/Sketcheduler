<template>
  <div class="lesson-notes-container">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">My Notes & Reflections</h2>
        <div class="flex space-x-2">
          <button
            v-if="isEditing"
            class="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            @click="cancelEdit"
          >
            Cancel
          </button>
          <button
            v-if="isEditing"
            :disabled="isSaving"
            class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            @click="saveNotes"
          >
            {{ isSaving ? "Saving..." : "Save" }}
          </button>
          <button
            v-else
            class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            @click="startEdit"
          >
            Edit
          </button>
        </div>
      </div>

      <!-- View Mode -->
      <div v-if="!isEditing" class="space-y-4">
        <div>
          <h3 class="text-lg font-semibold mb-2">Notes</h3>
          <div v-if="notes" class="bg-gray-50 p-4 rounded whitespace-pre-wrap">
            {{ notes }}
          </div>
          <div v-else class="bg-gray-50 p-4 rounded text-gray-500 italic">
            No notes added yet.
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-2">Reflection</h3>
          <div
            v-if="reflection"
            class="bg-gray-50 p-4 rounded whitespace-pre-wrap"
          >
            {{ reflection }}
          </div>
          <div v-else class="bg-gray-50 p-4 rounded text-gray-500 italic">
            No reflection added yet.
          </div>
        </div>
      </div>

      <!-- Edit Mode -->
      <div v-else class="space-y-4">
        <div>
          <label for="notes" class="block text-lg font-semibold mb-2"
            >Notes</label
          >
          <textarea
            id="notes"
            v-model="editedNotes"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="4"
            placeholder="Add your notes about this lesson here..."
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            Use notes to record important points, techniques, or reference
            materials for this lesson.
          </p>
        </div>

        <div>
          <label for="reflection" class="block text-lg font-semibold mb-2"
            >Reflection</label
          >
          <textarea
            id="reflection"
            v-model="editedReflection"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="4"
            placeholder="Reflect on what you've learned and how you'll apply it..."
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            Use reflections to document your learning journey, challenges faced,
            and personal insights.
          </p>
        </div>
      </div>

      <div v-if="error" class="mt-4 text-red-500">{{ error }}</div>
      <div v-if="successMessage" class="mt-4 text-green-500">
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits } from "vue";
import { lessonNotesService } from "../lib/LessonNotesService";
import { useToastStore } from "../stores/toast";

// Props
const props = defineProps<{
  lessonId: number;
}>();

// Emits
const emit = defineEmits<{
  (e: "saved"): void;
}>();

// Store
const toastStore = useToastStore();

// State
const notes = ref<string>("");
const reflection = ref<string>("");
const editedNotes = ref<string>("");
const editedReflection = ref<string>("");
const isEditing = ref<boolean>(false);
const isSaving = ref<boolean>(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

// Load existing notes and reflections
const loadNotes = async () => {
  try {
    error.value = null;
    const data = await lessonNotesService.getLessonNotes(props.lessonId);

    if (data) {
      notes.value = data.notes || "";
      reflection.value = data.reflection || "";
      // Also prepare the edited versions
      editedNotes.value = notes.value;
      editedReflection.value = reflection.value;
    }
  } catch (err: any) {
    console.error("Error loading lesson notes:", err);
    error.value = "Failed to load notes. Please try again.";
  }
};

// Start editing
const startEdit = () => {
  isEditing.value = true;
  editedNotes.value = notes.value;
  editedReflection.value = reflection.value;
  error.value = null;
  successMessage.value = null;
};

// Cancel editing
const cancelEdit = () => {
  isEditing.value = false;
  editedNotes.value = notes.value;
  editedReflection.value = reflection.value;
  error.value = null;
  successMessage.value = null;
};

// Save notes and reflections
const saveNotes = async () => {
  try {
    isSaving.value = true;
    error.value = null;
    successMessage.value = null;

    const data = await lessonNotesService.saveLessonNotes(
      props.lessonId,
      editedNotes.value,
      editedReflection.value,
    );

    if (data) {
      notes.value = editedNotes.value;
      reflection.value = editedReflection.value;
      isEditing.value = false;

      // Show success message
      toastStore.success("Notes and reflections saved successfully");

      // Emit saved event
      emit("saved");
    }
  } catch (err: any) {
    console.error("Error saving lesson notes:", err);
    error.value = "Failed to save notes. Please try again.";
    toastStore.error("Failed to save notes. Please try again.");
  } finally {
    isSaving.value = false;
  }
};

// Load notes on component mount
onMounted(loadNotes);
</script>

<style scoped>
.lesson-notes-container {
  margin-top: 1.5rem;
}
</style>
