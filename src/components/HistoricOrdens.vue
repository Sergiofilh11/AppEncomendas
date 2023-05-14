<template>
  <div class="container">
    <div class="main">
      <h2 class="text-h2">Histórico de Ordens</h2>
      <q-card>
        <q-card-section
          class="my-card bg-secondary text-white"
          v-for="order in orders"
          :key="order"
        >
          <q-card-section>
            <div class="text-h6">{{ order.identity }}</div>
          </q-card-section>
          <q-list dense bordered padding class="rounded-borders">
            <q-item clickable v-ripple>
              <q-item-section>Recebedor: {{ order.recipient }}</q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section
                >Data de recebimento: {{ order.receipt_date }}</q-item-section
              >
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section
                >Data de retirada: {{ order.date_withdrawal }}</q-item-section
              >
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator dark />
      </q-card>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import { api } from 'boot/axios';
import { userStore } from '../stores/user-store';

export default defineComponent({
  name: 'HistoricOrders',
  store: userStore,
  computed: {
    userData() {
      return this.getUserData;
    },
  },
  setup() {
    const orders = ref([]);
    const users = ref([]);

    onMounted(() => {
      console.log(this.userData);
      api.get('/orders').then((response) => {
        orders.value = response.data;
      });
      api.get('/users/').then((response) => {
        users.value = response.data;
      });
    });

    return {
      orders,
      users,
    };
  },
});
</script>

<style lang="scss" scoped>
.text-h2 {
  left: 30px;
}

.my-card {
  left: 30px;
  margin: 10px;
  width: 33.33%;
  max-width: 300px;
  border-radius: 10px;
  display: inline-block;
}
.main {
  flex-wrap: wrap;
  border: none;
}
</style>
