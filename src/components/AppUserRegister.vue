<template>
  <div class="q-pa-md">
    <h4 class="flex flex-center">Cadastro</h4>
    <q-form @submit="onSubmit" class="q-gutter-md q-mt-xl">
      <q-input
        filled
        v-model="name"
        label="Digite seu nome"
        hint="Nome Completo"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'O campo é obrigatório.']"
      />

      <q-input
        v-model="cpf"
        filled
        class="q-my-md"
        label="Digite seu CPF"
        hint="Digite seu CPF"
        mask="###.###.###-##"
        lazy-rules
        :rules="[
          (val) => (val !== null && val !== '') || 'O campo é obrigatório.',
          (val) => validateCPF(val) || 'CPF inválido',
        ]"
      />

      <q-select
        v-model="modelAdd"
        class="q-my-md"
        label="Digite os Nº's dos apartamentos"
        hint="Digite os Nº's dos apartamentos"
        type="text"
        filled
        use-input
        use-chips
        multiple
        hide-dropdown-icon
        input-debounce="0"
        new-value-mode="add"
        maxlength="5"
        :rules="[
          (val) => (val !== null && val !== '') || 'O campo é obrigatório.',
        ]"
      />

      <q-select
        v-model="clientType"
        :options="options"
        filled
        map-options
        emit-value
        label="Selecione o tipo do cliente"
      />
      <div class="flex flex-center q-mt-xl">
        <q-btn label="Enviar" type="submit" color="primary" />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { ref } from 'vue';
import { userStore } from 'src/stores/userStore';
import { generateMd5 } from '../services/generateMd5';

const $q = useQuasar();

const name = ref(null);
const cpf = ref(null);
const modelAdd = ref(null);
const clientType = ref(null);
const store = userStore();
const options = ref([
  {
    value: 'tenant',
    label: 'Inquilino',
  },
  {
    value: 'concierge',
    label: 'Porteiro',
  },
]);

const userData = store.getUserData;
if (userData.user_type === 'syndicate') {
  options.value.push({
    value: 'syndicate',
    label: 'Sindico',
  });
}

async function onSubmit() {
  const accessCode = clientType.value === 'tenant' ? '' : generateMd5();
  const payload = {
    name: name.value,
    cpf: cpf.value,
    user_type: clientType.value,
    access_code: accessCode,
  };

  await api
    .post('/users', payload)
    .then(async (response) => {
      if (![200, 201].includes(response.status)) {
        throw new Error('Falha ao criar o usuário, tente novamente');
      }
      await modelAdd.value.forEach(async (item) => {
        await api.post('/apartments', {
          user_id: response.data.id,
          cpf: cpf.value,
          id: item.toUpperCase(),
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

function validateCPF(val) {
  return /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/.test(val);
}
</script>
