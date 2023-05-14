<template>
  <div class="q-pa-md">
    <q-table title="" :rows="rows" :columns="columns" row-key="name" />
  </div>
</template>

<script>
const columns = [
  {
    name: 'Nome',
    required: true,
    label: '',
    align: 'left',
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
];

const rows = [];
export default {
  setup() {
    return {
      columns,
      rows,
    };
  },
};
</script>
