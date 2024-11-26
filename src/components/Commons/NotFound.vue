<!-- src/components/Commons/NotFound.vue -->
<template>
    <div class="not-found">
      <h2>{{ message }}</h2>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  defineProps({
    message: {
      type: String,
      default: 'Data Not Found',
    },
  });
  </script>
  
  <style scoped>
  .not-found {
    width: 100%;
    text-align: center;
    padding: 20px 0;
  }
  </style>
  