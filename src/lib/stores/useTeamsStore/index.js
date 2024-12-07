import { defineStore } from 'pinia';
import axiosInstance from '@/lib/api/axiosInstance';
import { showToast } from '@/lib/utils/toast';

export const useTeamsStore = defineStore('teams', {
  state: () => ({
    teams: [],
    invitations: [],
    loading: false,
    delete_loading: false,
  }),
  actions: {
    async fetchTeams(role, userId) {
      this.loading = true;
      try {
        let endpoint = '/teams';
        if (role === 'admin') {
          endpoint = `/teams`;
        }
        const response = await axiosInstance.get(endpoint);
        this.teams = response.data.data;
      } catch (error) {
        showToast({
          severity: 'error',
          summary: 'Error Fetching Teams',
          detail: error.response?.data?.message || error.message,
          life: 3000,
        });
      } finally {
        this.loading = false;
      }
    },

    async fetchInvitations(role, userId) {
      this.loading = true;
      try {
        let endpoint = '/teams/invites';
        const response = await axiosInstance.get(endpoint);
        this.invitations = response.data.data;
      } catch (error) {
        showToast({
          severity: 'error',
          summary: 'Error Fetching Invitations',
          detail: error.response?.data?.message || error.message,
          life: 3000,
        });
      } finally {
        this.loading = false;
      }
    },


    async createTeam(teamData) {
      try {
        const response = await axiosInstance.post('/teams', teamData);
        this.teams.push(response.data.data.data);
        showToast({
          severity: 'success',
          summary: 'Team Created',
          detail: 'Team has been created successfully.',
          life: 3000,
        });
      } catch (error) {
        showToast({
          severity: 'error',
          summary: 'Error Creating Team',
          detail: error.response?.data?.message || error.message,
          life: 3000,
        });
        throw error; // Rethrow to handle in the component
      }
    },

    async inviteUserToTeam(email, teamId) {
      try {
        const response = await axiosInstance.post(`/teams/${teamId}/invite`, { email });
        showToast({
          severity: 'success',
          summary: 'Invitation Sent',
          detail: response?.data?.message || 'User has been invited successfully.',
          life: 3000,
        });
        // Optionally, update the invitations list
        this.fetchInvitations(this.role, this.userId);
      } catch (error) {
        showToast({
          severity: 'error',
          summary: 'Error Sending Invitation',
          detail: error.response?.data?.message || error.message,
          life: 3000,
        });
        throw error; // Rethrow to handle in the component
      }
    },

    async deleteTeam(teamId) {
      this.delete_loading = true;
      try {
        await axiosInstance.delete(`/teams/${teamId}`);
        this.teams = this.teams.filter((team) => team.id !== teamId);
        showToast({
          severity: 'success',
          summary: 'Team Deleted',
          detail: 'Team has been deleted successfully.',
          life: 3000,
        });
      } catch (error) {
        showToast({
          severity: 'error',
          summary: 'Error Deleting Team',
          detail: error.response?.data?.message || error.message,
          life: 3000,
        });
      } finally {
        this.delete_loading = false;
      }
    },

    // Additional actions for accepting/rejecting invitations
    async acceptInvitation(token) {
      try {
        await axiosInstance.post(`/teams/invite/accept/${token}`);
        showToast({
          severity: 'success',
          summary: 'Invitation Accepted',
          detail: 'You have joined the team successfully.',
          life: 3000,
        });
        // Refresh teams and invitations
        const role = this.role;
        const userId = this.userId;
        this.fetchTeams(role, userId);
        this.fetchInvitations(role, userId);
      } catch (error) {
        showToast({
          severity: 'error',
          summary: 'Error Accepting Invitation',
          detail: error.response?.data?.message || error.message,
          life: 3000,
        });
      }
    },

    async rejectInvitation(token) {
      try {
        await axiosInstance.post(`/teams/invite/reject/${token}`);
        showToast({
          severity: 'info',
          summary: 'Invitation Rejected',
          detail: 'You have rejected the invitation.',
          life: 3000,
        });
        // Refresh invitations
        const role = this.role;
        const userId = this.userId;
        this.fetchInvitations(role, userId);
      } catch (error) {
        showToast({
          severity: 'error',
          summary: 'Error Rejecting Invitation',
          detail: error.response?.data?.message || error.message,
          life: 3000,
        });
      }
    },
  },
});