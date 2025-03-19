import { defineStore } from 'pinia';
import { ref } from 'vue';
import { challengeServices } from '../lib/ChallengeServices';

export const useChallengesStore = defineStore('challenges', () => {
  const challenges = ref([]);
  const currentChallenge = ref(null);
  const currentProgress = ref(null);
  const loading = ref(false);

  async function fetchChallenges() {
    loading.value = true;
    try {
      console.log('Fetching challenges...');
      const data = await challengeServices.getChallenges();
      console.log('Challenges fetched:', data);
      challenges.value = data;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching challenges:', error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  async function fetchChallengeById(id) {
    loading.value = true;
    try {
      console.log(`Fetching challenge with ID: ${id}`);
      const data = await challengeServices.getChallengeById(id);
      console.log('Challenge fetched:', data);
      currentChallenge.value = data;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching challenge:', error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  async function fetchChallengeProgress(challengeId) {
    loading.value = true;
    try {
      console.log(`Fetching progress for challenge ID: ${challengeId}`);
      const data = await challengeServices.getChallengeProgress(challengeId);
      console.log('Challenge progress fetched:', data);
      currentProgress.value = data;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching challenge progress:', error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  async function submitChallengeProgress(challengeId, count, imageUrl, notes) {
    loading.value = true;
    try {
      console.log(`Submitting progress for challenge ID: ${challengeId}`);
      const result = await challengeServices.submitChallengeProgress(
        challengeId,
        count,
        imageUrl,
        notes
      );

      // Update current progress
      currentProgress.value = result.progress;

      return { success: true, data: result };
    } catch (error) {
      console.error('Error submitting challenge progress:', error);
      return { success: false, error };
    } finally {
      loading.value = false;
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
    submitChallengeProgress,
  };
});
