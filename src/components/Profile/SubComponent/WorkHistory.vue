<!-- WorkHistoryComponent.vue -->
<template>
    <div class="card">
      <h3 class="mb-4">Work History</h3>
      
      <!-- Work History Table -->
      <Panel header="Projects">
        <DataTable :value="projects" paginator :rows="5" responsiveLayout="scroll">
          <Column field="name" header="Project Name" sortable></Column>
          <Column field="description" header="Description" sortable></Column>
          <Column field="status" header="Status" sortable></Column>
          <Column field="completionDate" header="Completion Date" sortable></Column>
        </DataTable>
      </Panel>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import Panel from 'primevue/panel';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  
  // Sample mock data for projects
  const projects = ref([
    { 
      id: 1, 
      name: 'Web Development', 
      description: 'Developed a responsive website for e-commerce.', 
      status: 'Completed', 
      completionDate: '2024-10-30' 
    },
    { 
      id: 2, 
      name: 'Mobile App Design', 
      description: 'Designed UI/UX for a cross-platform mobile application.', 
      status: 'Ongoing', 
      completionDate: '2024-12-15' 
    },
    { 
      id: 3, 
      name: 'API Integration', 
      description: 'Integrated third-party APIs for enhanced functionality.', 
      status: 'Completed', 
      completionDate: '2024-09-20' 
    },
    { 
      id: 4, 
      name: 'Database Optimization', 
      description: 'Optimized database queries for better performance.', 
      status: 'Completed', 
      completionDate: '2024-08-10' 
    },
    { 
      id: 5, 
      name: 'SEO Improvement', 
      description: 'Implemented SEO strategies to increase website traffic.', 
      status: 'Ongoing', 
      completionDate: '2024-12-01' 
    },
  ]);
  </script>
  
  <style scoped>
  .card {
    padding: 1.5rem;
  }
  
  .mb-4 {
    margin-bottom: 1rem;
  }
  
  .p-panel {
    margin-bottom: 1.5rem;
  }
  </style>
  