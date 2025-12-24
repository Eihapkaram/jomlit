<template>
  <div class="supplier-dashboard">
    <!-- Header -->
    <v-card class="mb-6 header-card" elevation="2">
      <div class="d-flex justify-space-between align-center">
        <div>
          <h2>👋 مرحبًا {{ user.name }}</h2>
          <p class="text-grey">لوحة تحكم المورد</p>
        </div>
        <v-chip color="primary" variant="tonal"> مورد </v-chip>
      </div>
    </v-card>

    <!-- Stats -->
    <v-row class="mb-6">
      <v-col cols="12" md="3" v-for="stat in stats" :key="stat.title">
        <v-card elevation="2" class="stat-card">
          <v-icon size="36" :color="stat.color">{{ stat.icon }}</v-icon>
          <h3>{{ stat.value }}</h3>
          <span>{{ stat.title }}</span>
        </v-card>
      </v-col>
    </v-row>

    <!-- Orders -->
    <v-row>
      <v-col cols="12" md="6" v-for="order in orders" :key="order.id">
        <v-card elevation="3" class="order-card">
          <!-- Order Header -->
          <div class="d-flex justify-space-between align-center mb-3">
            <div>
              <strong>طلب #{{ order.id }}</strong>
              <div class="text-grey text-sm">
                {{ formatDate(order.created_at) }}
              </div>
            </div>

            <v-chip :color="statusColor(order.status)" variant="tonal">
              {{ statusText(order.status) }}
            </v-chip>
          </div>

          <!-- Products -->
          <v-divider class="mb-3" />
          <div v-for="item in order.items" :key="item.id" class="product-row">
            <img :src="domin + item.product.img" />
            <div class="flex-1">
              <div>{{ item.product.titel }}</div>
              <small> {{ item.quantity }} × {{ item.supplier_price }} ج </small>
            </div>
            <strong>{{ item.total_price }} ج</strong>
          </div>

          <v-divider class="my-3" />

          <!-- Total -->
          <div class="d-flex justify-space-between mb-3">
            <strong>الإجمالي</strong>
            <strong>{{ order.total_price }} ج</strong>
          </div>

          <!-- Reject Reason -->
          <v-alert
            v-if="order.status === 'cancelled' && order.supplier_reject_reason"
            type="error"
            variant="tonal"
            class="mb-3"
          >
            سبب الرفض: {{ order.supplier_reject_reason }}
          </v-alert>

          <!-- Actions -->
          <div class="d-flex gap-2 flex-wrap">
            <v-btn
              v-if="order.status === 'sent'"
              color="success"
              @click="acceptOrder(order.id)"
            >
              قبول
            </v-btn>

            <v-btn
              v-if="order.status === 'sent'"
              color="error"
              @click="openReject(order)"
            >
              رفض
            </v-btn>

            <v-btn
              color="primary"
              variant="outlined"
              @click="downloadPdf(order.id)"
            >
              تحميل PDF
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Reject Dialog -->
    <v-dialog v-model="rejectDialog" max-width="500">
      <v-card>
        <v-card-title>سبب الرفض</v-card-title>
        <v-card-text>
          <v-textarea v-model="rejectReason" label="اكتب سبب الرفض" rows="3" />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="tonal" @click="rejectDialog = false">إلغاء</v-btn>
          <v-btn color="error" @click="confirmReject">تأكيد الرفض</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import axios from "axios";
import { mystore } from "@/store";
import { mapState } from "pinia";

export default {
  data() {
    return {
      orders: [],
      rejectDialog: false,
      rejectReason: "",
      selectedOrder: null,
    };
  },

  computed: {
    ...mapState(mystore, ["domin", "user"]),

    stats() {
      return [
        {
          title: "طلبات جديدة",
          value: this.orders.filter((o) => o.status === "sent").length,
          icon: "mdi-bell",
          color: "warning",
        },
        {
          title: "قيد التجهيز",
          value: this.orders.filter((o) => o.status === "preparing").length,
          icon: "mdi-progress-clock",
          color: "info",
        },
        {
          title: "مكتملة",
          value: this.orders.filter((o) => o.status === "received").length,
          icon: "mdi-check-circle",
          color: "success",
        },
        {
          title: "مرفوضة",
          value: this.orders.filter((o) => o.status === "cancelled").length,
          icon: "mdi-close-circle",
          color: "error",
        },
      ];
    },
  },

  methods: {
    async fetchOrders() {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${this.domin}supplier/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.orders = res.data;
      console.log(this.orders);
    },

    acceptOrder(id) {
      axios
        .post(`${this.domin}dashboard/orders/${id}/accept`, {}, this.auth())
        .then(() => this.fetchOrders());
    },

    openReject(order) {
      this.selectedOrder = order;
      this.rejectDialog = true;
    },

    confirmReject() {
      axios
        .post(
          `${this.domin}dashboard/orders/${this.selectedOrder.id}/reject`,
          { reason: this.rejectReason },
          this.auth()
        )
        .then(() => {
          this.rejectDialog = false;
          this.rejectReason = "";
          this.fetchOrders();
        });
    },

    downloadPdf(id) {
      const token = localStorage.getItem("token");
      window.open(
        `${this.domin}dashboard/orders/${id}/invoice?token=${token}`,
        "_blank"
      );
    },

    auth() {
      return {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      };
    },

    statusText(s) {
      return {
        sent: "جديد",
        preparing: "قيد التجهيز",
        ready: "جاهز",
        received: "مستلم",
        cancelled: "مرفوض",
      }[s];
    },

    statusColor(s) {
      return {
        sent: "warning",
        preparing: "info",
        ready: "primary",
        received: "success",
        cancelled: "error",
      }[s];
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("ar-EG");
    },
  },

  mounted() {
    this.fetchOrders();
  },
};
</script>
<style scoped>
.supplier-dashboard {
  padding: 24px;
  background: #f9fafc;
}

.header-card {
  padding: 20px;
  border-radius: 16px;
}

.stat-card {
  padding: 20px;
  text-align: center;
  border-radius: 16px;
}

.order-card {
  padding: 20px;
  border-radius: 16px;
}

.product-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.product-row img {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.text-sm {
  font-size: 13px;
}
</style>
