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
                <q-btn
                  size="sm"
                  :icon="'edit'"
                  class="q-mx-sm q-mr-sm text-primary"
                  dense
                  round
                  @click="
                    $router.push({
                      name: 'edit-order',
                      params: { id: props.row.id },
                    })
                  "
                />
                <q-btn
                  size="sm"
                  :icon="'delete'"
                  class="q-mx-sm q-mr-sm text-red"
                  dense
                  round
                  @click="openDeleteModal(props.row)"
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
        <q-card-section class="q-pt-md">
          <q-select
            outlined
            label="Coletor"
            v-model="selectedUser"
            :options="listOfUsers"
            option-label="name"
            option-value="id"
          />
        </q-card-section>

        <q-card-actions>
          <q-btn label="Cancelar" color="primary" flat @click="closeModal" />
          <q-btn
            label="Associar"
            color="positive"
            flat
            @click="sendUserReceiver"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="deleteModal" persistent>
      <q-card>
        <q-card-section class="q-pt-sm">
          <h6>Tem certeza que deseja excluir a encomenda {{}}</h6>
        </q-card-section>

        <q-card-actions class="flex flex-center">
          <q-btn
            label="Cancelar"
            color="primary"
            class="q-mx-md"
            @click="deleteModal = false"
          />
          <q-btn
            class="q-mx-md"
            label="Remover"
            color="negative"
            @click="removeOrder"
          />
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
import { getCurrentDate } from 'src/services/generateCurrentDate';
import { useQuasar } from 'quasar';

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
    field: (row) => row.apartment.code,
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
    const deleteModal = ref(false);

    const apartments = ref([]);

    const selectedUser = ref(null);
    const selectedOrder = ref(null);

    const listOfUsers = reactive([]);

    const store = userStore();
    const apartmentCode = store.getApartmentCode;
    const userIsAdmin = store.getUserIsAdmin;

    const router = useRoute();

    const $q = useQuasar();

    const loadOrders = async () => {
      // eslint-disable-next-line operator-linebreak
      let urlToSend =
        '/orders?_sort=receipt_date&_order=desc&_expand=apartment';
      const apartmentIdByUrl = router.query?.apartmentId;

      if (userIsAdmin && apartmentIdByUrl) {
        urlToSend += `&apartmentId=${apartmentIdByUrl}`;
      } else if (!userIsAdmin && apartmentCode) {
        urlToSend += `&code=${apartmentCode}`;
      }

      try {
        const response = await api.get(urlToSend);

        if (!response.data) return;

        const { data } = await api.get('/users');
        listOfUsers.push(...data);
        rows.value = response.data.filter((row) => !row.date_withdrawal);
      } catch {
        $q.notify({
          color: 'negative',
          textColor: 'white',
          icon: 'report_problem',
          position: 'top',
          timeout: 4000,
          message: 'Erro ao carregar os encomendas:',
        });
      }
    };

    onMounted(async () => {
      await loadOrders();
    });

    const closeModal = () => {
      modalOpen.value = false;
    };

    const openModal = (orderId) => {
      selectedOrder.value = orderId;
      modalOpen.value = true;
    };

    return {
      columns,
      rows,
      modalOpen,
      closeModal,
      openModal,
      deleteModal,
      loadOrders,
      selectedUser,
      listOfUsers,
      apartments,
      userIsAdmin,
      selectedOrder,
      $q,
      apartmentCode,
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
    sendUserReceiver() {
      api
        .patch(`/orders/${this.selectedOrder}`, {
          userId: this.selectedUser.id,
          date_withdrawal: getCurrentDate(),
        })

        .then(async (response) => {
          if (response.status !== 200) {
            throw new Error();
          }

          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            timeout: 2000,
            message: 'Encomenda retirada com sucesso!',
          });

          await this.loadOrders();
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            textColor: 'white',
            icon: 'report_problem',
            position: 'top',
            timeout: 4000,
            message: 'Erro ao vincular o recebedor',
          });
        });

      this.closeModal();
    },
    openDeleteModal(orderData) {
      this.deleteModal = true;
      this.selectedOrderId = orderData.id;
    },

    removeOrder() {
      api
        .delete(`/orders/${this.selectedOrderId}`)
        .then(async (response) => {
          if (response.status !== 200) {
            throw new Error();
          }

          this.deleteModal = false;
          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            timeout: 2000,
            message: 'Encomenda removida com sucesso!',
          });

          await this.loadOrders();
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            textColor: 'white',
            icon: 'report_problem',
            position: 'top',
            timeout: 4000,
            message: 'Erro ao remover a entrega.',
          });
        });
    },
  },
};
</script>
