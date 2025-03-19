import { defineStore } from 'pinia';
import { ref } from 'vue';
import { exerciseServices } from '../lib/ExerciseServices';
import { supabase } from '../lib/supabase';

export const useExercisesStore = defineStore('exercises', () => {
  const exercises = ref([]);
  const currentExercise = ref(null);
  const warmupExercises = ref([]);
  const loading = ref(false);

  async function fetchExercisesByLessonId(lessonId) {
    loading.value = true;
    try {
      console.log(`Fetching exercises for lesson ID: ${lessonId}`);
      const data = await exerciseServices.getExercisesByLessonId(lessonId);
      console.log('Exercises fetched:', data);
      exercises.value = data;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching exercises:', error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  async function fetchExerciseById(id) {
    loading.value = true;
    try {
      console.log(`Fetching exercise with ID: ${id}`);
      const data = await exerciseServices.getExerciseById(id);
      console.log('Exercise fetched:', data);
      currentExercise.value = data;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching exercise:', error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  async function fetchWarmupExercises() {
    loading.value = true;
    try {
      console.log('Fetching warmup exercises');
      const data = await exerciseServices.getWarmupExercises();
      console.log('Warmup exercises fetched:', data);
      warmupExercises.value = data;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching warmup exercises:', error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  async function addExercise(exerciseData) {
    loading.value = true;
    try {
      console.log('Adding new exercise:', exerciseData);
      const { data, error } = await supabase.from('exercises').insert([exerciseData]).select();

      if (error) throw error;

      // Add the new exercise to the store if it belongs to the current lesson
      if (data && data.length > 0) {
        console.log('Exercise added:', data[0]);
        exercises.value.push(data[0]);
        // Sort by order number
        exercises.value.sort((a, b) => a.order_number - b.order_number);
      }

      return { success: true, data: data?.[0] };
    } catch (error) {
      console.error('Error adding exercise:', error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  async function submitExercise(exerciseId, imageUrl, notes, selfRating) {
    loading.value = true;
    try {
      console.log(`Submitting exercise ID: ${exerciseId}`);
      const result = await exerciseServices.submitExercise(exerciseId, imageUrl, notes, selfRating);

      return { success: true, data: result };
    } catch (error) {
      console.error('Error submitting exercise:', error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  return {
    exercises,
    currentExercise,
    warmupExercises,
    loading,
    fetchExercisesByLessonId,
    fetchExerciseById,
    fetchWarmupExercises,
    addExercise,
    submitExercise,
  };
});
