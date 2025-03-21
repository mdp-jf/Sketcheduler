// src/lib/LessonNotesService.ts
import { supabase } from "./supabase";

export interface LessonNote {
  id?: number;
  user_id: string;
  lesson_id: number;
  notes: string;
  reflection: string;
  created_at?: string;
  updated_at?: string;
}

export const lessonNotesService = {
  async getLessonNotes(lessonId: number) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("lesson_notes")
      .select("*")
      .eq("user_id", user.id)
      .eq("lesson_id", lessonId)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 is "row not found" error
    return data;
  },

  async saveLessonNotes(lessonId: number, notes: string, reflection: string) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");

    const now = new Date().toISOString();

    // Check if notes already exist for this lesson
    const { data: existingNotes } = await supabase
      .from("lesson_notes")
      .select("id")
      .eq("user_id", user.id)
      .eq("lesson_id", lessonId)
      .single();

    if (existingNotes) {
      // Update existing notes
      const { data, error } = await supabase
        .from("lesson_notes")
        .update({
          notes,
          reflection,
          updated_at: now,
        })
        .eq("id", existingNotes.id)
        .select();

      if (error) throw error;
      return data;
    } else {
      // Create new notes
      const { data, error } = await supabase
        .from("lesson_notes")
        .insert([
          {
            user_id: user.id,
            lesson_id: lessonId,
            notes,
            reflection,
            created_at: now,
            updated_at: now,
          },
        ])
        .select();

      if (error) throw error;
      return data;
    }
  },

  async deleteLessonNotes(lessonId: number) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("lesson_notes")
      .delete()
      .eq("user_id", user.id)
      .eq("lesson_id", lessonId);

    if (error) throw error;
    return true;
  },
};
