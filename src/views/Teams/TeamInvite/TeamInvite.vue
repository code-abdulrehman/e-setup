<!-- src/components/TeamInvite.vue -->
<template>
    <div class="p-m-4">
      <h2>Team Invitation</h2>
      <p>You have been invited to join a team. Please accept or decline the invitation below.</p>
  
      <div class="p-d-flex p-flex-column p-ai-center">
        <Button label="Accept Invitation" icon="pi pi-check" class="p-button-success p-mr-2 p-mb-2" @click="openAcceptDialog" />
        <Button label="Decline Invitation" icon="pi pi-times" class="p-button-danger" @click="declineInvitation" />
      </div>
  
      <!-- Accept Invitation Dialog -->
      <Dialog header="Set Password" v-model:visible="acceptDialog" :modal="true" :closable="false">
        <form @submit.prevent="acceptInvite">
          <div class="p-field">
            <label for="password">New Password</label>
            <Password id="password" v-model="passwordData.password" toggleMask required />
          </div>
          <div class="p-d-flex p-jc-end">
            <Button label="Cancel" class="p-button-text" @click="acceptDialog = false" />
            <Button label="Accept" type="submit" class="p-button-primary" :loading="loading" />
          </div>
        </form>
      </Dialog>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useTeamsStore } from '@/lib/stores/useTeamsStore/useTeamsStore';
  import { useRoute, useRouter } from 'vue-router';
  
  export default {
    name: 'TeamInvite',
    setup() {
      const teamsStore = useTeamsStore();
      const route = useRoute();
      const router = useRouter();
  
      const acceptDialog = ref(false);
      const passwordData = ref({ password: '' });
  
      const openAcceptDialog = () => {
        acceptDialog.value = true;
      };
  
      const acceptInvite = async () => {
        const inviteToken = route.params.token;
        await teamsStore.acceptTeamInvitation(inviteToken, passwordData.value);
        acceptDialog.value = false;
        router.push({ name: 'TeamsList' });
      };
  
      const declineInvitation = async () => {
        const inviteToken = route.params.token;
        await teamsStore.declineInvitation(inviteToken);
        router.push({ name: 'TeamsList' });
      };
  
      return {
        acceptDialog,
        passwordData,
        openAcceptDialog,
        acceptInvite,
        declineInvitation,
        loading: teamsStore.loading,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Add any necessary styles here */
  </style>
  