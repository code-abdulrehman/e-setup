<!-- src/components/LayoutMenu.vue -->

<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const model = ref([
  {
    label: 'Home',
    items: [
      { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
      {
        label: 'Landing',
        icon: 'pi pi-fw pi-globe',
        to: '/landing',
      },
    ],
  },
  {
    label: 'Management',
    icon: 'pi pi-fw pi-sitemap',
    items: [
      {
        label: 'Teams',
        icon: 'pi pi-fw pi-users',
        to: '/teams',
      },
      {
        label: 'Users',
        icon: 'pi pi-fw pi-user-plus',
        to: '/users',
      },
      {
        label: 'Tasks',
        icon: 'pi pi-fw pi-list',
        to: '/tasks',
      },
      {
        label: 'Reports',
        icon: 'pi pi-fw pi-chart-line',
        to: '/reports',
      },
      {
        label: 'Settings',
        icon: 'pi pi-fw pi-cog',
        to: '/settings',
      },
    ],
  },
  {
    label: 'Auth',
    icon: 'pi pi-fw pi-lock',
    items: [
    {
        label: 'Profile',
        icon: 'pi pi-fw pi-user',
        to: '/profile',
      },
    ],
  },
//   {
//     label: 'Auth',
//     icon: 'pi pi-fw pi-lock',
//     items: [
//       {
//         label: 'Login',
//         icon: 'pi pi-fw pi-sign-in',
//         to: '/auth/login',
//       },
//       {
//         label: 'Sign Up',
//         icon: 'pi pi-fw pi-user-plus',
//         to: '/auth/sign-up',
//       },
//       {
//         label: 'Error',
//         icon: 'pi pi-fw pi-times-circle',
//         to: '/auth/error',
//       },
//       {
//         label: 'Access Denied',
//         icon: 'pi pi-fw pi-lock',
//         to: '/auth/access-denied',
//       },
//     ],
//   },
//   {
//     label: 'External',
//     items: [
//       {
//         label: 'View Source',
//         icon: 'pi pi-fw pi-github',
//         url: 'https://github.com/your-repo', // Replace with your actual repository URL
//         target: '_blank',
//       },
//       {
//         label: 'Documentation',
//         icon: 'pi pi-fw pi-book',
//         to: '/documentation',
//       },
//     ],
//   },
]);
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="i">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped>
.layout-menu {
  list-style: none;
  padding: 0;
  margin: 0;

  .menu-separator {
    height: 1px;
    background-color: #e0e0e0;
    margin: 8px 0;
  }
}
</style>
