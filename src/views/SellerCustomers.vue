<template>
  <div class="customers-page">
    <v-card elevation="3" class="main-card">
      <!-- 🟦 العنوان الرئيسي -->
      <div class="header-section">
        <v-icon color="primary" size="32">mdi-account-group</v-icon>
        <h2 class="title">إدارة العملاء</h2>
      </div>

      <!-- التنبيه -->
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

      <!-- 🔍 البحث -->
      <v-text-field
        v-model="search"
        label="بحث بالاسم أو رقم الهاتف"
        variant="outlined"
        density="comfortable"
        prepend-inner-icon="mdi-magnify"
        @input="fetchCustomers"
        hide-details
        class="mb-6"
      />

      <!-- 🧩 لوحة العمليات -->
      <v-row class="actions-section" dense>
        <v-col cols="12" md="6">
          <v-card class="form-card">
            <v-card-title class="pb-0">
              <v-icon start color="primary">mdi-account-plus</v-icon>
              إضافة عميل جديد
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="createCustomer">
                <v-row dense>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="newCustomer.name"
                      label="اسم العميل"
                      required
                    />
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="newCustomer.phone"
                      label="رقم الهاتف"
                      required
                    />
                  </v-col>
                  <v-col cols="12" sm="6" md="4" class="d-flex align-center">
                    <v-btn
                      color="info"
                      variant="tonal"
                      @click="getCustomerLocation"
                      block
                    >
                      {{
                        locationGranted
                          ? "✅ تم تحديد الموقع"
                          : "📍 مشاركة موقع العميل"
                      }}
                    </v-btn>
                  </v-col>
                </v-row>

                <v-row class="mt-2" v-if="latitude && longitude">
                  <v-col cols="12">
                    <small class="text-muted">
                      الموقع: {{ latitude.toFixed(5) }},
                      {{ longitude.toFixed(5) }}
                    </small>
                  </v-col>
                </v-row>

                <div class="text-end mt-4">
                  <v-btn
                    type="submit"
                    color="primary"
                    variant="flat"
                    :disabled="!locationGranted"
                  >
                    <v-icon start>mdi-check</v-icon>
                    إضافة العميل
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
            <!-- 🔗 رابط واتساب لتفعيل الحساب -->
            <v-alert
              v-if="waLink"
              type="success"
              variant="outlined"
              class="mb-4"
            >
              تم إنشاء العميل بنجاح 🎉
              <br />
              <a
                :href="waLink"
                target="_blank"
                style="
                  color: green;
                  font-weight: bold;
                  text-decoration: underline;
                "
              >
                اضغط هنا لإرسال رابط التفعيل عبر واتساب 📱
              </a>
            </v-alert>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="form-card">
            <v-card-title class="pb-0">
              <v-icon start color="success">mdi-link-variant</v-icon>
              ربط عميل مسجل بالفعل
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="addExistingCustomer">
                <v-row dense>
                  <v-col cols="12" sm="8">
                    <v-text-field
                      v-model="identifier"
                      label=" تليفون او ايميل العميل "
                      type="number"
                      required
                    />
                  </v-col>
                  <v-col cols="12" sm="4" class="d-flex align-center">
                    <v-btn type="submit" color="success" variant="flat" block>
                      <v-icon start>mdi-plus-circle</v-icon>
                      ربط
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- 📋 جدول العملاء -->
      <v-card class="mt-6" elevation="2">
        <v-card-title>
          <v-icon start color="primary">mdi-table</v-icon>
          قائمة العملاء
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="customers"
          :loading="loading"
          :items-per-page="10"
          :page.sync="page"
          :server-items-length="total"
          class="responsive-table"
          no-data-text="لا يوجد عملاء"
        >
          <template #item.actions="{ item }">
            <div class="action-buttons">
              <v-btn
                color="info"
                variant="tonal"
                size="small"
                @click="viewOrders(item.id)"
              >
                الطلبات
              </v-btn>
              <v-btn
                color="error"
                variant="tonal"
                size="small"
                @click="removeCustomer(item.id)"
              >
                حذف
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card>

      <!-- 🧾 نافذة الطلبات -->
      <v-dialog v-model="showOrdersDialog" max-width="900px">
        <v-icon
          style="
            color: white;
            background: linear-gradient(45deg, #1a1a1a, #000);
            align-self: flex-end;
            z-index: 5;
            position: fixed;
            border-radius: 50%;
            padding: 8px;
            margin: 10px;
          "
          @click="showOrdersDialog = false"
          id="closepopup"
          >mdi-close-circle-outline</v-icon
        >
        <v-card>
          <v-card-title>
            <v-icon start>mdi-cart-check</v-icon>
            طلبات العميل
          </v-card-title>

          <v-divider />
          <v-card-text>
            <v-alert v-if="!orders.length" type="info" text>
              لا توجد طلبات لهذا العميل
            </v-alert>

            <v-container v-else>
              <v-row
                v-for="order in orders"
                :key="order.id"
                class="mb-6 border pa-4 rounded"
              >
                <v-col cols="12">
                  <h3>
                    طلب رقم #{{ order.id }}
                    <span v-if="order.approved_at" class="approved-text">
                      (تمت الموافقة)
                    </span>
                  </h3>
                  <p><strong>الإجمالي:</strong> {{ order.total_price }} جنيه</p>
                  <p><strong>الحالة:</strong> {{ order.status }}</p>
                  <p>
                    <strong>موافقة العميل:</strong> {{ order.approval_status }}
                  </p>
                  <p>
                    <strong>تاريخ الموافقة:</strong> {{ order.approved_at }}
                  </p>
                  <p>
                    <strong>تاريخ الإنشاء:</strong>
                    {{ formatDate(order.created_at) }}
                  </p>

                  <v-btn
                    color="primary"
                    variant="outlined"
                    size="small"
                    class="mt-2"
                    @click="downinvoice(order.id)"
                  >
                    <v-icon start>mdi-file-pdf-box</v-icon>
                    فاتورة الطلبية
                  </v-btn>

                  <v-divider class="my-3"></v-divider>

                  <v-row dense>
                    <v-col
                      v-for="item in order.orderdetels"
                      :key="item.id"
                      cols="12"
                      sm="6"
                      md="4"
                      lg="3"
                    >
                      <v-card outlined class="order-card">
                        <v-img
                          :src="domin + item.product.img"
                          height="120px"
                          class="rounded-t-lg"
                        ></v-img>
                        <v-card-title class="text-h6">{{
                          item.product.titel
                        }}</v-card-title>
                        <v-card-text>
                          <div>الكمية: {{ item.quantity }}</div>
                          <div>السعر: {{ item.price }} جنيه</div>
                          <div>
                            الإجمالي: {{ item.price * item.quantity }} جنيه
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              color="primary"
              variant="tonal"
              @click="showOrdersDialog = false"
            >
              إغلاق
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import { mystore } from "@/store";
import { mapState } from "pinia";

export default {
  name: "SellerCustomers",
  data() {
    return {
      search: "",
      page: 1,
      total: 0,
      loading: false,
      customers: [],
      orders: [],
      showOrdersDialog: false,
      alert: { show: false, type: "success", message: "" },
      newCustomer: { name: "", phone: "" },
      identifier: "",
      latitude: null,
      longitude: null,
      waLink: null,
      locationGranted: false,
      headers: [
        { title: "الاسم", key: "name" },
        { title: "رقم الهاتف", key: "phone" },
        { title: "ID", key: "id" },
        { title: "تاريخ الإضافة", key: "created_at" },
        { title: "الإجراءات", key: "actions", sortable: false },
      ],
    };
  },
  computed: {
    ...mapState(mystore, ["domin"]),
  },
  methods: {
    showAlert(type, message) {
      this.alert = { show: true, type, message };
      setTimeout(() => (this.alert.show = false), 4000);
    },

    async fetchCustomers() {
      const token = localStorage.getItem("token");
      this.loading = true;
      try {
        const res = await axios.get(`${this.domin}seller/customers`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { search: this.search, page: this.page },
        });
        this.customers = res.data.data || res.data;
        this.total = res.data.total || res.data.length;
      } catch {
        this.showAlert("error", "فشل تحميل العملاء");
      } finally {
        this.loading = false;
      }
    },
    async getCustomerLocation() {
      try {
        // ✅ طلب صلاحيات الموقع على أندرويد/آيفون (Cordova/Capacitor)
        if (window.cordova && cordova.plugins && cordova.plugins.diagnostic) {
          await new Promise((resolve, reject) => {
            cordova.plugins.diagnostic.requestLocationAuthorization(
              (status) => {
                if (
                  status ===
                    cordova.plugins.diagnostic.permissionStatus.GRANTED ||
                  status ===
                    cordova.plugins.diagnostic.permissionStatus
                      .GRANTED_WHEN_IN_USE
                ) {
                  resolve();
                } else {
                  reject("لم يتم منح صلاحية الموقع");
                }
              },
              (err) => reject(err)
            );
          });
        }

        // 🔍 الحصول على الموقع
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              this.latitude = pos.coords.latitude;
              this.longitude = pos.coords.longitude;
              this.locationGranted = true;
              this.showAlert("success", "تم تحديد موقع العميل بنجاح ✅");
            },
            (err) => {
              this.showAlert("error", "تعذر تحديد الموقع، يرجى السماح للموقع");
              this.locationGranted = false;
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
        } else {
          this.showAlert("error", "المتصفح لا يدعم تحديد الموقع");
        }
      } catch (err) {
        console.error(err);
        this.showAlert("error", err || "خطأ في طلب صلاحيات الموقع");
      }
    },

    async getCustomerLocationL() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.latitude = pos.coords.latitude;
            this.longitude = pos.coords.longitude;
            this.locationGranted = true;
          },
          () => {
            this.showAlert("error", "يرجى السماح بمشاركة الموقع");
            this.locationGranted = false;
          }
        );
      } else {
        this.showAlert("error", "المتصفح لا يدعم تحديد الموقع");
      }
    },

    async createCustomer() {
      if (!this.locationGranted) {
        this.showAlert("error", "يجب تحديد موقع العميل أولًا");
        return;
      }
      const token = localStorage.getItem("token");
      try {
        const res = await axios.post(
          `${this.domin}seller/customers/new`,
          {
            ...this.newCustomer,
            latitude: this.latitude,
            longitude: this.longitude,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.waLink = res.data.waLink;
        console.log(res.data);
        this.showAlert("success", res.data.message);
        this.newCustomer = { name: "", phone: "" };
        this.locationGranted = false;
        this.fetchCustomers();
      } catch (err) {
        this.showAlert("error", err.response?.data?.message || "حدث خطأ");
      }
    },

    async addExistingCustomer() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.post(
          `${this.domin}seller/customers`,
          { identifier: this.identifier },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.showAlert("success", res.data.message);
        this.identifier = "";
        this.fetchCustomers();
      } catch {
        this.showAlert("error", "فشل ربط العميل");
      }
    },

    async removeCustomer(id) {
      if (!confirm("هل أنت متأكد من الحذف؟")) return;
      const token = localStorage.getItem("token");
      try {
        const res = await axios.delete(`${this.domin}seller/customers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.showAlert("success", res.data.message);
        this.fetchCustomers();
      } catch {
        this.showAlert("error", "حدث خطأ أثناء الحذف");
      }
    },

    async viewOrders(id) {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${this.domin}seller/customers/${id}/orders`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.orders = res.data.orders || res.data;
        this.showOrdersDialog = true;
      } catch {
        this.showAlert("error", "فشل تحميل الطلبات");
      }
    },

    async downinvoice(id) {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${this.domin}orders/${id}/invoice`, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        });
        const fileURL = URL.createObjectURL(res.data);
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = `invoice-${id}.pdf`;
        link.click();
        URL.revokeObjectURL(fileURL);
      } catch {
        this.showAlert("error", "فشل تحميل الفاتورة");
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("ar-EG");
    },
  },

  mounted() {
    this.fetchCustomers();
  },
};
</script>

<style scoped>
.customers-page {
  padding: 24px;
  background: #f9fafc;
}

.main-card {
  border-radius: 16px;
  padding: 24px;
  background: white;
}

.header-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.title {
  font-weight: 700;
  color: #333;
}

.form-card {
  background-color: #fcfcfc;
  border-radius: 14px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

@media (max-width: 600px) {
  .action-buttons {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
}

.approved-text {
  color: green;
  font-weight: 500;
}

.responsive-table {
  overflow-x: auto;
}

.order-card {
  transition: 0.2s;
}

.order-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style>
