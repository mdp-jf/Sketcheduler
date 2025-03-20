import { ref } from "vue";

export function useLoading(initialState = false) {
  const isLoading = ref(initialState);

  const startLoading = () => {
    isLoading.value = true;
  };

  const stopLoading = () => {
    isLoading.value = false;
  };

  /**
   * Wraps an async function with loading state management
   * @param fn - The async function to wrap
   * @returns A function that will handle loading state
   */
  const withLoading = <T>(fn: (...args: any[]) => Promise<T>) => {
    return async (...args: any[]): Promise<T> => {
      try {
        startLoading();
        return await fn(...args);
      } finally {
        stopLoading();
      }
    };
  };

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
}
