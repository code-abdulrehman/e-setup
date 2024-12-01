<!-- PublicProfile.vue -->
<template>

  <Panel header="Public Profile" class="public-profile-panel">
    <div><strong>Username:</strong> {{ user.username }}</div>
    <div><strong>Name:</strong> {{ user.first_name }} {{ user.last_name }}</div>
    <div><strong>Email:</strong> {{ user.email }}</div>
    <div><strong>Country:</strong> {{ user.country }}</div>
    <div><strong>Role:</strong> {{ user.role }}</div>
    <div><strong>Skill:</strong> {{ user.skill }}</div>
    
    <!-- Expertise as Individual Tags -->
    <div>
      <strong>Expertise:</strong>
      <div class="expertise-tags">
        <Tag 
          v-for="(item, index) in user.expertise" 
          :key="index" 
          :value="item" 
          class="mb-2 mr-2 p0" 
           severity="contrast"
           rounded
           />
      </div>
    </div>
    
    <div><strong>About:</strong> {{ user.about }}</div>
    <div><strong>National ID:</strong> {{ user.national_id }}</div>
    <div><strong>Per Hour Pay:</strong> {{ user.per_hour_pay }}</div>
    <div><strong>Last Online:</strong> {{ formattedLastOnline }}</div>
    <div><strong>Peer ID:</strong> {{ user.peerId }}</div>
  </Panel>
</template>

<script setup>
import { computed } from 'vue';
import Panel from 'primevue/panel';
import Tag from 'primevue/tag'; // Import Tag component

// Props
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

// Computed property to format 'last_online' date
const formattedLastOnline = computed(() => {
  const date = new Date(props.user.last_online);
  return date.toLocaleString(); // Adjust the format as needed
});
</script>

<style scoped>
.public-profile-panel {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* Adjusted for better spacing */
}

.expertise-tags {
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}
.expertise-tags .p0{
  padding-top: 1px;
  padding-bottom: 1px;
}
</style>
