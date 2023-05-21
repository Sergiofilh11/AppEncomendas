import { tokenIsAvailable } from './tokenIsAvailable';

export const isAdminUser = (to, from, next) => {
  const userStore = JSON.parse(localStorage.getItem('userStore')) || false;

  return (
    // eslint-disable-next-line operator-linebreak
    userStore?.isAdmin &&
      tokenIsAvailable(to, from, next, true)
      ? next()
      : next({ name: userStore?.userToken ? 'orders' : 'login' })
  );
};
