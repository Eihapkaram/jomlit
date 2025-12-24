<template>
  <v-container fluid class="pa-4">
    <v-btn
      @click="down()"
      style="left: 0px; position: relative"
      ripple
      elevation="3"
    >
      <v-icon>mdi-arrow-down-bold </v-icon></v-btn
    >تنزيل الكل
    <v-row>
      <!-- ✅ الطلبات التي قام بها البائعون -->
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold mb-4">طلبات البائعين للمستخدمين</h2>
      </v-col>
      <v-btn
        @click="downOrdersSellerAprroved()"
        style="left: 0px; position: relative"
        ripple
        elevation="3"
      >
        <v-icon>mdi-arrow-down-bold </v-icon></v-btn
      >تنزيل
      <v-col
        v-for="order in ordersbySeller"
        :key="order.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card
          class="pa-4 rounded-xl elevation-2"
          style="border: 1px solid #eee"
        >
          <div class="d-flex justify-space-between align-center mb-2">
            <h3 class="text-h6 font-weight-bold">الطلب رقم #{{ order.id }}</h3>
            <v-chip
              :color="getStatusColor(order.status)"
              text-color="white"
              small
            >
              {{ order.status }}
            </v-chip>
          </div>
          {{ console.log(order) }}
          ربح المندوب : {{ order.seller_profit }}
          <!-- ✅ إدخال الربح -->
          <v-text-field
            v-model="order.seller_profit"
            type="number"
            label="ربح البائع (جنيه)"
            dense
            outlined
            hide-details
            class="mb-3"
          ></v-text-field>

          <!-- ✅ زر التحديث منفصل -->
          <div class="text-center">
            <v-btn
              @click="addprfite(order)"
              color="blue"
              variant="elevated"
              size="small"
            >
              <v-icon start>mdi-content-save</v-icon>
              حفظ
            </v-btn>
          </div>
          <div class="text-body-2 mb-2">
            <strong>الإجمالي:</strong> {{ order.total_price }} جنيه
          </div>
          <div class="text-body-2 mb-2">
            <strong>العنوان:</strong> {{ order.city }} - {{ order.street }}
          </div>
          <div class="text-body-2 mb-2">
            <strong>المحل :</strong> {{ order.store_name }}
          </div>
          <div class="text-body-2 mb-2">
            <strong>موافقه العميل :</strong> {{ order.approval_status }}
          </div>
          <div class="text-body-2 mb-2">
            <strong>الهاتف:</strong> {{ order.phone }}
          </div>
          <div class="text-body-2 mb-2">
            <strong>المندوب:</strong> {{ order.seller.name }}
          </div>
          <div class="text-body-2 mb-2">
            <strong> تليفون المندوب :</strong> {{ order.seller.phone }}
          </div>
          <div class="text-body-2 mb-2">
            <strong>id المندوب:</strong> {{ order.seller.id }}
          </div>
          <div class="text-body-2 mb-2">
            <strong>اسم العميل:</strong> {{ order.userorder.name }}
          </div>
          <div class="text-body-2 mb-2">
            <strong>id العميل :</strong> {{ order.userorder.id }}
          </div>
          <div class="text-body-2 mb-2">
            <strong> الموقع :</strong>
            {{ order.userorder.latitude }}
            {{ order.userorder.longitude }}
          </div>

          <v-divider class="my-2"></v-divider>

          <!-- تفاصيل المنتجات -->
          <div>
            <h4 class="text-subtitle-1 font-weight-medium mb-2">
              تفاصيل المنتجات:
            </h4>
            <v-list density="compact">
              <v-list-item
                v-for="item in order.orderdetels"
                :key="item.id"
                class="px-2"
              >
                <v-list-item-avatar size="48">
                  <v-img
                    style="width: 50px; height: 50px"
                    v-if="item.product?.img"
                    :src="domin + item.product.img"
                    cover
                  ></v-img>
                  <v-icon v-else>mdi-image-off</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.product?.titel || "منتج محذوف" }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    الكمية: {{ item.quantity }} × {{ item.price }} =
                    <strong>{{ item.quantity * item.price }} جنيه</strong>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
          <!-- ✅ تعديل حالة الطلب -->
          <div class="d-flex align-center justify-space-between mb-3">
            <v-select
              v-model="order.newStatus"
              :items="statuses"
              label="تغيير الحالة"
              dense
              variant="outlined"
              hide-details
              style="max-width: 180px"
            ></v-select>

            <v-btn
              color="blue"
              variant="tonal"
              size="small"
              @click="updateStatus(order)"
            >
              <v-icon start>mdi-refresh</v-icon>
              تحديث
            </v-btn>
          </div>

          <v-divider class="my-2"></v-divider>

          <!-- أزرار التحكم -->
          <div class="d-flex justify-end">
            <v-btn
              color="red"
              variant="tonal"
              @click="dl(order.id)"
              size="small"
            >
              <v-icon start>mdi-delete</v-icon>
              حذف
            </v-btn>
            <v-btn
              color="blue"
              variant="tonal"
              @click="downinvoice(order.id)"
              size="small"
            >
              <v-icon start></v-icon>
              فاتوره
            </v-btn>
          </div>
        </v-card>
      </v-col>
      <!-- ... (الكود الحالي لطلبات البائعين) ... -->
    </v-row>

    <!-- ✅ صف جديد لطلبات المستخدمين فقط -->
    <v-row class="mt-12">
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold mb-4">طلبات المستخدمين فقط</h2>
      </v-col>
      <v-btn
        @click="downordersCustomer()"
        style="left: 0px; position: relative"
        ripple
        elevation="3"
      >
        <v-icon>mdi-arrow-down-bold </v-icon></v-btn
      >تنزيل
      <!-- لو مفيش طلبات -->
      <v-col
        v-if="!ordersbyCoustomer || ordersbyCoustomer.length === 0"
        cols="12"
        class="text-center"
      >
        <v-card class="pa-5">
          <v-icon color="grey" size="48">mdi-package-variant</v-icon>
          <p class="text-subtitle-1 mt-2">لا توجد طلبات للمستخدمين حالياً</p>
        </v-card>
      </v-col>

      <!-- عرض الطلبات -->
      <v-col
        v-for="order in ordersbyCoustomer"
        :key="order.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card
          class="pa-4 rounded-xl elevation-2"
          style="border: 1px solid #eee"
        >
          <div class="d-flex justify-space-between align-center mb-2">
            <h3 class="text-h6 font-weight-bold">الطلب رقم #{{ order.id }}</h3>
            <v-chip
              :color="getStatusColor(order.status)"
              text-color="white"
              small
            >
              {{ order.status }}
            </v-chip>
          </div>

          <div class="text-body-2 mb-2">
            <strong>الإجمالي:</strong> {{ order.total_price }} جنيه
          </div>
          <div class="text-body-2 mb-2">
            <strong>العنوان:</strong> {{ order.city }} - {{ order.street }}
          </div>
          <div class="text-body-2 mb-2">
            <strong>الهاتف:</strong> {{ order.phone }}
          </div>
          <div class="text-body-2 mb-2">
            <strong>اسم العميل:</strong> {{ order.userorder.name }}
          </div>
          <div class="text-body-2 mb-2">
            <strong>id العميل :</strong> {{ order.userorder.id }}
          </div>
          <div class="text-body-2 mb-2">
            <strong> الموقع :</strong>
            {{ order.userorder.latitude }}
            {{ order.userorder.longitude }}
          </div>

          <v-divider class="my-2"></v-divider>

          <!-- تفاصيل المنتجات -->
          <div>
            <h4 class="text-subtitle-1 font-weight-medium mb-2">
              تفاصيل المنتجات:
            </h4>
            <v-list density="compact">
              <v-list-item
                v-for="item in order.orderdetels"
                :key="item.id"
                class="px-2"
              >
                <v-list-item-avatar size="48">
                  <v-img
                    style="width: 50px; height: 50px"
                    v-if="item.product?.img"
                    :src="domin + item.product.img"
                    cover
                  ></v-img>
                  <v-icon v-else>mdi-image-off</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.product?.titel || "منتج محذوف" }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    الكمية: {{ item.quantity }} × {{ item.price }} =
                    <strong>{{ item.quantity * item.price }} جنيه</strong>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
          <!-- ✅ تعديل حالة الطلب -->
          <div class="d-flex align-center justify-space-between mb-3">
            <v-select
              v-model="order.newStatus"
              :items="statuses"
              label="تغيير الحالة"
              dense
              variant="outlined"
              hide-details
              style="max-width: 180px"
            ></v-select>

            <v-btn
              color="blue"
              variant="tonal"
              size="small"
              @click="updateStatus(order)"
            >
              <v-icon start>mdi-refresh</v-icon>
              تحديث
            </v-btn>
          </div>

          <v-divider class="my-2"></v-divider>

          <!-- أزرار التحكم -->
          <div class="d-flex justify-end">
            <v-btn
              color="red"
              variant="tonal"
              @click="dl(order.id)"
              size="small"
            >
              <v-icon start>mdi-delete</v-icon>
              حذف
            </v-btn>
            <v-btn
              color="blue"
              variant="tonal"
              @click="downinvoice(order.id)"
              size="small"
            >
              <v-icon start></v-icon>
              فاتوره
            </v-btn>
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
  async mounted() {
    await Promise.all([this.ordersShow(), this.allordersbySeller()]);
  },
  data() {
    return {
      statuses: ["pending", "paid", "shipped", "completed", "cancelled"],
    };
  },
  computed: {
    ...mapState(mystore, ["domin", "ordersbyCoustomer", "ordersbySeller"]),
  },
  methods: {
    ...mapActions(mystore, ["ordersShow", "allordersbySeller"]),

    // ✅ تعديل حالة الطلب
    async updateStatus(order) {
      const token = localStorage.getItem("token");
      if (!order.newStatus) {
        alert("من فضلك اختر حالة جديدة قبل التحديث");
        return;
      }

      try {
        const res = await axios.put(
          `${this.domin}dashboard/orders/${order.id}/status`,
          { status: order.newStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("تم تحديث الحالة:", res.data);
        this.ordersShow();
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },

    //اضافه الربح
    // ✅ تعديل حالة الطلب
    async addprfite(order) {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.post(
          `${this.domin}dashboard/orders/${order.id}/add-profit`,
          { profit: order.seller_profit },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("تم اضافه الربح:", res.data);
        this.ordersShow();
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },

    // دالة حذف الطلب
    async dl(id) {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.delete(`${this.domin}order/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("تم حذف الطلب:", res.data);
        await this.ordersShow(); // تحديث القائمة بعد الحذف
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },

    async down() {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(`${this.domin}orders/export`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // 🔹 مهم جداً لتحميل الملف بشكل صحيح
        });

        // إنشاء رابط التحميل
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "orders.xlsx"); // اسم الملف
        document.body.appendChild(link);
        link.click();

        // تنظيف بعد التحميل
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log("✅ تم تنزيل الملف بنجاح");
      } catch (err) {
        console.error("❌ خطأ أثناء التحميل:", err.response?.data || err);
      }
    },
    async downordersCustomer() {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(`${this.domin}orders/export/customers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // 🔹 مهم جداً لتحميل الملف بشكل صحيح
        });

        // إنشاء رابط التحميل
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "customersOrders.xlsx"); // اسم الملف
        document.body.appendChild(link);
        link.click();

        // تنظيف بعد التحميل
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log("✅ تم تنزيل الملف بنجاح");
      } catch (err) {
        console.error("❌ خطأ أثناء التحميل:", err.response?.data || err);
      }
    },
    async downOrdersSellerAprroved() {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(
          `${this.domin}orders/export/sellers/approved`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob", // 🔹 مهم جداً لتحميل الملف بشكل صحيح
          }
        );

        // إنشاء رابط التحميل
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "sellersordersapproved.xlsx"); // اسم الملف
        document.body.appendChild(link);
        link.click();

        // تنظيف بعد التحميل
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log("✅ تم تنزيل الملف بنجاح");
      } catch (err) {
        console.error("❌ خطأ أثناء التحميل:", err.response?.data || err);
      }
    },
    async downinvoice(id) {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(`${this.domin}orders/${id}/invoice`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // 🔹 ضروري لتحميل ملف PDF أو أي ملف ثنائي
        });

        // إنشاء رابط للتحميل
        const fileURL = window.URL.createObjectURL(
          new Blob([res.data], { type: "application/pdf" })
        );
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", `invoice-${id}.pdf`); // اسم الملف حسب رقم الطلب
        document.body.appendChild(link);
        link.click();

        // تنظيف بعد التحميل
        document.body.removeChild(link);
        window.URL.revokeObjectURL(fileURL);

        console.log("✅ تم تنزيل الفاتورة بنجاح");
      } catch (err) {
        console.error(
          "❌ خطأ أثناء تحميل الفاتورة:",
          err.response?.data || err
        );
      }
    },

    // لون الحالة
    getStatusColor(status) {
      switch (status) {
        case "pending":
          return "orange";
        case "paid":
          return "blue";
        case "shipped":
          return "purple";
        case "completed":
          return "green";
        case "cancelled":
          return "red";
        default:
          return "grey";
      }
    },
  },
};
</script>

<style scoped>
.text-h4 {
  color: #333;
}
.v-card {
  transition: 0.3s;
}
.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
