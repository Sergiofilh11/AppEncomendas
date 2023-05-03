<template>
  <q-layout class="app-container">
    <q-header >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          :icon="$q.dark.isActive ? 'wb_sunny' : 'nightlight_round'"
          @click="changeTheme"
        />
      </q-toolbar>
    </q-header>

    <div class="flex flex-center">
      <h4>Login</h4>
    </div>

    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="cpf"
        label="Digite o seu CPF"
        lazy-rules
        :rules="[
          val => /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/.test(val) || 'CPF inválido'
          ]"
      />

      <q-input
        v-if="!isAdmin"
        filled
        type="string"
        v-model="apartment"
        label="Digite o número do seu apartamento"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'O campo não pode ser vazio'
        ]"
      />

      <q-input
        v-else
        filled
        type="string"
        v-model="access_code"
        label="Digite o seu codigo de acesso"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'O campo não pode ser vazio',
        ]"
      />

      <div class="row flex-center">
        <q-toggle v-model="isAdmin" label="Acesso restrito" />
      </div>

      <div class="row flex-center">
        <q-btn label="Entrar" type="submit" color="primary"/>
      </div>
    </q-form>

  </q-layout>
</template>

<script>
import { useQuasar } from 'quasar';
import { ref } from 'vue';

export default {
  setup() {
    const $q = useQuasar();
    $q.dark.set(true);

    const isAdmin = ref(false);

    return {
      isAdmin,
      onSubmit() {

      },
      changeTheme() {
        $q.dark.toggle();
      },
    };
  },
};
</script>

<style>
  .app-container {
    padding: 7px;
  }
</style>
