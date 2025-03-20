import { ref, readonly } from "vue";

// This is a simple state management solution for maintenance mode
const isInMaintenance = ref(true); // Set to true to activate maintenance mode

export function useMaintenanceMode() {
  // Function to check if the site is in maintenance mode
  const checkMaintenanceMode = () => {
    return readonly(isInMaintenance);
  };

  // For admin purposes only - to toggle maintenance mode
  const toggleMaintenanceMode = (value: boolean) => {
    isInMaintenance.value = value;
  };

  return {
    isInMaintenance: checkMaintenanceMode(),
    toggleMaintenanceMode,
  };
}
