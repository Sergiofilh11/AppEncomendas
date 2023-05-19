import { defineStore } from 'pinia';

export const userStore = defineStore('userStore', {
  persist: true,
  state: () => ({
    userData: null,
    apartmentId: null,
    userToken: null,
    tokenExpiration: null,
  }),

  getters: {
    getUserData: (state) => state.userData,
    getUserToken: (state) => state.userToken,
    getApartmentId: (state) => state.apartmentId,
    getTokenExpiration: (state) => state.tokenExpiration,
  },

  actions: {
    SET_USER_DATA(userObject) {
      this.userData = userObject;
    },
    SET_APARTMENT_ID(id) {
      this.apartmentId = id;
    },
    SET_USER_TOKEN(userToken) {
      this.userToken = userToken;
    },
  },
});
