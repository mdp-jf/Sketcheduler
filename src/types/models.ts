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

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  social_links?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  totalDrawings: number;
  totalHoursDrawing: number;
  completedLessons: number;
  totalLessons: number;
  lessonCompletionPercentage: number;
  completedChallenges: number;
  activeChallengeSummary: Array<{
    id: number;
    title: string;
    current_count: number;
    target_count: number;
  }>;
}

/**
 * User activity item
 */
export interface UserActivity {
  id: number;
  user_id: string;
  activity_type:
    | "lesson_completed"
    | "challenge_progress"
    | "drawing_created"
    | "exercise_completed"
    | string;
  title: string;
  notes?: string;
  image_url?: string;
  related_id?: number;
  created_at: string;
}

export interface Exercise {
  id: number;
  title: string;
  description: string;
  order_number: number;
  lesson_id: number;
  is_warmup_eligible: boolean;
  category?: string;
  created_at: string;
}

export interface UserExerciseProgress {
  id: number;
  user_id: string;
  exercise_id: number;
  title?: string; // From joined exercise data
  status: "not_started" | "in_progress" | "completed";
  self_rating?: number;
  completed_at?: string;
  warmup_count?: number;
  last_used_as_warmup?: string;
  exercises?: Exercise; // For joined queries
}

export interface UserStats {
  totalDrawings: number;
  totalHoursDrawing: number;
  completedLessons: number;
  totalLessons: number;
  lessonCompletionPercentage: number;
  completedChallenges: number;
  activeChallengeSummary: Array<{
    id: number;
    title: string;
    current_count: number;
    target_count: number;
  }>;
  // Add exercise-specific stats
  completedExercises?: number;
  exerciseCompletionPercentage?: number;
  currentExerciseStreak?: number;
  bestExerciseStreak?: number;
}

export interface UserActivity {
  id: number;
  user_id: string;
  activity_type: string;
  title: string;
  notes?: string;
  image_url?: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  social_links?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  target_count: number;
  difficulty: string;
  order_number: number;
  created_at: string;
  updated_at: string;
}

export interface ChallengeProgress {
  id: number;
  user_id: string;
  challenge_id: number;
  current_count: number;
  status: "not_started" | "in_progress" | "completed";
  started_at?: string;
  completed_at?: string;
  challenges?: Challenge;
}

export interface ChallengeSubmission {
  id: number;
  user_id: string;
  challenge_id: number;
  image_url?: string;
  count: number;
  notes?: string;
  created_at: string;
}

export interface MonthlyCompletion {
  month: string;
  count: number;
}

export interface ChallengeSummary {
  totalActive: number;
  totalCompleted: number;
  totalSubmissions: number;
  completionRate: number;
  lastCompletedChallenge?: {
    id: number;
    title: string;
    completed_at: string;
  };
}

export interface LessonNote {
  id?: number;
  user_id: string;
  lesson_id: number;
  notes: string;
  reflection: string;
  created_at?: string;
  updated_at?: string;
}
