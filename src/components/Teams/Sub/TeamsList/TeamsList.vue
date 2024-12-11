<!-- src/components/Teams/Sub/TeamsList/TeamsList.vue -->
<template>
  <div>
    <!-- Action Buttons -->
     <div  class="pb-8" v-if="btnAccess">    
       <Toolbar>
         <template #start>
           <Button label="Create Team" icon="pi pi-plus" @click="$emit('open-create-team')" />
         </template>
         <template #end>
           <Button label="Invite User" icon="pi pi-user-plus" class="p-ml-2" @click="$emit('open-invite-user')" />
         </template>
       </Toolbar>
     </div>
    <div>
      <!-- Teams Data Table -->
      <DataTable
        :value="teams"
        :loading="loading"
        responsiveLayout="scroll"
        :paginator="paginator"
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
      >
      <template #empty>
          <DataNotFound :message="'No teams found.'"/>
      </template>
      
        <Column field="name" header="Logo" style="width: 4rem;">
          <template #body="{ data }">
            <Avatar :label="data?.name[0].toUpperCase()" class="mr-2 logo-font" size="large" />
          </template>
        </Column>
        <Column field="name" header="Team Name">
          <template #body="{ data }">
            <span
              class="font-bold cursor-pointer text-primary"
              @click="$router.push(`/teams/team/${data?._id}`)"
            >
              {{ data?.name }}
            </span>
          </template>
        </Column>
        <Column field="created_by" header="Created By">
          <template #body="{ data }">
            <b>@</b>{{ data?.created_by?.username || resolveUserName(data?.created_by) }}
          </template>
        </Column>
        <Column field="members" header="Team Members" style="width: 12rem;">
          <template #body="{ data }">
            <div class="flex justify-center w-[80%] overflow-hidden text-ellipsis">
              {{ data?.members?.length || 0 }}
            </div>
          </template>
        </Column>
        <Column field="_id" header="Actions" style="width: 12rem;" v-if="userRole !== 'user'">
          <template #body="{ data }">
            <div class="p-d-flex p-ai-center">
              <span v-if="canAccessTeam(data)">
                <Button
                  icon="pi pi-user-plus"
                  class="p-button-rounded p-button-primary p-mr-2"
                  tooltip="Invite User"
                  @click="$emit('invite-user', data?._id)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger"
                  tooltip="Delete Team"
                  @click="$emit('delete-team', data?._id)"
                />
              </span>
            </div>
          </template>
        </Column>

      </DataTable>
    </div>
  </div>
</template>

<script setup>
import DataNotFound from '@/components/Commons/DataNotFound.vue';
import { computed, defineProps } from 'vue';

const props = defineProps({
  teams: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  userRole: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['invite-user', 'delete-team', 'open-create-team', 'open-invite-user']);

const paginator = computed(() => props.teams.length > 10);

const btnAccess = computed(() => props.userRole === 'super_admin' || props.userRole === 'admin');

const canAccessTeam = (team) => {
  return (
    props.userRole === 'super_admin' ||
    (props.userRole === 'admin' && team?.created_by?._id === props.userId)
  );
};

const resolveUserName = (userId) => {
  // Assuming users data is available globally or via a store
  // If not, consider passing user names as part of team data
  return 'Unknown'; // Placeholder
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
