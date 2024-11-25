import axiosInstance from '@/lib/api/axiosInstance';
import { showToast } from '@/lib/utils/toast';
import { useRouter } from 'vue-router';
import Peer from 'peerjs'; // Import PeerJS
import { defineStore } from 'pinia';
const router = useRouter()
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: sessionStorage.getItem('token') || '',
    peerId: localStorage.getItem('peerId') || '', // Store peerId
    loading: false,
    logoutTimer: null,
    peer: null, // PeerJS instance
  }),
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

      if (this.peerId) {
        // Initialize PeerJS with existing peerId
        this.initializePeer(this.peerId);
      }
    },

    // Initialize PeerJS
    initializePeer(peerId = undefined) {
      this.peer = new Peer(peerId, {
        host: 'your-peerjs-server.com', // Replace with your PeerJS server
        port: 443,
        path: '/peerjs',
        secure: true,
      });

      this.peer.on('open', (id) => {
        if (!this.peerId) {
          this.peerId = id;
          localStorage.setItem('peerId', id);
          // Optionally, send peerId to backend to associate with the user
          this.updateUserPeerId(id);
        }
      });

      this.peer.on('error', (err) => {
        console.error('PeerJS error:', err);
        showToast({ severity: 'error', summary: 'Peer Error', detail: err.message, life: 3000 });
      });

      // Handle incoming connections/messages as needed
      this.peer.on('connection', (conn) => {
        conn.on('data', (data) => {
          // Handle incoming data
          console.log('Received data:', data);
        });
      });
    },

    // Update user's peerId on the backend
    async updateUserPeerId(peerId) {
      try {
        await axiosInstance.post('/auth/update-peer-id', { peerId });
        showToast({ severity: 'success', summary: 'Peer ID Updated', detail: 'Your peer ID has been updated.', life: 3000 });
      } catch (error) {
        console.error('Failed to update peerId:', error);
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
        // Optionally, redirect to another page after registration
        router.push('/dashboard'); // Change the route as per your app
      } catch (error) {
        showToast({ severity: 'error', summary: 'Registration Failed', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },

    async loginUser(credentials) {
      this.loading = true;
      try {
        const response = await axiosInstance.post('/auth/login', credentials);
        this.user = response.data.user;
        this.token = response.data.token;

        // Store token in sessionStorage and user in localStorage
        sessionStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));

        // Set the Authorization header for future requests
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        // Initialize the logout timer based on token expiry
        const tokenExpiry = this.getTokenExpiry(this.token);
        const expiresIn = tokenExpiry - Date.now();
        this.setLogoutTimer(expiresIn);

        showToast({ severity: 'success', summary: 'Login Successful', detail: 'You have logged in successfully.', life: 3000 });

        // Initialize PeerJS and generate peerId
        this.initializePeer(); // Without passing peerId to auto-generate

        // Redirect to dashboard or desired route after login
        router.push('/dashboard'); // Change the route as per your app
      } catch (error) {
        showToast({ severity: 'error', summary: 'Login Failed', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },

    async forgotPassword(emailData) {
      this.loading = true;
      try {
        await axiosInstance.post('/auth/forgotpassword', emailData);
        showToast({ severity: 'success', summary: 'Email Sent', detail: 'Password reset email has been sent.', life: 3000 });
      } catch (error) {
        showToast({ severity: 'error', summary: 'Error', detail: error.response?.data?.message || error.message, life: 3000 });
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
        router.push('/login'); // Change the route as per your app
      } catch (error) {
        showToast({ severity: 'error', summary: 'Error', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },

    logout() {
      if (this.peer) {
        this.peer.destroy(); // Close PeerJS connection
      }
      this.user = null;
      this.token = '';
      this.peerId = '';
      localStorage.removeItem('user');
      localStorage.removeItem('peerId');
      sessionStorage.removeItem('token');
      delete axiosInstance.defaults.headers.common['Authorization'];
      this.clearLogoutTimer();
      showToast({ severity: 'success', summary: 'Logged Out', detail: 'You have been logged out.', life: 3000 });
      router.push('/auth/sign-in'); // Change the route as per your app
    },
  },
});
