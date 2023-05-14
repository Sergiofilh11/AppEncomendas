<template>
  <div class="container">
    <div class="main">
      <h2 class="text-h2">Histórico de Ordens</h2>
      <q-card-section
        class="my-card text-white"
        v-for="order in orders"
        :key="order"
      >
        <q-card-section>
          <div class="text-h6">{{ order.identity }}</div>
        </q-card-section>
        <q-list dense bordered padding class="rounded-borders">
          <q-item clickable v-ripple>
            <q-item-section
              >Recebedor: {{ order.recipient.name }}</q-item-section
            >
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
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import { api } from 'boot/axios';
// import { userStore } from 'stores/userStore';

export default defineComponent({
  name: 'HistoricOrders',
  setup() {
    // const store = userStore();
    const orders = ref([]);
    const users = ref([]);
    onMounted(() => {
      api.get('/orders').then((response) => {
        orders.value = response.data;

        response.data.forEach((item, index) => {
          api.get(`/users/${item.recipient}`).then((res) => {
            orders.value[index].recipient = res.data;
          });
        });
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
  margin: 35px;
}

.my-card {
  left: 30px;
  margin: 10px;
  width: 33.33%;
  max-width: 300px;
  border-radius: 5px;
  display: inline-block;
  background: radial-gradient(circle, #35a2ff 0%, #014a88 80%);
}
.main {
  flex-wrap: wrap;
  border: none;
}
</style>
