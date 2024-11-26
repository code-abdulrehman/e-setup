<!-- src/components/TabsComponent.vue -->
<template>
  <TabMenu :model="tabItems" :activeItem="activeTab" @tab-change="onTabChange" />
  <div class="py-4"></div>
  </template>
  
  <script setup>
  import { ref, watch, computed } from 'vue';
  import TabMenu from 'primevue/tabmenu'; // Ensure correct import
  
  // Define props
  const props = defineProps({
    tabs: {
      type: Array,
      required: true,
      // Each tab should have a unique identifier, e.g., { id: 'teams', label: 'teams', icon: 'pi pi-users' }
    },
    initialTab: {
      type: String,
      default: null,
    },
  });
  
  // Define emitted events
  const emit = defineEmits(['tab-selected']);
  
  // Reactive active tab
  const activeTab = ref(null);
  
  // Compute tab items with formatted labels
  const tabItems = computed(() =>
    props.tabs.map((tab) => ({
      label: formatLabel(tab.label),
      icon: tab.icon || '', // Optional: include icons if provided
      command: () => emit('tab-selected', tab.id),
    }))
  );
  
  // Set initial active tab
  if (props.initialTab) {
    const initial = tabItems.value.find((tab) => tab.id === props.initialTab);
    activeTab.value = initial || tabItems.value[0];
  } else if (tabItems.value.length > 0) {
    activeTab.value = tabItems.value[0];
  }
  
  // Watch for prop changes to update active tab if necessary
  watch(
    () => props.tabs,
    () => {
      // Update active tab if current active tab is no longer present
      if (!props.tabs.find((tab) => tab.id === activeTab.value?.id)) {
        activeTab.value = tabItems.value[0];
      }
    }
  );
  
  // Handle tab change event
  const onTabChange = (event) => {
    const selectedTab = props.tabs[event.index];
    emit('tab-selected', selectedTab.id);
  };
  
  // Function to format labels by replacing hyphens and underscores with spaces
  function formatLabel(label) {
    return label.replace(/[-_]/g, ' ');
  }
  </script>
  
  <style scoped>
  /* Add any necessary styling here */
  </style>
  