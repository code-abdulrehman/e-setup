<!-- src/views/pages/auth/SignUp.vue -->

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { useAuthStore } from '@/lib/stores/useAuthStore';
const authStore = useAuthStore();

// Comprehensive list of countries
const countries = [
  { label: 'Pakistan', value: 'PK' },
  { label: 'United States', value: 'US' },
  { label: 'Canada', value: 'CA' },
  { label: 'United Kingdom', value: 'UK' },
  { label: 'India', value: 'IN' },
  { label: 'Australia', value: 'AU' },
  { label: 'Germany', value: 'DE' },
  { label: 'France', value: 'FR' },
  { label: 'Japan', value: 'JP' },
  { label: 'China', value: 'CN' },
  { label: 'South Korea', value: 'KR' },
  { label: 'Brazil', value: 'BR' },
  { label: 'South Africa', value: 'ZA' },
  // Add more countries as needed
];

const firstname = ref('');
const lastname = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const country = ref(null);
const skill = ref('');
const national_id = ref('');

const router = useRouter();

const handleSignUp = async () => {
  try {

    await authStore.registerUser({
      first_name: firstname.value,
      last_name: lastname.value,
      username: username.value,
      email: email.value,
      password: password.value,
      country: country.value.value,
      skill: skill.value,
      national_id: national_id.value,
    });
    router.push('/auth/sign-in');
  } catch (error) {
    console.error(error);
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
        <div class="w-full px-6 py-8 bg-surface-0 dark:bg-surface-900 sm:px-20" style="border-radius: 53px">
          <div class="mb-8 text-center">
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" class="w-16 mx-auto mb-8 shrink-0"
                            viewBox="0 0 736.000000 736.000000" preserveAspectRatio="xMidYMid meet">
                            <g transform="translate(0.000000,736.000000) scale(0.100000,-0.100000)"
                                fill="var(--primary-color)" stroke="none">
                                <path d="..." />
                            </g>
                        </svg>
            <div class="mb-4 text-3xl font-medium text-surface-900 dark:text-surface-0">
              Create an Account
            </div>
            <span class="font-medium text-muted-color">
              Sign up to get started
            </span>
          </div>

          <div class="w-full md:min-w-[30rem]">
            <div class="flex flex-wrap w-full gap-4 md:flex-nowrap">
              <div  class="w-full mb-4 md:w-1/2">
                <label for="firstname" class="block mb-2 text-xl font-medium text-surface-900 dark:text-surface-0">First Name</label>
                <InputText
                  id="firstname"
                  type="text"
                  placeholder="First Name"
                class="w-full"
                  v-model.trim="firstname"
                />
              </div>
              <div  class="w-full mb-4 md:w-1/2">
                
                <label for="lastname" class="block mb-2 text-xl font-medium text-surface-900 dark:text-surface-0">Last Name</label>
                <InputText
                  id="lastname"
                  type="text"
                  placeholder="Last Name"
                  class="w-full"
                  v-model.trim="lastname"
                />
              </div>

              
            </div>

            <div class="flex flex-wrap w-full gap-4 md:flex-nowrap">
              <div  class="w-full mb-4 md:w-1/2">
            <label for="username" class="block mb-2 text-xl font-medium text-surface-900 dark:text-surface-0">Username</label>
            <InputText
              id="username"
              type="text"
              placeholder="@username"
              class="w-full"
              v-model.trim="username"
            />
              </div>
              <div  class="w-full mb-4 md:w-1/2">
            <label for="email" class="block mb-2 text-xl font-medium text-surface-900 dark:text-surface-0">Email</label>
            <InputText
              id="email"
              type="email"
              placeholder="Email address"
              class="w-full"
              v-model.trim="email"
            />
              </div>
              </div>

            <label for="password" class="block mb-2 text-xl font-medium text-surface-900 dark:text-surface-0">Password</label>
            <Password
              id="password"
              v-model.trim="password"
              placeholder="Password"
              :toggleMask="true"
              class="mb-4" fluid
              :feedback="false"
            />

            
            <div class="flex flex-wrap w-full gap-4 md:flex-nowrap">
              <div  class="w-full mb-4 md:w-1/2">
                <label for="country" class="block mb-2 text-xl font-medium text-surface-900 dark:text-surface-0">Country</label>
            <Dropdown
              id="country"
              v-model.trim="country"
              :options="countries"
              optionLabel="label"
              placeholder="Select a Country"
              class="w-full"
            />
              </div>
              <div  class="w-full mb-4 md:w-1/2">
                <label for="skill" class="block mb-2 text-xl font-medium text-surface-900 dark:text-surface-0">Skill</label>
            <InputText
              id="skill"
              type="text"
              placeholder="Enter your skills"
              class="w-full"
              v-model.trim="skill"
            />
              </div>
            </div>

            <label for="national_id" class="block mb-2 text-xl font-medium text-surface-900 dark:text-surface-0">National ID</label>
            <InputText
              id="national_id"
              type="text"
              placeholder="National ID"
              class="w-full md:min-w-[30rem] mb-8"
              v-model.trim="national_id"
            />

            <Button
              label="Sign Up"
              class="w-full mb-4"
              @click="handleSignUp"
              :disabled="!firstname || !lastname || !username || !email || !password || !country || !skill || !national_id"
              v-if="!authStore.loading"
            />
                        <Button icon="pi pi-spin pi-spinner" class="w-full"  label="Sign Up" v-else></Button>
          

            <div class="text-center">
              <span class="text-muted-color">Already have an account?</span>
              <router-link to="/login" class="font-medium text-primary">Login</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any specific styles if needed */
</style>
