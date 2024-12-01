<template>

<div class="p-0 m-0 card">  
  <div class="relative w-full shadow-md h-44 bg-primary rounded-t-md bg-pattern-container pattern-3" style="background-image: url('/public/demo/images/banners/banner-9.jpg');background-size: cover; background-position: center; background-repeat: no-repeat;">
    
    <div class="absolute w-36 h-36 translate-x-1/2 rounded-full trasnslate-y-1/2 profile-img bg-[var(--surface-card)] top-[23%] border-[var(--surface-card)] border-4 shadow-xl flex justify-center items-center overflow-hidden">
      <!-- <img :src="profile.avatar" alt="avatar" class="object-cover"> -->
      <Avatar :label="profile?.first_name[0].toUpperCase() + profile?.last_name[0].toUpperCase()" class="logo-font" style="width: 100%; height: 100%; font-size:2rem; background: var(--surface-card); " />
    </div>
  </div>
</div>

    <!-- Use TabsComponent to handle the tabs -->
    <TabsComponent :tabs="tabs" :initialTab="activeTab.id" @tab-selected="onTabChange" />
  
    <div class="py-4">
      <!-- Render Tab Content based on active tab -->
      <component :is="activeTabComponent" :user="user" />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, markRaw } from 'vue';
  import TabsComponent from '@/components/Commons/TabsComponent.vue';
  import GeneralInfo from '@/components/Profile/SubComponent/GeneralInfo.vue';
  import Payments from '@/components/Profile/SubComponent/Payments.vue';
  import WorkHistory from '@/components/Profile/SubComponent/WorkHistory.vue';
  
  // Simulated user data
  const user = ref({
    username: "super_admin",
    first_name: "super",
    last_name: "admin",
    email: "super@mail.com",
    country: "Pakistan",
    skill: "CEO",
  });
  
  // Tabs configuration with component references
  const tabs = [
    { id: 'general-info', label: 'General Info', icon: 'pi pi-user', component: markRaw(GeneralInfo) },
    { id: 'payments', label: 'Payments', icon: 'pi pi-dollar', component: markRaw(Payments) },
    { id: 'work-history', label: 'Work History', icon: 'pi pi-briefcase', component: markRaw(WorkHistory) }
  ];
  
  // Active tab reference
  const activeTab = ref(tabs[0]);
  
  // Handle tab change event
  const onTabChange = (tabId) => {
    const selectedTab = tabs.find(tab => tab.id === tabId);
    if (selectedTab) {
      activeTab.value = selectedTab;
    }
  };
  
  // Computed property to get the component for the active tab
  const activeTabComponent = computed(() => {
    return activeTab.value.component; // Return the component associated with the active tab
  });
  const profile = {
  username: "abdulrehman",
  first_name: "ABDULREHMAN",
  last_name: "kHALIQ",
  get avatar() {
    // return `https://placehold.co/120x120?font=roboto&text=test`;
    return `https://placehold.co/120x120?font=roboto&text=${this.first_name[0]}+${this.last_name[0]}`;
  },
  phone: "09902222231",
  links: ["https://github.com", "https://linkedin.com","https://code-abdulrehman.netlify.app"],
  per_hour_pay: 45,
  email: "code.abdulrehman@gmail.com",
  country: "Pakistan",
  peerId: "jsfuewfnewufnew_3434--34-43-34#_$",
  last_online: "2022-01-01T00:00:00.000Z",
  skill: "Full Stack Developer",
  expertise: ["React", "Git", "Vue", "Node", "Express", "Mongo"],
  bg_image: `.pattern {
  --s: 202px; 
  --c1: #f6edb3;
  --c2: #acc4a3;
  --c3: #55897c;
  
  --_l:#0000 calc(25%/3),var(--c1) 0 25%,#0000 0;
  --_g:conic-gradient(from 120deg at 50% 87.5%,var(--c1) 120deg,#0000 0);
  background:
    var(--_g),var(--_g) 0 calc(var(--s)/2),
    conic-gradient(from 180deg at 75%,var(--c2) 60deg,#0000 0),
    conic-gradient(from 60deg at 75% 75%,var(--c1) 0 60deg,#0000 0),
    linear-gradient(150deg,var(--_l)) 0 calc(var(--s)/2),
    conic-gradient(at 25% 25%,#0000 50%,var(--c2) 0 240deg,var(--c1) 0 300deg,var(--c2) 0),
    linear-gradient(-150deg,var(--_l)) var(--c3);
  background-size: calc(0.866*var(--s)) var(--s);
}`
}
  </script>
