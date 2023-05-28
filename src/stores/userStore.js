import { defineStore } from 'pinia';

export const userStore = defineStore('userStore', {
  persist: true,
  state: () => ({
    userData: null,
    apartmentCode: null,
    apartmentId: null,
    userToken: null,
    isAdmin: false,
  }),

  getters: {
    getUserData: (state) => state.userData,
    getUserToken: (state) => state.userToken,
    getApartmentCode: (state) => state.apartmentCode,
    getApartmentId: (state) => state.apartmentId,
    getUserIsAdmin: (state) => state.isAdmin,
  },

  actions: {
    SET_USER_DATA(userObject) {
      this.userData = userObject;
    },
    SET_APARTMENT_CODE(id) {
      this.apartmentCode = id;
    },
    SET_APARTMENT_ID(id) {
      this.apartmentId = id;
    },
    SET_USER_TOKEN(userToken) {
      this.userToken = userToken;
    },
    SET_USER_IS_ADMIN(userType) {
      this.isAdmin = !!userType;
    },
  },
});
