<template>
  <div class="q-pa-md">
    <h4 class="flex flex-center">Editar Encomendas</h4>
    <q-form @submit="onSubmit" class="q-gutter-md q-mt-xl">
      <q-input
        filled
        v-model="productDescription"
        label="Qual o produto"
        hint="Tipo do Produto"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'O campo é obrigatório.',
          ,
          ,
        ]"
      />

      <q-select
        filled
        v-model="selectedApartment"
        :options="apartmentData"
        hint="Selecione o apartamento"
        label="Selecione o apartamento"
        :rules="[(val) => val !== '' || 'O campo é obrigatório.']"
      />

      <q-input
        v-if="receptor"
        filled
        v-model="receptor"
        label="Recebedor"
        hint="Quem recebeu o produto"
        lazy-rules
        disable
      />
      <div class="flex flex-center q-mt-xl">
        <q-btn type="submit" color="primary" label="Atualizar" />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const $q = useQuasar();
const productDescription = ref(null);
const selectedApartment = ref(null);
const oldApartmentId = ref(null);

const apartmentData = ref([]);
const receptor = ref(null);

const route = useRoute();
const { id } = route.params;

const router = useRouter();

async function onSubmit() {
  await api
    .patch(`/orders/${id}`, {
      identity: productDescription.value,
      apartmentId: selectedApartment.value,
    })
    .then(async (response) => {
      if (![200, 201].includes(response.status)) {
        throw new Error('');
      }

      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        timeout: 2000,
        message: 'Encomenda editada com sucesso!',
      });

      router.push({
        name: 'orders',
        query: { apartmentId: oldApartmentId.value },
      });
    })
    .catch(() => {
      $q.notify({
        color: 'negative',
        textColor: 'white',
        icon: 'report_problem',
        position: 'top',
        timeout: 4000,
        message: 'Falha ao editar a encomenda, tente novamente.',
      });
    });
}

async function getApartments() {
  apartmentData.value = await api.get('/apartments').then(
    (response) => response.data.map((apartment) => apartment.id),
    // eslint-disable-next-line function-paren-newline
  );
}

async function getOrderDataById() {
  await api
    .get(`/orders/${id}`)
    .then(async (response) => {
      const { apartmentId, identity, recipient } = response.data;
      oldApartmentId.value = apartmentId;
      selectedApartment.value = apartmentId;
      productDescription.value = identity;

      if (recipient) {
        await api.get(`/users/${recipient}`).then((res) => {
          receptor.value = res.data.name;
        });
      }
    })
    .catch(() => {
      $q.notify({
        color: 'negative',
        textColor: 'white',
        icon: 'report_problem',
        position: 'top',
        timeout: 4000,
        message: 'Encomenda não encontrada, tente novamente.',
      });
    });
}

onMounted(async () => {
  await getApartments();
  await getOrderDataById();
});
</script>
