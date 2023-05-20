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
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>

            <q-th> Ações </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
            <q-td auto-width>
              <q-btn
                class="q-mx-sm"
                size="sm"
                :icon="mdiEye"
                color="green"
                round
                dense
                @click="showViewModal(props.row.apartments)"
              />
              <!-- Visualizar -->
              <q-btn
                class="q-mx-sm"
                size="sm"
                :icon="mdiGreasePencil"
                color="primary"
                round
                dense
              />
              <!-- Editar -->
              <q-btn
                class="q-mx-sm"
                size="sm"
                color="red"
                :icon="mdiDelete"
                round
                dense
              />
              <!-- Excluir -->
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props"> </q-tr>
        </template>
      </q-table>

      <q-dialog v-model="dialogVisivel">
        <q-card>
          <q-card-section>
            <q-option-group
              v-if="opcoes.length"
              v-model="selectedOption"
              type="radio"
              color="primary"
              :options="opcoes"
            />
            <p v-else>Sem apartamentos cadastrados</p>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="Cancelar" color="red" @click="closeModal" />
            <q-btn
              v-if="opcoes.length"
              label="Prosseguir"
              color="green"
              @click="nextStep"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>
<script>
import { api } from 'boot/axios';
import { onMounted, ref } from 'vue';
import { mdiDelete, mdiEye, mdiGreasePencil } from '@quasar/extras/mdi-v5';
import {
  QDialog,
  QCard,
  QCardSection,
  QCardActions,
  QBtn,
  QOptionGroup,
} from 'quasar';
import { useRouter } from 'vue-router';

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
  components: {
    QDialog,
    QCard,
    QCardSection,
    QCardActions,
    QBtn,
    QOptionGroup,
  },

  methods: {
    changePage(page) {
      this.currentPage = page;
    },
  },
  watch: {
    dialogVisivel(newValue) {
      if (!newValue) {
        this.opcoes = [];
      }
    },
  },
  setup() {
    const router = useRouter();

    const rows = ref([]);
    const nextPage = ref(2);
    const loading = ref(false);

    const dialogVisivel = ref(false);
    const selectedOption = ref(null);
    const opcoes = ref([]);

    const showViewModal = (options) => {
      dialogVisivel.value = true;

      options.forEach((item) => {
        opcoes.value.push({
          label: `APARTAMENTO: ${item.id}`,
          value: item,
        });
      });
    };

    const closeModal = () => {
      dialogVisivel.value = false;
    };

    const nextStep = () => {
      const { id, cpf } = selectedOption.value;
      router.push({
        name: 'orders',
        query: { apartmentId: id, cpf },
      });
      dialogVisivel.value = false;
    };

    onMounted(async () => {
      try {
        const response = await api.get('/users?_embed=apartments');
        rows.value = response.data;
      } catch (error) {
        console.error('Erro ao carregar os usuários:', error);
      }
    });

    return {
      columns,
      rows,
      mdiDelete,
      mdiGreasePencil,
      nextPage,
      loading,
      mdiEye,
      dialogVisivel,
      selectedOption,
      opcoes,
      showViewModal,
      closeModal,
      nextStep,
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
