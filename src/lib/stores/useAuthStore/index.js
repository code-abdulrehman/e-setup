import axiosInstance from '@/lib/api/axiosInstance';
import { showToast } from '@/lib/utils/toast';
import { defineStore } from 'pinia';


export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: sessionStorage.getItem('token') || '',
    loading: false,
    logoutTimer: null,
  }),
  getters: {
    // Getter to fetch the user's role
    role: (state) => state.user?.role || null,
  },
  actions: {
    initializeStore() {
      if (this.token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        const tokenExpiry = this.getTokenExpiry(this.token);
        const expiresIn = tokenExpiry - Date.now();
        if (expiresIn > 0) {
          this.setLogoutTimer(expiresIn);
        } else {
          this.logout();
        }
      }
    },

    // Decode JWT to get expiry time
    getTokenExpiry(token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // JWT 'exp' is in seconds, convert to milliseconds
        return payload.exp * 1000;
      } catch (error) {
        console.error('Invalid token format:', error);
        return Date.now() + 3 * 60 * 60 * 1000; // Default to 3 hours if decoding fails
      }
    },

    // Set a timeout to logout the user after token expiry
    setLogoutTimer(duration) {
      // Clear any existing timer
      if (this.logoutTimer) {
        clearTimeout(this.logoutTimer);
      }
      this.logoutTimer = setTimeout(() => {
        this.logout();
        showToast({ severity: 'info', summary: 'Session Expired', detail: 'Your session has expired. Please log in again.', life: 3000 });
      }, duration);
    },

    // Clear the logout timer
    clearLogoutTimer() {
      if (this.logoutTimer) {
        clearTimeout(this.logoutTimer);
        this.logoutTimer = null;
      }
    },

    async registerUser(userData) {
      this.loading = true;
      try {
        const response = await axiosInstance.post('/auth/register', userData);
        this.user = response.data.user;
        localStorage.setItem('user', JSON.stringify(this.user)); // Store user in localStorage
        showToast({ severity: 'success', summary: 'Registration Successful', detail: 'You have registered successfully.', life: 3000 });

      } catch (error) {
        showToast({ severity: 'error', summary: 'Registration Failed', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },

    async loginUser(credentials) {
      this.loading = true;
      try {
        this.loading = true;
        const response = await axiosInstance.post('/auth/login', credentials);
        this.user = response.data.user;
        this.token = response.data.token;

        // Store token in sessionStorage and user in localStorage
        sessionStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(this.user));

        // Set the Authorization header for future requests
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        // Initialize the logout timer based on token expiry
        const tokenExpiry = this.getTokenExpiry(this.token);
        const expiresIn = tokenExpiry - Date.now();
        this.setLogoutTimer(expiresIn);

        showToast({ severity: 'success', summary: 'Login Successful', detail: 'You have logged in successfully.', life: 3000 });

      } catch (error) {
        showToast({ severity: 'error', summary: 'Login Failed', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },

    async forgotPassword(emailData) {
      this.loading = true;
      try {
        const response = await axiosInstance.post('/auth/forgotpassword', emailData);

        if (response.data?.token) {
          const token = response.data.token;
          sessionStorage.setItem("passwordResetToken", token);
          showToast({ severity: 'success', summary: 'Email Sent', detail: 'Password reset email has been sent.', life: 3000 });
          return token; // Return token for potential chaining or follow-up logic
        } else {
          showToast({ severity: 'warn', summary: 'Token Missing', detail: 'No verification token received. Please check your email.', life: 3000 });
        }
      } catch (error) {
        showToast({
          severity: 'error',
          summary: 'Error',
          detail: error.response?.data?.message || error.message || 'An unexpected error occurred.',
          life: 3000,
        });
      } finally {
        this.loading = false;
      }
    },
    

    async resetPassword(token, passwordData) {
      this.loading = true;
      try {
        await axiosInstance.put(`/auth/resetpassword/${token}`, passwordData);
        showToast({ severity: 'success', summary: 'Password Reset', detail: 'Your password has been reset successfully.', life: 3000 });
        // Optionally, redirect to login after password reset
      } catch (error) {
        showToast({ severity: 'error', summary: 'Error', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = '';
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      delete axiosInstance.defaults.headers.common['Authorization'];
      this.clearLogoutTimer();
      showToast({ severity: 'success', summary: 'Logged Out', detail: 'You have been logged out.', life: 3000 });
    },
  },
});
