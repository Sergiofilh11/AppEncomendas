const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('components/AppLogin.vue'),
  },
  {
    path: '/register',
    name: 'user-register',
    component: () => import('components/AppUserRegister.vue'),
  },
  {
    path: '/listuser',
    name: 'list-user',
    component: () => import('components/AppUserList.vue'),
  },
  {
    path: '/newOrders',
    name: 'new-Orders',
    component: () => import('components/newOrder.vue'),
  },

  {
    path: '/orders',
    name: 'orders',
    component: () => import('components/NoWithdrawal.vue'),
  },
  {
    path: '/historic',
    name: 'historic',
    component: () => import('components/HistoricOrders.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
