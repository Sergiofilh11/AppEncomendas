<template>
  <div class="container">
    <div class="main">
      <div class="q-pa-md">
        <q-table
          title="Histórico de Ordens"
          :rows="rows"
          :columns="columns"
          row-key="name"
          no-data-label="Nenhum resultado encontrado."
          rows-per-page-label="Itens por página"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import { api } from 'boot/axios';
import { userStore } from 'stores/userStore';

const columns = [
  {
    name: 'Produto',
    required: true,
    label: 'Produto',
    align: 'left',
    field: (rows) => rows.identity,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'Recebedor',
    required: true,
    label: 'Recebedor',
    align: 'left',
    field: (rows) => rows.user.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'Data de recebimento',
    required: true,
    label: 'Data de recebimento',
    align: 'left',
    field: (rows) => rows.receipt_date,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'Data de retirada',
    required: true,
    label: 'Data de retirada',
    align: 'left',
    field: (rows) => rows.date_withdrawal,
    format: (val) => `${val}`,
    sortable: true,
  },
];

export default defineComponent({
  name: 'HistoricOrders',
  setup() {
    const store = userStore();
    const apartmentCode = store.getApartmentCode;
    const rows = ref([]);
    const users = ref([]);
    const formatDate = (date) => {
      const parsedDate = new Date(date);
      const day = parsedDate.getDate();
      const month = parsedDate.getMonth() + 1;
      const year = parsedDate.getFullYear();
      return `${day.toString().padStart(2, '0')}/${month
        .toString()
        .padStart(2, '0')}/${year.toString()}`;
    };

    onMounted(() => {
      let urlToSend = '/orders?_expand=user';
      if (apartmentCode) {
        urlToSend += `&code=${apartmentCode}`;
      }

      api.get(urlToSend).then((response) => {
        response.data
          .filter((item) => item.date_withdrawal)
          .forEach((item) => {
            rows.value.push(item);
          });
      });
    });

    return {
      users,
      formatDate,
      columns,
      rows,
    };
  },
});
</script>

<style lang="scss" scoped>
.main {
  flex-wrap: wrap;
  border: none;
  width: 90%;
  margin: 0 auto;
}
</style>
