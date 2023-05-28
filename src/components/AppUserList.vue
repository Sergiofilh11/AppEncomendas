<template>
  <div class="q-pa-md">
    <div class="q-container-flex-auto-width">
      <q-table
        title="Listagem de usuários"
        :rows="rows"
        :columns="columns"
        row-key="users"
        color="primary"
        no-data-label="Nenhum usuário encontrado"
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
              <!-- Visualizar -->
              <q-btn
                class="q-mx-sm"
                size="sm"
                :icon="mdiEye"
                color="green"
                round
                dense
                @click="showViewModal(props.row.apartments)"
              />
              <template v-if="canExcludeSyndicate(props.row.user_type)">
                <!-- Editar -->
                <q-btn
                  class="q-mx-sm"
                  size="sm"
                  :icon="mdiGreasePencil"
                  color="primary"
                  round
                  dense
                  @click="showEdit(props)"
                />
                <!-- Excluir -->
                <q-btn
                  class="q-mx-sm"
                  size="sm"
                  color="red"
                  :icon="mdiDelete"
                  round
                  dense
                  @click="showDialogDelete(props)"
                />
              </template>
              <template v-else>
                <q-btn
                  class="q-mx-sm"
                  size="sm"
                  :icon="mdiGreasePencil"
                  color="primary"
                  round
                  dense
                  disable
                />
                <q-btn
                  class="q-mx-sm"
                  size="sm"
                  color="red"
                  :icon="mdiDelete"
                  round
                  dense
                  disable
                />
              </template>
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props"> </q-tr>
        </template>
      </q-table>

      <!-- Visualizar Usuário -->
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
            <q-btn label="Cancelar" color="red" @click="closeDialogVisivel" />
            <q-btn
              v-if="opcoes.length"
              label="Prosseguir"
              color="green"
              @click="nextStep"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Editar Usuário -->
      <q-dialog v-model="dialogEdit">
        <q-card>
          <q-card-section>
            <q-input label="Nome" v-model="editUser.name"></q-input>
            <q-input
              label="CPF"
              v-model="editUser.cpf"
              mask="###.###.###-##"
            ></q-input>
            <q-btn
              label="Editar Apartamento"
              color="primary"
              @click="
                $router.push({
                  path: '/listuser/apartment',
                  query: { userId: editUser.id },
                })
              "
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="Cancelar" color="red" @click="dialogEdit = false" />
            <q-btn label="Editar" color="primary" @click="edit()" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Excluir usuário -->
      <q-dialog v-model="dialogDelete">
        <q-card>
          <q-card-section>
            <h6>
              Tem certeza que deseja excluir o usuário <b>{{ editUser.name }}</b
              >?
            </h6>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              class="q-mx-md"
              label="Cancelar"
              color="red"
              @click="dialogDelete = false"
            />
            <q-btn
              class="q-mx-md"
              label="Excluir"
              color="primary"
              @click="deleteUser()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>
<script>
import { api } from 'boot/axios';
import { onMounted, ref, reactive } from 'vue';
import { mdiDelete, mdiEye, mdiGreasePencil } from '@quasar/extras/mdi-v5';
import {
  QDialog,
  QCard,
  QCardSection,
  QCardActions,
  QBtn,
  QOptionGroup,
  useQuasar,
} from 'quasar';
import { useRouter } from 'vue-router';
import userRulesMixin from '../mixins/userRulesMixin';

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
      const userMaps = {
        tenant: 'Inquilino',
        syndicate: 'Síndico',
        concierge: 'Porteiro',
      };

      return userMaps[row.user_type] ?? '';
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
  mixins: [userRulesMixin],
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

    const $q = useQuasar();
    const rows = ref([]);
    const nextPage = ref(2);
    const loading = ref(false);

    const dialogVisivel = ref(false);
    const dialogEdit = ref(false);
    const dialogDelete = ref(false);
    const selectedOption = ref(null);
    const opcoes = ref([]);
    const editUser = reactive({});
    const typeUserClicked = ref();

    const showViewModal = (options) => {
      dialogVisivel.value = true;

      options.forEach((item) => {
        opcoes.value.push({
          label: `APARTAMENTO: ${item.code}`,
          value: item,
        });
      });
    };

    const showEdit = (value) => {
      editUser.name = value.row.name;
      editUser.cpf = value.row.cpf;
      editUser.id = value.row.id;
      typeUserClicked.value = value.row.user_type;
      dialogEdit.value = true;
    };

    const showDialogDelete = (value) => {
      editUser.id = value.row.id;
      editUser.name = value.row.name;
      dialogDelete.value = true;
    };

    const closeDialogVisivel = () => {
      dialogVisivel.value = false;
    };

    const closeDialogDelete = () => {
      dialogDelete.value = false;
    };

    async function getUsers() {
      try {
        const response = await api.get('/users?_embed=apartments');
        rows.value = response.data;
      } catch (error) {
        console.error('Erro ao carregar os usuários:', error);
      }
    }

    const edit = () => {
      loading.value = true;
      api
        .patch(`/users/${editUser.id}`, {
          name: editUser.name,
          cpf: editUser.cpf,
        })
        .then(() => {
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Usuário editado com sucesso!',
          });
          dialogEdit.value = false;
          getUsers();
          loading.value = false;
        });
    };

    const deleteUser = () => {
      loading.value = true;
      api.delete(`/users/${editUser.id}`).then(() => {
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Usuário excluido com sucesso!',
        });
        dialogDelete.value = false;
        getUsers();
        loading.value = false;
      });
    };

    const nextStep = () => {
      router.push({
        name: 'orders',
        query: { apartmentId: selectedOption.value.id },
      });
      dialogVisivel.value = false;
    };
    onMounted(() => {
      getUsers();
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
      dialogEdit,
      selectedOption,
      editUser,
      edit,
      deleteUser,
      dialogDelete,
      opcoes,
      showViewModal,
      showDialogDelete,
      showEdit,
      closeDialogVisivel,
      closeDialogDelete,
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
