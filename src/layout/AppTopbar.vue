<script setup>
import { useLayout } from '@/layout/composables/layout';
import AppConfigurator from './AppConfigurator.vue';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
const authStore = useAuthStore();

const router = useRouter();
const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();
const user = computed(() => {
    const profile = JSON.parse(sessionStorage.getItem('user'));
    return profile || {};
});
const logout = async()=> {
    try{
        authStore.logout();
        router.push('/auth/sign-in');
        
    }catch(error){
        console.error(error)
    };
}
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">

                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="40px" height="40px"
                    viewBox="0 0 736.000000 736.000000" preserveAspectRatio="xMidYMid meet">
                    <g transform="translate(0.000000,736.000000) scale(0.100000,-0.100000)" fill="var(--primary-color)"
                        stroke="none">
                        <path d="M3435 5484 c-414 -65 -777 -244 -1079 -534 -315 -303 -496 -665 -547
-1095 -14 -122 -6 -398 15 -513 112 -605 486 -1101 1030 -1366 268 -131 598
-206 906 -206 307 0 571 62 855 199 474 230 834 629 1000 1111 147 425 122
865 -74 1309 -257 582 -823 990 -1513 1091 -160 24 -453 26 -593 4z m460 -564
c326 -38 617 -167 815 -362 131 -129 206 -271 230 -436 35 -239 -109 -496
-348 -620 -148 -77 -126 -75 -802 -82 -428 -4 -616 -10 -641 -18 -102 -34
-153 -107 -146 -208 11 -154 132 -292 352 -401 307 -153 652 -149 970 10 110
55 185 108 275 193 41 40 88 76 103 79 56 15 117 -36 117 -97 0 -35 -101 -177
-192 -268 -173 -174 -369 -278 -633 -336 -120 -26 -369 -24 -500 4 -277 59
-508 177 -703 357 -187 173 -328 436 -373 695 -20 117 -16 346 9 460 53 245
166 447 356 635 201 199 422 320 682 374 152 32 279 38 429 21z" />
                        <path d="M3560 4551 c-463 -104 -730 -403 -780 -871 -16 -154 -18 -149 41 -96
62 56 167 109 274 138 77 21 105 22 665 27 570 6 586 7 631 28 61 28 114 75
147 132 24 40 27 57 27 131 0 73 -4 93 -29 143 -75 153 -280 291 -535 359
-112 30 -327 34 -441 9z" />
                    </g>
                </svg>


                <span>SETUP</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
                <div class="relative">
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                        type="button" class="layout-topbar-action layout-topbar-action-highlight">
                        <i class="pi pi-palette"></i>
                    </button>
                    <AppConfigurator />
                </div>
                <div class="relative">
                    <Avatar :label="user.username[0].toUpperCase()" style="height: 35px; width: 35px;" class="font-bold logo-font" shape="circle"/>
                </div>
                <div class="relative">
                    <button
                    class="layout-topbar-action" 
                     @click="logout"
                    :disabled="authStore.loading"
                        type="button">
                        <i class="pi pi-sign-in" v-if="!authStore.loading" ></i>
                        <i class="pi pi-spin pi-spinner" v-else></i>
                    </button>
                </div>
            </div>

            <!-- <button class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }">
                <i class="pi pi-ellipsis-v"></i>
            </button> -->

            <!-- <div class="hidden layout-topbar-menu lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-inbox"></i>
                        <span>Messages</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                </div>
            </div> -->
        </div>
    </div>
</template>
