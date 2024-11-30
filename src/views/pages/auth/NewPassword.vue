<!-- src/views/pages/auth/NewPassword.vue -->

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { useAuthStore } from '@/lib/stores/useAuthStore';
const authStore = useAuthStore();

const router = useRouter();
const route = useRoute();
const newPassword = ref('');
const confirmPassword = ref('');

const handleNewPassword = async () => {
  const token = sessionStorage.getItem("passwordResetToken")
   
  if (!token) {
    alert('Reset token is missing. Please request a new password reset.');
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    alert('Passwords do not match!');
    return;
  }

  if (newPassword.value.length < 8) {
    alert('Password must be at least 8 characters long.');
    return;
  }

  try {
    await authStore.resetPassword(token, { password: newPassword.value });
    router.push({ name: 'SignIn' });
    sessionStorage.removeItem("passwordResetToken")

  } catch (error) {
    console.error('Password reset failed:', error);
  }
};
</script>

<template>
  <FloatingConfigurator />
  <div
    class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
    <div class="flex flex-col items-center justify-center">
      <div
        style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full px-8 py-20 bg-surface-0 dark:bg-surface-900 sm:px-20" style="border-radius: 53px">
          <div class="mb-8 text-center">
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" class="w-16 mx-auto mb-8 shrink-0"
                            viewBox="0 0 736.000000 736.000000" preserveAspectRatio="xMidYMid meet">
                            <g transform="translate(0.000000,736.000000) scale(0.100000,-0.100000)"
                                fill="var(--primary-color)" stroke="none">
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
            <div class="mb-4 text-3xl font-medium text-surface-900 dark:text-surface-0">
              Reset Your Password
            </div>
            <span class="font-medium text-muted-color">
              Enter your new password below
            </span>
          </div>

          <div>
            <label for="new-password" class="block mb-2 text-xl font-medium text-surface-900 dark:text-surface-0">New Password</label>
            <Password
              id="new-password"
              v-model="newPassword"
              placeholder="New Password"
              :toggleMask="true"
              class="mb-4" fluid
              :feedback="false"
            />

            <label for="confirm-password" class="block mb-2 text-xl font-medium text-surface-900 dark:text-surface-0">Confirm Password</label>
            <Password
              id="confirm-password"
              v-model="confirmPassword"
              placeholder="Confirm Password"
              :toggleMask="true"
              class="mb-8" fluid
              :feedback="false"
            />

            <Button
              label="Reset Password"
              
              class="w-full md:min-w-[30rem] mb-8"
              @click="handleNewPassword"
              :disabled="!newPassword || !confirmPassword"
              v-if="!authStore.loading" />
            <Button icon="pi pi-spin pi-spinner" class="w-full" label="Submit" v-else></Button>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any specific styles if needed */
</style>
