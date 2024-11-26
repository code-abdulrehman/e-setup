<!-- src/components/InvitationsList.vue -->
<template>
    <div>
      <DataTable :value="invitations" :loading="loading" responsiveLayout="scroll">
        <Column field="name" header="Team Name" />
        <Column field="created_by" header="Invited By">
        <template #body="{ data }">
      @{{ data?.created_by?.username }}
    </template>
        </Column>
        <Column header="Actions">
          <template #body="{ row }">
            <div class="p-d-flex p-ai-center">
              <Button
                label="Accept"
                class="p-button-primary p-mr-2"
                @click="handleAccept(row.token)"
              />
              <Button
                label="Reject"
                class="p-button-danger"
                @click="handleReject(row.token)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import {useTeamsStore} from '@/lib/stores/useTeamsStore/useTeamsStore';
  import { showToast } from '@/lib/utils/toast';
  
  // Define the events that this component can emit
  const emit = defineEmits(['accept-invitation', 'reject-invitation']);
  
  const teamsStore = useTeamsStore();
  
  const invitations = computed(() => teamsStore.invitations);
  const loading = computed(() => teamsStore.loading);
  
  // Handler functions for button clicks
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
  /* Add any necessary styling */
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
  