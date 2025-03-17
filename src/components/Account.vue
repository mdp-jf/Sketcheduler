<script setup>
import { onMounted, ref, toRefs } from 'vue'
import { supabase } from '../lib/supabase'
import Avatar from './Avatar.vue'

const props = defineProps({
  session: Object
})

const { session } = toRefs(props)
const loading = ref(false)
const saving = ref(false)
const username = ref('')
const website = ref('')
const avatar_url = ref('')
const successMsg = ref('')
const errorMsg = ref('')

onMounted(() => {
  getProfile()
})

async function getProfile() {
  try {
    loading.value = true
    errorMsg.value = ''
    
    const { user } = session.value
    
    const { data, error, status } = await supabase
      .from('profiles')
      .select('username, website, avatar_url')
      .eq('id', user.id)
      .single()
    
    if (error && status !== 406) throw error
    
    if (data) {
      username.value = data.username || ''
      website.value = data.website || ''
      avatar_url.value = data.avatar_url || ''
    }
  } catch (error) {
    errorMsg.value = error.message
  } finally {
    loading.value = false
  }
}

async function updateProfile() {
  try {
    saving.value = true
    errorMsg.value = ''
    successMsg.value = ''
    
    const { user } = session.value
    
    const updates = {
      id: user.id,
      username: username.value,
      website: website.value,
      avatar_url: avatar_url.value,
      updated_at: new Date(),
    }
    
    const { error } = await supabase
      .from('profiles')
      .upsert(updates)
    
    if (error) throw error
    
    successMsg.value = 'Profile updated successfully!'
  } catch (error) {
    errorMsg.value = error.message
  } finally {
    saving.value = false
  }
}

async function signOut() {
  try {
    loading.value = true
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    errorMsg.value = error.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="account-container">
    <form class="form-widget" @submit.prevent="updateProfile">
      <h1 class="header">Account Settings</h1>
      
      <div v-if="loading" class="loading-indicator">Loading profile data...</div>
      
      <div v-if="errorMsg" class="error-message mb-4">{{ errorMsg }}</div>
      <div v-if="successMsg" class="success-message mb-4">{{ successMsg }}</div>
      
      <Avatar 
        v-model:path="avatar_url" 
        @upload="updateProfile" 
        :size="12" 
      />
      
      <div class="mb-4">
        <label for="email">Email</label>
        <input 
          id="email" 
          type="text" 
          class="inputField" 
          :value="session.user.email" 
          disabled 
        />
      </div>
      
      <div class="mb-4">
        <label for="username">Name</label>
        <input 
          id="username" 
          type="text" 
          class="inputField" 
          v-model="username" 
        />
      </div>
      
      <div class="mb-6">
        <label for="website">Website</label>
        <input 
          id="website" 
          type="url" 
          class="inputField" 
          v-model="website" 
          placeholder="https://example.com"
        />
      </div>
      
      <div class="button-group">
        <button
          type="submit"
          class="button"
          :disabled="saving"
        >
          {{ saving ? 'Saving...' : 'Update Profile' }}
        </button>
        
        <button 
          type="button"
          class="button danger mt-6" 
          @click="signOut" 
          :disabled="loading"
        >
          Sign Out
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.account-container {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.loading-indicator {
  text-align: center;
  color: var(--gray-500);
  padding: 1rem;
}

.error-message {
  padding: 0.75rem;
  background-color: #fee2e2;
  color: #b91c1c;
  border-radius: 0.375rem;
}

.success-message {
  padding: 0.75rem;
  background-color: #d1fae5;
  color: #065f46;
  border-radius: 0.375rem;
}

.button-group {
  display: flex;
  flex-direction: column;
}
</style>