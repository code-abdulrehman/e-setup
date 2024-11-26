<!-- src/components/SingleTeam.vue -->
<template>
  <div class="p-m-4" v-if="currentTeam">
    <h2>{{ currentTeam.name }}</h2>
    <p><strong>Members:</strong></p>
    <ul>
      <li v-for="member in currentTeam.members" :key="member.id">{{ member.username }}</li>
    </ul>

    <!-- Role-Based Actions -->
    <div v-if="userRole === 'super_admin' || userRole === 'admin'">
      <Button label="Invite Member" icon="pi pi-user-plus" class="p-button-info p-mr-2" @click="openInviteDialog" />
      <!-- Add more admin actions as needed -->
    </div>

    <!-- Invite Member Dialog -->
    <Dialog header="Invite Member" v-model:visible="inviteDialog" :modal="true" :closable="false">
      <form @submit.prevent="sendInvite">
        <div class="p-field">
          <label for="inviteEmail">Member Email</label>
          <InputText id="inviteEmail" v-model="inviteData.email" type="email" required />
        </div>
        <div class="p-d-flex p-jc-end">
          <Button label="Cancel" class="p-button-text" @click="inviteDialog = false" />
          <Button label="Send Invite" type="submit" class="p-button-primary" :loading="loading" />
        </div>
      </form>
    </Dialog>
  </div>

  <div v-else-if="loading">
    <ProgressSpinner />
  </div>

  <div v-else>
    <p>Team not found.</p>
  </div>
</template>

<script>
import { onMounted, ref, computed } from 'vue';
import { useTeamsStore } from '@/stores/useTeamsStore';
import { useRoute } from 'vue-router';
import { Button } from 'primevue/button';
import { Dialog } from 'primevue/dialog';
import { InputText } from 'primevue/inputtext';
import { ProgressSpinner } from 'primevue/progressspinner';

export default {
  name: 'SingleTeam',
  components: {
    Button,
    Dialog,
    InputText,
    ProgressSpinner,
  },
  setup() {
    const teamsStore = useTeamsStore();
    const route = useRoute();
    const teamId = route.params.teamId;

    const inviteDialog = ref(false);
    const inviteData = ref({ email: '' });

    const userRole = ref('user'); // You should fetch the user's role from the auth store or API

    onMounted(() => {
      teamsStore.getTeamById(teamId);
      // Assume you have a method to get the current user's role
      // userRole.value = getUserRole();
    });

    const sendInvite = async () => {
      await teamsStore.inviteMember(teamId, inviteData.value);
      inviteDialog.value = false;
      inviteData.value.email = '';
    };

    return {
      currentTeam: teamsStore.currentTeam,
      loading: teamsStore.loading,
      inviteDialog,
      inviteData,
      sendInvite,
      userRole,
      openInviteDialog: () => {
        inviteDialog.value = true;
      },
    };
  },
};
</script>

<style scoped>
/* Add any necessary styles here */
</style>
