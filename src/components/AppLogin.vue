<template>
  <q-layout class="app-container">
    <div class="flex flex-center">
      <img
        src="https://i.imgur.com/gFTIS61.png"
        alt="Logo do serviço de entrega"
        class="logo"
      />
      <h3 class="text-h4 text-bold">PortariaDelivery</h3>
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
        type="string"
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
        v-model="dataLogin.accessCode"
        label="Digite o seu código de acesso"
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

<script setup>
import { ref } from 'vue';
import { api } from 'boot/axios';
import { useRouter } from 'vue-router';
import { userStore } from 'src/stores/userStore';
import { sign } from 'fake-jwt-sign';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const router = useRouter();
const isAdmin = ref(false);
const formRef = ref(null);
const dataLogin = ref({
  cpf: '',
  apartment: '',
  accessCode: '',
});
const store = userStore();

function getUrlToSend() {
  const { cpf, apartment, accessCode } = dataLogin.value;
  if (isAdmin.value) {
    return `/users?cpf=${cpf}&access_code=${accessCode}`;
  }

  return `/apartments?cpf=${cpf}&code=${apartment}&_expand=user`;
}

function buildJWTToken(payload) {
  return sign({ isAuthenticated: true, ...payload }, 'BIG_SECRET', {
    expiresIn: '1h',
  });
}

function onSubmit() {
  api
    .get(getUrlToSend())
    .then((response) => {
      if (!response.data.length) {
        throw new Error('Usuário não encontrado!');
      }

      const data = response.data[0];
      const user = data?.user || data;
      const { code, id } = data;

      if (isAdmin.value) {
        if (['tenant'].includes(user.user_type)) {
          throw new Error('Login não autorizado.');
        }
      }

      store.SET_USER_DATA(user);

      if (!isAdmin.value && code) {
        store.SET_APARTMENT_CODE(code);
        store.SET_APARTMENT_ID(id);
      }

      const authToken = buildJWTToken({ id: user.id, cpf: user.cpf });

      store.SET_USER_TOKEN(authToken);
      store.SET_USER_IS_ADMIN(isAdmin.value);

      const redirectBy = isAdmin.value ? 'list-user' : 'orders';
      router.push({ name: redirectBy });
    })
    .catch((e) => {
      $q.notify({
        color: 'negative',
        textColor: 'white',
        icon: 'report_problem',
        position: 'top',
        timeout: 4000,
        message: e.message,
      });
    });
}
</script>

<style>
.app-container {
  padding: 7px;
}

.logo {
  width: 150px;
  height: 150px;
  margin-bottom: 20px;
}

.text-h2.text-h5 {
  font-family: 'Bebas Neue', sans-serif;
}
</style>
