<template>
  <div class="q-pa-md">
    <h4 class="flex flex-center">Cadastrar Encomendas</h4>
    <q-form @submit="onSubmit" class="q-gutter-md q-mt-xl">
      <q-input
        filled
        v-model="name"
        label="Qual o produto"
        hint="Tipo do Produto"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'O campo é obrigatório.']"
      />

      <q-input
        v-model="apt"
        filled
        class="q-my-md"
        label="Destinatario"
        hint="Número do apartamento"
        mask="#####"
        lazy-rules
        :rules="[
          (val) => (val !== null && val !== '') || 'O campo é obrigatório.',
          (val) => validateAPT(val) || 'Apartamento inválido',
        ]"
      />

      <q-input
        filled
        v-model="name"
        label="Recebedor"
        hint="Quem recebeu o produto"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'O campo é obrigatório.']"
      />
      <div class="flex flex-center q-mt-xl">
        <button type="button" class="btn btn-success">Cadastrar</button>
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { ref } from 'vue';

const $q = useQuasar();

const name = ref(null);
const cpf = ref(null);
const modelAdd = ref(null);
const clientType = ref(null);
async function onSubmit() {
  await api
    .post('/users', {
      name: name.value,
      cpf: cpf.value,
      user_type: clientType.value,
      access_code: '',
    })
    .then(async (response) => {
      if (![200, 201].includes(response.status)) {
        throw new Error('Falha ao criar o usuário, tente novamente');
      }
      await modelAdd.value.forEach(async (item) => {
        await api.post('/apartments', {
          user_id: response.data.id,
          cpf: cpf.value,
          id: item,
        });
      });

      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Enviado!',
      });
    })
    .catch(() => {
      $q.notify({
        color: 'negative',
        textColor: 'white',
        icon: 'report_problem',
        position: 'top',
        timeout: 4000,
        message: 'Falha ao criar o usuário, tente novamente.',
      });
    });
}

function validateAPT(val) {
  return /^[0-9]\.[A-Z]\.[a-z]$/.test(val);
}
</script>
