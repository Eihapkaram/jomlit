<template>
  <div class="supplier-orders-page" dir="rtl">
    <v-container fluid>
      <h2 class="page-title d-flex align-center gap-2">
        <v-icon color="indigo-darken-3">mdi-dolly</v-icon>
        طلبات التجهيز من الأدمن
      </h2>

      <v-alert
        v-if="alert.show"
        :type="alert.type"
        variant="tonal"
        closable
        class="mb-4 rounded-xl"
        @click:close="alert.show = false"
      >
        {{ alert.message }}
      </v-alert>

      <v-col
        v-if="!orders || orders.length === 0"
        cols="12"
        class="text-center"
      >
        <v-card class="pa-12 rounded-xl border-dashed">
          <v-icon color="grey-lighten-1" size="80" class="mb-3"
            >mdi-package-variant-remove</v-icon
          >
          <p class="text-h6 font-weight-bold text-grey-darken-1">
            لا توجد طلبات معلقة حتى الآن
          </p>
          <p class="text-caption text-grey">
            ستظهر الطلبات الجديدة المرسلة من الإدارة هنا مباشرة
          </p>
        </v-card>
      </v-col>

      <v-row dense>
        <v-col v-for="order in orders" :key="order.id" cols="12" md="6" lg="4">
          <v-card
            elevation="2"
            class="mb-4 card-order rounded-xl border-smooth"
          >
            <v-card-title
              class="d-flex justify-space-between align-start pt-4 px-4"
            >
              <div>
                <div class="order-id-block">
                  <v-icon size="18" color="indigo" class="ml-1"
                    >mdi-pound</v-icon
                  >
                  <span>رقم الطلب {{ order.id }}</span>
                </div>
                <div class="order-date-text mt-1 text-caption text-grey">
                  <v-icon size="14" class="ml-1">mdi-calendar-clock</v-icon>
                  {{ formatDate(order.created_at) }}
                </div>
              </div>

              <v-chip
                :color="statusColor(order.status)"
                variant="flat"
                size="small"
                class="font-weight-bold rounded-lg px-3"
              >
                {{ statusText(order.status) }}
              </v-chip>
            </v-card-title>

            <v-divider class="my-3" color="indigo-lighten-4" />

            <v-card-text class="px-4 py-2">
              <div class="products-list-wrapper">
                <div
                  v-for="item in order.items"
                  :key="item.id"
                  class="modern-product-row"
                >
                  <v-avatar
                    size="64"
                    rounded="lg"
                    class="bg-grey-lighten-4 border-smooth elevation-1"
                  >
                    <v-img
                      :src="domin + item.product.img"
                      cover
                      transition="fade-transition"
                    >
                      <template v-slot:placeholder>
                        <v-row
                          class="fill-height ma-0"
                          align="center"
                          justify="center"
                        >
                          <v-progress-circular
                            indeterminate
                            size="20"
                            color="indigo-lighten-3"
                          ></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </v-avatar>

                  <div class="product-info-block">
                    <h4 class="product-title-text text-truncate">
                      {{ item.product.titel }}
                    </h4>

                    <div class="product-meta-pricing mt-1">
                      <span class="meta-badge qty"
                        >الكمية المطلوبة :
                        <strong>{{ item.quantity }}</strong></span
                      >
                      <span class="meta-divider">|</span>
                      <span class="meta-badge price"
                        >سعر الوحدة :
                        <strong>{{ item.supplier_price }} ج</strong></span
                      >
                      <span class="meta-divider">|</span>
                      <span class="meta-badge total text-indigo-darken-2"
                        >الإجمالي:
                        <strong>{{ item.total_price }} ج</strong></span
                      >
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="total-order-price-bar mt-4 pa-3 rounded-lg d-flex justify-space-between align-center"
              >
                <span class="text-subtitle-2 text-slate-600 font-weight-bold"
                  >إجمالي مستحقات المورد:</span
                >
                <span class="final-price-tag">{{ order.total_price }} ج.م</span>
              </div>
            </v-card-text>

            <v-divider class="my-2" color="indigo-lighten-4" />

            <v-alert
              v-if="
                order.status === 'cancelled' && order.supplier_reject_reason
              "
              type="error"
              variant="tonal"
              density="compact"
              class="mb-3 mx-4 rounded-lg text-caption"
            >
              <strong>سبب الرفض:</strong> {{ order.supplier_reject_reason }}
            </v-alert>

            <v-card-actions class="justify-end px-4 pb-3 gap-2">
              <v-btn
                v-if="order.status === 'sent'"
                color="success"
                variant="flat"
                height="36"
                class="rounded-lg font-weight-bold text-white px-4"
                @click="acceptOrder(order.id)"
              >
                <v-icon left class="ml-1" size="18"
                  >mdi-check-circle-outline</v-icon
                >
                قبول الطلب
              </v-btn>

              <v-btn
                v-if="order.status === 'sent'"
                color="error"
                variant="outlined"
                height="36"
                class="rounded-lg font-weight-bold px-4"
                @click="openReject(order)"
              >
                <v-icon left class="ml-1" size="18"
                  >mdi-close-circle-outline</v-icon
                >
                رفض
              </v-btn>

              <v-btn
                v-if="order.status === 'preparing'"
                color="warning"
                variant="flat"
                height="36"
                class="rounded-lg font-weight-bold text-white px-4"
                @click="markAsReady(order.id)"
              >
                <v-icon left class="ml-1" size="18"
                  >mdi-package-variant-closed-check</v-icon
                >
                الطلب جاهز للتسليم
              </v-btn>

              <v-btn
                v-if="pdf"
                color="indigo-darken-1"
                variant="text"
                height="36"
                class="rounded-lg font-weight-bold"
                @click="downloadPdf(order.id)"
              >
                <v-icon left class="ml-1" size="18">mdi-file-pdf-box</v-icon>
                الفاتورة PDF
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="rejectDialog.show" max-width="480px" persistent>
      <v-card class="rounded-xl pa-2">
        <v-card-title
          class="d-flex align-center text-h6 font-weight-bold text-red-darken-1"
        >
          <v-icon color="red" class="ml-2">mdi-alert-circle-outline</v-icon>
          تأكيد رفض تجهيز الطلب
        </v-card-title>

        <v-card-text class="pt-2">
          <p class="text-body-2 text-grey-darken-1 mb-3">
            يرجى كتابة سبب رفض هذا الطلب بوضوح للإدارة للوقوف على المشكلة:
          </p>
          <v-textarea
            v-model="rejectDialog.reason"
            label="سبب الرفض الإجباري"
            variant="outlined"
            color="red"
            rows="3"
            no-resize
            auto-grow
            class="rounded-lg"
          />
        </v-card-text>

        <v-card-actions class="justify-end pb-3 px-4 gap-2">
          <v-btn
            color="grey-darken-1"
            variant="text"
            rounded
            @click="rejectDialog.show = false"
            >تراجع</v-btn
          >
          <v-btn
            color="error"
            variant="flat"
            class="px-4"
            rounded
            @click="rejectOrder"
            >تأكيد الرفض نهائياً</v-btn
          >
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
      pdf: false,
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
      this.alert = { show: true, type, message };
      setTimeout(() => {
        this.alert.show = false;
      }, 3000);
    },

    async fetchOrders() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${this.domin}supplier/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.orders = res.data;
      } catch (err) {
        console.log(err);
        this.showAlert("error", "فشل تحميل الطلبات");
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    statusText(status) {
      const map = {
        sent: "مرسل إليك",
        preparing: "قيد التحضير",
        ready: "جاهز للتسليم",
        received: "تم الاستلام",
        cancelled: "ملغي / مرفوض",
      };
      return map[status] || status;
    },

    statusColor(status) {
      const map = {
        sent: "indigo",
        preparing: "amber-darken-2",
        ready: "teal",
        received: "blue-grey-darken-1",
        cancelled: "red-darken-1",
      };
      return map[status] || "grey";
    },

    async acceptOrder(orderId) {
      const token = localStorage.getItem("token");
      try {
        await axios.post(
          `${this.domin}supplier/orders/${orderId}/accept`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const order = this.orders.find((o) => o.id === orderId);
        if (order) order.status = "preparing";
        this.showAlert("success", "تم قبول الطلب وبدأ التجهيز");
      } catch (err) {
        this.showAlert("error", "فشل قبول الطلب");
      }
    },

    async markAsReady(orderId) {
      const token = localStorage.getItem("token");
      try {
        await axios.post(
          `${this.domin}supplier-orders/${orderId}/status`,
          { status: "ready" },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const order = this.orders.find((o) => o.id === orderId);
        if (order) order.status = "ready";
        this.showAlert("success", "تم تجهيز الطلب بنجاح");
      } catch (err) {
        this.showAlert("error", "فشل تحديث حالة الطلب");
      }
    },

    openReject(order) {
      this.rejectDialog.show = true;
      this.rejectDialog.orderId = order.id;
      this.rejectDialog.reason = "";
    },

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
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const order = this.orders.find((o) => o.id === orderId);
        if (order) {
          order.status = "cancelled";
          order.supplier_reject_reason = this.rejectDialog.reason;
        }
        this.showAlert("success", "تم رفض الطلب بنجاح");
        this.rejectDialog.show = false;
      } catch (err) {
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
  background: #f8fafc;
  min-height: 100vh;
}

.page-title {
  font-weight: 800;
  color: #1e3a8a;
  margin-bottom: 24px;
  letter-spacing: -0.5px;
}

.border-smooth {
  border: 1px solid #e2e8f0 !important;
}

.border-dashed {
  border: 2px dashed #cbd5e1 !important;
  background: #ffffff;
}

.card-order {
  background: #ffffff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-order:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(30, 41, 59, 0.08) !important;
}

.order-id-block {
  font-weight: 700;
  font-size: 16px;
  color: #334155;
  display: flex;
  align-items: center;
}

/* حاوية قائمة المنتجات في الصف المودرن الجديد */
.products-list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modern-product-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background-color: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
}

.product-info-block {
  flex-grow: 1;
  min-width: 0; /* لمنع حدوث مشاكل الـ overflow مع النصوص الطويلة */
}

.product-title-text {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.product-meta-pricing {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
}

.meta-badge strong {
  color: #334155;
}

.meta-divider {
  color: #cbd5e1;
}

/* شريط السعر الإجمالي السفلي داخل الكارت */
.total-order-price-bar {
  background: linear-gradient(135deg, #f0f4ff, #e0e7ff);
  border: 1px solid #c7d2fe;
}

.final-price-tag {
  font-weight: 800;
  font-size: 18px;
  color: #1e40af;
}

@media (max-width: 600px) {
  .supplier-orders-page {
    padding: 12px;
  }
  .modern-product-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .product-meta-pricing {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
  .meta-divider {
    display: none;
  }
}
</style>
