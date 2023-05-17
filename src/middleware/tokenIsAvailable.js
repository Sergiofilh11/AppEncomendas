export const tokenIsAvailable = (to, from, next, returnBool = false) => {
  const userStore = JSON.parse(localStorage.getItem('userStore')) || false;

  if (returnBool) return userStore && userStore.userToken;

  return userStore && userStore.userToken ? next() : next({ name: 'login' });
};
