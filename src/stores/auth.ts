// stores/auth.ts
import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'
import { ref } from 'vue'
import type { User, Session } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(false)
  
  async function initialize() {
    const { data } = await supabase.auth.getSession()
    session.value = data.session
    user.value = data.session?.user || null
    
    supabase.auth.onAuthStateChange((_, _session) => {
      session.value = _session
      user.value = _session?.user || null
    })
  }
  
  async function signIn(email: string, password: string) {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }
  
  async function signUp(email: string, password: string) {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "http://localhost:5174/home"
        }
      })
      
      if (error) throw error
      
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }
  
  async function signOut() {
    loading.value = true
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      user.value = null
      session.value = null
      
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }
  
  return {
    user,
    session,
    loading,
    initialize,
    signIn,
    signUp, 
    signOut,
    isAuthenticated: () => !!user.value
  }
})