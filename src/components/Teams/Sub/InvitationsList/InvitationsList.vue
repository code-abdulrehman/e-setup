<template>
  <div>
    <DataTable
      :value="invitations"
      :paginator="paginator"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      responsiveLayout="scroll"
    >
      <Column field="teamName" header="Team Name" />
      <Column field="createdBy" header="To">
        <template #body="{ data }">
          @{{ data.createdBy }}
        </template>
      </Column>
      <Column header="Actions">
        <template #body="slotProps">
          <div class="p-d-flex p-ai-center">
            <Button
              label="Accept"
              class="p-button-primary p-mr-2"
              @click="handleAccept(slotProps.data.token)"
            />
            <Button
              label="Reject"
              class="p-button-danger"
              @click="handleReject(slotProps.data.token)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useTeamsStore } from '@/lib/stores/useTeamsStore';
import { showToast } from '@/lib/utils/toast';

const emit = defineEmits(['accept-invitation', 'reject-invitation']);
const teamsStore = useTeamsStore();

// Log teamsStore to ensure it's initialized correctly
console.log('Teams Store:', teamsStore);

// Ensure teamsStore data is available
const teams = computed(() => {
  console.log('Teams Store Data:', teamsStore.teams);
  return teamsStore.teams;
});

// Making invitations a computed property
const invitations = computed(() => {
  // Ensure teamsStore and data are available
  if (!teamsStore || !teamsStore.invitations) {
    console.log('TeamsStore or teamsStore.data is not available');
    return [];
  }

  // Extract invitations from the "to" array safely
  const toInvitations = Array.isArray(teamsStore.invitations.to)
    ? teamsStore.invitations.to.map(user => {
        // Direct invitations from each user in "to"
        const directInvitation = {
          teamName: null,
          createdBy: user.username,
          token: user.invitationToken
        };

        // Invitations found in user's "invitations" array, if available
        const additionalInvitations = Array.isArray(user.invitations)
          ? user.invitations.map(invite => ({
              teamName: invite.teamName,
              createdBy: invite.createdBy?.username,
              token: invite.invitationToken
            }))
          : [];

        return [directInvitation, ...additionalInvitations];
      })
    : [];

  // Extract invitations from the "from" team invites safely
  const fromInvitations = Array.isArray(teamsStore.invitations.from?.teamInvites)
    ? teamsStore.invitations.from.teamInvites.map(invite => ({
        teamName: invite.teamName,
        createdBy: invite.createdBy?.username,
        token: invite.invitationToken
      }))
    : [];

  // Merging both arrays
  const combinedInvitations = [ ...fromInvitations];
  console.log('Combined Invitations:', combinedInvitations);
  console.log('toInvitations Invitations:', toInvitations);

  return combinedInvitations;
});


const paginator = ref(false); // Default value

// Watch teams to update paginator
watch(invitations, (newInvitations) => {
  paginator.value = newInvitations.length > 10;
});

// Watch invitations to ensure it changes
watch(invitations, (newInvitations) => {
  console.log('Updated Invitations:', newInvitations);
}, { immediate: true });

const handleAccept = (token) => {
  emit('accept-invitation', token);
  showToast('Invitation accepted.', 'success');
};

const handleReject = (token) => {
  emit('reject-invitation', token);
  showToast('Invitation rejected.', 'error');
};

</script>

<style scoped>
.p-d-flex {
  display: flex;
}
.p-ai-center {
  align-items: center;
}
.p-mr-2 {
  margin-right: 0.5rem;
}
</style>
