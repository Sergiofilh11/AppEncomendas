<template>
  <div class="q-pa-md">
    <h4>Encomendas não retiradas</h4>
    <div class="q-mt-md">
      <q-input
        filled
        v-model="searchText"
        label="Pesquisar"
        icon="mdi-magnify"
        @keyup.enter="filterEncomendas"
        ref="searchInput"
      />
    </div>
    <q-markup-table>
      <thead>
        <tr>
          <th class="text-left">Identificação</th>
          <th class="text-left">Apartamento</th>
          <th class="text-left">Data de Recebido</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="encomenda in paginatedEncomendas" :key="encomenda.id">
          <td class="text-left">{{ encomenda.identity }}</td>
          <td class="text-left">{{ encomenda.apartment }}</td>
          <td class="text-left">{{ encomenda.receipt_date }}</td>
        </tr>
      </tbody>
    </q-markup-table>
    <div class="q-mt-md q-mb-md">
      <q-pagination
        v-model="page"
        :max="maxPage"
        @input="filterEncomendas"
        color="primary"
        dense
        class="q-pagination__boundary-right"
      />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    return {
      encomendas: [
        {
          id: 1,
          identity: 'Caixa da Kabum',
          apartment: '101',
          receipt_date: '2023-05-10',
          retirada: true,
        },
        {
          id: 2,
          identity: 'Caixa da Shopee',
          apartment: '201',
          receipt_date: '2023-05-11',
          retirada: true,
        },
        {
          id: 3,
          identity: 'Mercado Livre',
          apartment: '301',
          receipt_date: '2023-05-12',
          retirada: true,
        },
        {
          id: 4,
          identity: 'OLX',
          apartment: '401',
          receipt_date: '2023-05-12',
          retirada: true,
        },
      ],
      searchText: '',
      page: 1,
      pageSize: 10,
    };
  },
  computed: {
    filteredEncomendas() {
      return this.encomendas.filter((encomenda) => encomenda.identity
          .toLowerCase()
          .includes(this.searchText.toLowerCase()));
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
  },
};
</script>
