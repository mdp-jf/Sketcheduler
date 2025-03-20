import { ref } from "vue";

export function useError() {
  const error = ref<string | null>(null);

  const setError = (message: string | null) => {
    error.value = message;
  };

  const clearError = () => {
    error.value = null;
  };

  /**
   * Wraps an async function with error handling
   * @param fn - The async function to wrap
   * @returns A function that will handle errors
   */
  const withErrorHandling = <T>(fn: (...args: any[]) => Promise<T>) => {
    return async (...args: any[]): Promise<T | null> => {
      try {
        clearError();
        return await fn(...args);
      } catch (err: any) {
        const errorMessage = err.message || "An unexpected error occurred";
        console.error(errorMessage, err);
        setError(errorMessage);
        return null;
      }
    };
  };

  return {
    error,
    setError,
    clearError,
    withErrorHandling,
  };
}
