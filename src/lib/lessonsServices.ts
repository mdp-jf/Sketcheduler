import { supabase } from "./supabase";

// Lesson Services
export const lessonServices = {
  async getLessons() {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .order("order_number");

    if (error) throw error;
    return data;
  },

  async getLessonById(id: number) {
    const { data, error } = await supabase
      .from("lessons")
      .select("*, exercises(*)")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },
};

// Exercise Services
export const exerciseServices = {
  async getExercisesByLessonId(lessonId: number) {
    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .eq("lesson_id", lessonId)
      .order("order_number");

    if (error) throw error;
    return data;
  },

  async getExerciseById(id: number) {
    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async getWarmupExercises() {
    // Get user ID
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");

    // Get completed exercises that are eligible for warmup
    const { data, error } = await supabase
      .from("user_exercise_progress")
      .select("exercise_id, warmup_count, last_used_as_warmup, exercises(*)")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .eq("exercises.is_warmup_eligible", true)
      .order("warmup_count", { ascending: true })
      .order("last_used_as_warmup", { ascending: true });

    if (error) throw error;
    return data;
  },

  async submitExercise(
    exerciseId: number,
    imageUrl: string,
    notes: string,
    selfRating?: number,
  ) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");

    // Create submission
    const { data: submission, error: submissionError } = await supabase
      .from("exercise_submissions")
      .insert([
        {
          user_id: user.id,
          exercise_id: exerciseId,
          image_url: imageUrl,
          notes,
          self_rating: selfRating,
        },
      ]);

    if (submissionError) throw submissionError;

    // Update progress
    const { data: progress, error: progressError } = await supabase
      .from("user_exercise_progress")
      .upsert([
        {
          user_id: user.id,
          exercise_id: exerciseId,
          status: "completed",
          completed_at: new Date().toISOString(),
        },
      ]);

    if (progressError) throw progressError;

    return { submission, progress };
  },

  async updateWarmupUse(exerciseId: number) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");

    // Get current progress
    const { data: current, error: getError } = await supabase
      .from("user_exercise_progress")
      .select("warmup_count")
      .eq("user_id", user.id)
      .eq("exercise_id", exerciseId)
      .single();

    if (getError) throw getError;

    // Update warmup count
    const { data, error } = await supabase
      .from("user_exercise_progress")
      .update({
        warmup_count: (current?.warmup_count || 0) + 1,
        last_used_as_warmup: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("exercise_id", exerciseId);

    if (error) throw error;
    return data;
  },
};
