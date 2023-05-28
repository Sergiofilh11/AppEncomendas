<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />

      <q-footer class="footer" :class="{ 'footer-dark': $q.dark.isActive }">
        <p>© 2023 Desenvolvido por Equipe Viridian</p>
      </q-footer>
    </q-page-container>
  </q-layout>
</template>

<script>
import { useQuasar } from 'quasar';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const $q = useQuasar();

    return {
      $q,
    };
  },
});
</script>

<style lang="scss">
.footer {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.1);
  color: black;
  background: white;
}

.footer-dark {
  color: white !important;
  background: #121212 !important;
}

.footer p {
  margin: 0;
  font-size: 14px;
}
</style>
