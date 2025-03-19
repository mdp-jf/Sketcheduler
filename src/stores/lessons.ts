// stores/lessons.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { lessonServices } from '../lib/LessonsServices'

export const useLessonsStore = defineStore('lessons', () => {
  const lessons = ref([])
  const currentLesson = ref(null)
  const loading = ref(false)
  
  async function fetchLessons() {
    loading.value = true
    try {
      lessons.value = await lessonServices.getLessons()
      return { success: true }
    } catch (error) {
      console.error('Error fetching lessons:', error)
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }
  
  async function fetchLessonById(id) {
    loading.value = true
    try {
      currentLesson.value = await lessonServices.getLessonById(id)
      return { success: true }
    } catch (error) {
      console.error('Error fetching lesson:', error)
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }
  
  async function addLesson(lessonData) {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('lessons')
        .insert([lessonData])
        .select()
      
      if (error) throw error
      
      // Add the new lesson to the store
      if (data && data.length > 0) {
        lessons.value.push(data[0])
        // Sort by order number
        lessons.value.sort((a, b) => a.order_number - b.order_number)
      }
      
      return { success: true, data: data?.[0] }
    } catch (error) {
      console.error('Error adding lesson:', error)
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }
  
  return {
    lessons,
    currentLesson,
    loading,
    fetchLessons,
    fetchLessonById,
    addLesson
  }
})