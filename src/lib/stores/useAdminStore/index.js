// src/stores/useAdminStore.js
import axiosInstance from '@/lib/api/axiosInstance';
import { showToast } from '@/lib/utils/toast';
import { defineStore } from 'pinia';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    roles: [],
    feePercentage: 0,
    loading: false,
  }),
  actions: {
    async getRolesAndPermissions() {
      this.loading = true;
      try {
        const response = await axiosInstance.get('/admin/roles');
        this.roles = response.data.roles;
      } catch (error) {
        showToast({ severity: 'error', summary: 'Error Fetching Roles', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },

    async updateRoles(roleData) {
      this.loading = true;
      try {
        const response = await axiosInstance.put('/admin/roles', roleData);
        this.roles = response.data.roles;
        showToast({ severity: 'success', summary: 'Roles Updated', detail: 'Roles and permissions have been updated.', life: 3000 });
      } catch (error) {
        showToast({ severity: 'error', summary: 'Error Updating Roles', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },

    async updateFeePercentage(feeData) {
      this.loading = true;
      try {
        const response = await axiosInstance.put('/admin/fee', feeData);
        this.feePercentage = response.data.feePercentage;
        showToast({ severity: 'success', summary: 'Fee Updated', detail: 'Fee percentage has been updated.', life: 3000 });
      } catch (error) {
        showToast({ severity: 'error', summary: 'Error Updating Fee', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },
  },
});
