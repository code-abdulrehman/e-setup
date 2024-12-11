<!-- src/components/Commons/TabsComponent.vue -->
<template>
  <TabMenu :model="tabItems" :activeItem="currentActiveTab" @tab-change="onTabChange" />
  <div class="py-4"></div>
</template>
<!-- src/components/Commons/TabsComponent.vue -->
<script setup>
import { computed } from 'vue';
import TabMenu from 'primevue/tabmenu';
import { useRoute, useRouter } from 'vue-router';

// Define props
const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    // Each tab should have a unique identifier and corresponding route, e.g.,
    // { id: 'teams', label: 'Teams', icon: 'pi pi-users', route: { name: 'TeamsList' } }
  },
});

// Define emitted events
const emit = defineEmits(['tab-selected']);

// Router instances
const route = useRoute();
const router = useRouter();

// Compute tab items with formatted labels
const tabItems = computed(() =>
  props.tabs.map((tab) => ({
    label: formatLabel(tab.label),
    icon: tab.icon || '', // Optional: include icons if provided
    id: tab.id, // Keep track of tab id
    route: tab.route, // Route object for navigation
  }))
);

// Determine the current active tab based on the route
const currentActiveTab = computed(() => {
  const currentRouteName = route.name;
  console.log("Current Route Name:", currentRouteName); // Debugging
  const matchingTab = tabItems.value.find(tab => tab.route.name === currentRouteName);
  console.log("Matching Tab:", matchingTab); // Debugging
  return matchingTab || tabItems.value[0];
});

// Handle tab change by navigating to the selected route
const onTabChange = (event) => {
  const selectedTab = tabItems.value[event.index];
  if (selectedTab && selectedTab.route) {
    router.push(selectedTab.route);
    emit('tab-selected', selectedTab.id);
  }
};

// Function to format labels by replacing hyphens and underscores with spaces
function formatLabel(label) {
  return label.replace(/[-_]/g, ' ');
}
</script>
