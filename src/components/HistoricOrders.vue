<template>
  <div class="container">
    <div class="main">
      <div class="q-pa-md">
        <q-table
          title="Histórico de Ordens"
          :rows="rows"
          :columns="columns"
          row-key="name"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import { api } from 'boot/axios';
// import { userStore } from 'stores/userStore';

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
    field: (rows) => rows.recipient.name,
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
    // const store = userStore();
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
      api.get('/orders').then((response) => {
        rows.value = response.data;

        response.data.forEach((item, index) => {
          api.get(`/users/${item.recipient}`).then((res) => {
            rows.value[index].recipient = res.data;
          });
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
