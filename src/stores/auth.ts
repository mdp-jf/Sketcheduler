import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const session = ref<Session | null>(null);
  const loading = ref(false);

  async function initialize() {
    const { data } = await supabase.auth.getSession();
    session.value = data.session;
    user.value = data.session?.user || null;

    // Set up auth state change listener
    supabase.auth.onAuthStateChange((_, _session) => {
      session.value = _session;
      user.value = _session?.user || null;
      console.log('Auth state changed in store:', _session?.user?.email);
    });
  }

  async function signIn(email: string, password: string) {
    loading.value = true;
    try {
      console.log('Attempting sign in with:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    } finally {
      loading.value = false;
    }
  }

  async function signOut() {
    loading.value = true;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      loading.value = false;
    }
  }

  return {
    user,
    session,
    loading,
    initialize,
    signIn,
    signOut,
    isAuthenticated: () => !!user.value,
  };
});
