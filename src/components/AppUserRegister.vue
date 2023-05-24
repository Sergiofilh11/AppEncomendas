<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div class="q-pa-md">
    <h4 class="flex flex-center">Cadastro de usuários</h4>
    <q-form @submit="onSubmit" class="q-gutter-md q-mt-xl">
      <q-input
        filled
        v-model="name"
        label="Digite seu nome completo"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'O campo é obrigatório.']"
      />

      <q-input
        v-model="cpf"
        filled
        class="q-my-md"
        label="Digite seu CPF"
        mask="###.###.###-##"
        lazy-rules
        :rules="[
          (val) => (val !== null && val !== '') || 'O campo é obrigatório.',
          (val) => validateCPF(val) || 'CPF inválido',
        ]"
      />

      <q-select
        v-model="clientType"
        :options="options"
        filled
        map-options
        emit-value
        label="Selecione o tipo do cliente"
        :rules="[
          (val) => (val !== null && val !== '') || 'O campo é obrigatório.',
        ]"
      />

      <!-- INICIO -->
      <div class="flex flex-lg">
        <q-input
          v-model="currentApartment"
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
          style="width: 80%"
        />

        <q-btn
          class="q-mt-md q-mb-xl q-ml-sm text-right"
          fab
          icon="add"
          color="green"
          posit
          @click.prevent="pushNewApartment"
        />
      </div>
      <q-list
        v-if="listOfApartments.length"
        bordered
        class="rounded-borders q-mt-xl"
      >
        <q-item-label header>Apartamentos Vinculados:</q-item-label>

        <div v-for="(apartment, index) in listOfApartments" :key="apartment">
          <q-separator spaced />

          <q-item>
            <q-item-section center>
              <q-item-label> Apartamento: {{ apartment }} </q-item-label>
            </q-item-section>

            <q-item-section center side>
              <q-btn
                size="12px"
                flat
                dense
                round
                icon="delete"
                @click="removeApartment(index)"
              />
              <div class="text-grey-8"></div>
            </q-item-section>
          </q-item>
        </div>
      </q-list>

      <!-- FIM  -->
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
import { useRouter } from 'vue-router';
import { generateMd5 } from '../services/generateMd5';

const $q = useQuasar();

const name = ref(null);
const cpf = ref(null);
const listOfApartments = ref([]);
const currentApartment = ref(null);
const router = useRouter();

const clientType = ref(null);
const store = userStore();
const options = ref([
  {
    value: 'tenant',
    label: 'Inquilino',
  },
]);

const userData = store.getUserData;
if (userData.user_type === 'syndicate') {
  options.value.push(
    {
      value: 'syndicate',
      label: 'Sindico',
    },
    {
      value: 'concierge',
      label: 'Porteiro',
    },
  );
}

function clearFields() {
  name.value = null;
  cpf.value = null;
  clientType.value = null;
  currentApartment.value = null;
  listOfApartments.value = [];
}

async function onSubmit() {
  const accessCode = clientType.value === 'tenant' ? '' : generateMd5();
  const payload = {
    name: name.value,
    cpf: cpf.value,
    user_type: clientType.value,
    access_code: accessCode,
  };

  if (!listOfApartments.value.length) {
    $q.notify({
      color: 'negative',
      textColor: 'white',
      icon: 'report_problem',
      position: 'top',
      timeout: 4000,
      message: 'Selecione ao menos um apartamento.',
    });
    return;
  }

  const userExist = await api.get(`/users?cpf=${cpf.value}`);
  if (userExist.data.length) {
    $q.notify({
      color: 'negative',
      textColor: 'white',
      icon: 'report_problem',
      position: 'top',
      timeout: 4000,
      message: 'Usuário já cadastrado.',
    });

    return;
  }

  await api
    .post('/users', payload)
    .then(async (response) => {
      if (![200, 201].includes(response.status)) {
        throw new Error('Falha ao criar o usuário, tente novamente');
      }
      listOfApartments.value.forEach(async (item) => {
        try {
          const apartmentExists = await api
            .get(`apartments?code=${item.toUpperCase()}`)
            .then((resApt) => resApt.data);

          if (apartmentExists) {
            throw new Error();
          }

          await api.post('/apartments', {
            userId: response.data.id,
            cpf: cpf.value,
            code: item.toUpperCase(),
          });
        } catch {
          $q.notify({
            color: 'negative',
            textColor: 'white',
            icon: 'report_problem',
            position: 'top',
            timeout: 4000,
            message: `Falha ao vincular o apartamento ${item.toUpperCase()}`,
          });
        }
      });

      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Usuário cadastrado!',
      });

      router.push({ name: 'orders' });
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

  clearFields();
}

function pushNewApartment() {
  if (!currentApartment.value) return;
  if (listOfApartments.value.includes(currentApartment.value)) return;

  listOfApartments.value.push(currentApartment.value.toUpperCase());
  currentApartment.value = null;
}

function removeApartment(indexOfApartment) {
  listOfApartments.value.splice(indexOfApartment, 1);
}

function validateCPF(val) {
  return /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/.test(val);
}
</script>
