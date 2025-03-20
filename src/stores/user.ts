// src/stores/user.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../lib/supabase";
import type {
  User,
  UserStats,
  UserActivity,
  ApiResponse,
} from "../types/models";

export const useUserStore = defineStore("user", () => {
  // State
  const userProfile = ref<User | null>(null);
  const userStats = ref<UserStats>({
    totalDrawings: 0,
    totalHoursDrawing: 0,
    completedLessons: 0,
    totalLessons: 0,
    lessonCompletionPercentage: 0,
    completedChallenges: 0,
    activeChallengeSummary: [],
  });
  const userActivity = ref<UserActivity[]>([]);
  const loading = ref(false);

  // Fetch user profile
  async function fetchUserProfile(): Promise<ApiResponse<User>> {
    loading.value = true;
    try {
      const authUser = (await supabase.auth.getUser()).data.user;
      if (!authUser) {
        throw new Error("User not authenticated");
      }

      // Get user profile data
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (error) {
        // If profile doesn't exist, create it
        if (error.code === "PGRST116") {
          const newProfile = {
            id: authUser.id,
            email: authUser.email,
            name: authUser.email?.split("@")[0] || "User",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const { data: createdData, error: createError } = await supabase
            .from("user_profiles")
            .insert([newProfile])
            .select()
            .single();

          if (createError) throw createError;
          userProfile.value = createdData;
          return { success: true, data: createdData };
        }
        throw error;
      }

      userProfile.value = data;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      return {
        success: false,
        error: error.message || "Failed to load user profile",
      };
    } finally {
      loading.value = false;
    }
  }

  // Update user profile
  async function updateUserProfile(
    profileData: Partial<User>,
  ): Promise<ApiResponse<User>> {
    loading.value = true;
    try {
      const authUser = (await supabase.auth.getUser()).data.user;
      if (!authUser) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("user_profiles")
        .update({
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", authUser.id)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      userProfile.value = data;
      return { success: true, data };
    } catch (error: any) {
      console.error("Error updating user profile:", error);
      return {
        success: false,
        error: error.message || "Failed to update user profile",
      };
    } finally {
      loading.value = false;
    }
  }

  // Fetch user statistics
  async function fetchUserStats(): Promise<ApiResponse<UserStats>> {
    loading.value = true;
    try {
      const authUser = (await supabase.auth.getUser()).data.user;
      if (!authUser) {
        throw new Error("User not authenticated");
      }

      // This would typically be a single API call to a stats endpoint
      // For this example, we'll simulate fetching various stats

      // 1. Get total lessons and completed lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from("lessons")
        .select("count");

      if (lessonsError) throw lessonsError;

      // For completed lessons, we need a different approach since distinct isn't available
      // Let's get all completed exercises and count unique lessons
      const { data: completedExercisesData, error: completedError } =
        await supabase
          .from("user_exercise_progress")
          .select("exercise_id, exercises(lesson_id)")
          .eq("user_id", authUser.id)
          .eq("status", "completed");

      if (completedError) throw completedError;

      // Get unique lesson IDs from completed exercises
      const completedLessonIds = new Set();
      completedExercisesData?.forEach((item) => {
        if (item.exercises && item.exercises.lesson_id) {
          completedLessonIds.add(item.exercises.lesson_id);
        }
      });

      // 2. Get drawings count and total drawing time
      const { data: drawingsData, error: drawingsError } = await supabase
        .from("free_drawings")
        .select("id, time_spent")
        .eq("user_id", authUser.id);

      if (drawingsError) throw drawingsError;

      // 3. Get completed challenges
      const { data: challengesData, error: challengesError } = await supabase
        .from("user_challenge_progress")
        .select("*")
        .eq("user_id", authUser.id)
        .eq("status", "completed");

      if (challengesError) throw challengesError;

      // 4. Get active challenges
      const { data: activeChallenges, error: activeError } = await supabase
        .from("user_challenge_progress")
        .select(
          `
          current_count,
          challenges!inner(
            id,
            title,
            target_count
          )
        `,
        )
        .eq("user_id", authUser.id)
        .eq("status", "in_progress");

      if (activeError) throw activeError;

      // Calculate stats
      const totalLessons = lessonsData[0]?.count || 0;
      const completedLessons = completedLessonIds.size;
      const lessonCompletionPercentage =
        totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;

      const totalDrawings = drawingsData?.length || 0;
      const totalHoursDrawing =
        drawingsData?.reduce(
          (total, drawing) => total + (drawing.time_spent || 0) / 60,
          0,
        ) || 0;

      const completedChallenges = challengesData?.length || 0;

      // Format active challenges summary
      const activeChallengeSummary =
        activeChallenges?.map((item) => ({
          id: item.challenges.id,
          title: item.challenges.title,
          current_count: item.current_count,
          target_count: item.challenges.target_count,
        })) || [];

      // Update stats state
      userStats.value = {
        totalDrawings,
        totalHoursDrawing,
        completedLessons,
        totalLessons,
        lessonCompletionPercentage,
        completedChallenges,
        activeChallengeSummary,
      };

      return { success: true, data: userStats.value };
    } catch (error: any) {
      console.error("Error fetching user stats:", error);
      return {
        success: false,
        error: error.message || "Failed to load user statistics",
      };
    } finally {
      loading.value = false;
    }
  }

  // Fetch user activity
  async function fetchUserActivity(
    limit: number = 10,
  ): Promise<ApiResponse<UserActivity[]>> {
    loading.value = true;
    try {
      const authUser = (await supabase.auth.getUser()).data.user;
      if (!authUser) {
        throw new Error("User not authenticated");
      }

      // Fetch user activity from the user_activity table
      const { data, error } = await supabase
        .from("user_activity")
        .select("*")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      userActivity.value = data || [];
      return { success: true, data: userActivity.value };
    } catch (error: any) {
      console.error("Error fetching user activity:", error);
      return {
        success: false,
        error: error.message || "Failed to load user activity",
      };
    } finally {
      loading.value = false;
    }
  }

  // NEW FUNCTIONS FOR ACCOUNT SETTINGS

  // Change password
  async function changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<ApiResponse<null>> {
    loading.value = true;
    try {
      const authUser = (await supabase.auth.getUser()).data.user;
      if (!authUser || !authUser.email) {
        throw new Error("User not authenticated or missing email");
      }

      // Verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: authUser.email,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error("Current password is incorrect");
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      return { success: true, data: null };
    } catch (error: any) {
      console.error("Error changing password:", error);
      return {
        success: false,
        error: error.message || "Failed to change password",
      };
    } finally {
      loading.value = false;
    }
  }

  // Export user data
  async function exportUserData(): Promise<ApiResponse<any>> {
    loading.value = true;
    try {
      const authUser = (await supabase.auth.getUser()).data.user;
      if (!authUser) {
        throw new Error("User not authenticated");
      }

      // Fetch user profile data
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (profileError) {
        throw new Error(profileError.message);
      }

      // Fetch user drawings/content
      const { data: drawingsData, error: drawingsError } = await supabase
        .from("free_drawings")
        .select("*")
        .eq("user_id", authUser.id);

      if (drawingsError) {
        throw new Error(drawingsError.message);
      }

      // Fetch user activity history
      const { data: activityData, error: activityError } = await supabase
        .from("user_activity")
        .select("*")
        .eq("user_id", authUser.id);

      if (activityError) {
        throw new Error(activityError.message);
      }

      // Fetch user exercise progress
      const { data: exerciseData, error: exerciseError } = await supabase
        .from("user_exercise_progress")
        .select("*")
        .eq("user_id", authUser.id);

      if (exerciseError) {
        throw new Error(exerciseError.message);
      }

      // Fetch user challenge progress
      const { data: challengeData, error: challengeError } = await supabase
        .from("user_challenge_progress")
        .select("*")
        .eq("user_id", authUser.id);

      if (challengeError) {
        throw new Error(challengeError.message);
      }

      // Combine all data
      const exportData = {
        profile: profileData,
        drawings: drawingsData,
        activity: activityData,
        exercises: exerciseData,
        challenges: challengeData,
        exportDate: new Date().toISOString(),
      };

      return { success: true, data: exportData };
    } catch (error: any) {
      console.error("Error exporting user data:", error);
      return {
        success: false,
        error: error.message || "Failed to export user data",
      };
    } finally {
      loading.value = false;
    }
  }

  // Delete account
  async function deleteAccount(): Promise<ApiResponse<null>> {
    loading.value = true;
    try {
      const authUser = (await supabase.auth.getUser()).data.user;
      if (!authUser) {
        throw new Error("User not authenticated");
      }

      // Delete user data from database tables in order to maintain referential integrity

      // 1. Delete user challenge progress
      const { error: challengeError } = await supabase
        .from("user_challenge_progress")
        .delete()
        .eq("user_id", authUser.id);

      if (challengeError) {
        throw new Error(
          `Failed to delete challenge data: ${challengeError.message}`,
        );
      }

      // 2. Delete user exercise progress
      const { error: exerciseError } = await supabase
        .from("user_exercise_progress")
        .delete()
        .eq("user_id", authUser.id);

      if (exerciseError) {
        throw new Error(
          `Failed to delete exercise data: ${exerciseError.message}`,
        );
      }

      // 3. Delete user drawings
      const { error: drawingsError } = await supabase
        .from("free_drawings")
        .delete()
        .eq("user_id", authUser.id);

      if (drawingsError) {
        throw new Error(`Failed to delete drawings: ${drawingsError.message}`);
      }

      // 4. Delete user activity
      const { error: activityError } = await supabase
        .from("user_activity")
        .delete()
        .eq("user_id", authUser.id);

      if (activityError) {
        throw new Error(
          `Failed to delete activity data: ${activityError.message}`,
        );
      }

      // 5. Delete user profile
      const { error: profileError } = await supabase
        .from("user_profiles")
        .delete()
        .eq("id", authUser.id);

      if (profileError) {
        throw new Error(`Failed to delete profile: ${profileError.message}`);
      }

      // 6. Finally, delete the user account from auth
      const { error: userError } = await supabase.auth.admin.deleteUser(
        authUser.id,
      );

      if (userError) {
        throw new Error(`Failed to delete user account: ${userError.message}`);
      }

      return { success: true, data: null };
    } catch (error: any) {
      console.error("Error deleting account:", error);
      return {
        success: false,
        error: error.message || "Failed to delete account",
      };
    } finally {
      loading.value = false;
    }
  }

  return {
    userProfile,
    userStats,
    userActivity,
    loading,
    fetchUserProfile,
    updateUserProfile,
    fetchUserStats,
    fetchUserActivity,
    changePassword,
    exportUserData,
    deleteAccount,
  };
});
