// src/types/models.ts

/**
 * Generic API response interface used across all API calls
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  order_number: number;
  created_at: string;
  updated_at: string;
  exercises?: Exercise[];
}

export interface Exercise {
  id: number;
  lesson_id: number;
  title: string;
  description: string;
  order_number: number;
  is_warmup_eligible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  target_count: number;
  order_number: number;
  created_at: string;
  updated_at: string;
}

export interface ChallengeProgress {
  user_id: string;
  challenge_id: number;
  current_count: number;
  status: "not_started" | "in_progress" | "completed";
  started_at: string | null;
  completed_at: string | null;
}

export interface Drawing {
  id: number;
  user_id: string;
  image_url: string | null;
  time_spent?: number;
  notes?: string;
  prompt_id?: number;
  created_at: string;
  updated_at: string;
  drawing_prompts?: DrawingPrompt | null;
}

export interface DrawingPrompt {
  id: number;
  user_id: string;
  prompt_text: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface ExerciseSubmission {
  id: number;
  user_id: string;
  exercise_id: number;
  image_url: string;
  notes?: string;
  self_rating?: number;
  created_at: string;
}

export interface UserExerciseProgress {
  user_id: string;
  exercise_id: number;
  status: "not_started" | "in_progress" | "completed";
  completed_at: string | null;
  warmup_count: number;
  last_used_as_warmup: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface User {
  id: string;
  email: string;
}
