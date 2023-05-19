<template>
  <div class="q-pa-md">
    <h4 class="flex flex-center">Cadastrar Encomendas</h4>
    <q-form @submit="onSubmit" class="q-gutter-md q-mt-xl">
      <q-input
        filled
        v-model="productDescription"
        label="Qual o produto"
        hint="Tipo do Produto"
        lazy-rules
        :rules="[
          (val) => (val.trim() && val.length > 0) || 'O campo é obrigatório.',
          ,
          ,
        ]"
      />

      <q-select
        filled
        v-model="selectedUser"
        :options="apartmentData"
        hint="Selecione o apartamento"
        :rules="[(val) => val.trim() !== '' || 'O campo é obrigatório.']"
      />

      <q-input
        filled
        v-model="receptor"
        label="Recebedor"
        hint="Quem recebeu o produto"
        lazy-rules
        disable
      />
      <div class="flex flex-center q-mt-xl">
        <q-btn type="submit" color="primary" label="Cadastrar" />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { userStore } from 'src/stores/userStore';
import { onMounted, ref } from 'vue';

const $q = useQuasar();
const store = userStore();
const userData = store.getUserData;
const productDescription = ref(null);
const selectedUser = ref(null);
const apartmentData = ref([]);
const receptor = ref(null);

function getDate() {
  const parsedDate = new Date();
  const day = parsedDate.getDate();
  const month = parsedDate.getMonth() + 1;
  const year = parsedDate.getFullYear();
  return `${day.toString().padStart(2, '0')}/${month
    .toString()
    .padStart(2, '0')}/${year.toString()}`;
}

async function onSubmit() {
  await api
    .post('/orders', {
      identity: productDescription.value,
      recipient: userData?.id,
      receipt_date: getDate(),
      apartmentId: receptor.value,
    })
    .then(async (response) => {
      if (![200, 201].includes(response.status)) {
        throw new Error('');
      }

      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Encomenda cadastrada com sucesso!',
      });

      productDescription.value = null;
      selectedUser.value = null;
    })
    .catch(() => {
      $q.notify({
        color: 'negative',
        textColor: 'white',
        icon: 'report_problem',
        position: 'top',
        timeout: 4000,
        message: 'Falha ao cadastrar a encomenda, tente novamente.',
      });
    });
}

async function getApartments() {
  apartmentData.value = await api.get('/apartments').then(
    (response) => response.data.map((apartment) => apartment.id),
    // eslint-disable-next-line function-paren-newline
  );
}

onMounted(async () => {
  await getApartments();

  receptor.value = userData?.name;
});
</script>
