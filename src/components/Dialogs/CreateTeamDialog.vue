<!-- src/components/Dialogs/CreateTeamDialog.vue -->
<template>
  <Dialog header="Create Team" :visible="visible" @hide="onHide" modal :closable="false">
    <form @submit.prevent="submitCreateTeam">
      <InputText
        v-model="teamName"
        placeholder="Team Name"
        class="w-full md:min-w-[400px] my-4"
        required
      />
      <div class="flex justify-end gap-2">
        <Button label="Close" @click="onHide" class="p-button-text" />
        <Button label="Create Team" type="submit" :loading="loading" />
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:visible', 'team-created']);

const teamName = ref('');
const loading = ref(false);

const submitCreateTeam = () => {
  if (!teamName.value.trim()) {
    // Optionally emit a validation warning or handle it here
    return;
  }
  loading.value = true;
  // Emit the team creation event with team data
  emit('team-created', { name: teamName.value });
  // Reset state
  teamName.value = '';
  loading.value = false;
  emit('update:visible', false);
};

const onHide = () => {
  emit('update:visible', false);
  teamName.value = '';
};
</script>

<style scoped>
/* Add any necessary styling here */
</style>
