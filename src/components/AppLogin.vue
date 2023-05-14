<template>
  <q-layout class="app-container">
    <div class="flex flex-center">
      <h2 class="text-h2">Login</h2>
    </div>

    <q-form
      ref="formRef"
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="dataLogin.cpf"
        label="Digite o seu CPF"
        mask="###.###.###-##"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'O campo não pode ser vazio',
        ]"
      />

      <q-input
        v-if="!isAdmin"
        filled
        type="number"
        v-model="dataLogin.apartment"
        label="Digite o número do seu apartamento"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'O campo não pode ser vazio',
        ]"
      />

      <q-input
        v-else
        filled
        type="string"
        v-model="dataLogin.access_code"
        label="Digite o seu codigo de acesso"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'O campo não pode ser vazio',
        ]"
      />

      <div class="row flex-center">
        <q-toggle class="text-h5" v-model="isAdmin" label="Acesso restrito" />
      </div>

      <div class="row flex-center">
        <q-btn label="Entrar" type="submit" color="primary" />
      </div>
    </q-form>
  </q-layout>
</template>

<script>
import { ref } from 'vue';
import { api } from 'boot/axios';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const isAdmin = ref(false);
    const formRef = ref(null);
    const dataLogin = ref({
      cpf: '',
      apartment: '',
      access_code: '',
    });

    return {
      isAdmin,
      formRef,
      dataLogin,
      router,
      onSubmit() {
        // eslint-disable-next-line camelcase
        const { cpf, apartment } = dataLogin.value;

        if (isAdmin.value) {
          api
            .get(`/apartments?cpf=${cpf}&id=${apartment}&_expand=user`)
            .then((e) => {
              console.log(e.data);
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          // eslint-disable-next-line camelcase
          api

            .get(`/users?cpf=${cpf}&access_code=${dataLogin.value.access_code}`)
            .then((response) => {
              if (!response.data.length) {
                throw new Error('Request failed');
              }
            });
        }
      },
    };
  },
};
</script>

<style>
.app-container {
  padding: 7px;
}

.text-h2.text-h5 {
  font-family: 'Bebas Neue', sans-serif;
}
</style>
