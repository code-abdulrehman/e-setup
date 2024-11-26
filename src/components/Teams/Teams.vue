<template>
  <div>
    <!-- Reusable Tabs Component -->
    <TabsComponent :tabs="tabs" @tab-selected="handleTabSelection" />

    <!-- Content based on selected tab -->
    <div class="p-mt-4">
      <component
        :is="currentComponent"
        @open-create-team="openCreateTeamDialog"
        @open-invite-user="openInviteUserModal"
        @invite-user="handleInviteUser"
        @delete-team="handleDeleteTeam"
        @accept-invitation="handleAcceptInvitation"
        @reject-invitation="handleRejectInvitation"
      />
    </div>

    <!-- Create Team Modal -->
    <Dialog header="Create Team" :visible.sync="createTeamDialogVisible" modal>
      <form @submit.prevent="createTeam">
        <InputText v-model="newTeamName" placeholder="Team Name" class="w-full mb-3" />
        <Button label="Create" type="submit" :loading="creatingTeam" />
      </form>
    </Dialog>

    <!-- Invite User Modal -->
    <Dialog header="Invite User" :visible.sync="inviteUserDialogVisible" modal >
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
        />
        <Button label="Send Invite" type="submit" :loading="invitingUser" />
      </form>
    </Dialog>
  </div>
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

// Reactive states
const activeTab = ref('teams');
const createTeamDialogVisible = ref(false);
const inviteUserDialogVisible = ref(false);
const newTeamName = ref('');
const creatingTeam = ref(false);

const selectedUser = ref(null);
const selectedTeam = ref(null); // Added for team selection
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
    showToast({
      severity: 'success',
      summary: 'Team Created',
      detail: 'Team has been created successfully.',
      life: 3000,
    });
    createTeamDialogVisible.value = false;
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

// Open Invite User Modal (from child component)
const openInviteUserModal = () => {
  selectedTeam.value = null; // Reset selected team
  inviteUserDialogVisible.value = true;
  fetchAllUsersAndTeams();
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
    showToast({
      severity: 'success',
      summary: 'Invitation Sent',
      detail: 'User has been invited successfully.',
      life: 3000,
    });
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
const handleInviteUser = (teamId = null) => {
  selectedTeam.value = teamId;
  inviteUserDialogVisible.value = true;
  fetchAllUsersAndTeams();
};

// Handle deleting a team (from TeamsList)
const handleDeleteTeam = async (teamId) => {
  if (confirm('Are you sure you want to delete this team?')) {
    try {
      await teamsStore.deleteTeam(teamId);
      showToast({
        severity: 'success',
        summary: 'Team Deleted',
        detail: 'Team has been deleted successfully.',
        life: 3000,
      });
      // Optionally, refresh teams list
      await teamsStore.fetchTeams(authStore.user.role, authStore.user.id);
    } catch (error) {
      showToast({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to delete team.',
        life: 3000,
      });
    }
  }
};

// On component mount, fetch initial data
onMounted(() => {
  teamsStore.fetchTeams(authStore.user.role, authStore.user._id);
});
</script>

<style scoped>
/* Add any necessary styling */
</style>



