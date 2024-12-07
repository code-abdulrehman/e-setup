<!-- src/components/TeamsManagement.vue -->
<template>
  <div>
    <!-- Reusable Tabs Component -->
    <TabsComponent :tabs="tabs" @tab-selected="handleTabSelection" />

    <!-- Content based on selected tab -->
    <div class="p-mt-4">
      <component
        :is="currentComponent"
        :teams="teamsStore.teams"
        :invitations="teamsStore.invitations"
        :loading="teamsStore.loading"
        :userRole="authStore.user.role"
        :userId="authStore.user._id"
        @open-create-team="openCreateTeamDialog"
        @invite-user="openInviteUserDialog"
        @open-invite-user="openInviteUserDialog"
        @delete-team="handleDeleteTeam"
        @accept-invitation="handleAcceptInvitation"
        @reject-invitation="handleRejectInvitation"
      />
    </div>

    <!-- Create Team Dialog -->
    <CreateTeamDialog
      :visible="createTeamDialogVisible"
      @update:visible="createTeamDialogVisible = $event"
      @team-created="handleTeamCreated"
    />

    <!-- Invite User Dialog -->
    <InviteUserDialog
      :visible="inviteUserDialogVisible"
      :teams="teamsStore.teams"
      :users="usersStore.users"
      :loadingUsers="usersStore.loadingUsers"
      @update:visible="inviteUserDialogVisible = $event"
      @user-invited="handleUserInvited"
    />

    <Toast />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import TabsComponent from '@/components/Commons/TabsComponent.vue';
import TeamsList from '@/components/Teams/Sub/TeamsList/TeamsList.vue';
import InvitationsList from '@/components/Teams/Sub/InvitationsList/InvitationsList.vue';
import CreateTeamDialog from '@/components/Dialogs/CreateTeamDialog.vue';
import InviteUserDialog from '@/components/Dialogs/InviteUserDialog.vue';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { useTeamsStore } from '@/lib/stores/useTeamsStore';
import { useUsersStore } from '@/lib/stores/useUsersStore';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

const confirm = useConfirm();
const toast = useToast();

// Define the tabs
const tabs = [
  { id: 'teams', label: 'Teams', icon: 'pi pi-users' },
  { id: 'invitations', label: 'Invitations', icon: 'pi pi-inbox' },
  // Add more tabs if needed
];

// Reactive states
const activeTab = ref('teams');
const createTeamDialogVisible = ref(false);
const inviteUserDialogVisible = ref(false);

// Store instances
const authStore = useAuthStore();
const teamsStore = useTeamsStore();
const usersStore = useUsersStore();

// Current component to display based on active tab
const currentComponent = computed(() => {
  if (activeTab.value === 'teams') return TeamsList;
  if (activeTab.value === 'invitations') return InvitationsList;
  return null;
});

// Handle tab selection
const handleTabSelection = (tabId) => {
  activeTab.value = tabId;
};

// Fetch data based on active tab
watch(
  activeTab,
  async (newTab) => {
    if (newTab === 'teams') {
      if (teamsStore.teams.length === 0) {
        await teamsStore.fetchTeams(authStore.user.role, authStore.user._id);
      }
    } else if (newTab === 'invitations') {
      if (teamsStore.invitations.length === 0) {
        await teamsStore.fetchInvitations();
      }
    }
  },
  { immediate: true }
);

// Create Team Handlers
const openCreateTeamDialog = () => {
  createTeamDialogVisible.value = true;
};

const handleTeamCreated = async (newTeam) => {
  createTeamDialogVisible.value = true;
  try {
    await teamsStore.createTeam(newTeam);
    toast.add({
      severity: 'success',
      summary: 'Team Created',
      detail: `Team "${newTeam.name}" has been created successfully.`,
      life: 3000,
    });
    await teamsStore.fetchTeams(authStore.user.role, authStore.user._id);
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || error.message || 'Failed to create team.',
      life: 3000,
    });
  }finally{
    createTeamDialogVisible.value = false;
  }
};

// Invite User Handlers
const openInviteUserDialog = () => {
  inviteUserDialogVisible.value = true;
};

const handleUserInvited = async ({ email, teamId }) => {
  try {
    await teamsStore.inviteUserToTeam(email, teamId);
    toast.add({
      severity: 'success',
      summary: 'Invitation Sent',
      detail: 'User has been invited successfully.',
      life: 3000,
    });
    await teamsStore.fetchTeams(authStore.user.role, authStore.user._id);
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || error.message || 'Failed to send invitation.',
      life: 3000,
    });
  }
};

// Handle deleting a team
const handleDeleteTeam = (teamId) => {
  confirm.require({
    header: 'Confirm Deletion',
    message: 'Do you want to delete this team?',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    rejectClass: 'p-button-secondary',
    acceptLabel: 'Delete',
    rejectLabel: 'Cancel',
    accept: async () => {
      try {
        await teamsStore.deleteTeam(teamId);
        toast.add({
          severity: 'success',
          summary: 'Team Deleted',
          detail: 'Team has been deleted successfully.',
          life: 3000,
        });
        await teamsStore.fetchTeams(authStore.user.role, authStore.user._id);
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.response?.data?.message || error.message || 'Failed to delete team.',
          life: 3000,
        });
      }
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: 'Cancelled',
        detail: 'Team deletion was cancelled.',
        life: 3000,
      });
    },
  });
};

// Handle accepting an invitation
const handleAcceptInvitation = async (token) => {
  try {
    await teamsStore.acceptInvitation(token);
    toast.add({
      severity: 'success',
      summary: 'Invitation Accepted',
      detail: 'You have joined the team successfully.',
      life: 3000,
    });
    await teamsStore.fetchTeams(authStore.user.role, authStore.user._id);
    await teamsStore.fetchInvitations();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || error.message || 'Failed to accept invitation.',
      life: 3000,
    });
  }
};

// Handle rejecting an invitation
const handleRejectInvitation = async (token) => {
  try {
    await teamsStore.rejectInvitation(token);
    toast.add({
      severity: 'info',
      summary: 'Invitation Rejected',
      detail: 'You have rejected the invitation.',
      life: 3000,
    });
    await teamsStore.fetchInvitations();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || error.message || 'Failed to reject invitation.',
      life: 3000,
    });
  }
};

// On component mount, fetch initial data
onMounted(async () => {
  if (teamsStore.teams.length === 0) {
    await teamsStore.fetchTeams(authStore.user.role, authStore.user._id);
  }

  if (usersStore.users.length === 0) {
    await usersStore.getAllUsers();
  }

  if (teamsStore.invitations.length === 0) {
    await teamsStore.fetchInvitations();
  }
});
</script>

<style scoped>
/* Add any necessary styling here */
</style>
