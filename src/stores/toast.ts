import { defineStore } from "pinia";
import { ref } from "vue";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

export const useToastStore = defineStore("toast", () => {
  const toasts = ref<Toast[]>([]);
  let nextId = 1;

  const add = (
    message: string,
    type: ToastType = "info",
    duration: number = 3000,
  ) => {
    const id = nextId++;
    const toast: Toast = {
      id,
      message,
      type,
      duration,
    };

    toasts.value.push(toast);

    // Auto-remove after duration
    setTimeout(() => {
      remove(id);
    }, duration);

    return id;
  };

  const remove = (id: number) => {
    const index = toasts.value.findIndex((toast) => toast.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };

  const success = (message: string, duration?: number) => {
    return add(message, "success", duration);
  };

  const error = (message: string, duration?: number) => {
    return add(message, "error", duration);
  };

  const info = (message: string, duration?: number) => {
    return add(message, "info", duration);
  };

  const warning = (message: string, duration?: number) => {
    return add(message, "warning", duration);
  };

  return {
    toasts,
    add,
    remove,
    success,
    error,
    info,
    warning,
  };
});
