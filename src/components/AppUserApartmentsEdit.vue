<template>
  <div class="q-pa-md">
    <div class="q-container-flex-auto-width">
      <q-table
        title="Listagem de apartamentos"
        :rows="rows"
        :columns="columns"
        row-key="users"
        color="primary"
        no-data-label="Nenhum apartamento encontrado"
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
                :icon="mdiGreasePencil"
                color="primary"
                round
                dense
                @click="showEdit(props)"
              />
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props"> </q-tr>
        </template>
      </q-table>

      <!-- Editar Usuário -->
      <q-dialog v-model="dialogApartments">
        <q-card>
          <q-card-section>
            <q-input
              label="Nº do apartamento"
              v-model="editUser.code"
              mask="NNNNN"
            ></q-input>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              label="Cancelar"
              color="red"
              @click="dialogApartments = false"
            />
            <q-btn
              :label="labelSubmitApartment"
              color="primary"
              @click="crudApartment()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <div class="flex" style="justify-content: flex-end">
        <q-btn
          class="q-mt-md q-mb-xl q-ml-sm"
          fab
          icon="add_home_work"
          color="primary"
          posit
          @click="showCreateApartments()"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { api } from 'boot/axios';
import { ref, reactive, onMounted } from 'vue';
import { mdiDelete, mdiEye, mdiGreasePencil } from '@quasar/extras/mdi-v5';
import {
  QDialog,
  QCard,
  QCardSection,
  QCardActions,
  QBtn,
  useQuasar,
} from 'quasar';
import { useRoute } from 'vue-router';

const columns = [
  {
    name: 'numberApartment',
    required: true,
    label: 'Nº do apartamento',
    align: 'left',
    field: (row) => row.code,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'cpf',
    required: true,
    label: 'CPF do dono do apartamento',
    align: 'left',
    field: (row) => row.cpf,
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
  },
  watch: {
    dialogVisivel(newValue) {
      if (!newValue) {
        this.opcoes = [];
      }
    },
  },
  setup() {
    const route = useRoute();
    const $q = useQuasar();
    const rows = ref([]);
    const nextPage = ref(2);
    const loading = ref(false);
    const dialogApartments = ref(false);
    const labelSubmitApartment = ref('');
    const selectedOption = ref(null);
    const opcoes = ref([]);
    const editUser = reactive({});
    const editClickedUser = ref();

    const showEdit = (value) => {
      editUser.code = value.row.code;
      editClickedUser.value = value.row.id;
      dialogApartments.value = true;
      labelSubmitApartment.value = 'Editar';
    };

    async function getApartments() {
      try {
        const response = await api.get(
          `/apartments?userId=${route.query.userId}`,
        );
        rows.value = response.data;
      } catch {
        $q.notify({
          color: 'negative',
          textColor: 'white',
          icon: 'report_problem',
          position: 'top',
          timeout: 4000,
          message: 'Erro ao carregar os apartamentos:',
        });
      }
    }

    async function apartmentAlreadyExist(apartmentCode) {
      const apartmentExists = await api
        .get(`/apartments?code=${apartmentCode}`)
        .then((response) => response.data.length);

      return !!apartmentExists;
    }

    const edit = async () => {
      loading.value = true;

      const apartmentExists = apartmentAlreadyExist(editUser.code);

      if (apartmentExists) {
        $q.notify({
          color: 'negative',
          textColor: 'white',
          icon: 'report_problem',
          position: 'top',
          timeout: 4000,
          message: 'Apartamento já cadastrado:',
        });

        loading.value = false;
        dialogApartments.value = false;

        return;
      }

      api
        .patch(`/apartments/${editClickedUser.value}`, {
          code: editUser.code.toUpperCase(),
        })
        .then(async () => {
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Apartamento editado com sucesso!',
          });

          dialogApartments.value = false;
          await getApartments();
          loading.value = false;
        });
    };

    const showCreateApartments = () => {
      dialogApartments.value = true;
      labelSubmitApartment.value = 'Registrar';
    };

    const createApartments = () => {
      loading.value = true;

      const apartmentExists = apartmentAlreadyExist(editUser.code);
      if (apartmentExists) {
        $q.notify({
          color: 'negative',
          textColor: 'white',
          icon: 'report_problem',
          position: 'top',
          timeout: 4000,
          message: 'Apartamento já cadastrado:',
        });

        loading.value = false;

        return;
      }

      api
        .post('apartments', {
          userId: rows.value[0].userId,
          cpf: rows.value[0].cpf,
          code: editUser.code.toUpperCase(),
        })
        .then(async () => {
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Apartamento registrado com sucesso!',
          });

          dialogApartments.value = false;
          await getApartments();
          loading.value = false;
        });
    };

    function crudApartment() {
      switch (labelSubmitApartment.value) {
        case 'Editar':
          edit();
          break;
        default:
          createApartments();
      }
    }

    onMounted(() => {
      getApartments();
    });

    return {
      columns,
      rows,
      mdiDelete,
      mdiGreasePencil,
      nextPage,
      loading,
      mdiEye,
      dialogApartments,
      labelSubmitApartment,
      selectedOption,
      editUser,
      edit,
      opcoes,
      editClickedUser,
      showEdit,
      createApartments,
      crudApartment,
      showCreateApartments,
    };
  },
};
</script>
