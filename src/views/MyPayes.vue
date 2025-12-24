<template>
  <v-container
    fluid
    class="pa-6"
    style="background-color: #f9f9f9; top: 20px; position: relative"
  >
    <v-row>
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold mb-6 text-center">🛍️ مشترياتي</h2>
      </v-col>

      <!-- لو مفيش طلبات -->
      <v-col
        v-if="!userorders || userorders.length === 0"
        cols="12"
        class="text-center"
      >
        <v-card class="pa-8">
          <v-icon color="grey" size="64">mdi-package-variant</v-icon>
          <p class="text-subtitle-1 mt-3">لا توجد طلبات حتى الآن</p>
        </v-card>
      </v-col>

      <!-- عرض الطلبات -->
      <v-col
        v-show="this.userRole !== 'supplier'"
        v-for="order in userorders"
        :key="order.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card
          class="pa-4 rounded-xl elevation-3 hover-card"
          style="border: 1px solid #ddd; background: white"
        >
          <!-- رأس الطلب -->
          <div class="d-flex justify-space-between align-center mb-3">
            <h3 v-if="!order.seller_id" class="text-h6 font-weight-bold">
              طلبية رقم #{{ order.id }}
            </h3>
            <h3
              style="color: lightcoral"
              v-if="order.seller_id"
              class="text-h6 font-weight-bold"
            >
              طلبية رقم #{{ order.id }} عملها المندوب
            </h3>
            <v-chip
              :color="getStatusColor(order.status)"
              text-color="white"
              small
              label
            >
              {{ getStatusText(order.status) }}
            </v-chip>
          </div>

          <v-divider class="mb-3"></v-divider>

          <!-- بيانات الطلب الأساسية -->
          <div v-if="!order.seller_id">
            <div class="text-body-2 mb-2">
              <strong>المتجر الي هيوصلة الطلبية:</strong> {{ order.store_name }}
            </div>
            <div class="text-body-2 mb-2">
              <strong>المدينة:</strong> {{ order.city }}
            </div>
            <div class="text-body-2 mb-2">
              <strong>المحافظة:</strong> {{ order.governorate }}
            </div>
            <div class="text-body-2 mb-2">
              <strong>العنوان:</strong> {{ order.street || "غير محدد" }}
            </div>
            <div class="text-body-2 mb-2">
              <strong>الهاتف:</strong> {{ order.phone }}
            </div>
          </div>

          <div v-if="order.seller_id">
            <div class="text-body-2 mb-2">
              <strong>اسم المندوب الي عملك الطلبية:</strong>
              {{ order.seller.name }}
            </div>
            <div class="text-body-2 mb-2">
              <strong> تليفون المندوب :</strong> {{ order.seller.phone }}
            </div>
          </div>

          <div class="text-body-2 mb-2">
            <strong>طريقة الدفع:</strong>
            {{
              order.payment_method === "cod"
                ? "الدفع عند الاستلام"
                : order.payment_method === "credit_card"
                ? "بطاقة ائتمان"
                : "PayPal"
            }}
          </div>

          <!-- التاريخين -->
          <div class="text-body-2 mb-2">
            <strong>تاريخ الطلب:</strong>
            {{ new Date(order.created_at).toLocaleDateString("ar-EG") }}
          </div>
          <div class="text-body-2 mb-2 text-success">
            <strong>موعد التسليم المتوقع:</strong>
            {{ getDeliveryDate(order.created_at) }}
          </div>

          <v-divider class="my-3"></v-divider>

          <!-- تفاصيل المنتجات -->
          <h4 class="text-subtitle-1 font-weight-medium mb-2">
            تفاصيل المنتجات:
          </h4>

          <v-list density="compact">
            <v-list-item
              v-for="item in order.orderdetels"
              :key="item.id"
              class="px-2"
            >
              <v-list-item-avatar size="50">
                <v-img
                  v-if="item.product?.img"
                  :src="domin + item.product.img"
                  style="width: 100px; max-height: 200px"
                  :alt="item.product.titel"
                  loading="lazy"
                  cover
                ></v-img>
                <v-icon v-else>mdi-image-off</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="font-weight-medium">
                  {{ item.product?.titel || "منتج محذوف" }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  الكمية: {{ item.quantity }} × {{ item.price }} =
                  <strong>{{ item.quantity * item.price }} جنيه</strong>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider class="my-3"></v-divider>

          <!-- أزرار التحكم -->
          <div
            style="display: flex; flex-flow: column; gap: 15px"
            class="d-flex justify-space-between align-center"
          >
            <div>
              <strong>الإجمالي: </strong>
              <span class="text-primary"
                >{{ Math.floor(order.total_price) }} جنيه</span
              >
            </div>

            <!-- أزرار -->
            <div
              style="display: flex; flex-flow: column; gap: 10px"
              v-if="!['shipped', 'completed', 'paid'].includes(order.status)"
            >
              <div v-show="!order.seller_id">
                <v-btn
                  v-if="order.status === 'cancelled'"
                  color="blue"
                  variant="tonal"
                  size="small"
                  @click="updateStatus(order.id, 'pending')"
                >
                  <v-icon start>mdi-refresh</v-icon>
                  إعادة الطلب
                </v-btn>

                <v-btn
                  v-else
                  v-show="order.status !== 'cancelled'"
                  color="red"
                  variant="tonal"
                  size="small"
                  @click="updateStatus(order.id, 'cancelled')"
                >
                  <v-icon start>mdi-delete</v-icon>
                  إلغاء الطلبية
                </v-btn>
              </div>

              <div v-show="order.seller_id">
                <v-btn
                  v-show="order.approval_status !== 'approved'"
                  color="red"
                  style="margin-inline: 10px"
                  variant="tonal"
                  size="small"
                  @click="
                    order.seller_id
                      ? RejectOrder(order.id)
                      : RejectOrder(order.id)
                  "
                >
                  <v-icon start>mdi-delete</v-icon>
                  رفض الطلبية
                </v-btn>

                <v-btn
                  v-show="
                    order.seller_id && order.approval_status !== 'approved'
                  "
                  color="green"
                  variant="tonal"
                  size="small"
                  @click="AcceptOrder(order.id)"
                >
                  <v-icon start>mdi-check</v-icon>
                  تاكيد الطلبيه
                </v-btn>
              </div>

              <v-btn
                color="blue"
                variant="tonal"
                size="small"
                @click="downinvoice(order.id)"
              >
                <v-icon start>mdi-invoice-list-outline</v-icon>
                فاتورة الطلبية
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col
        v-show="userRole == 'supplier'"
        v-for="order in userorders"
        :key="order.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card
          class="pa-4 rounded-xl elevation-3 hover-card"
          style="border: 1px solid #ddd; background: white"
        >
          <!-- رأس الطلب -->
          <div class="d-flex justify-space-between align-center mb-3">
            <h3 v-if="!order.seller_id" class="text-h6 font-weight-bold">
              طلبية رقم #{{ order.id }}
            </h3>
            <h3
              style="color: lightcoral"
              v-if="order.seller_id"
              class="text-h6 font-weight-bold"
            >
              طلبية رقم #{{ order.id }} عملها ادارة جملة الجملة
            </h3>
            <v-chip
              :color="getStatusColor(order.status)"
              text-color="white"
              small
              label
            >
              {{ getStatusText(order.status) }}
            </v-chip>
          </div>

          <v-divider class="mb-3"></v-divider>

          <div v-if="order.seller_id">
            <div class="text-body-2 mb-2">
              <strong>اسم مسئول الي عملك الطلبية:</strong>
              {{ order.seller.name }}
            </div>
            <div class="text-body-2 mb-2">
              <strong> تليفون مسئول :</strong> {{ order.seller.phone }}
            </div>
          </div>

          <div class="text-body-2 mb-2">
            <strong>طريقة الدفع:</strong>
            {{
              order.payment_method === "cod"
                ? "الدفع عند الاستلام"
                : order.payment_method === "credit_card"
                ? "بطاقة ائتمان"
                : "PayPal"
            }}
          </div>

          <!-- التاريخين -->
          <div class="text-body-2 mb-2">
            <strong>تاريخ الطلب:</strong>
            {{ new Date(order.created_at).toLocaleDateString("ar-EG") }}
          </div>
          <div class="text-body-2 mb-2 text-success">
            <strong>موعد التسليم المتوقع:</strong>
            {{ getDeliveryDate(order.created_at) }}
          </div>

          <v-divider class="my-3"></v-divider>

          <!-- تفاصيل المنتجات -->
          <h4 class="text-subtitle-1 font-weight-medium mb-2">
            تفاصيل المنتجات:
          </h4>

          <v-list density="compact">
            <v-list-item
              v-for="item in order.orderdetels"
              :key="item.id"
              class="px-2"
            >
              <v-list-item-avatar size="50">
                <v-img
                  v-if="item.product?.img"
                  :src="domin + item.product.img"
                  style="width: 100px; max-height: 200px"
                  :alt="item.product.titel"
                  loading="lazy"
                  cover
                ></v-img>
                <v-icon v-else>mdi-image-off</v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="font-weight-medium">
                  {{ item.product?.titel || "منتج محذوف" }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  الكمية المطلوبة: {{ item.quantity }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider class="my-3"></v-divider>

          <!-- أزرار التحكم -->
          <div
            style="display: flex; flex-flow: column; gap: 15px"
            class="d-flex justify-space-between align-center"
          >
            <!-- أزرار -->
            <div
              style="display: flex; flex-flow: column; gap: 10px"
              v-if="!['shipped', 'completed', 'paid'].includes(order.status)"
            >
              <div v-show="!order.seller_id">
                <v-btn
                  v-if="order.status === 'cancelled'"
                  color="blue"
                  variant="tonal"
                  size="small"
                  @click="updateStatus(order.id, 'pending')"
                >
                  <v-icon start>mdi-refresh</v-icon>
                  إعادة الطلب
                </v-btn>

                <v-btn
                  v-else
                  v-show="order.status !== 'cancelled'"
                  color="red"
                  variant="tonal"
                  size="small"
                  @click="updateStatus(order.id, 'cancelled')"
                >
                  <v-icon start>mdi-delete</v-icon>
                  إلغاء الطلبية
                </v-btn>
              </div>

              <div v-show="order.seller_id">
                <v-btn
                  v-show="order.approval_status !== 'approved'"
                  color="red"
                  style="margin-inline: 10px"
                  variant="tonal"
                  size="small"
                  @click="
                    order.seller_id
                      ? RejectOrder(order.id)
                      : RejectOrder(order.id)
                  "
                >
                  <v-icon start>mdi-delete</v-icon>
                  رفض الطلبية
                </v-btn>

                <v-btn
                  v-show="
                    order.seller_id && order.approval_status !== 'approved'
                  "
                  color="green"
                  variant="tonal"
                  size="small"
                  @click="AcceptOrder(order.id)"
                >
                  <v-icon start>mdi-check</v-icon>
                  تاكيد الطلبيه
                </v-btn>
              </div>

              <v-btn
                color="blue"
                variant="tonal"
                size="small"
                @click="downinvoice(order.id)"
              >
                <v-icon start>mdi-invoice-list-outline</v-icon>
                فاتورة الطلبية
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mystore } from "@/store";
import axios from "axios";
import { mapActions, mapState } from "pinia";

export default {
  data() {
    return {
      autoRefreshTimer: null, // المؤقت للتحديث التلقائي
    };
  },
  async mounted() {
    await this.userordersShow();

    // ✅ تحديث تلقائي كل 10 ثواني
    this.autoRefreshTimer = setInterval(async () => {
      await this.userordersShow();
    }, 10000);
  },
  beforeUnmount() {
    // تنظيف التايمر عند مغادرة الصفحة
    clearInterval(this.autoRefreshTimer);
  },
  computed: {
    ...mapState(mystore, ["domin", "userorders", "userRole"]),
  },
  methods: {
    ...mapActions(mystore, ["userordersShow"]),

    async downinvoice(id) {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${this.domin}orders/${id}/invoice`, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        });
        const fileURL = window.URL.createObjectURL(
          new Blob([res.data], { type: "application/pdf" })
        );
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", `invoice-${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(fileURL);
      } catch (err) {
        console.error(
          "❌ خطأ أثناء تحميل الفاتورة:",
          err.response?.data || err
        );
      }
    },

    async updateStatus(id, status) {
      const token = localStorage.getItem("token");
      try {
        await axios.put(
          `${this.domin}order/update/${id}`,
          { status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await this.userordersShow();
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },

    async AcceptOrder(id) {
      const token = localStorage.getItem("token");
      try {
        await axios.post(
          `${this.domin}orders/${id}/approve`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        await this.userordersShow();
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },

    async RejectOrder(id) {
      const token = localStorage.getItem("token");
      try {
        await axios.post(
          `${this.domin}orders/${id}/reject`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        await this.userordersShow();
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },

    getDeliveryDate(created_at) {
      const date = new Date(created_at);
      date.setDate(date.getDate() + 3);
      return date.toLocaleDateString("ar-EG");
    },

    getStatusColor(status) {
      const map = {
        pending: "orange",
        paid: "blue",
        shipped: "purple",
        completed: "green",
        cancelled: "red",
      };
      return map[status] || "grey";
    },

    getStatusText(status) {
      const map = {
        pending: "قيد الانتظار",
        paid: "تم الدفع",
        shipped: "تم الشحن",
        completed: "مكتمل",
        cancelled: "ملغي",
      };
      return map[status] || "غير معروف";
    },
  },
};
</script>

<style scoped>
.text-h4 {
  color: #222;
}
.hover-card {
  transition: 0.3s;
}
.hover-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}
.text-primary {
  color: #1976d2;
}
.text-success {
  color: #2e7d32;
}
</style>
