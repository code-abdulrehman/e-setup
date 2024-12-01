<!-- ProfileCard.vue -->
<template>
  <div class="card">
    <!-- Toggle Button -->
    <div class="flex justify-end header">
      <ToggleButton 
        v-model="isPreview" 
        :onLabel="'Edit Profile'" 
        :offLabel="'Public Preview'" 
        :onIcon="'pi pi-user-edit'" 
        :offIcon="'pi pi-eye'" 
        class="w-48"
      />
    </div>

    <!-- Render Content Based on Toggle State -->
    <div class="py-4">
      <EditProfile 
        v-if="!isPreview" 
        :user="user" 
        @saveProfile="handleSaveProfile" 
        @showRoleDialog="handleShowRoleDialog"
      />
      <PublicProfile 
        v-else 
        :user="user" 
      />
    </div>

    <!-- Role Change Dialog (Optional: Can be moved to EditProfile.vue) -->
    <!-- If you prefer to keep the dialog in the main component, uncomment and adjust accordingly -->
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

// PrimeVue Components
import ToggleButton from 'primevue/togglebutton';
import EditProfile from '@/components/Profile/SubComponent/SubTab/EditProfile.vue';
import PublicProfile from '@/components/Profile/SubComponent/SubTab/PublicProfile.vue';

// Initialize Toast
const toast = useToast();

// User data (populate with your actual data or fetch from API)
const user = ref({
  _id: "6744c582aa308befce621018",
  username: 'super_admin',
  first_name: 'super',
  last_name: 'admin',
  email: 'super@mail.com',
  skill: 'CEO',
  expertise: [],
  per_hour_pay: 0,
  national_id: '12345-6789012-3',
  country: 'Pakistan',
  role: 'super_admin',
  last_online: '2024-11-26T07:55:00.067Z',
  peerId: 'f51d289f-c4c1-4e72-9455-2d69947fa4e4',
  createdAt: '2024-11-25T18:44:18.048Z',
  updatedAt: '2024-11-30T15:22:38.816Z',
});

// State to track whether we are in "Edit Profile" or "Public Profile" mode
const isPreview = ref(true);

// Handle Save Profile Event from EditProfile Component
const handleSaveProfile = (updatedUser) => {
  console.log('Profile saved:', updatedUser);
  
  // Simulate API call with a timeout
  setTimeout(() => {
    // Update the user data
    user.value = { ...updatedUser };
    
    // Show success toast
    toast.add({ 
      severity: 'success', 
      summary: 'Success', 
      detail: 'Profile updated successfully.', 
      life: 3000 
    });
    
    // Optionally switch to "Public Profile" mode after saving
    isPreview.value = true;
  }, 1000);
  
  // In a real application, replace the above setTimeout with an actual API call
};

// Handle Show Role Dialog Event from EditProfile Component
const handleShowRoleDialog = () => {
  // If you choose to manage the role dialog in the main component
  // Implement the logic here
};
</script>

<style scoped>
.header {
  margin-bottom: 1rem;
}
.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
</style>
