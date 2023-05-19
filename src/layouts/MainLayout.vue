<template>
  <q-layout view="lHh Lpr lFf">
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
      />
    </q-toolbar>
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu de navegação </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import { useRouter } from 'vue-router';

const linksList = [
  {
    title: 'Registro',
    caption: 'Registro de Usuário',
    icon: 'document',
    to: 'http://localhost:9000/register',
  },
  {
    title: 'Lista',
    caption: 'Listagem de Úsuario',
    icon: 'list',
    link: 'http://localhost:9000/listuser',
  },
  {
    title: 'Encomendas',
    caption: 'Cadastrar Encomendas',
    icon: 'add box',
    link: 'http://localhost:9000/newOrders',
  },
  {
    title: 'Encomendas não retiradas',
    caption: 'Listagem de encomendas não retiradas',
    icon: 'cube',
    link: 'http://localhost:9000/orders',
  },
  {
    title: 'Histórico',
    caption: 'Histórico de Ordens',
    icon: 'paper',
    link: 'http://localhost:9000/historic',
  },
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const router = useRouter();

    onMounted(() => {
      const { path } = router.currentRoute.value;
      console.log('Path:', path);
    });
    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
  methods: {
    navigate(link) {
      this.$router.push(link);
    },
  },
});
</script>
