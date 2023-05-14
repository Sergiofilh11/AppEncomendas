import { defineStore } from 'pinia';

export const userStore = defineStore('userStore', {
  state: () => ({
    userData: {
      id: 1,
    },
    userToken: null,
    tokenExpiration: null,
  }),

  getters: {
    getUserData: (state) => state.userData,
    getUserToken: (state) => state.userToken,
    getTokenExpiration: (state) => state.tokenExpiration,
  },

  actions: {
    // SET_USER_DATA(state, payload) {},
  },
});
