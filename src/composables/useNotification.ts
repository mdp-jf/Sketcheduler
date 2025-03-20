// src/composables/useNotification.ts
import { useToastStore } from "../stores/toast";
import type { ApiResponse } from "../types/models";

export function useNotification() {
  const toastStore = useToastStore();

  /**
   * Show a notification for API responses
   * @param response The API response object
   * @param successMessage Message to show on success
   * @param defaultErrorMessage Default error message if none is provided in the response
   * @returns True if the operation was successful
   */
  const notifyResponse = <T>(
    response: ApiResponse<T>,
    successMessage: string,
    defaultErrorMessage = "An error occurred. Please try again.",
  ): boolean => {
    if (response.success) {
      toastStore.success(successMessage);
      return true;
    } else {
      toastStore.error(response.error || defaultErrorMessage);
      return false;
    }
  };

  /**
   * Wrap an async API call with notification handling
   * @param apiCall The async function that returns an ApiResponse
   * @param successMessage Message to show on success
   * @param errorMessage Default error message
   * @returns A function that handles notifications automatically
   */
  const withNotification = <T, P extends any[]>(
    apiCall: (...args: P) => Promise<ApiResponse<T>>,
    successMessage: string,
    errorMessage = "An error occurred. Please try again.",
  ) => {
    return async (...args: P): Promise<ApiResponse<T>> => {
      try {
        const response = await apiCall(...args);
        notifyResponse(response, successMessage, errorMessage);
        return response;
      } catch (error: any) {
        toastStore.error(error.message || errorMessage);
        return { success: false, error: error.message || errorMessage };
      }
    };
  };

  return {
    notifyResponse,
    withNotification,
  };
}
