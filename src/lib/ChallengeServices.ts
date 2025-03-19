import { supabase } from './supabase';

// Challenge Services
export const challengeServices = {
  async getChallenges() {
    const { data, error } = await supabase.from('challenges').select('*').order('order_number');

    if (error) throw error;
    return data;
  },

  async getChallengeById(id: number) {
    const { data, error } = await supabase.from('challenges').select('*').eq('id', id).single();

    if (error) throw error;
    return data;
  },

  async getChallengeProgress(challengeId: number) {
    const user = (await supabase.auth.getUser()).data.user;
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
            status: 'not_started',
          },
        ])
        .single();

      if (insertError) throw insertError;
      return newProgress;
    }

    return data;
  },

  async submitChallengeProgress(
    challengeId: number,
    count: number,
    imageUrl: string,
    notes: string
  ) {
    const user = (await supabase.auth.getUser()).data.user;
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
          notes,
        },
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
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
        },
      ]);

    if (updateError) throw updateError;

    return { submission, progress: updatedProgress };
  },
};
