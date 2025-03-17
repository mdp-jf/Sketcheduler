<script setup>
import { ref, toRefs, watchEffect } from 'vue'
import { supabase } from '../lib/supabase'

const props = defineProps({
  path: String,
  size: {
    type: Number,
    default: 10
  }
})

const { path, size } = toRefs(props)
const emit = defineEmits(['upload', 'update:path'])

const uploading = ref(false)
const src = ref('')
const files = ref()

const downloadImage = async () => {
  try {
    const { data, error } = await supabase.storage
      .from('avatars')
      .download(path.value)
    
    if (error) throw error
    
    src.value = URL.createObjectURL(data)
  } catch (error) {
    console.error('Error downloading image: ', error.message)
  }
}

const uploadAvatar = async (evt) => {
  files.value = evt.target.files
  
  try {
    uploading.value = true
    
    if (!files.value || files.value.length === 0) {
      throw new Error('You must select an image to upload.')
    }
    
    const file = files.value[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file)
    
    if (uploadError) throw uploadError
    
    emit('update:path', fileName)
    emit('upload')
  } catch (error) {
    alert(error.message)
  } finally {
    uploading.value = false
  }
}

watchEffect(() => {
  if (path.value) downloadImage()
})
</script>

<template>
  <div class="avatar-container">
    <div v-if="src" class="avatar-preview">
      <img
        :src="src"
        alt="Avatar"
        class="avatar"
        :style="{ height: size + 'em', width: size + 'em' }"
      />
    </div>
    <div 
      v-else 
      class="avatar no-image" 
      :style="{ height: size + 'em', width: size + 'em' }"
    />
    
    <div :style="{ width: size + 'em' }" class="mt-2">
      <label class="button primary" for="single">
        {{ uploading ? 'Uploading...' : 'Upload' }}
      </label>
      <input
        style="visibility: hidden; position: absolute"
        type="file"
        id="single"
        accept="image/*"
        @change="uploadAvatar"
        :disabled="uploading"
      />
    </div>
  </div>
</template>

<style scoped>
.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.avatar-preview {
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--primary-color);
}

.mt-2 {
  margin-top: 0.5rem;
}
</style>