<template>
    <div class="add-lesson-container">
      <h2 class="text-2xl font-bold mb-6">Add New Lesson</h2>
      
      <form @submit.prevent="handleSubmit" class="bg-white p-6 rounded-lg shadow">
        <!-- Title Input -->
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
          <input
            id="title"
            v-model="lessonData.title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter lesson title"
            required
          />
        </div>
        
        <!-- Description Input -->
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            v-model="lessonData.description"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="4"
            placeholder="Enter lesson description"
          ></textarea>
        </div>
        
        <!-- Order Number Input -->
        <div class="mb-6">
          <label for="order" class="block text-sm font-medium text-gray-700 mb-1">Order Number</label>
          <input
            id="order"
            v-model.number="lessonData.order_number"
            type="number"
            min="1"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter order number"
            required
          />
          <p class="text-xs text-gray-500 mt-1">This determines the lesson's position in the list</p>
        </div>
        
        <!-- Form Actions -->
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="$emit('cancel')"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Saving...' : 'Save Lesson' }}
          </button>
        </div>
        
        <!-- Success/Error Messages -->
        <div v-if="message" class="mt-4" :class="{'text-green-600': !isError, 'text-red-600': isError}">
          {{ message }}
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { supabase } from '../lib/supabase'
  
  // Define props and emits
  const emit = defineEmits(['cancel', 'lesson-added'])
  
  // Form state
  const lessonData = reactive({
    title: '',
    description: '',
    order_number: 1,
  })
  
  const isSubmitting = ref(false)
  const message = ref('')
  const isError = ref(false)
  
  // Submit handler
  const handleSubmit = async () => {
    try {
      isSubmitting.value = true
      message.value = ''
      isError.value = false
      
      // Insert new lesson into Supabase
      const { data, error } = await supabase
        .from('lessons')
        .insert([
          {
            title: lessonData.title,
            description: lessonData.description,
            order_number: lessonData.order_number,
          }
        ])
        .select()
      
      if (error) {
        throw error
      }
      
      // Show success message
      message.value = 'Lesson added successfully!'
      
      // Emit event with the new lesson data
      if (data && data.length > 0) {
        emit('lesson-added', data[0])
      }
      
      // Reset form
      lessonData.title = ''
      lessonData.description = ''
      lessonData.order_number = 1
      
    } catch (error: any) {
      console.error('Error adding lesson:', error)
      message.value = error.message || 'Failed to add lesson. Please try again.'
      isError.value = true
    } finally {
      isSubmitting.value = false
    }
  }
  </script>
  
  <style scoped>
  .add-lesson-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }
  </style>