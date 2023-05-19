<template>
  <div class="q-pa-md">
    <div class="q-container-flex-auto-width">
      <q-table
        title="Listagem de usuários"
        :rows="rows"
        :columns="columns"
        row-key="users"
        color="primary"
        no-data-label="Carregando..."
        hide-pagination
        :loading="loading"
        :rows-per-page-options="[0]"
        :virtual-scroll-item-size="12"
        :virtual-scroll-sticky-size-start="12"
        virtual-scroll
        @virtual-scroll="onScroll"
        v-model:pagination="pagination"
      />
    </div>
  </div>
</template>

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
    name: 'Apartamento',
    required: false,
    label: 'N° apartamento',
    align: 'center',
    field: (row) => row.id,
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
      style: 'max-width: 50px',
      headerStyle: 'max-width: 50px',
    };
  },
  methods: {
    changePage(page) {
      this.currentPage = page;
    },
  },
  setup() {
    const rows = ref([]);
    const nextPage = ref(2);
    const loading = ref(false);
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

      nextPage,
      loading,

      onScroll({ to }) {
        const lastIndex = rows.value.length - 1;

        if (loading.value !== true && nextPage.value < 1 && to === lastIndex) {
          loading.value = true;
        }
      },
    };
  },
};
</script>
