// src/stores/exercises.ts (enhanced version)
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { exerciseServices } from "../lib/ExerciseServices";
import { supabase } from "../lib/supabase";
import type { UserExerciseProgress, Exercise } from "../types/models";

export interface CategoryCount {
  name: string;
  completed: number;
  total: number;
}

export const useExercisesStore = defineStore("exercises", () => {
  const exercises = ref<Exercise[]>([]);
  const currentExercise = ref<Exercise | null>(null);
  const warmupExercises = ref<UserExerciseProgress[]>([]);
  const completedExercises = ref<UserExerciseProgress[]>([]);
  const exerciseCategories = ref<string[]>([]);
  const categoryProgress = ref<CategoryCount[]>([]);
  const exerciseStreak = ref({
    current: 0,
    best: 0,
    lastExerciseDate: null as string | null,
  });
  const loading = ref(false);

  // Computed properties
  const recentCompletedExercises = computed(() => {
    return [...completedExercises.value]
      .sort((a, b) => {
        if (!a.completed_at || !b.completed_at) return 0;
        return (
          new Date(b.completed_at).getTime() -
          new Date(a.completed_at).getTime()
        );
      })
      .slice(0, 5);
  });

  const totalExercisesCount = computed(() => {
    return exercises.value.length;
  });

  const completedExercisesCount = computed(() => {
    return completedExercises.value.length;
  });

  const exerciseCompletionPercentage = computed(() => {
    if (totalExercisesCount.value === 0) return 0;
    return Math.round(
      (completedExercisesCount.value / totalExercisesCount.value) * 100,
    );
  });

  // Fetch functions
  async function fetchExercisesByLessonId(lessonId: number) {
    loading.value = true;
    try {
      console.log(`Fetching exercises for lesson ID: ${lessonId}`);
      const data = await exerciseServices.getExercisesByLessonId(lessonId);
      console.log("Exercises fetched:", data);
      exercises.value = data;
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching exercises:", error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  async function fetchExerciseById(id: number) {
    loading.value = true;
    try {
      console.log(`Fetching exercise with ID: ${id}`);
      const data = await exerciseServices.getExerciseById(id);
      console.log("Exercise fetched:", data);
      currentExercise.value = data;
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching exercise:", error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  async function fetchWarmupExercises() {
    loading.value = true;
    try {
      console.log("Fetching warmup exercises");
      const data = await exerciseServices.getWarmupExercises();
      console.log("Warmup exercises fetched:", data);
      warmupExercises.value = data;
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching warmup exercises:", error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  // New functions for exercise tracking
  async function fetchCompletedExercises() {
    loading.value = true;
    try {
      console.log("Fetching completed exercises");
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("user_exercise_progress")
        .select(
          `
          *,
          exercises(*)
        `,
        )
        .eq("user_id", user.id)
        .eq("status", "completed")
        .order("completed_at", { ascending: false });

      if (error) throw error;

      // Map data to include exercise title and other details
      const mappedData = data.map((progress) => ({
        ...progress,
        title: progress.exercises?.title || "Unknown Exercise",
      }));

      completedExercises.value = mappedData;
      return { success: true, data: mappedData };
    } catch (error) {
      console.error("Error fetching completed exercises:", error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  async function fetchExerciseCategories() {
    loading.value = true;
    try {
      const { data, error } = await supabase
        .from("exercises")
        .select("category")
        .not("category", "is", null);

      if (error) throw error;

      // Extract unique categories
      const categories = [...new Set(data.map((item) => item.category))].filter(
        (category) => category !== null && category !== "",
      );

      exerciseCategories.value = categories as string[];
      return { success: true, data: categories };
    } catch (error) {
      console.error("Error fetching exercise categories:", error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  async function fetchExerciseCategoryProgress() {
    loading.value = true;
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");

      // First get all exercises with their categories
      const { data: allExercises, error: exercisesError } = await supabase
        .from("exercises")
        .select("id, category")
        .not("category", "is", null);

      if (exercisesError) throw exercisesError;

      // Then get completed exercises
      const { data: completedIds, error: completedError } = await supabase
        .from("user_exercise_progress")
        .select("exercise_id")
        .eq("user_id", user.id)
        .eq("status", "completed");

      if (completedError) throw completedError;

      // Build a set of completed exercise IDs for quick lookup
      const completedIdSet = new Set(
        completedIds.map((item) => item.exercise_id),
      );

      // Group by category and count totals and completed
      const categoryCounts: Record<
        string,
        { total: number; completed: number }
      > = {};

      allExercises.forEach((exercise) => {
        const category = exercise.category || "Uncategorized";

        if (!categoryCounts[category]) {
          categoryCounts[category] = { total: 0, completed: 0 };
        }

        categoryCounts[category].total++;

        if (completedIdSet.has(exercise.id)) {
          categoryCounts[category].completed++;
        }
      });

      // Convert to the format needed for the component
      const result = Object.entries(categoryCounts).map(([name, counts]) => ({
        name,
        ...counts,
      }));

      categoryProgress.value = result;
      return { success: true, data: result };
    } catch (error) {
      console.error("Error fetching category progress:", error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  async function calculateExerciseStreak() {
    loading.value = true;
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");

      // Get completed exercises ordered by completion date
      const { data, error } = await supabase
        .from("user_exercise_progress")
        .select("completed_at")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .order("completed_at", { ascending: false });

      if (error) throw error;

      // No completed exercises yet
      if (!data || data.length === 0) {
        exerciseStreak.value = { current: 0, best: 0, lastExerciseDate: null };
        return { success: true, data: exerciseStreak.value };
      }

      // Process dates to calculate streak
      const dates = data
        .filter((item) => item.completed_at)
        .map(
          (item) =>
            new Date(item.completed_at as string).toISOString().split("T")[0],
        );

      // Get unique dates (in case multiple exercises were completed on the same day)
      const uniqueDates = [...new Set(dates)].sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime(),
      );

      // Calculate current streak
      let currentStreak = 1;
      let bestStreak = 1;

      // Start from the most recent date
      let currentDate = new Date(uniqueDates[0]);

      // Check for consecutive days
      for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(uniqueDates[i]);

        // Calculate difference in days
        const diffTime = currentDate.getTime() - prevDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Consecutive day
          currentStreak++;
          bestStreak = Math.max(bestStreak, currentStreak);
        } else {
          // Streak broken
          currentStreak = 1;
        }

        currentDate = prevDate;
      }

      // Check if the streak is still active (exercise done today or yesterday)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const mostRecentDate = new Date(uniqueDates[0]);
      mostRecentDate.setHours(0, 0, 0, 0);

      const daysSinceLastExercise = Math.floor(
        (today.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      // If it's been more than 1 day since the last exercise, the streak is broken
      if (daysSinceLastExercise > 1) {
        currentStreak = 0;
      }

      exerciseStreak.value = {
        current: currentStreak,
        best: bestStreak,
        lastExerciseDate: uniqueDates[0],
      };

      return { success: true, data: exerciseStreak.value };
    } catch (error) {
      console.error("Error calculating exercise streak:", error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  // Load all exercise tracking data
  async function loadExerciseTrackingData() {
    loading.value = true;
    try {
      await Promise.all([
        fetchCompletedExercises(),
        fetchExerciseCategories(),
        fetchExerciseCategoryProgress(),
        calculateExerciseStreak(),
      ]);

      return { success: true };
    } catch (error) {
      console.error("Error loading exercise tracking data:", error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  async function addExercise(exerciseData: Partial<Exercise>) {
    loading.value = true;
    try {
      console.log("Adding new exercise:", exerciseData);
      const { data, error } = await supabase
        .from("exercises")
        .insert([exerciseData])
        .select();
      if (error) throw error;
      // Add the new exercise to the store if it belongs to the current lesson
      if (data && data.length > 0) {
        console.log("Exercise added:", data[0]);
        exercises.value.push(data[0]);
        // Sort by order number
        exercises.value.sort((a, b) => a.order_number - b.order_number);
      }
      return { success: true, data: data?.[0] };
    } catch (error) {
      console.error("Error adding exercise:", error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  async function submitExercise(
    exerciseId: number,
    imageUrl: string,
    notes: string,
    selfRating?: number,
  ) {
    loading.value = true;
    try {
      console.log(`Submitting exercise ID: ${exerciseId}`);
      const result = await exerciseServices.submitExercise(
        exerciseId,
        imageUrl,
        notes,
        selfRating,
      );

      // After submitting, refresh the completed exercises list
      await fetchCompletedExercises();

      // Recalculate streak
      await calculateExerciseStreak();

      return { success: true, data: result };
    } catch (error) {
      console.error("Error submitting exercise:", error);
      return { success: false, error };
    } finally {
      loading.value = false;
    }
  }

  return {
    exercises,
    currentExercise,
    warmupExercises,
    completedExercises,
    recentCompletedExercises,
    exerciseCategories,
    categoryProgress,
    exerciseStreak,
    totalExercisesCount,
    completedExercisesCount,
    exerciseCompletionPercentage,
    loading,
    fetchExercisesByLessonId,
    fetchExerciseById,
    fetchWarmupExercises,
    fetchCompletedExercises,
    fetchExerciseCategories,
    fetchExerciseCategoryProgress,
    calculateExerciseStreak,
    loadExerciseTrackingData,
    addExercise,
    submitExercise,
  };
});
