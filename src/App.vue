<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from './lib/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const session = ref()

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
    console.log("Session on mount:", session.value)
    
    // If user is logged in but on sign-in page, redirect to home
    if (session.value && (window.location.pathname === '/sign-in' || window.location.pathname === '/')) {
      router.push('/home')
    }
  })
  
  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
    console.log("Auth state changed:", session.value)
  })
})
</script>

<template>
  <router-view/>
</template>