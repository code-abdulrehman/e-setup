<!-- src/components/Dialogs/InviteUserDialog.vue -->
<template>
  <Dialog
    header="Invite User"
    :visible="visible"
    @hide="onHide"
    modal
    :closable="false"
    class="w-full md:w-[450px]"
  >
    <form @submit.prevent="submitInvite">
      <Dropdown
        v-model="selectedUser"
        :options="users"
        option-label="email"
        option-value="email"
        placeholder="Select User"
        class="w-full mb-3"
        :loading="loadingUsers"
        required
      />
      <Dropdown
        v-model="selectedTeam"
        :options="teams"
        option-label="name"
        option-value="_id"
        placeholder="Select Team"
        class="w-full mb-3"
        :loading="loadingTeams"
        :disabled="alreadySelectedTeam"
        required
      />
      <div class="flex justify-end gap-2">
        <Button label="Close" @click="onHide" class="p-button-text" />
        <Button label="Send Invite" type="submit" :loading="loading" />
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  teams: {
    type: Array,
    required: true,
  },
  users: {
    type: Array,
    required: true,
  },
  loadingUsers: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:visible', 'user-invited']);

const selectedUser = ref(null);
const selectedTeam = ref(null);
const loading = ref(false);

// Determine if a team is preselected and disable the team dropdown accordingly
const alreadySelectedTeam = computed(() => {
  return selectedTeam.value !== null;
});

const submitInvite = () => {
  if (!selectedUser.value || !selectedTeam.value) {
    // Optionally emit a validation warning or handle it here
    return;
  }
  loading.value = true;
  // Emit the invite user event with necessary data
  emit('user-invited', { email: selectedUser.value, teamId: selectedTeam.value });
  // Reset state
  selectedUser.value = null;
  selectedTeam.value = null;
  loading.value = false;
  emit('update:visible', false);
};

const onHide = () => {
  emit('update:visible', false);
  selectedUser.value = null;
  selectedTeam.value = null;
};
</script>

<style scoped>
/* Add any necessary styling here */
</style>
