<!-- src/components/Teams/Sub/InvitationsList/InvitationsList.vue -->
<template>
  <div>
    <DataTable
    v-model:selection="selectedInvite" selectionMode="single" 
      :value="invitations?.to"
      :paginator="paginator"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      responsiveLayout="scroll"
      :loading="loading"
    >
      <template #empty>
        <h3 class="flex items-center justify-center w-full">No invitations found.</h3>
      </template>
      <Column field="teamName" header="Team Name" />
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
          <Tag v-if="data?.status === 'pending'" severity="info" rounded>{{ data?.status }}</Tag>
          <Tag v-else-if="data?.status === 'accepted'" severity="success" rounded>{{ data?.status }}</Tag>
          <Tag v-else-if="data?.status === 'rejected'" severity="warn" rounded>{{ data?.status }}</Tag>
          <Tag v-else-if="data?.status === 'expired'" severity="danger" rounded>{{ data?.status }}</Tag>
          <Tag v-else severity="contrast" rounded>{{ data?.status }}</Tag>
        </template>
      </Column>
      <Column field="expireAt" header="Expire At">
        <template #body="{ data }">
          {{formatDate(data.expireAt, month='short')}}
        </template>
      </Column>
      <Column header="Actions">
        <template #body="{ data }">
          <div class="p-d-flex p-ai-center" v-if="data?.status === 'pending'">
            <Button
              label="Accept"
              class="p-button-primary p-mr-2"
              @click="$emit('accept-invitation', data?.token)"
              v-if="userRole === 'user'"
            />
            <Button
              label="Reject"
              class="p-button-danger"
              @click="$emit('reject-invitation', data?.token)"
            />
          </div>
          <div class="flex items-center justify-center w-1/2 p-d-flex p-ai-center" v-else>
            <!-- <Button
              label="Accept"
              class="p-button-primary p-mr-2"
              @click="$emit('accept-invitation', data?.token)"
            /> -->
            - -
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { formatDate } from '@/lib/utils/helper';
import { defineProps, computed, ref } from 'vue';

const props = defineProps({
  invitations: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  userRole: {
    type: String,
  }
});

const emit = defineEmits(['accept-invitation', 'reject-invitation']);
const selectedInvite = ref();
const paginator = computed(() => props.invitations.length > 10);
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
