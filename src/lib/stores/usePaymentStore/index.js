// src/stores/usePaymentStore.js
import axiosInstance from '@/lib/api/axiosInstance';
import { showToast } from '@/lib/utils/toast';
import { defineStore } from 'pinia';

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    payments: [],
    loading: false,
  }),
  actions: {
    async processPayment(paymentData) {
      this.loading = true;
      try {
        const response = await axiosInstance.post('/payments', paymentData);
        this.payments.push(response.data.payment);
        showToast({ severity: 'success', summary: 'Payment Processed', detail: 'Your payment has been processed successfully.', life: 3000 });
      } catch (error) {
        showToast({ severity: 'error', summary: 'Payment Failed', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },

    async getPaymentsForUser(userId) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(`/payments/user/${userId}`);
        this.payments = response.data.payments;
      } catch (error) {
        showToast({ severity: 'error', summary: 'Error Fetching Payments', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },
  },
});
