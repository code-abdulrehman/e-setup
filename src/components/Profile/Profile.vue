<!-- src/components/Profile/Profile.vue -->
<template>
  <Spinner v-if="profileStore?.loading" />
  <div v-else>
    <!-- Profile Card -->
    <div class="p-0 m-0 card">  
      <div
        class="relative w-full p-4 shadow-md h-44 rounded-t-md"
        :class="bannerClass"
        :style="bannerStyle"
      >
        <!-- Profile Image -->
        <div class="absolute w-36 h-36 rounded-full profile-img bg-[var(--surface-card)] top-[23%] border-[var(--surface-card)] border-4 shadow-xl flex justify-center items-center overflow-hidden">
          <Avatar
            v-if="profile?.appearance?.profile_img.url"
            :src="profile?.appearance?.profile_img.url"
            alt="avatar"
            class="object-cover"
            @error="handleImageError"
          />
          <Avatar
            v-else
            :label="getInitials(profile)"
            class="logo-font"
            style="width: 100%; height: 100%; font-size:2rem; background: var(--surface-card);"
          />
        </div>

        <!-- Edit Button -->
        <div class="relative flex justify-end w-full h-4 p-4">   
          <Button
            icon="pi pi-pencil"
            severity="secondary"
            variant="text"
            rounded
            aria-label="Edit Banner"
            @click="showDialog = true"
          />
        </div>
      </div>
    </div>

    <!-- Tabs Component -->
    <TabsComponent :tabs="tabs" :initialTab="activeTab.id" @tab-selected="onTabChange" />

    <!-- Tab Content -->
    <div class="py-4">
      <component :is="activeTabComponent" :user="profile" />
    </div>

    <!-- Pattern Dialog Component -->
    <PatternDialog
      v-model:visible="showDialog"
      :totalPatterns="22"
      :totalImages="4"
      @banner-selected="handleBannerSelected"
    />
  </div>
</template>

<script setup>
import { ref, computed, markRaw, onMounted, watch } from 'vue';
import { useProfileStore } from '@/lib/stores/useProfileStore';
import TabsComponent from '@/components/Commons/TabsComponent.vue';
import GeneralInfo from '@/components/Profile/SubComponent/GeneralInfo.vue';
import Payments from '@/components/Profile/SubComponent/Payments.vue';
import WorkHistory from '@/components/Profile/SubComponent/WorkHistory.vue';
import PatternDialog from '@/components/Profile/Dialog/PatternDialog.vue'; // Corrected import path
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import Spinner from '@/components/Commons/Spinner.vue'; // Ensure you have a Spinner component

// Initialize the profile store
const profileStore = useProfileStore();

// Reactive state for dialog visibility
const showDialog = ref(false);

// Computed property to access the user profile from the store
const profile = computed(() => profileStore.user);

// Tabs configuration with component references
const tabs = [
  { id: 'general-info', label: 'General Info', icon: 'pi pi-user', component: markRaw(GeneralInfo) },
  { id: 'payments', label: 'Payments', icon: 'pi pi-dollar', component: markRaw(Payments) },
  { id: 'work-history', label: 'Work History', icon: 'pi pi-briefcase', component: markRaw(WorkHistory) }
];

// Active tab reference
const activeTab = ref(tabs[0]);

// Computed property to get the component for the active tab
const activeTabComponent = computed(() => activeTab.value.component); 

// Handle tab change event
const onTabChange = (tabId) => {
  const selectedTab = tabs.find(tab => tab.id === tabId);
  if (selectedTab) {
    activeTab.value = selectedTab;
  }
};

// Computed property for banner class based on pattern_no
const bannerClass = computed(() => {
  return profile.value?.appearance.banner.pattern_no
    ? `pattern-${profile.value.appearance.banner.pattern_no}`
    : '';
});

// Computed property for banner style based on banner_url
const bannerStyle = computed(() => {
  if (profile.value?.appearance.banner.banner_url) {
    return {
      backgroundImage: `url(${profile.value.appearance.banner.banner_url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  } else {
    return {}; // Let the class handle the background color
  }
});

// Handle image load error by clearing the URL
const handleImageError = () => {
  profileStore.updateProfileImage('');
};

// Function to handle banner selection from the dialog
const handleBannerSelected = ({ type, value }) => {
  if (type === 'pattern') {
    profileStore.updateBannerPattern(value);
  } else if (type === 'image') {
    // Assuming you want to send the image index, adjust if you need to send the URL instead
    const bannerUrl = `/public/demo/images/banners/banner-${value}.jpg`;
    profileStore.updateBannerImage(bannerUrl);
  }
};

// Function to get initials if profile image is missing
const getInitials = (profile) => {
  const first = profile?.first_name ? profile.first_name[0].toUpperCase() : '';
  const last = profile?.last_name ? profile.last_name[0].toUpperCase() : '';
  return `${first}${last}`;
};

// Get user ID from session (assuming it's stored in sessionStorage as 'user')
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

// Fetch user profile on component mount
onMounted(async () => {
  const userId = getUserIdFromSession();
  console.log(userId, "userId")
  if (userId) {
    await profileStore.fetchUserById(userId);
  } else {
    profileStore.showToast({
      severity: 'error',
      summary: 'Authentication Error',
      detail: 'User not authenticated.',
      life: 3000,
    });
  }
});

// Watch for changes in the store's user data
watch(() => profileStore.user, (newUser) => {
  // Any additional logic when user data changes can be added here
});
</script>

<style scoped>
.selection-section {
  margin-bottom: 20px;
}

.selection-section h3 {
  margin-bottom: 10px;
  text-align: center;
}

.flex {
  display: flex;
}

.flex-wrap {
  flex-wrap: wrap;
}

.justify-between {
  justify-content: space-between;
}

.gap-4 {
  gap: 1rem;
}

.pattern-box, .image-box {
  cursor: pointer;
  border: 2px solid #ccc;
  border-radius: 4px;
  transition: transform 0.2s, border-color 0.2s;
}

.pattern-box.selected, .image-box.selected {
  border: 6px dashed #007bff;
}

.image-box {
  background-size: cover;
  background-position: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
