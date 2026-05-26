<template>
  <div class="supplier-orders-page">
    <v-container fluid>
      <h2 class="page-title">طلبات التجهيز من الأدمن</h2>

      <!-- Alert -->
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

      <!-- Empty -->
      <v-col
        v-if="!orders || orders.length === 0"
        cols="12"
        class="text-center"
      >
        <v-card class="pa-8">
          <v-icon color="grey" size="64"> mdi-package-variant </v-icon>

          <p class="text-subtitle-1 mt-3">لا توجد طلبات حتى الآن</p>
        </v-card>
      </v-col>

      <!-- Orders -->
      <v-row dense>
        <v-col v-for="order in orders" :key="order.id" cols="12" md="6" lg="4">
          <v-card elevation="4" class="mb-4 card-order">
            <!-- Header -->
            <v-card-title class="d-flex justify-space-between align-center">
              <div>
                <div class="order-id">#{{ order.id }}</div>

                <div class="order-status" :class="order.status">
                  {{ statusText(order.status) }}
                </div>
              </div>

              <v-chip :color="statusColor(order.status)" small>
                {{ statusText(order.status) }}
              </v-chip>
            </v-card-title>

            <!-- Date -->
            <v-card-subtitle>
              <strong>تاريخ الطلب:</strong>

              {{ formatDate(order.created_at) }}
            </v-card-subtitle>

            <v-divider class="my-2" />

            <!-- Products -->
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
                        cover
                      />

                      <v-card-title class="text-subtitle-2">
                        {{ item.product.titel }}
                      </v-card-title>

                      <v-card-text>
                        <div>
                          <strong>الكمية:</strong>
                          {{ item.quantity }}
                        </div>

                        <div>
                          <strong>سعر الوحدة:</strong>
                          {{ item.supplier_price }} ج
                        </div>

                        <div>
                          <strong>الإجمالي:</strong>
                          {{ item.total_price }} ج
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </div>

              <div class="text-end mt-2 total-price">
                <strong>الإجمالي الكلي:</strong>

                {{ order.total_price }} ج
              </div>
            </v-card-text>

            <v-divider class="my-2" />

            <!-- Reject Reason -->
            <v-alert
              v-if="
                order.status === 'cancelled' && order.supplier_reject_reason
              "
              type="error"
              variant="tonal"
              class="mb-3 mx-3"
            >
              سبب الرفض:
              {{ order.supplier_reject_reason }}
            </v-alert>

            <!-- Actions -->
            <v-card-actions class="justify-end">
              <!-- Accept -->
              <v-btn
                v-if="order.status === 'sent'"
                color="success"
                small
                @click="acceptOrder(order.id)"
              >
                قبول
              </v-btn>

              <!-- Reject -->
              <v-btn
                v-if="order.status === 'sent'"
                color="error"
                small
                @click="openReject(order)"
              >
                رفض
              </v-btn>

              <!-- Ready -->
              <v-btn
                v-if="order.status === 'preparing'"
                color="warning"
                small
                @click="markAsReady(order.id)"
              >
                الطلب جاهز
              </v-btn>

              <!-- PDF -->
              <v-btn color="primary" small @click="downloadPdf(order.id)">
                تنزيل PDF
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Reject Dialog -->
    <v-dialog v-model="rejectDialog.show" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h6"> رفض الطلب </span>
        </v-card-title>

        <v-card-text>
          <v-textarea
            v-model="rejectDialog.reason"
            label="سبب الرفض"
            rows="3"
          />
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn text @click="rejectDialog.show = false"> إلغاء </v-btn>

          <v-btn color="error" @click="rejectOrder"> تأكيد الرفض </v-btn>
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

      alert: {
        show: false,
        type: "success",
        message: "",
      },

      rejectDialog: {
        show: false,
        reason: "",
        orderId: null,
      },
    };
  },

  computed: {
    ...mapState(mystore, ["domin"]),
  },

  methods: {
    showAlert(type, message) {
      this.alert = {
        show: true,
        type,
        message,
      };

      setTimeout(() => {
        this.alert.show = false;
      }, 3000);
    },

    async fetchOrders() {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(`${this.domin}supplier/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.orders = res.data;
      } catch (err) {
        console.log(err);

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

    // قبول الطلب
    async acceptOrder(orderId) {
      const token = localStorage.getItem("token");

      try {
        await axios.post(
          `${this.domin}supplier/orders/${orderId}/accept`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // تحديث مباشر
        const order = this.orders.find((o) => o.id === orderId);

        if (order) {
          order.status = "preparing";
        }

        this.showAlert("success", "تم قبول الطلب");
      } catch (err) {
        console.log(err);

        this.showAlert("error", "فشل قبول الطلب");
      }
    },

    // تجهيز الطلب
    async markAsReady(orderId) {
      const token = localStorage.getItem("token");

      try {
        await axios.post(
          `${this.domin}supplier-orders/${orderId}/status`,
          {
            status: "ready",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // تحديث مباشر
        const order = this.orders.find((o) => o.id === orderId);

        if (order) {
          order.status = "ready";
        }

        this.showAlert("success", "تم تجهيز الطلب بنجاح");
      } catch (err) {
        console.log(err.response?.data || err);

        this.showAlert("error", "فشل تحديث حالة الطلب");
      }
    },

    // فتح Dialog الرفض
    openReject(order) {
      this.rejectDialog.show = true;

      this.rejectDialog.orderId = order.id;

      this.rejectDialog.reason = "";
    },

    // رفض الطلب
    async rejectOrder() {
      if (!this.rejectDialog.reason.trim()) {
        this.showAlert("error", "الرجاء كتابة سبب الرفض");

        return;
      }

      const token = localStorage.getItem("token");

      try {
        const orderId = this.rejectDialog.orderId;

        await axios.post(
          `${this.domin}supplier/orders/${orderId}/reject`,
          {
            reason: this.rejectDialog.reason,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // تحديث مباشر
        const order = this.orders.find((o) => o.id === orderId);

        if (order) {
          order.status = "cancelled";

          order.supplier_reject_reason = this.rejectDialog.reason;
        }

        this.showAlert("success", "تم رفض الطلب");

        // Reset Dialog
        this.rejectDialog.show = false;
        this.rejectDialog.reason = "";
        this.rejectDialog.orderId = null;
      } catch (err) {
        console.log(err.response?.data || err);

        this.showAlert("error", "فشل رفض الطلب");
      }
    },

    // تنزيل PDF
    async downloadPdf(orderId) {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${this.domin}supplier-orders/${orderId}/invoice`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },

            responseType: "blob",
          },
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement("a");

        link.href = url;

        link.setAttribute("download", `order-${orderId}.pdf`);

        document.body.appendChild(link);

        link.click();

        link.remove();
      } catch (err) {
        console.log(err);

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
  min-height: 100vh;
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
  font-weight: 700;
  font-size: 18px;
}

.order-status {
  margin-top: 4px;
  font-size: 14px;
}

.total-price {
  font-weight: bold;
  font-size: 15px;
  color: #1e40af;
}
</style>
