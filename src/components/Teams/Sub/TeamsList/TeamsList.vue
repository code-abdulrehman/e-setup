<template>
  <div>
    <!-- Action Buttons -->
     <Toolbar v-if="role=== !'user'">
      <template #start v-if="role=== !'user'">   
        <Button label="Create Team" icon="pi pi-plus" @click="emit('open-create-team')" />
      </template>
      <template #end  v-if="role=== !'user'">
        <Button label="Invite User" icon="pi pi-user-plus" class="p-ml-2" @click="emit('open-invite-user')" />
      </template>
     </Toolbar>
     <div class="py-4"></div>
    <div v-if="usersStore.users && teams.length">
    <!-- Teams Data Table -->
    <DataTable :value="teams" :loading="loading" responsiveLayout="scroll">
      <Column field="name" header="Team Name">
        <template #body="{ data }">
          <span class="font-bold cursor-pointer text-primary" 
          v-on:click="$router.push(`/teams/team/${data._id}`)">
            {{ data.name }}
          </span>
        </template>
      </Column>
      
      <Column field="created_by" header="Created By">
        <template #body="{ data }">
      @{{  data?.created_by?.username || resolveUserName(data?.created_by)}}
    </template>
      </Column>
      <Column field="members" header="Team Members" style="width: 12rem;">
        <template #body="{ data }">
          <div class="flex justify-center w-[80%] overflow-hidden text-ellipsis">
            {{ data.members?.length || 0 }}
          </div>
    </template>
      </Column>
      <Column field="_id" header="Actions">
        <template #body="{ row }">
          <div class="p-d-flex p-ai-center">
            <Button
              icon="pi pi-user-plus"
              class="p-button-rounded p-button-primary p-mr-2"
              tooltip="Invite User"
              @click="emit('invite-user', row._id)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger"
              tooltip="Delete Team"
              v-if="canDeleteTeam(row)"
              @click="emit('delete-team', row._id)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useAuthStore } from '@/lib/stores/useAuthStore/useAuthStore';
import { useTeamsStore } from '@/lib/stores/useTeamsStore/useTeamsStore';
import { useUsersStore } from '@/lib/stores/useUsersStore/useUsersStore';
import { useRoute } from 'vue-router';
const route = useRoute();
// Emit events for parent component
const emit = defineEmits(['open-create-team', 'open-invite-user', 'invite-user', 'delete-team']);

const authStore = useAuthStore();
const teamsStore = useTeamsStore();
const usersStore = useUsersStore();

// Computed properties for teams and loading state
const teams = computed(() => teamsStore.teams);
const loading = computed(() => teamsStore.loading);

// Fetch teams and users on component mount
onMounted(async () => {
  await teamsStore.fetchTeams(authStore.user.role, authStore.user._id);
  await usersStore.getAllUsers(); // Fetch all users to resolve names
  if (!usersStore.users) {
    console.log('usersStore.users is undefined 62', usersStore.users);
  }
});

const resolveUserName = (userId) => {
  if (!usersStore.users) {
    console.log('usersStore.users is undefined');
    return 'Unknown';
  }
  const user = usersStore.users.find((user) => user._id === userId);
  if (!user) {
    console.log(`User with ID ${userId} not found.`);
  }
  return user ? user.username : 'Unknown';
};


// Check if the current user can delete the team
const role = authStore.role;
const canDeleteTeam = (team) => {
  return role === 'super_admin' || (role === 'admin' && team.created_by === authStore.user._id);
};
</script>


<style scoped>
/* Styling */
.p-d-flex {
  display: flex;
}

.p-jc-end {
  justify-content: flex-end;
}

.p-mb-3 {
  margin-bottom: 1rem;
}

.p-ml-2 {
  margin-left: 0.5rem;
}

.p-mr-2 {
  margin-right: 0.5rem;
}

.p-ai-center {
  align-items: center;
}
</style>
