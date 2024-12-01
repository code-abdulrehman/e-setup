// src/lib/stores/useProfileStore/index.js
import axiosInstance from '@/lib/api/axiosInstance';
import { showToast } from '@/lib/utils/toast'; // Ensure this utility is set up correctly
import { defineStore } from 'pinia';

export const useProfileStore = defineStore('profile', {
  state: () => ({
    user: null,
    loading: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    /**
     * Fetch a user by their ID.
     * @param {String|Number} userId - The ID of the user to fetch.
     */
    async fetchUserById(userId) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(`/users/${userId}`);
        this.user = response.data.data;
        console.log(response.data.data, "user");
      } catch (error) {
        showToast({
          severity: 'error',
          summary: 'Error Fetching User',
          detail: error.response?.data?.message || error.message,
          life: 3000,
        });
      } finally {
        this.loading = false;
      }
    },

    /**
     * Update a user's information.
     * @param {String|Number} userId - The ID of the user to update.
     * @param {Object} updateData - The data to update.
     */
    async updateUser(userId, updateData) {
      this.loading = true;
      try {
        const response = await axiosInstance.put(`/users/${userId}`, updateData);
        this.user = response.data.user;
        showToast({
          severity: 'success',
          summary: 'User Updated',
          detail: 'User profile has been updated successfully.',
          life: 3000,
        });
      } catch (error) {
        showToast({
          severity: 'error',
          summary: 'Error Updating User',
          detail: error.response?.data?.message || error.message,
          life: 3000,
        });
      } finally {
        this.loading = false;
      }
    },

    /**
     * Delete a user by their ID.
     * @param {String|Number} userId - The ID of the user to delete.
     */
    async deleteUser(userId) {
      this.loading = true;
      try {
        await axiosInstance.delete(`/users/${userId}`);
        this.user = null;
        showToast({
          severity: 'success',
          summary: 'User Deleted',
          detail: 'User has been deleted successfully.',
          life: 3000,
        });
      } catch (error) {
        showToast({
          severity: 'error',
          summary: 'Error Deleting User',
          detail: error.response?.data?.message || error.message,
          life: 3000,
        });
      } finally {
        this.loading = false;
      }
    },

    /**
     * Create a new user.
     * @param {Object} userData - The data for the new user.
     */
    async createUser(userData) {
      this.loading = true;
      try {
        const response = await axiosInstance.post('/users', userData);
        this.user = response.data.user;
        showToast({
          severity: 'success',
          summary: 'User Created',
          detail: 'User has been created successfully.',
          life: 3000,
        });
      } catch (error) {
        showToast({
          severity: 'error',
          summary: 'Error Creating User',
          detail: error.response?.data?.message || error.message,
          life: 3000,
        });
      } finally {
        this.loading = false;
      }
    },

    /**
     * Update the current user's appearance.
     * @param {String|Number} userId - The ID of the user.
     * @param {Object} appearanceData - The appearance data (e.g., banner, profile image).
     */
    async updateAppearance(userId, appearanceData) {
      this.loading = true;
      try {
        const response = await axiosInstance.put(`/users/${userId}/appearance`, { appearance: appearanceData });
        this.user = response.data.user;
        showToast({
          severity: 'success',
          summary: 'Appearance Updated',
          detail: 'User appearance has been updated successfully.',
          life: 3000,
        });
      } catch (error) {
        showToast({
          severity: 'error',
          summary: 'Error Updating Appearance',
          detail: error.response?.data?.message || error.message,
          life: 3000,
        });
      } finally {
        this.loading = false;
      }
    },

    /**
     * Update the banner pattern.
     * @param {Number} patternNo - The selected pattern number.
     */
    async updateBannerPattern(patternNo) {
      if (this.user) {
        this.user.appearance.banner.pattern_no = patternNo;
        this.user.appearance.banner.banner_url = ""; // Clear banner_url if a pattern is selected
        await this.updateAppearance(this.user._id, this.user.appearance); // Send entire appearance object
        // Persist banner selection if needed
        this.persistBannerSelection();
        showToast({
          severity: 'success',
          summary: 'Success',
          detail: `Pattern ${patternNo} selected`,
          life: 3000,
        });
      }
    },

    /**
     * Update the banner image.
     * @param {String} bannerUrl - The URL of the selected banner image.
     */
    async updateBannerImage(bannerUrl) {
      if (this.user) {
        this.user.appearance.banner.banner_url = bannerUrl;
        this.user.appearance.banner.pattern_no = null; // Clear pattern_no if an image is selected
        await this.updateAppearance(this.user._id, this.user.appearance); // Send entire appearance object
        // Persist banner selection if needed
        this.persistBannerSelection();
        showToast({
          severity: 'success',
          summary: 'Success',
          detail: `Image selected`,
          life: 3000,
        });
      }
    },

    /**
     * Update the profile image URL.
     * @param {String} imageUrl - The new profile image URL.
     */
    async updateProfileImage(imageUrl) {
      if (this.user) {
        this.user.appearance.profile_img.url = imageUrl;
        await this.updateAppearance(this.user._id, this.user.appearance);
        showToast({
          severity: 'success',
          summary: 'Success',
          detail: `Profile image updated`,
          life: 3000,
        });
      }
    },

    /**
     * Persist banner selection in localStorage.
     */
    persistBannerSelection() {
      if (this.user.appearance.banner.banner_url) {
        localStorage.setItem('selectedBannerImage', this.user.appearance.banner.banner_url);
        localStorage.removeItem('selectedPattern');
      } else if (this.user.appearance.banner.pattern_no) {
        localStorage.setItem('selectedPattern', this.user.appearance.banner.pattern_no);
        localStorage.removeItem('selectedBannerImage');
      }
    },
  },
});
