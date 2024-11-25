<!-- src/views/pages/auth/VerifyToken.vue -->

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';

const visible = ref(true);
const router = useRouter();
const route = useRoute();

onMounted(() => {
  // Extract route parameters
  const token = route.params.token || '';

  // Store them in sessionStorage
  if (token) sessionStorage.setItem('verificationToken', token);
});

const proceedToNewPassword = () => {
  router.push({ name: 'NewPassword' });
};
</script>

<template>
  <FloatingConfigurator />
  <Dialog
    header="Verify Your Email"
    v-model:visible="visible"
    :modal="true"
    :closable="false"
    style="width: 30vw"
  >
    <p>Please check your email for the verification token to reset your password.</p>
    <div class="flex justify-end mt-4">
      <Button label="Proceed to Reset Password" icon="pi pi-arrow-right" @click="proceedToNewPassword" />
    </div>
  </Dialog>
</template>

<style scoped>
/* Add any specific styles if needed */
</style>
