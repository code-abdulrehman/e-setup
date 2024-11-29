<template>
  <div>
    <!-- Reusable Tabs Component -->
    <TabsComponent :tabs="tabs" @tab-selected="handleTabSelection" />

    <!-- Content based on selected tab -->
    <div class="p-mt-4">
      <component
        :is="currentComponent"
        @open-create-team="openCreateTeamDialog"
        @open-invite-user="handleInviteUser"
        @invite-user="handleInviteUser"
        @delete-team="handleDeleteTeam"
        @accept-invitation="handleAcceptInvitation"
        @reject-invitation="handleRejectInvitation"
      />
    </div>

    <!-- Create Team Modal -->
    <Dialog header="Create Team" :visible.sync="createTeamDialogVisible" modal :closable="false">
      <form @submit.prevent="createTeam">
        <InputText v-model="newTeamName" placeholder="Team Name" class="w-full md:min-w-[400px] 3 my-4" />
        <div class="flex justify-end gap-2">
      
      <Button label="Close" @click="closeCreateteamDialog" class="p-button-text" />
      <Button label="Create team" type="submit" :loading="creatingTeam" />
    </div>
   </form>
    </Dialog>

    <!-- Invite User Modal -->
    <Dialog header="Invite User" :visible.sync="inviteUserDialogVisible" modal :closable="false" class="w-full md:w-[450px]">
      <form @submit.prevent="inviteUser">
        <!-- User Selection Dropdown -->
        <Dropdown
          v-model="selectedUser"
          :options="users"
          option-label="email"
          option-value="email"
          placeholder="Select User"
          class="w-full mb-3"
          :loading="loadingUsers"
        />
        <!-- Team Selection Dropdown -->
        <Dropdown
          v-model="selectedTeam"
          :options="teams"
          option-label="name"
          option-value="_id"
          placeholder="Select Team"
          class="w-full mb-3"
          :loading="loadingUsers"
          :disabled="alredySelectedTeam"
        />

    <div class="flex justify-end gap-2">
      
      <Button label="Close" @click="closeDialog" class="p-button-text" />
      <Button label="Send Invite" type="submit" :loading="invitingUser" />
    </div>
      </form>
    </Dialog>
  </div>
  <Toast />
  <ConfirmDialog></ConfirmDialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import TabsComponent from '@/components/Commons/TabsComponent.vue';
import TeamsList from '@/components/Teams/Sub/TeamsList/TeamsList.vue';
import InvitationsList from '@/components/Teams/Sub/InvitationsList/InvitationsList.vue';
import { useAuthStore } from '@/lib/stores/useAuthStore/useAuthStore';
import { useTeamsStore } from '@/lib/stores/useTeamsStore/useTeamsStore';
import { useUsersStore } from '@/lib/stores/useUsersStore/useUsersStore';
import { showToast } from '@/lib/utils/toast';

// Define the tabs dynamically with localization keys
const tabs = [
  { id: 'teams', label: 'Teams', icon: 'pi pi-users' },
  { id: 'invitations', label: 'Invitations', icon: 'pi pi-inbox' },
  // Add more tabs if needed
];

import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
const confirm = useConfirm();
const toast = useToast();

// Reactive states
const activeTab = ref('teams');
const createTeamDialogVisible = ref(false);
const inviteUserDialogVisible = ref(false);
const newTeamName = ref('');
const creatingTeam = ref(false);

const selectedUser = ref(null);
const selectedTeam = ref(null);
var alredySelectedTeam = ref(false);
const users = ref([]);
const teams = ref([]); // Added to store teams
const loadingUsers = ref(false);
const invitingUser = ref(false);

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
watch(activeTab, async (newTab) => {
  if (newTab === 'teams') {
    await teamsStore.fetchTeams(authStore.user.role, authStore.user._id);
  } else if (newTab === 'invitations') {
    await teamsStore.fetchInvitations(authStore.user.role, authStore.user._id);
  }
});


// Create a new team
const createTeam = async () => {
  if (!newTeamName.value.trim()) {
    showToast({
      severity: 'warn',
      summary: 'Validation',
      detail: 'Team name cannot be empty.',
      life: 3000,
    });
    return;
  }
  creatingTeam.value = true;
  try {
    await teamsStore.createTeam({ name: newTeamName.value });
    createTeamDialogVisible.value = false;
    await teamsStore.fetchTeams(authStore.user.role, authStore.user.id);
    newTeamName.value = '';
  } catch (error) {
    showToast({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Failed to create team.',
      life: 3000,
    });
  } finally {
    creatingTeam.value = false;
  }
};
// Open Create Team Modal (from child component)
const openCreateTeamDialog = () => {
  createTeamDialogVisible.value = true;
};
const closeDialog = () => {
  inviteUserDialogVisible.value = false;
  alredySelectedTeam = false
};
const closeCreateteamDialog = () => {
  createTeamDialogVisible.value = false
};

// Fetch all users and teams for invitation
const fetchAllUsersAndTeams = async () => {
  loadingUsers.value = true;
  try {
    // Fetch all users
    await usersStore.getAllUsers();
    users.value = usersStore.users;

    // Fetch teams
    await teamsStore.fetchTeams(authStore.user.role, authStore.user._id);
    teams.value = teamsStore.teams;
  } catch (error) {
    showToast({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Failed to fetch users and teams.',
      life: 3000,
    });
  } finally {
    loadingUsers.value = false;
  }
};

// Invite a user to a team
const inviteUser = async () => {
  if (!selectedUser.value || !selectedTeam.value) {
    showToast({
      severity: 'warn',
      summary: 'Validation',
      detail: 'Please select both a user and a team.',
      life: 3000,
    });
    return;
  }
  invitingUser.value = true;
  try {
    await teamsStore.inviteUserToTeam(selectedUser.value, selectedTeam.value);
    inviteUserDialogVisible.value = false;
    selectedUser.value = null;
    selectedTeam.value = null;
  } catch (error) {
    showToast({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Failed to send invitation.',
      life: 3000,
    });
  } finally {
    invitingUser.value = false;
  }
};

watch(createTeamDialogVisible, (newValue) => {
  if (!newValue) {
    newTeamName.value = '';
  }
});

watch(inviteUserDialogVisible, (newValue) => {
  if (!newValue) {
    selectedUser.value = null;
    selectedTeam.value = null;
  }
});

// Handle accepting invitation (from child component)
const handleAcceptInvitation = async (token) => {
  // ... existing code ...
};

// Handle rejecting invitation (from child component)
const handleRejectInvitation = async (token) => {
  // ... existing code ...
};

// Handle inviting a user from TeamsList (e.g., inviting to a specific team)
// Handle inviting a user from TeamsList (e.g., inviting to a specific team)
const handleInviteUser = (teamId) => {
  // If a team ID is provided, select that team automatically
  selectedTeam.value = teamId ? teamId : null;
  alredySelectedTeam = teamId ? true  : false;
  inviteUserDialogVisible.value = true;
  fetchAllUsersAndTeams();
};


// Handle deleting a team (from TeamsList)
const handleDeleteTeam = (teamId) => {
  confirm.require({
    header: 'Danger Zone',
    message: 'Do you want to delete this Team?',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: async () => { 
      try {
        await teamsStore.deleteTeam(teamId);
        await teamsStore.fetchTeams(authStore.user.role, authStore.user.id);
      } catch (error) {
        showToast({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to delete team.',
          life: 3000,
        });
      }
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected the action', life: 3000 });
    }
  });
};

// On component mount, fetch initial data
onMounted(() => {
  teamsStore.fetchTeams(authStore.user.role, authStore.user._id);
});
</script>


