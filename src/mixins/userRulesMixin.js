import { userStore } from '../stores/userStore';

export default {
  methods: {
    canExcludeSyndicate(currentUserType) {
      const store = userStore();
      const userData = store.getUserData;

      return (
        (userData.user_type === 'syndicate')
        || (userData.user_type === 'concierge' && currentUserType !== 'syndicate')
      );
    },
  },
};
