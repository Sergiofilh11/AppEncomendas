import { tokenIsAvailable } from '../middleware/tokenIsAvailable';
import { isAdminUser } from '../middleware/isAdminUser';

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/orders',
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('components/AppLogin.vue'),
      },
      {
        path: '/register',
        beforeEnter: isAdminUser,
        name: 'user-register',
        component: () => import('components/AppUserRegister.vue'),
      },
      {
        path: '/listuser',
        beforeEnter: isAdminUser,
        name: 'list-user',
        component: () => import('components/AppUserList.vue'),
      },
      {
        path: '/newOrders',
        beforeEnter: isAdminUser,
        name: 'new-Orders',
        component: () => import('src/components/NewOrder.vue'),
      },
      {
        path: '/orders',
        beforeEnter: tokenIsAvailable,
        name: 'orders',
        component: () => import('components/NoWithdrawal.vue'),
      },
      {
        path: '/historic',
        beforeEnter: tokenIsAvailable,
        name: 'historic',
        component: () => import('components/HistoricOrders.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
