<!-- src/components/InviteUserDialog.vue -->
<template>
    <Dialog header="Invite User" :visible="visible" @hide="onHide" modal>
      <form @submit.prevent="submitInvite">
        <Dropdown
          v-model="selectedUser"
          :options="users"
          option-label="name"
          option-value="id"
          placeholder="Select User"
          class="w-full mb-3"
          :loading="loadingUsers"
        />
        <Button label="Send Invite" type="submit" :loading="loading" />
      </form>
    </Dialog>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useUsersStore } from '@/lib/stores/useUsersStore';
  import { showToast } from '@/lib/utils/toast';
  
  const props = defineProps({
    visible: Boolean,
    teamId: Number,
  });
  
  const emit = defineEmits(['update:visible']);
  
  const usersStore = useUsersStore();
  const users = ref([]);
  const selectedUser = ref(null);
  const loading = ref(false);
  const loadingUsers = ref(false);
  
  const fetchUsers = async () => {
    loadingUsers.value = true;
    try {
      await usersStore.getAllUsers();
      users.value = usersStore.users;
    } catch (error) {
      showToast({
        severity: 'error',
        summary: 'Error Fetching Users',
        detail: error.response?.data?.message || error.message,
        life: 3000,
      });
    } finally {
      loadingUsers.value = false;
    }
  };
  
  const submitInvite = async () => {
    if (!selectedUser.value) {
      showToast({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Please select a user to invite.',
        life: 3000,
      });
      return;
    }
    loading.value = true;
    try {
      await emit.inviteUserToTeam(props.teamId, selectedUser.value);
      emit('update:visible', false);
    } catch (error) {
      // Error handling is done in the store
    } finally {
      loading.value = false;
    }
  };
  
  const onHide = () => {
    emit('update:visible', false);
  };
  
  onMounted(() => {
    if (props.visible) {
      fetchUsers();
    }
  });
  </script>
  
  <style scoped>
  /* Add any necessary styling */
  </style>
  