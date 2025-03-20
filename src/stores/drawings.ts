import { defineStore } from "pinia";
import { ref } from "vue";
import { drawingServices } from "../lib/FreeDrawingServices";

export const useDrawingsStore = defineStore("drawings", () => {
  const drawings = ref([]);
  const prompts = ref([]);
  const loading = ref(false);

  async function fetchUserDrawings() {
    loading.value = true;
    try {
      console.log("Fetching user drawings...");
      const data = await drawingServices.getUserDrawings();
      console.log("User drawings fetched:", data);
      drawings.value = data;
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching user drawings:", error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  async function fetchPrompts() {
    loading.value = true;
    try {
      console.log("Fetching drawing prompts...");
      const data = await drawingServices.getPrompts();
      console.log("Prompts fetched:", data);
      prompts.value = data;
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching prompts:", error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  async function createPrompt(promptText, category) {
    loading.value = true;
    try {
      console.log("Creating new prompt:", promptText, category);
      const result = await drawingServices.createPrompt(promptText, category);

      // Add new prompt to the list
      if (result) {
        await fetchPrompts(); // Refresh the prompts list
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("Error creating prompt:", error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  async function submitFreeDrawing(imageUrl, timeSpent, notes, promptId) {
    loading.value = true;
    try {
      console.log("Submitting drawing:", {
        imageUrl,
        timeSpent,
        notes,
        promptId,
      });
      const result = await drawingServices.submitFreeDrawing(
        imageUrl,
        timeSpent,
        notes,
        promptId,
      );

      // Add drawing to the list
      await fetchUserDrawings(); // Refresh the drawings list

      return { success: true, data: result };
    } catch (error) {
      console.error("Error submitting drawing:", error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  return {
    drawings,
    prompts,
    loading,
    fetchUserDrawings,
    fetchPrompts,
    createPrompt,
    submitFreeDrawing,
  };
});
