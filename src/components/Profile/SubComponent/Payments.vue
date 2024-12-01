<!-- PaymentsComponent.vue -->
<template>
    <div class="card">
      <h3 class="mb-4">Payments</h3>
      
      <!-- Payment Methods Section -->
      <Panel header="Payment Methods" class="mb-6">
        <ul>
          <li v-for="method in paymentMethods" :key="method.id">
            <i :class="method.icon" aria-hidden="true"></i> {{ method.name }}
          </li>
        </ul>
      </Panel>
      
      <!-- Payment History Section -->
      <Panel header="Payment History">
        <DataTable :value="paymentHistory" paginator :rows="5" responsiveLayout="scroll">
          <Column field="amount" header="Amount" sortable></Column>
          <Column field="date" header="Date" sortable></Column>
          <Column field="method" header="Method" sortable></Column>
          <Column field="status" header="Status" sortable></Column>
        </DataTable>
      </Panel>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import Panel from 'primevue/panel';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  
  // Sample mock data for payment methods
  const paymentMethods = ref([
    { id: 1, name: 'Credit Card', icon: 'pi pi-credit-card' },
    { id: 2, name: 'PayPal', icon: 'pi pi-paypal' },
    { id: 3, name: 'Bank Transfer', icon: 'pi pi-university' },
  ]);
  
  // Sample mock data for payment history
  const paymentHistory = ref([
    { id: 1, amount: '$1000', date: '2024-11-20', method: 'Credit Card', status: 'Completed' },
    { id: 2, amount: '$500', date: '2024-11-15', method: 'PayPal', status: 'Pending' },
    { id: 3, amount: '$750', date: '2024-11-10', method: 'Bank Transfer', status: 'Failed' },
    { id: 4, amount: '$1200', date: '2024-11-05', method: 'Credit Card', status: 'Completed' },
    { id: 5, amount: '$300', date: '2024-11-01', method: 'PayPal', status: 'Completed' },
  ]);
  </script>
  
  <style scoped>
  .card {
    padding: 1.5rem;
  }
  
  .mb-4 {
    margin-bottom: 1rem;
  }
  
  .mb-6 {
    margin-bottom: 1.5rem;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  li i {
    margin-right: 0.5rem;
  }
  </style>
  