<template>
  <q-layout>
    <q-toolbar>
      <section v-if="isLoggedOutStep">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
          <q-list>
            <q-item-label header> Menu de navegação </q-item-label>

            <EssentialLink
              v-for="link in getListLinks"
              :key="link.title"
              v-bind="link"
            />
          </q-list>
        </q-drawer>
      </section>

      <q-btn
        flat
        dense
        round
        :icon="$q.dark.isActive ? 'wb_sunny' : 'nightlight_round'"
        @click="changeTheme"
        class="q-ml-auto q-mr"
      />
      <img
        v-if="isLoggedOutStep"
        @click="logout()"
        class="cursor-pointer q-ml-md"
        width="30"
        height="30"
        src="https://img.icons8.com/fluency/48/shutdown.png"
        alt="shutdown"
      />
    </q-toolbar>
    <router-view />
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import { useQuasar } from 'quasar';
import { userStore } from 'src/stores/userStore';

export default defineComponent({
  name: 'App',
  components: {
    EssentialLink,
  },
  setup() {
    const $q = useQuasar();
    const store = userStore();
    const leftDrawerOpen = ref(false);

    const linksList = [
      {
        title: 'Cadastro de usuários',
        caption: 'Registro de usuário',
        icon: 'person_add',
        to: '/register',
        adminAccess: true,
      },
      {
        title: 'Lista de usuários',
        caption: 'Listagem de usuário',
        icon: 'list_alt',
        link: '/listuser',
        adminAccess: true,
      },
      {
        title: 'Lista de encomendas',
        caption: 'Cadastrar encomendas',
        icon: 'add_box',
        link: '/newOrders',
        adminAccess: true,
      },
      {
        title: 'Encomendas não retiradas',
        caption: 'Listagem de encomendas não retiradas',
        icon: 'shelves',
        link: '/orders',
        adminAccess: false,
      },
      {
        title: 'Histórico',
        caption: 'Histórico encomendas',
        icon: 'pallet',
        link: '/historic',
        adminAccess: false,
      },
    ];

    return {
      $q,
      store,
      linksList,
      leftDrawerOpen,
      changeTheme() {
        $q.dark.toggle();
      },
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },

  computed: {
    isLoggedOutStep() {
      return this.$router.currentRoute.value.path !== '/login';
    },

    getListLinks() {
      const userData = this.store.getUserData;
      const apartmentId = this.store.getApartmentId;

      if (!userData) return [];

      return this.linksList.filter(
        (link) =>
          !(
            (userData.user_type === 'tenant' && link.adminAccess)
            || (userData.user_type === 'concierge' && !link.adminAccess)
            || (userData.user_type === 'syndicate'
              && apartmentId
              && link.adminAccess)
            || (userData.user_type === 'syndicate'
              && !apartmentId
              && !link.adminAccess)
          ),
      );
    },
  },

  methods: {
    logout() {
      localStorage.removeItem('userStore');

      this.store.SET_USER_DATA(null);
      this.store.SET_APARTMENT_ID(null);
      this.store.SET_USER_TOKEN(null);

      this.$router.push('/login');
    },

    navigate(link) {
      this.$router.push(link);
    },
  },
});
</script>

<style lang="scss"></style>
