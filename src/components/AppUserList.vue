<template>
  <div class="q-pa-md">
    <div class="q-container-flex">
      <q-table
        title="Listagem de usuários"
        :rows="rows"
        :columns="columns"
        row-key="users"
        color="primary"
        :loading="loading"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.q-container-flex {
  flex-wrap: wrap;
  border: none;
  width: 80%;
  margin: 0 auto;
}
</style>

<script>
import { api } from 'boot/axios';
import { onMounted, ref } from 'vue';

const columns = [
  {
    name: 'Nome',
    required: true,
    label: 'Nome',
    align: 'left',
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'CPF',
    required: true,
    label: 'CPF',
    align: 'left',
    field: (row) => row.cpf,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'Tipo de usuário',
    required: true,
    label: 'Tipo de usuário',
    align: 'left',
    field: (row) => {
      if (row.user_type === 'tenant') {
        return 'Inquilino';
      }
      if (row.user_type === 'syndicate') {
        return 'Sindico';
      }
      return 'Porteiro';
    },
    format: (val) => `${val}`,
    sortable: true,
  },
];

export default {
  data() {
    return {
      currentPage: 1,
      rowsPerPage: 5,
    };
  },
  methods: {
    changePage(page) {
      this.currentPage = page;
    },
  },
  setup() {
    const rows = ref([]);
    onMounted(async () => {
      try {
        const response = await api.get('/users');
        rows.value = response.data;
      } catch (error) {
        console.error('Erro ao carregar os usuários:', error);
      }
    });
    return {
      columns,
      rows,
    };
  },
};
</script>
