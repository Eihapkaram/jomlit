<template>
  <v-container>
    <v-card>
      <v-card-title class="text-h6"> Supplier Orders </v-card-title>

      <v-data-table
        :headers="headers"
        :items="orders"
        :loading="loading"
        class="elevation-1"
      >
        <!-- Supplier -->
        <template #item.supplier="{ item }">
          {{ item.supplier?.name || "----" }}
        </template>

        <!-- Status -->
        <template #item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" dark>
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <!-- draft -> sent -->
          <v-btn
            v-if="item.status === 'draft'"
            size="small"
            color="primary"
            @click="updateStatus(item.id, 'sent')"
          >
            Send
          </v-btn>

          <!-- sent -> preparing -->
          <v-btn
            v-if="item.status === 'sent'"
            size="small"
            color="info"
            @click="updateStatus(item.id, 'preparing')"
          >
            Preparing
          </v-btn>

          <!-- preparing -> ready -->
          <v-btn
            v-if="item.status === 'preparing'"
            size="small"
            color="purple"
            @click="updateStatus(item.id, 'ready')"
          >
            Ready
          </v-btn>

          <!-- ready -> received -->
          <v-btn
            v-if="item.status === 'ready'"
            size="small"
            color="success"
            @click="updateStatus(item.id, 'received')"
          >
            Received
          </v-btn>

          <!-- Cancel متاح في كل الحالات -->
          <v-btn
            v-if="item.status !== 'cancelled' && item.status !== 'received'"
            size="small"
            color="error"
            class="ml-2"
            @click="updateStatus(item.id, 'cancelled')"
          >
            Cancel
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { mystore } from "/src/store/index";

const store = mystore();

const loading = ref(false);

const headers = [
  { title: "ID", key: "id" },
  { title: "Supplier", key: "supplier" },
  { title: "Total", key: "total_price" },
  { title: "Status", key: "status" },
  { title: "Created At", key: "created_at" },
  { title: "Actions", key: "actions", sortable: false },
];

const orders = computed(() => store.adminSupplierorders || []);

const loadOrders = async () => {
  loading.value = true;
  await store.adminsupplierorders();
  loading.value = false;
};

const updateStatus = async (id, status) => {
  await store.supplierordersstatus(id, status);
  await loadOrders();
};

/* 🎨 ألوان الحالات */
const getStatusColor = (status) => {
  switch (status) {
    case "draft":
      return "grey";

    case "sent":
      return "blue";

    case "preparing":
      return "orange";

    case "ready":
      return "purple";

    case "received":
      return "green";

    case "cancelled":
      return "red";

    default:
      return "grey";
  }
};

onMounted(loadOrders);
</script>
