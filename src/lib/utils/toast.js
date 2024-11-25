// src/utils/toast.js
import { useToast } from 'primevue/usetoast';

let toastInstance = null;

// Function to set the toast instance (called from a Vue component)
export function setToast(instance) {
  toastInstance = instance;
}

// Function to show a toast
export function showToast(options) {
  if (toastInstance) {
    toastInstance.add(options);
  } else {
    console.warn('Toast instance is not set. Please set it in your main component.');
  }
}
