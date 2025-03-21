import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { challengeServices } from "../lib/ChallengeServices";
import { supabase } from "../lib/supabase";
import type {
  Challenge,
  ChallengeProgress,
  ChallengeSubmission,
  MonthlyCompletion,
  ChallengeSummary,
} from "../types/models";

export const useChallengesStore = defineStore("challenges", () => {
  // State
  const challenges = ref<Challenge[]>([]);
  const userChallengeProgress = ref<ChallengeProgress[]>([]);
  const currentChallenge = ref<Challenge | null>(null);
  const currentProgress = ref<ChallengeProgress | null>(null);
  const challengeSubmissions = ref<ChallengeSubmission[]>([]);
  const completionByMonth = ref<MonthlyCompletion[]>([]);
  const loading = ref(false);

  // Computed properties
  const activeChallenge = computed(() => {
    if (!userChallengeProgress.value.length) return null;

    // Find active challenge with the most progress
    const inProgress = userChallengeProgress.value
      .filter((progress) => progress.status === "in_progress")
      .sort((a, b) => b.current_count - a.current_count);

    if (inProgress.length) {
      const progressItem = inProgress[0];
      const challenge = challenges.value.find(
        (c) => c.id === progressItem.challenge_id,
      );
      if (challenge) {
        return {
          id: challenge.id,
          title: challenge.title,
        };
      }
    }

    return null;
  });

  const activeChallengesWithDetails = computed(() => {
    return userChallengeProgress.value
      .filter((progress) => progress.status === "in_progress")
      .map((progress) => {
        const challenge = challenges.value.find(
          (c) => c.id === progress.challenge_id,
        );
        return {
          ...progress,
          title: challenge?.title || "Unknown Challenge",
          description: challenge?.description || "",
          target_count: challenge?.target_count || 0,
        };
      })
      .sort(
        (a, b) =>
          // Sort by completion percentage (descending)
          b.current_count / b.target_count - a.current_count / a.target_count,
      );
  });

  const completedChallengesWithDetails = computed(() => {
    return userChallengeProgress.value
      .filter(
        (progress) => progress.status === "completed" && progress.completed_at,
      )
      .map((progress) => {
        const challenge = challenges.value.find(
          (c) => c.id === progress.challenge_id,
        );
        // Find the last submission for this challenge to get the image
        const lastSubmission = challengeSubmissions.value
          .filter((sub) => sub.challenge_id === progress.challenge_id)
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )[0];

        return {
          ...progress,
          title: challenge?.title || "Unknown Challenge",
          description: challenge?.description || "",
          target_count: challenge?.target_count || 0,
          image_url: lastSubmission?.image_url,
        };
      })
      .sort(
        (a, b) =>
          // Sort by completion date (most recent first)
          new Date(b.completed_at!).getTime() -
          new Date(a.completed_at!).getTime(),
      );
  });

  const challengeSummary = computed<ChallengeSummary>(() => {
    const active = userChallengeProgress.value.filter(
      (p) => p.status === "in_progress",
    ).length;
    const completed = userChallengeProgress.value.filter(
      (p) => p.status === "completed",
    ).length;
    const total = challenges.value.length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    // Get last completed challenge
    let lastCompletedChallenge = undefined;

    if (completedChallengesWithDetails.value.length > 0) {
      const lastCompleted = completedChallengesWithDetails.value[0];
      lastCompletedChallenge = {
        id: lastCompleted.challenge_id,
        title: lastCompleted.title,
        completed_at: lastCompleted.completed_at!,
      };
    }

    return {
      totalActive: active,
      totalCompleted: completed,
      totalSubmissions: challengeSubmissions.value.length,
      completionRate: Math.round(completionRate),
      lastCompletedChallenge,
    };
  });

  // Methods
  async function fetchChallenges() {
    loading.value = true;
    try {
      console.log("Fetching challenges...");
      const data = await challengeServices.getChallenges();
      console.log("Challenges fetched:", data);
      challenges.value = data;
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching challenges:", error);
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
      console.log("Challenge fetched:", data);
      currentChallenge.value = data;
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching challenge:", error);
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
      console.log("Challenge progress fetched:", data);
      currentProgress.value = data;
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching challenge progress:", error);
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
        notes,
      );
      // Update current progress
      currentProgress.value = result.progress;

      // Refresh data after submission
      await fetchAllChallengeData();

      return { success: true, data: result };
    } catch (error) {
      console.error("Error submitting challenge progress:", error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  // New methods for enhanced challenge tracking

  async function fetchAllUserChallengeProgress() {
    loading.value = true;
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("user_challenge_progress")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      userChallengeProgress.value = data;
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching user challenge progress:", error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  async function fetchChallengeSubmissions() {
    loading.value = true;
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("challenge_submissions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      challengeSubmissions.value = data;
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching challenge submissions:", error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  async function calculateMonthlyCompletions() {
    loading.value = true;
    try {
      // Can only calculate if we have the completed challenges data
      if (userChallengeProgress.value.length === 0) {
        await fetchAllUserChallengeProgress();
      }

      // Filter completed challenges and group by month
      const completed = userChallengeProgress.value.filter(
        (p) => p.status === "completed" && p.completed_at,
      );

      // Group by month
      const monthsMap = new Map<string, number>();

      // Get the last 12 months to ensure we have entries for months with zero completions
      const today = new Date();
      for (let i = 0; i < 12; i++) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

        monthsMap.set(monthKey, 0);
      }

      // Count completions by month
      completed.forEach((challenge) => {
        if (!challenge.completed_at) return;

        const date = new Date(challenge.completed_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

        if (monthsMap.has(monthKey)) {
          monthsMap.set(monthKey, monthsMap.get(monthKey)! + 1);
        } else {
          monthsMap.set(monthKey, 1);
        }
      });

      // Convert to sorted array
      const sortedMonths = Array.from(monthsMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key, count]) => {
          const [year, month] = key.split("-");
          const date = new Date(Number(year), Number(month) - 1);
          return {
            month: date.toLocaleString("default", {
              month: "short",
              year: "numeric",
            }),
            count,
          };
        });

      completionByMonth.value = sortedMonths;
      return { success: true, data: sortedMonths };
    } catch (error) {
      console.error("Error calculating monthly completions:", error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  async function fetchAllChallengeData() {
    loading.value = true;
    try {
      await Promise.all([
        fetchChallenges(),
        fetchAllUserChallengeProgress(),
        fetchChallengeSubmissions(),
      ]);

      await calculateMonthlyCompletions();

      return { success: true };
    } catch (error) {
      console.error("Error fetching all challenge data:", error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  return {
    challenges,
    userChallengeProgress,
    currentChallenge,
    currentProgress,
    challengeSubmissions,
    completionByMonth,
    loading,
    // Computed
    activeChallenge,
    activeChallengesWithDetails,
    completedChallengesWithDetails,
    challengeSummary,
    // Methods
    fetchChallenges,
    fetchChallengeById,
    fetchChallengeProgress,
    submitChallengeProgress,
    fetchAllUserChallengeProgress,
    fetchChallengeSubmissions,
    calculateMonthlyCompletions,
    fetchAllChallengeData,
  };
});
