<!-- eslint-disable implicit-arrow-linebreak -->
<!-- eslint-disable implicit-arrow-linebreak -->
<template>
  <div class="q-pa-md">
    <div class="q-pa-md">
      <div class="q-container-flex">
        <q-table
          no-data-label="Nenhum resultado encontrado."
          title="Listagem de encomendas não retiradas"
          :rows="rows"
          :columns="columns"
          row-key="users"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { api } from 'boot/axios';
import { userStore } from 'stores/userStore';

const columns = [
  {
    name: 'identify',
    required: true,
    label: 'Identificação',
    align: 'left',
    field: (row) => row.identity,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'apartament',
    required: true,
    label: 'Apartamento',
    align: 'left',
    field: (row) => row.apartmentId,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'date-reciviement',
    required: true,
    label: 'Data do recebimento',
    align: 'left',
    field: (row) => row.receipt_date,
    format: (val) => `${val}`,
    sortable: true,
  },
];
export default {
  setup() {
    const rows = ref([]);
    const store = userStore();
    const apartmentId = store.getApartmentId;
    onMounted(async () => {
      const urlToSend = '/orders?_sort=receipt_date&_order=desc';
      try {
        const response = await api.get(urlToSend);
        rows.value = response.data.filter(
          (order) =>
            order.apartmentId === apartmentId && order.date_withdrawal === null,
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Erro ao carregar os encomendas:', error);
      }
    });
    return {
      columns,
      rows,
    };
  },
  computed: {
    filteredEncomendas() {
      return this.encomendas.filter(
        (encomenda) =>
          encomenda.identity
            .toLowerCase()
            .includes(this.searchText.toLowerCase()),
        // eslint-disable-next-line function-paren-newline
      );
    },
    paginatedEncomendas() {
      const startIndex = (this.page - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.filteredEncomendas.slice(startIndex, endIndex);
    },
    maxPage() {
      return Math.ceil(this.filteredEncomendas.length / this.pageSize);
    },
  },
  methods: {
    filterEncomendas() {
      this.page = 1;
      this.$refs.searchInput.blur();
    },
    formatDate(date) {
      const parsedDate = new Date(date);
      const day = parsedDate.getDate();
      const month = parsedDate.getMonth() + 1;
      const year = parsedDate.getFullYear();
      return `${day.toString().padStart(2, '0')}/${month
        .toString()
        .padStart(2, '0')}/${year.toString()}`;
    },
    onEncomendaClick(encomenda) {
      // eslint-disable-next-line no-console
      console.log(`Encomenda ${encomenda.id} clicada.`);
    },
  },
};
</script>
