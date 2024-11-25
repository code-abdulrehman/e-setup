<!-- src/App.vue -->
<template>
    <div id="app">
      <Toast ref="toast" />
      <router-view />
    </div>
  </template>
  
  <script>
  import { onMounted, ref } from 'vue';
  import { setToast } from '@/lib/utils/toast';
  
  export default {
    name: 'App',
    setup() {
      const toast = ref(null);
  
      onMounted(() => {
        setToast(toast.value);
      });
  
      return {
        toast,
      };
    },
  };
  </script>
  
  <style>
  /* Your styles here */
  </style>
  