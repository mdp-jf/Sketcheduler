<template>
    <div class="add-exercise-container">
      <h2 class="text-2xl font-bold mb-6">Add New Exercise</h2>
      
      <form @submit.prevent="handleSubmit" class="bg-white p-6 rounded-lg shadow">
        <!-- Title Input -->
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Exercise Title</label>
          <input
            id="title"
            v-model="exerciseData.title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter exercise title"
            required
          />
        </div>
        
        <!-- Description Input -->
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            v-model="exerciseData.description"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="4"
            placeholder="Enter exercise description"
          ></textarea>
        </div>
        
        <!-- Order Number Input -->
        <div class="mb-4">
          <label for="order" class="block text-sm font-medium text-gray-700 mb-1">Order Number</label>
          <input
            id="order"
            v-model.number="exerciseData.order_number"
            type="number"
            min="1"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter order number"
            required
          />
          <p class="text-xs text-gray-500 mt-1">This determines the exercise's position in the lesson</p>
        </div>
        
        <!-- Warmup Eligible Checkbox -->
        <div class="mb-6">
          <div class="flex items-center">
            <input
              id="warmup"
              v-model="exerciseData.is_warmup_eligible"
              type="checkbox"
              class="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label for="warmup" class="ml-2 block text-sm text-gray-700">
              Eligible for warmup exercises
            </label>
          </div>
          <p class="text-xs text-gray-500 mt-1 ml-6">
            When checked, this exercise can be randomly selected as a warmup exercise
          </p>
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
            {{ isSubmitting ? 'Saving...' : 'Save Exercise' }}
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
  const props = defineProps<{
    lessonId: number
  }>()
  
  const emit = defineEmits(['cancel', 'exercise-added'])
  
  // Form state
  const exerciseData = reactive({
    title: '',
    description: '',
    order_number: 1,
    is_warmup_eligible: false
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
      
      // Insert new exercise into Supabase
      const { data, error } = await supabase
        .from('exercises')
        .insert([
          {
            lesson_id: props.lessonId,
            title: exerciseData.title,
            description: exerciseData.description,
            order_number: exerciseData.order_number,
            is_warmup_eligible: exerciseData.is_warmup_eligible
          }
        ])
        .select()
      
      if (error) {
        throw error
      }
      
      // Show success message
      message.value = 'Exercise added successfully!'
      
      // Emit event with the new exercise data
      if (data && data.length > 0) {
        emit('exercise-added', data[0])
      }
      
      // Reset form
      exerciseData.title = ''
      exerciseData.description = ''
      exerciseData.order_number = 1
      exerciseData.is_warmup_eligible = false
      
    } catch (error: any) {
      console.error('Error adding exercise:', error)
      message.value = error.message || 'Failed to add exercise. Please try again.'
      isError.value = true
    } finally {
      isSubmitting.value = false
    }
  }
  </script>
  
  <style scoped>
  .add-exercise-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }
  </style>