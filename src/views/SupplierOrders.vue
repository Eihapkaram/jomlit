<template>
  <div class="supplier-orders-page">
    <v-container fluid>
      <h2 class="page-title">طلبات التجهيز من الأدمن</h2>

      <v-alert
        v-if="alert.show"
        :type="alert.type"
        variant="tonal"
        closable
        class="mb-4"
        @click:close="alert.show = false"
      >
        {{ alert.message }}
      </v-alert>
      <!-- لو مفيش طلبات -->
      <v-col
        v-if="!orders || orders.length === 0"
        cols="12"
        class="text-center"
      >
        <v-card class="pa-8">
          <v-icon color="grey" size="64">mdi-package-variant</v-icon>
          <p class="text-subtitle-1 mt-3">لا توجد طلبات حتى الآن</p>
        </v-card>
      </v-col>
      <v-row dense>
        <v-col v-for="order in orders" :key="order.id" cols="12" md="6" lg="4">
          <v-card elevation="4" class="mb-4 card-order">
            <v-card-title class="d-flex justify-space-between align-center">
              <div>
                <div class="order-id">#{{ order.id }}</div>
                <div class="order-status" :class="order.status">
                  {{ statusText(order.status) }}
                </div>
              </div>
              <v-chip :color="statusColor(order.status)" small>{{
                statusText(order.status)
              }}</v-chip>
            </v-card-title>

            <v-card-subtitle>
              <strong>تاريخ الطلب:</strong> {{ formatDate(order.created_at) }}
            </v-card-subtitle>

            <v-divider class="my-2"></v-divider>

            <v-card-text>
              <div class="products-list">
                <v-row dense>
                  <v-col
                    v-for="item in order.items"
                    :key="item.id"
                    cols="12"
                    sm="6"
                  >
                    <v-card elevation="1" class="mb-2 product-card">
                      <v-img
                        :src="domin + item.product.img"
                        height="120px"
                      ></v-img>
                      <v-card-title class="text-subtitle-2">{{
                        item.product.titel
                      }}</v-card-title>
                      <v-card-text>
                        <div><strong>الكمية:</strong> {{ item.quantity }}</div>
                        <div>
                          <strong>سعر الوحدة:</strong>
                          {{ item.supplier_price }} ج
                        </div>
                        <div>
                          <strong>الإجمالي:</strong> {{ item.total_price }} ج
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
              <div class="text-end mt-2 total-price">
                <strong>الإجمالي الكلي:</strong> {{ order.total_price }} ج
              </div>
            </v-card-text>

            <v-divider class="my-2"></v-divider>

            <v-card-actions class="justify-end">
              <v-btn
                v-if="order.status === 'sent'"
                color="success"
                small
                @click="acceptOrder(order.id)"
              >
                قبول
              </v-btn>
              <v-btn
                v-if="order.status === 'sent'"
                color="error"
                small
                @click="openReject(order)"
              >
                رفض
              </v-btn>
              <v-btn color="primary" small @click="downloadPdf(order.id)">
                تنزيل PDF
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Dialog رفض الطلب -->
    <v-dialog v-model="rejectDialog.show" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h6">رفض الطلب</span>
        </v-card-title>
        <v-card-text>
          <v-textarea
            v-model="rejectDialog.reason"
            label="سبب الرفض"
            rows="3"
          ></v-textarea>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="rejectDialog.show = false">إلغاء</v-btn>
          <v-btn color="error" @click="rejectOrder">تأكيد الرفض</v-btn>
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
      alert: { show: false, type: "success", message: "" },
      rejectDialog: { show: false, reason: "", orderId: null },
    };
  },
  computed: {
    ...mapState(mystore, ["domin"]),
  },
  methods: {
    showAlert(type, message) {
      this.alert = { show: true, type, message };
      setTimeout(() => (this.alert.show = false), 3000);
    },

    async fetchOrders() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${this.domin}supplier/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.orders = res.data;
      } catch {
        this.showAlert("error", "فشل تحميل الطلبات");
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("ar-EG");
    },

    statusText(status) {
      const map = {
        sent: "مرسل",
        preparing: "قيد التحضير",
        ready: "جاهز",
        received: "تم الاستلام",
        cancelled: "ملغي",
      };
      return map[status] || status;
    },

    statusColor(status) {
      const map = {
        sent: "blue",
        preparing: "orange",
        ready: "green",
        received: "grey",
        cancelled: "red",
      };
      return map[status] || "grey";
    },

    async acceptOrder(orderId) {
      const token = localStorage.getItem("token");
      try {
        await axios.post(
          `${this.domin}supplier/orders/${orderId}/accept`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.showAlert("success", "تم قبول الطلب");
        this.fetchOrders();
      } catch {
        this.showAlert("error", "فشل قبول الطلب");
      }
    },

    openReject(order) {
      this.rejectDialog.show = true;
      this.rejectDialog.orderId = order.id;
      this.rejectDialog.reason = "";
    },

    async rejectOrder() {
      if (!this.rejectDialog.reason) {
        this.showAlert("error", "الرجاء كتابة سبب الرفض");
        return;
      }
      const token = localStorage.getItem("token");
      try {
        await axios.post(
          `${this.domin}supplier/orders/${this.rejectDialog.orderId}/reject`,
          { reason: this.rejectDialog.reason },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.showAlert("success", "تم رفض الطلب");
        this.rejectDialog.show = false;
        this.fetchOrders();
      } catch {
        this.showAlert("error", "فشل رفض الطلب");
      }
    },

    async downloadPdf(orderId) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${this.domin}supplier-orders/${orderId}/invoice`,
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
          }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `order-${orderId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch {
        this.showAlert("error", "فشل تنزيل الفاتورة");
      }
    },
  },
  mounted() {
    this.fetchOrders();
  },
};
</script>

<style scoped>
.supplier-orders-page {
  padding: 24px;
  background: #f5f5f7;
}

.page-title {
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 20px;
}

.card-order {
  border-radius: 16px;
  padding: 12px;
}

.product-card {
  border-radius: 12px;
  overflow: hidden;
}

.order-id {
  font-weight: 600;
}

.order-status {
  margin-top: 4px;
}

.total-price {
  font-weight: bold;
  font-size: 15px;
  color: #1e40af;
}
</style>
