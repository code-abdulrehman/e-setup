// src/stores/useUsersStore.js
import axiosInstance from '@/lib/api/axiosInstance';
import { showToast } from '@/lib/utils/toast';
import { defineStore } from 'pinia';

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    expertiseList: [],
    countriesList: [],
    currentUser: null,
    peerIds: [],
    loading: false,
  }),
  actions: {
    async getAllUsers() {
      this.loading = true;
      try {
        const response = await axiosInstance.get('/users');
        this.users = response.data.data;
      } catch (error) {
        showToast({ severity: 'error', summary: 'Error Fetching Users', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },

    async getExpertiseList() {
      this.loading = true;
      try {
        const response = await axiosInstance.get('/users/expertise');
        this.expertiseList = response.data.expertise;
      } catch (error) {
        showToast({ severity: 'error', summary: 'Error Fetching Expertise', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },

    async getCountriesList() {
      this.loading = true;
      try {
        const response = await axiosInstance.get('/users/countries');
        this.countriesList = response.data.countries;
      } catch (error) {
        showToast({ severity: 'error', summary: 'Error Fetching Countries', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },

    async getUserById(userId) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(`/users/${userId}`);
        this.currentUser = response.data.user;
      } catch (error) {
        showToast({ severity: 'error', summary: 'Error Fetching User', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },

    async updateUser(userId, updateData) {
      this.loading = true;
      try {
        const response = await axiosInstance.put(`/users/${userId}`, updateData);
        const index = this.users.findIndex(user => user.id === userId);
        if (index !== -1) {
          this.users[index] = response.data.user;
        }
        showToast({ severity: 'success', summary: 'User Updated', detail: 'User profile has been updated successfully.', life: 3000 });
      } catch (error) {
        showToast({ severity: 'error', summary: 'Error Updating User', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(userId) {
      this.loading = true;
      try {
        await axiosInstance.delete(`/users/${userId}`);
        this.users = this.users.filter(user => user.id !== userId);
        showToast({ severity: 'success', summary: 'User Deleted', detail: 'User has been deleted successfully.', life: 3000 });
      } catch (error) {
        showToast({ severity: 'error', summary: 'Error Deleting User', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },

    async getUserPeerIds() {
      this.loading = true;
      try {
        const response = await axiosInstance.get('/users/peerids');
        this.peerIds = response.data.peerIds;
      } catch (error) {
        showToast({ severity: 'error', summary: 'Error Fetching Peer IDs', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },
  },
});
