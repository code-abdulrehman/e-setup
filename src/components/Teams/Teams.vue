<!-- src/components/TeamsManagement.vue -->
<template>
  <div>
    <!-- Reusable Tabs Component -->
    <TabsComponent :tabs="tabs" @tab-selected="handleTabSelection"/>

    <!-- Content based on selected tab via nested routes -->
    <div class="p-mt-4">
      <router-view
        :teams="teamsStore.teams"
        :invitations="teamsStore.invitations"
        :loading="teamsStore.loading"
        :loadingTeams="teamsStore.loading"
        :userRole="authStore.user.role"
        :userId="authStore.user._id"
        @open-create-team="openCreateTeamDialog"
        @open-invite-user="openInviteUserDialog"
        @invite-user="openInviteUserDialog"
        @delete-team="handleDeleteTeam"
        @accept-invitation="handleAcceptInvitation"
        @reject-invitation="handleRejectInvitation"
        @decline-invitation="handleDeclineInvitation"
      />
    </div>

    <!-- Create Team Dialog -->
    <CreateTeamDialog
      :visible="createTeamDialogVisible"
      :dialogLoading="loading"
      @update:visible="createTeamDialogVisible = $event"
      @team-created="handleTeamCreated"
    />

    <!-- Invite User Dialog -->
    <InviteUserDialog
      :visible="inviteUserDialogVisible"
      :teams="teamsStore.teams"
      :users="usersStore.users"
      :loadingUsers="usersStore.loadingUsers"
      :selectedTeamId="selectedTeamId"
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
import CreateTeamDialog from '@/components/Dialogs/CreateTeamDialog.vue';
import InviteUserDialog from '@/components/Dialogs/InviteUserDialog.vue';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { useTeamsStore } from '@/lib/stores/useTeamsStore';
import { useUsersStore } from '@/lib/stores/useUsersStore';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useRoute, useRouter } from 'vue-router';

const confirm = useConfirm();
const toast = useToast();
const selectedTeamId = ref(null);
const loading = ref(false);

// Define the tabs with corresponding routes
const tabs = [
  { id: 'teams', label: 'Teams', icon: 'pi pi-users', route: { name: 'TeamsList' } },
  { id: 'invitations', label: 'Invitations', icon: 'pi pi-inbox', route: { name: 'Invitations' } },
  // Add more tabs if needed
];

// Store instances
const authStore = useAuthStore();
const teamsStore = useTeamsStore();
const usersStore = useUsersStore();

// Router instances
const route = useRoute();
const router = useRouter();

// Handle tab selection by navigating to the corresponding route
const handleTabSelection = (tabId) => {
  const selectedTab = tabs.find(tab => tab.id === tabId);
  console.log(selectedTab, 'selectedTab')
  if (selectedTab && selectedTab.route) {
    router.push(selectedTab.route);
  }
};

// Synchronize active tab with current route
const activeTab = computed(() => {
  const currentRouteName = route.name;
  console.log(currentRouteName, 'currentRouteName')
  const matchingTab = tabs.find(tab => tab.route.name === currentRouteName);
  console.log(matchingTab, 'matchingTab')
  // handleTabSelection(matchingTab ? matchingTab.id : tabs[1].id)
  return matchingTab ? matchingTab.id : tabs[0].id;
});

// Watch for route changes to update the active tab
watch(
  () => router.currentRoute.value.name,
  async (newRouteName) => {
    if (newRouteName === 'TeamsList' || newRouteName === 'Teams') {
      if (teamsStore.teams.length === 0) {
        await teamsStore.fetchTeams(authStore.user.role, authStore.user._id);
      }
    } else if (newRouteName === 'Invitations' || newRouteName === 'Invitations-token') {
      if (teamsStore.invitations.length === 0) {
        await teamsStore.fetchInvitations();
      }
    }
  },
  { immediate: true }
);


// Fetch data based on current tab
watch(
  activeTab,
  async (newTab) => {
    if (newTab === 'teams') {
      if (teamsStore.teams.length === 0) {
        await teamsStore.fetchTeams(authStore.user.role, authStore.user._id);
      }
    } else if (newTab === 'invitations') {
      console.log(newTab, 'newtab')
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
  loading.value = true;
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
  } finally {
    loading.value = false;
    createTeamDialogVisible.value = false;
  }
};

// Invite User Handlers
const openInviteUserDialog = (teamId = null) => {
  selectedTeamId.value = teamId || null; // Correctly set to teamId if provided
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

// Handle decline an invitation
const handleDeclineInvitation = async (token) => {
  try {
    await teamsStore.declineInvitationAdmin(token);
    toast.add({
      severity: 'info',
      summary: 'Invitation Declined',
      detail: 'The invitation has been declined successfully.',
      life: 3000,
    });
    await teamsStore.fetchInvitations();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error Declining Invitation',
      detail: error.response?.data?.message || error.message || 'Failed to decline invitation.',
      life: 3000,
    });
  }
};

// Create Team Dialog Visibility
const createTeamDialogVisible = ref(false);

// Invite User Dialog Visibility
const inviteUserDialogVisible = ref(false);

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
