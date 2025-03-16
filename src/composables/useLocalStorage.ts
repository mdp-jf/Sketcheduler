import { ref, watch } from 'vue';

export function useLocalStorage<T>(key: string, defaultValue: T) {
  // Create a ref to store the data
  const data = ref<T>(getStoredValue());
  
  // Function to retrieve the value from localStorage
  function getStoredValue(): T {
    try {
      const value = localStorage.getItem(key);
      // If the key exists in localStorage, parse and return it
      if (value) return JSON.parse(value) as T;
      
      // Otherwise store and return the default value
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  }
  
  // Watch for changes to the data and update localStorage
  watch(
    data,
    (newValue) => {
      try {
        localStorage.setItem(key, JSON.stringify(newValue));
      } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
      }
    },
    { deep: true }
  );
  
  // Return the ref and additional utilities if needed
  return data;
}