<template>
  <div>
    <!-- Settings Button -->
    <button
      class="fixed bottom-4 right-4 p-2 bg-gray-100 text-gray-700 rounded-full shadow hover:bg-gray-200"
      title="Dashboard settings"
      @click="showSettings = !showSettings"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </button>

    <!-- Settings Modal -->
    <div
      v-if="showSettings"
      class="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 mx-4"
        @click.stop
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Dashboard Settings</h2>
          <button
            class="text-gray-500 hover:text-gray-700"
            @click="showSettings = false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="mb-6">
          <h3 class="font-medium mb-2">Widgets</h3>
          <p class="text-sm text-gray-600 mb-3">
            Choose which widgets to display on your dashboard
          </p>

          <div class="space-y-3">
            <div v-for="widget in availableWidgets" :key="widget.id">
              <label class="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  :checked="widgetSettings[widget.id].visible"
                  class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  @change="toggleWidget(widget.id)"
                />
                <span class="ml-2">{{ widget.name }}</span>
              </label>
            </div>
          </div>
        </div>

        <div v-if="visibleWidgets.length > 1" class="mb-6">
          <h3 class="font-medium mb-2">Widget Order</h3>
          <p class="text-sm text-gray-600 mb-3">
            Drag and drop to rearrange widgets
          </p>

          <div class="space-y-2 bg-gray-50 rounded p-2">
            <div
              v-for="widget in visibleWidgets"
              :key="widget.id"
              class="bg-white border rounded p-2 cursor-move flex justify-between items-center"
              draggable="true"
              @dragstart="handleDragStart($event, widget.id)"
              @dragover.prevent
              @dragenter.prevent
              @drop="handleDrop($event, widget.id)"
            >
              <span>{{ widget.name }}</span>
              <div class="text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            class="px-4 py-2 text-gray-700 hover:text-gray-900"
            @click="resetDefaults"
          >
            Reset to Default
          </button>
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            @click="saveSettings"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useLocalStorage } from "@vueuse/core";

// Define widget types - these correspond to the components in the dashboard
export type Widget = {
  id: string;
  name: string;
  defaultVisible: boolean;
  defaultOrder: number;
};

export type WidgetSettings = {
  [key: string]: {
    visible: boolean;
    order: number;
  };
};

// Define available widgets
const availableWidgets: Widget[] = [
  {
    id: "welcome",
    name: "Welcome Message",
    defaultVisible: true,
    defaultOrder: 1,
  },
  {
    id: "stats",
    name: "Progress Stats",
    defaultVisible: true,
    defaultOrder: 2,
  },
  {
    id: "activity",
    name: "Recent Activity",
    defaultVisible: true,
    defaultOrder: 3,
  },
  {
    id: "tabContent",
    name: "Tab Content",
    defaultVisible: true,
    defaultOrder: 4,
  },
];

// Create default settings based on available widgets
const createDefaultSettings = (): WidgetSettings => {
  const settings: WidgetSettings = {};
  availableWidgets.forEach((widget) => {
    settings[widget.id] = {
      visible: widget.defaultVisible,
      order: widget.defaultOrder,
    };
  });
  return settings;
};

// Store settings in localStorage
const widgetSettings = useLocalStorage<WidgetSettings>(
  "dashboard-widget-settings",
  createDefaultSettings(),
);

// State for modal visibility
const showSettings = ref(false);
const draggedWidgetId = ref("");

// Compute visible widgets in order
const visibleWidgets = computed(() => {
  return availableWidgets
    .filter((widget) => widgetSettings.value[widget.id].visible)
    .sort(
      (a, b) =>
        widgetSettings.value[a.id].order - widgetSettings.value[b.id].order,
    );
});

// Toggle widget visibility
const toggleWidget = (widgetId: string) => {
  if (widgetId === "tabContent" && widgetSettings.value[widgetId].visible) {
    // Prevent disabling the tab content as it's essential
    return;
  }

  widgetSettings.value[widgetId].visible =
    !widgetSettings.value[widgetId].visible;
};

// Reset to default settings
const resetDefaults = () => {
  widgetSettings.value = createDefaultSettings();
};

// Emit events
const emit = defineEmits<{
  (e: "update:settings", settings: WidgetSettings): void;
}>();

// Save settings and close modal
const saveSettings = () => {
  emit("update:settings", widgetSettings.value);
  showSettings.value = false;
};

// Handle drag start event
const handleDragStart = (event: DragEvent, widgetId: string) => {
  draggedWidgetId.value = widgetId;
};

// Handle drop event
const handleDrop = (event: DragEvent, targetWidgetId: string) => {
  if (!draggedWidgetId.value || draggedWidgetId.value === targetWidgetId)
    return;

  const draggedOrder = widgetSettings.value[draggedWidgetId.value].order;
  const targetOrder = widgetSettings.value[targetWidgetId].order;

  // Swap the order values
  if (draggedOrder < targetOrder) {
    // Moving down - shift all widgets between up
    for (const id in widgetSettings.value) {
      const order = widgetSettings.value[id].order;
      if (order > draggedOrder && order <= targetOrder) {
        widgetSettings.value[id].order--;
      }
    }
    widgetSettings.value[draggedWidgetId.value].order = targetOrder;
  } else {
    // Moving up - shift all widgets between down
    for (const id in widgetSettings.value) {
      const order = widgetSettings.value[id].order;
      if (order < draggedOrder && order >= targetOrder) {
        widgetSettings.value[id].order++;
      }
    }
    widgetSettings.value[draggedWidgetId.value].order = targetOrder;
  }

  draggedWidgetId.value = "";
};

// Initialize settings if needed
onMounted(() => {
  // Make sure all widgets have settings (in case new ones were added)
  availableWidgets.forEach((widget) => {
    if (!widgetSettings.value[widget.id]) {
      widgetSettings.value[widget.id] = {
        visible: widget.defaultVisible,
        order: widget.defaultOrder,
      };
    }
  });
});
</script>
