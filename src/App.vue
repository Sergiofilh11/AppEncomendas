<template>
  <q-layout>
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        :icon="$q.dark.isActive ? 'wb_sunny' : 'nightlight_round'"
        @click="changeTheme"
        class="q-ml-auto q-mr"
      />
      <img
        v-if="currenRoute !== '/login'"
        @click="logout()"
        class="cursor-pointer"
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
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar';
import { userStore } from 'src/stores/userStore';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'App',
  setup() {
    const $q = useQuasar();
    const store = userStore();
    const router = useRouter();
    const currenRoute = router.currentRoute.value.path;
    return {
      $q,
      store,
      currenRoute,
      changeTheme() {
        $q.dark.toggle();
      },
    };
  },
  methods: {
    logout() {
      localStorage.removeItem('userStore');
      this.$router.push('/login');
    },
  },
});
</script>

<style lang="scss"></style>
