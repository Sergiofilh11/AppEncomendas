<!-- eslint-disable implicit-arrow-linebreak -->
<!-- eslint-disable implicit-arrow-linebreak -->
<template>
  <div class="q-pa-md q-mt-md">
    <div class="q-pa-md">
      <div class="q-container-flex">
        <q-table
          no-data-label="Nenhum resultado encontrado."
          title="Listagem de encomendas não retiradas"
          :rows="rows"
          :columns="columns"
          row-key="users"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.value }}
              </q-td>
              <q-td v-if="userIsAdmin" auto-width>
                <q-btn
                  size="sm"
                  :icon="'add'"
                  class="q-mx-sm q-mr-sm text-positive"
                  dense
                  round
                  @click="openModal(props.row.id)"
                />
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="text-left">
                  This is expand slot for row above: {{ props.row.name }}.
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>

    <q-dialog v-model="modalOpen" persistent>
      <q-card>
        <q-card-section class="q-pt-none">
          <q-select
            outlined
            label="Apartamento"
            v-model="selectedApartment"
            :options="selectApartment"
            option-label="id"
            option-value="id"
          />
        </q-card-section>

        <q-card-actions>
          <q-btn label="Cancelar" color="primary" flat @click="closeModal" />
          <q-btn label="Associar" color="positive" flat />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { onMounted, ref, reactive } from 'vue';
import { api } from 'boot/axios';
import { userStore } from 'stores/userStore';
import { useRoute } from 'vue-router';

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
  {
    name: 'actions',
    required: true,
    align: 'right',
    field: '',
    format: (row) => row,
    sortable: false,
    class: 'q-table__td-actions',
  },
];
export default {
  setup() {
    const rows = ref([]);
    const modalOpen = ref(false);
    const apartmentNumber = ref('');
    const selectedApartment = ref(null);
    const selectApartment = reactive([]);
    const apartments = ref([]);

    const store = userStore();
    const apartmentId = store.getApartmentId;
    const userIsAdmin = store.getUserIsAdmin;

    const router = useRoute();

    onMounted(async () => {
      // eslint-disable-next-line operator-linebreak
      let urlToSend = '/orders?_sort=receipt_date&_order=desc';
      const apartmentIdByUrl = router.query?.apartmentId;

      if (userIsAdmin && apartmentIdByUrl) {
        urlToSend += `&apartmentId=${apartmentIdByUrl}`;
      } else if (!userIsAdmin && apartmentId) {
        urlToSend += `&apartmentId=${apartmentId}`;
      }

      try {
        const response = await api.get(urlToSend);
        const { data } = await api.get('/apartments');
        selectApartment.push(...data);
        rows.value = response.data;
      } catch (error) {
        console.error('Erro ao carregar os encomendas:', error);
      }
    });

    const closeModal = () => {
      apartmentNumber.value = '';
      modalOpen.value = false;
    };

    const openModal = (row) => {
      console.log('Add encomenda:', row);
      modalOpen.value = true;
    };

    return {
      columns,
      rows,
      modalOpen,
      apartmentNumber,
      closeModal,
      openModal,
      selectedApartment,
      selectApartment,
      apartments,
      userIsAdmin,
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
      console.log(`Encomenda ${encomenda.id} clicada.`);
    },
    linkOrderToAnApartment(row) {
      console.log('Adicionar encomenda:', row);
    },
  },
};
</script>
