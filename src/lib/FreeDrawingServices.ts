import { supabase } from "./supabase";

// Free Drawing Services
export const drawingServices = {
  async getPrompts() {
    const { data, error } = await supabase
      .from("drawing_prompts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async createPrompt(promptText: string, category?: string) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase.from("drawing_prompts").insert([
      {
        user_id: user.id,
        prompt_text: promptText,
        category,
      },
    ]);

    if (error) throw error;
    return data;
  },

  async submitFreeDrawing(
    imageUrl: string,
    timeSpent: number,
    notes: string,
    promptId?: number,
  ) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase.from("free_drawings").insert([
      {
        user_id: user.id,
        image_url: imageUrl,
        time_spent: timeSpent,
        prompt_id: promptId,
        notes,
      },
    ]);

    if (error) throw error;
    return data;
  },

  async getUserDrawings() {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("free_drawings")
      .select("*, drawing_prompts(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },
};
