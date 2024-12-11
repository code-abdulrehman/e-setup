<!-- src/components/Teams/Sub/InvitationsList/InvitationsList.vue -->
<template>
  <div>
    <DataTable
      v-model:selection="selectedInvite"
      selectionMode="single"
      :value="invitations?.to"
      :paginator="paginator"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      responsiveLayout="scroll"
      :loading="loading"
      dataKey="token"
      @row-click="onRowClick"
    >
      <template #empty>
        <DataNotFound message="No invitations found." />
      </template>

      <Column field="teamName" header="Team Name" />
      
      <!-- Display 'To' Column only for Admins and Super Admins -->
      <Column field="toUsername" header="To" v-if="userRole !== 'user'">
        <template #body="{ data }">
          <b>@</b>{{ data?.username }}
        </template>
      </Column>

      <Column field="fromUsername" header="From">
        <template #body="{ data }">
          <b>@</b>{{ data?.createdBy?.username }}
        </template>
      </Column>

      <Column field="status" header="Status">
        <template #body="{ data }">
          <Tag
            :severity="getTagSeverity(data.status)"
            rounded
          >
            {{ data?.status }}
          </Tag>
        </template>
      </Column>

      <Column field="expireAt" header="Expire At">
        <template #body="{ data }">
          {{ formatDate(data.expireAt, 'short') }}
        </template>
      </Column>

    </DataTable>

    <!-- Invitation Details Dialog -->
    <Dialog
      v-if="currentInvite"
      :visible.sync="dialogVisible"
      header="Invitation Details"
      v-model:visible="dialogVisible" 
      :style="{ width: '50vw' }"
      @hide="onDialogHide"
    >
      <div>
        <p><strong>Team Name:</strong> {{ currentInvite.teamName }}</p>
        <p><strong>From:</strong> @{{ currentInvite.createdBy.username }}</p>
        <p><strong>Status:</strong> {{ currentInvite.status }}</p>
        <p><strong>Expires At:</strong> {{ formatDate(currentInvite.expireAt, 'short') }}</p>
        <!-- Add more details as needed -->
      </div>
      
      <!-- Dialog Footer with Action Buttons -->
      <template #footer>
        <div class="flex gap-2 p-d-flex p-ai-center" v-if="currentInvite.status === 'pending'">
          <!-- Accept Button for Users -->
          <Button
            v-if="userRole === 'user'"
            :key="currentInvite.token + 'accept'"
            label="Accept"
            class="p-button-primary"
            @click.stop="onAcceptInvitation(currentInvite.token)"
          />

          <!-- Reject Button for Users -->
          <Button
            v-if="userRole === 'user'"
            :key="currentInvite.token + 'reject'"
            label="Reject"
            class="p-button-danger"
            @click.stop="onRejectInvitation(currentInvite.token)"
          />

          <!-- Decline Button for Admins and Super Admins -->
          <Button
            v-if="userRole !== 'user'"
            :key="currentInvite.token + 'decline'"
            label="Decline"
            class="p-button-warn"
            @click.stop="onDeclineInvitation(currentInvite.token)"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import DataNotFound from '@/components/Commons/DataNotFound.vue';
import { formatDate } from '@/lib/utils/helper';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';
import { computed, defineProps, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Define Props
const props = defineProps({
  invitations: {
    type: Object, // Changed from Array to Object to match backend response structure
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  userRole: {
    type: String,
  },
  userId: {
    type: String,
  },
});

// Define Emits
const emit = defineEmits(['accept-invitation', 'reject-invitation', 'decline-invitation']);

// Router Instances
const route = useRoute();
const router = useRouter();

// Dialog Visibility
const dialogVisible = ref(false);

// Selected Invitation
const selectedInvite = ref(null);

// Computed Property for Paginator
const paginator = computed(() => (props.invitations.to?.length > 10));

// Computed Property for Current Invite based on Route Token
const currentInvite = computed(() => {
  const token = route.params.token;
  if (token && props.invitations.to) {
    return props.invitations.to.find(invite => invite.token === token);
  }
  return null;
});

// Watch for Changes in Current Invite to Toggle Dialog Visibility
watch(currentInvite, (newInvite) => {
  if (newInvite) {
    dialogVisible.value = true;
    selectedInvite.value = newInvite;
  } else {
    dialogVisible.value = false;
    selectedInvite.value = null;
  }
});

// Function to Handle Row Click
const onRowClick = (event) => {
  const invite = event.data;
  if (invite && invite.token) {
    router.push({ name: 'Invitations-token', params: { token: invite.token } });
  }
};

// Function to Handle Accept Invitation
const onAcceptInvitation = (token) => {
  emit('accept-invitation', token);
};

// Function to Handle Reject Invitation
const onRejectInvitation = (token) => {
  emit('reject-invitation', token);
};

// Function to Handle Decline Invitation (Admin)
const onDeclineInvitation = (token) => {
  emit('decline-invitation', token);
};

// Handle Dialog Hide (Close)
const onDialogHide = () => {
  // Remove the token from the route to close the dialog
  router.push({ name: 'Invitations' });
};

// On Mounted, Check if There's a Token in the Route and Open the Dialog
onMounted(() => {
  if (currentInvite.value) {
    dialogVisible.value = true;
    selectedInvite.value = currentInvite.value;
  }
});

// Helper Function to Determine Tag Severity Based on Status
const getTagSeverity = (status) => {
  switch (status) {
    case 'pending':
      return 'info';
    case 'accepted':
      return 'success';
    case 'rejected':
      return 'danger';
    case 'expired':
      return 'contrast';
    default:
      return 'warn';
  }
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
