<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref } from 'vue';
import Peer from 'peerjs';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const checked = ref(false);
const authStore = useAuthStore();



const handleLogin = async () => {
    const peer = new Peer();
  peer.on('open', async (peerId) => {
    const credentials = {
      email: email.value,
      password: password.value,
      peerId, // Include peerId in the credentials
    };


  // Call the loginUser action from the store
  await authStore.loginUser(credentials);

  // Check if login was successful by verifying if user and token are set
  if (authStore.user && authStore.token) {
     router.push('/'); // Ensure this route exists
  } else {
       // Handle login failure
       console.error('Login failed');
    }

    // Destroy PeerJS instance
    peer.destroy();
  });
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

                        <div class="mb-4 text-3xl font-medium text-surface-900 dark:text-surface-0">Welcome to e-setup!
                        </div>
                        <span class="font-medium text-muted-color">Sign in to continue</span>
                    </div>

                    <div>
                        <label for="email1"
                            class="block mb-2 text-xl font-medium text-surface-900 dark:text-surface-0">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8"
                            v-model="email" />

                        <label for="password1"
                            class="block mb-2 text-xl font-medium text-surface-900 dark:text-surface-0">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true"
                            class="mb-4" fluid :feedback="false"></Password>

                        <div class="flex items-center justify-between gap-8 mt-2 mb-8">
                            <div class="flex items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <span class="ml-2 font-medium text-right no-underline cursor-pointer text-primary">
                                <router-link to="/auth/forget-password"> Forgot
                                    password?</router-link>
                               
                            </span>
                        </div>
                        
                        <Button label="Sign In" class="w-full" @click="handleLogin" :disabled="!email || !password" v-if="!authStore.loading"></Button>
                        <Button icon="pi pi-spin pi-spinner" class="w-full"  label="Sign In" v-else></Button>
          </div>
          <div class="mt-4 text-center">
              <span class="font-medium text-muted-color">Don't have an account?</span>
              <router-link to="/auth/sign-up" class="ml-2 text-primary hover:underline">Sign Up</router-link>
            </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
