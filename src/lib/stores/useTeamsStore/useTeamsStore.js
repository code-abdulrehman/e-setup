// src/stores/useTeamsStore.js
import axiosInstance from '@/lib/api/axiosInstance';
import { showToast } from '@/utils/toast';
import { defineStore } from 'pinia';

export const useTeamsStore = defineStore('teams', {
  state: () => ({
    teams: [],
    currentTeam: null,
    loading: false,
  }),
  actions: {
    async createTeam(teamData) {
      this.loading = true;
      try {
        const response = await axiosInstance.post('/teams', teamData);
        this.teams.push(response.data.team);
        showToast({ severity: 'success', summary: 'Team Created', detail: 'Team has been created successfully.', life: 3000 });
      } catch (error) {
        showToast({ severity: 'error', summary: 'Error Creating Team', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },

    async getTeamById(teamId) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(`/teams/${teamId}`);
        this.currentTeam = response.data.team;
      } catch (error) {
        showToast({ severity: 'error', summary: 'Error Fetching Team', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },

    async deleteTeam(teamId) {
      this.loading = true;
      try {
        await axiosInstance.delete(`/teams/${teamId}`);
        this.teams = this.teams.filter(team => team.id !== teamId);
        showToast({ severity: 'success', summary: 'Team Deleted', detail: 'Team has been deleted successfully.', life: 3000 });
      } catch (error) {
        showToast({ severity: 'error', summary: 'Error Deleting Team', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },

    async inviteMember(teamId, emailData) {
      this.loading = true;
      try {
        await axiosInstance.post(`/teams/${teamId}/invite`, emailData);
        showToast({ severity: 'success', summary: 'Invitation Sent', detail: 'Invitation has been sent to the member.', life: 3000 });
      } catch (error) {
        showToast({ severity: 'error', summary: 'Error Sending Invitation', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },

    async acceptTeamInvitation(inviteToken, passwordData) {
      this.loading = true;
      try {
        await axiosInstance.post(`/teams/invite/accept/${inviteToken}`, passwordData);
        showToast({ severity: 'success', summary: 'Invitation Accepted', detail: 'You have joined the team successfully.', life: 3000 });
      } catch (error) {
        showToast({ severity: 'error', summary: 'Error Accepting Invitation', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },

    async getAllTeams() {
      this.loading = true;
      try {
        const response = await axiosInstance.get('/teams');
        this.teams = response.data.teams;
      } catch (error) {
        showToast({ severity: 'error', summary: 'Error Fetching Teams', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },
  },
});
