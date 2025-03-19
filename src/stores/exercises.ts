// stores/exercises.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { exerciseServices } from '../lib/ExerciseServices'
import { supabase } from '../lib/supabase'

export const useExercisesStore = defineStore('exercises', () => {
  const exercises = ref([])
  const currentExercise = ref(null)
  const warmupExercises = ref([])
  const loading = ref(false)
  
  async function fetchExercisesByLessonId(lessonId) {
    loading.value = true
    try {
      exercises.value = await exerciseServices.getExercisesByLessonId(lessonId)
      return { success: true }
    } catch (error) {
      console.error('Error fetching exercises:', error)
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }
  
  async function fetchExerciseById(id) {
    loading.value = true
    try {
      currentExercise.value = await exerciseServices.getExerciseById(id)
      return { success: true }
    } catch (error) {
      console.error('Error fetching exercise:', error)
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }
  
  async function fetchWarmupExercises() {
    loading.value = true
    try {
      warmupExercises.value = await exerciseServices.getWarmupExercises()
      return { success: true }
    } catch (error) {
      console.error('Error fetching warmup exercises:', error)
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }
  
  async function submitExercise(exerciseId, imageUrl, notes, selfRating) {
    loading.value = true
    try {
      const result = await exerciseServices.submitExercise(
        exerciseId, 
        imageUrl, 
        notes, 
        selfRating
      )
      
      return { success: true, data: result }
    } catch (error) {
      console.error('Error submitting exercise:', error)
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }
  
  async function updateWarmupUse(exerciseId) {
    loading.value = true
    try {
      const result = await exerciseServices.updateWarmupUse(exerciseId)
      
      // Refresh warmup exercises
      await fetchWarmupExercises()
      
      return { success: true, data: result }
    } catch (error) {
      console.error('Error updating warmup use:', error)
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }
  
  async function addExercise(exerciseData) {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('exercises')
        .insert([exerciseData])
        .select()
      
      if (error) throw error
      
      // Add the new exercise to the store if it belongs to the current lesson
      if (data && data.length > 0 && exercises.value.some(e => e.lesson_id === data[0].lesson_id)) {
        exercises.value.push(data[0])
        // Sort by order number
        exercises.value.sort((a, b) => a.order_number - b.order_number)
      }
      
      return { success: true, data: data?.[0] }
    } catch (error) {
      console.error('Error adding exercise:', error)
      return { success: false, error }
    } finally {
      loading.value = false
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
    submitExercise,
    updateWarmupUse,
    addExercise
  }
})