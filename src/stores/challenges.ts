// stores/challenges.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { challengeServices } from '../lib/ChallengeServices'
import { supabase } from '../lib/supabase'

export const useChallengesStore = defineStore('challenges', () => {
  const challenges = ref([])
  const currentChallenge = ref(null)
  const currentProgress = ref(null)
  const loading = ref(false)
  
  async function fetchChallenges() {
    loading.value = true
    try {
      challenges.value = await challengeServices.getChallenges()
      return { success: true }
    } catch (error) {
      console.error('Error fetching challenges:', error)
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }
  
  async function fetchChallengeById(id) {
    loading.value = true
    try {
      currentChallenge.value = await challengeServices.getChallengeById(id)
      return { success: true }
    } catch (error) {
      console.error('Error fetching challenge:', error)
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }
  
  async function fetchChallengeProgress(challengeId) {
    loading.value = true
    try {
      currentProgress.value = await challengeServices.getChallengeProgress(challengeId)
      return { success: true }
    } catch (error) {
      console.error('Error fetching challenge progress:', error)
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }
  
  async function submitChallengeProgress(challengeId, count, imageUrl, notes) {
    loading.value = true
    try {
      const result = await challengeServices.submitChallengeProgress(
        challengeId, 
        count, 
        imageUrl, 
        notes
      )
      
      // Update current progress
      currentProgress.value = result.progress
      
      return { success: true, data: result }
    } catch (error) {
      console.error('Error submitting challenge progress:', error)
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }
  
  return {
    challenges,
    currentChallenge,
    currentProgress,
    loading,
    fetchChallenges,
    fetchChallengeById,
    fetchChallengeProgress,
    submitChallengeProgress
  }
})