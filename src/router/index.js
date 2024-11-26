import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

// Public Components
const SignIn = () => import('@/views/pages/auth/SignIn.vue');
const SignUp = () => import('@/views/pages/auth/SignUp.vue');
const ForgetPassword = () => import('@/views/pages/auth/ForgetPassword.vue');
const VerifyToken = () => import('@/views/pages/auth/VerifyToken.vue');
const NewPassword = () => import('@/views/pages/auth/NewPassword.vue');
const AccessDenied = () => import('@/views/pages/auth/Access.vue');
const AuthError = () => import('@/views/pages/auth/Error.vue');
const NotFound = () => import('@/views/pages/NotFound.vue');

// Private Components
const Landing = () => import('@/views/Landing/Landing.vue');
const Dashboard = () => import('@/views/Dashboard/Dashboard.vue');
const Profile = () => import('@/views/Profile/Profile.vue');
const Settings = () => import('@/views/Settings/Settings.vue');
const Teams = () => import('@/views/Teams/Teams.vue');
const TeamDetail = () => import('@/views/Teams/Team/Team.vue');
const TeamInvite = () => import('@/views/Teams/TeamInvite/TeamInvite.vue');
const Tasks = () => import('@/views/Tasks/Tasks.vue');
const TaskDetail = () => import('@/views/Tasks/Task/Task.vue');
const Reports = () => import('@/views/Reports/Reports.vue');
const Users = () => import('@/views/Users/Users.vue');
const UserDetail = () => import('@/views/Users/User/User.vue');
// ... import other components similarly

const routes = [
  // Public Routes
  {
    path: '/auth',
    children: [
      {
        path: 'sign-in',
        name: 'SignIn',
        component: SignIn,
      },
      {
        path: 'sign-up',
        name: 'SignUp',
        component: SignUp,
      },
      {
        path: 'forget-password',
        name: 'ForgetPassword',
        component: ForgetPassword,
      },
      {
        path: '/auth/verify-token/:token',
        name: 'VerifyToken',
        component: VerifyToken,
      },
      {
        path: 'new-password',
        name: 'NewPassword',
        component: NewPassword,
      },
      {
        path: 'access-denied',
        name: 'AccessDenied',
        component: AccessDenied,
      },
      {
        path: 'error',
        name: 'AuthError',
        component: AuthError,
      },
    ],
  },

  // Private Routes
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '/',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: '/landing',
        name: 'Landing',
        component: Landing,
      },
      {
        path: '/profile',
        name: 'Profile',
        component: Profile,
      },
      {
        path: '/settings',
        name: 'Settings',
        component: Settings,
      },
      {
        path: '/teams',
        name: 'Teams',
        component: Teams,
      },
      // {
      //   path: '/teams/:tabs',
      //   name: 'Teams',
      //   component: Teams,
      // },
      {
        path: '/teams/team/:id',
        name: 'TeamDetail',
        component: TeamDetail,
        props: true,
      },
      {
        path: '/teams/teaminvite/:token',
        name: 'TeamInvite',
        component: TeamInvite,
        props: true,
      },
      {
        path: '/users',
        name: 'Users',
        component: Users,
      },
      {
        path: '/users/user/:id',
        name: 'UserDetail',
        component: UserDetail,
        props: true,
      },
      {
        path: '/tasks',
        name: 'Tasks',
        component: Tasks,
      },
      {
        path: '/tasks/task/:id',
        name: 'TaskDetail',
        component: TaskDetail,
        props: true,
      },
      {
        path: '/reports',
        name: 'Reports',
        component: Reports,
      },
    ],
  },

  // Catch-All Route for 404 Not Found
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
];

// Define Public Route Names
const publicRouteNames = [
  'SignIn',
  'SignUp',
  'ForgetPassword',
  'VerifyToken',
  'NewPassword',
];

// Create Router Instance
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      };
    }
    return {
      top: 0,
      behavior: 'smooth',
    };
  },
});

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token'); // Adjust based on how you store the token

  if (token) {
    // If authenticated, prevent access to public routes
    if (publicRouteNames.includes(to.name)) {
      return next({ name: 'Dashboard' }); // Redirect to Dashboard or any private route
    }
  } else {
    // If not authenticated, restrict access to private routes
    if (!publicRouteNames.includes(to.name)) {
      return next({ name: 'SignIn' }); // Redirect to Login
    }
  }

  next(); // Proceed to route
});

export default router;
