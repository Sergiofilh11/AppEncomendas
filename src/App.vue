<template>
  <q-layout>
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        :icon="$q.dark.isActive ? 'wb_sunny' : 'nightlight_round'"
        @click="changeTheme"
      />
    </q-toolbar>
    <router-view />
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar';
import { userStore } from 'src/stores/userStore';

export default defineComponent({
  name: 'App',
  setup() {
    const $q = useQuasar();
    const store = userStore();

    return {
      $q,
      store,
      changeTheme() {
        $q.dark.toggle();
      },
    };
  },
});
</script>
