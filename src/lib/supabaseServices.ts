import { supabase } from './supabase';

// Lesson Services
export const lessonServices = {
  async getLessons() {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('order_number');
    
    if (error) throw error;
    return data;
  },
  
  async getLessonById(id: number) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*, exercises(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Exercise Services
export const exerciseServices = {
  async getExercisesByLessonId(lessonId: number) {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('order_number');
    
    if (error) throw error;
    return data;
  },
  
  async getExerciseById(id: number) {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async getWarmupExercises() {
    // Get user ID
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');
    
    // Get completed exercises that are eligible for warmup
    const { data, error } = await supabase
      .from('user_exercise_progress')
      .select('exercise_id, warmup_count, last_used_as_warmup, exercises(*)')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .eq('exercises.is_warmup_eligible', true)
      .order('warmup_count', { ascending: true })
      .order('last_used_as_warmup', { ascending: true });
    
    if (error) throw error;
    return data;
  },
  
  async submitExercise(exerciseId: number, imageUrl: string, notes: string, selfRating?: number) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');
    
    // Create submission
    const { data: submission, error: submissionError } = await supabase
      .from('exercise_submissions')
      .insert([
        {
          user_id: user.id,
          exercise_id: exerciseId,
          image_url: imageUrl,
          notes,
          self_rating: selfRating
        }
      ]);
    
    if (submissionError) throw submissionError;
    
    // Update progress
    const { data: progress, error: progressError } = await supabase
      .from('user_exercise_progress')
      .upsert([
        {
          user_id: user.id,
          exercise_id: exerciseId,
          status: 'completed',
          completed_at: new Date().toISOString()
        }
      ]);
    
    if (progressError) throw progressError;
    
    return { submission, progress };
  },
  
  async updateWarmupUse(exerciseId: number) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');
    
    // Get current progress
    const { data: current, error: getError } = await supabase
      .from('user_exercise_progress')
      .select('warmup_count')
      .eq('user_id', user.id)
      .eq('exercise_id', exerciseId)
      .single();
    
    if (getError) throw getError;
    
    // Update warmup count
    const { data, error } = await supabase
      .from('user_exercise_progress')
      .update({
        warmup_count: (current?.warmup_count || 0) + 1,
        last_used_as_warmup: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('exercise_id', exerciseId);
    
    if (error) throw error;
    return data;
  }
};

// Challenge Services
export const challengeServices = {
  async getChallenges() {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('order_number');
    
    if (error) throw error;
    return data;
  },
  
  async getChallengeById(id: number) {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async getChallengeProgress(challengeId: number) {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('user_challenge_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('challenge_id', challengeId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "row not found" error
    
    // If no progress record exists, create one
    if (!data) {
      const { data: newProgress, error: insertError } = await supabase
        .from('user_challenge_progress')
        .insert([
          {
            user_id: user.id,
            challenge_id: challengeId,
            current_count: 0,
            status: 'not_started'
          }
        ])
        .single();
      
      if (insertError) throw insertError;
      return newProgress;
    }
    
    return data;
  },
  
  async submitChallengeProgress(challengeId: number, count: number, imageUrl: string, notes: string) {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) throw new Error('User not authenticated');
    
    // Create submission
    const { data: submission, error: submissionError } = await supabase
      .from('challenge_submissions')
      .insert([
        {
          user_id: user.id,
          challenge_id: challengeId,
          image_url: imageUrl,
          count,
          notes
        }
      ]);
    
    if (submissionError) throw submissionError;
    
    // Get challenge details for target count
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .select('target_count')
      .eq('id', challengeId)
      .single();
    
    if (challengeError) throw challengeError;
    
    // Get current progress
    const { data: currentProgress, error: progressError } = await supabase
      .from('user_challenge_progress')
      .select('current_count, status')
      .eq('user_id', user.id)
      .eq('challenge_id', challengeId)
      .single();
    
    if (progressError) throw progressError;
    
    const newCount = (currentProgress?.current_count || 0) + count;
    let newStatus = currentProgress?.status || 'not_started';
    
    if (newCount >= challenge.target_count) {
      newStatus = 'completed';
    } else if (newStatus === 'not_started') {
      newStatus = 'in_progress';
    }
    
    // Update progress
    const { data: updatedProgress, error: updateError } = await supabase
      .from('user_challenge_progress')
      .upsert([
        {
          user_id: user.id,
          challenge_id: challengeId,
          current_count: newCount,
          status: newStatus,
          started_at: currentProgress?.started_at || new Date().toISOString(),
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null
        }
      ]);
    
    if (updateError) throw updateError;
    
    return { submission, progress: updatedProgress };
  }
};

// Free Drawing Services
export const drawingServices = {
  async getPrompts() {
    const { data, error } = await supabase
      .from('drawing_prompts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  async createPrompt(promptText: string, category?: string) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('drawing_prompts')
      .insert([
        {
          user_id: user.id,
          prompt_text: promptText,
          category
        }
      ]);
    
    if (error) throw error;
    return data;
  },
  
  async submitFreeDrawing(imageUrl: string, timeSpent: number, notes: string, promptId?: number) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('free_drawings')
      .insert([
        {
          user_id: user.id,
          image_url: imageUrl,
          time_spent: timeSpent,
          prompt_id: promptId,
          notes
        }
      ]);
    
    if (error) throw error;
    return data;
  },
  
  async getUserDrawings() {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('free_drawings')
      .select('*, drawing_prompts(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};