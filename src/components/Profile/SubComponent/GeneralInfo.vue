<!-- src/components/Profile/ProfileCard.vue -->
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
        :isLoading="isLoading"
        @saveProfile="handleSaveProfile" 
        @showRoleDialog="handleShowRoleDialog"
      />
      <PublicProfile 
        v-else 
        :user="user" 
      />
    </div>

    <!-- Role Change Dialog (Optional: Can be moved to EditProfile.vue) -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useProfileStore } from '@/lib/stores/useProfileStore';
import { useToast } from 'primevue/usetoast';

// PrimeVue Components
import ToggleButton from 'primevue/togglebutton';
import EditProfile from '@/components/Profile/SubComponent/SubTab/EditProfile.vue';
import PublicProfile from '@/components/Profile/SubComponent/SubTab/PublicProfile.vue';

const toast = useToast();
const profileStore = useProfileStore();

// Reactive state for toggle
const isPreview = ref(true);
const isLoading = ref(false);

// Computed property to get user data from the store
const user = computed(() => profileStore.user);

// Handle Save Profile Event from EditProfile Component
const handleSaveProfile = async (updatedUser) => {
  isLoading.value = true;
  try {
    await profileStore.updateUser(profileStore.user._id, updatedUser);
    toast.add({ 
      severity: 'success', 
      summary: 'Success', 
      detail: 'Profile updated successfully.', 
      life: 3000 
    });
    isPreview.value = true; // Switch to public preview after saving
  } catch (error) {
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Failed to update profile.', 
      life: 3000 
    });
    console.error(error);
  }finally{
    isLoading.value = false;
  }
};

// Handle Show Role Dialog Event from EditProfile Component
const handleShowRoleDialog = () => {
  // If the role dialog is managed within EditProfile, this can be empty or handle global dialogs
};

// Fetch user data if not already fetched
onMounted(async () => {
  if (!profileStore.user) {
    const userId = getUserIdFromSession();
    if (userId) {
      await profileStore.fetchUserById(userId);
    } else {
      toast.add({
        severity: 'error',
        summary: 'Authentication Error',
        detail: 'User not authenticated.',
        life: 3000,
      });
    }
  }
});

// Function to get user ID from session (same as in Profile.vue)
const getUserIdFromSession = () => {
  const userSession = sessionStorage.getItem('user');
  if (userSession) {
    try {
      const user = JSON.parse(userSession);
      return user._id || user.id;
    } catch (e) {
      console.error('Failed to parse user session:', e);
      return null;
    }
  }
  return null;
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
