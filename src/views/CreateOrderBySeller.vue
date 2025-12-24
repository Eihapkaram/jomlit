<template>
  <div>
    <v-card>
      <!-- جدول عرض المنتجات -->
      <v-table>
        <thead>
          <tr>
            <th>الصورة</th>
            <th>المنتج</th>
            <th>الكمية</th>
            <th>السعر</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in CartProduct2" :key="item.id">
            <td>
              <img
                id="img"
                height="100px"
                width="fit-content"
                loading="lazy"
                :src="domin + item.product.img"
                :alt="item.product.titel"
              />
            </td>
            <td>{{ item.product.titel }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ Math.ceil(item.product.price) }}ج</td>
          </tr>
        </tbody>
      </v-table>

      <!-- المجموع الكلي -->
      <v-card outlined class="mt-3">
        <v-card-text class="text-h5">
          المجموع الكلي: {{ total.reduce((a, b) => a + b, 0) }}ج
        </v-card-text>
      </v-card>
    </v-card>
  </div>

  <div class="pa-6">
    <v-card class="pa-6" elevation="3">
      <h2 class="mb-4">إنشاء طلب جديد</h2>

      <!-- رسائل التنبيه -->
      <v-alert
        v-if="alert.show"
        :type="alert.type"
        closable
        class="mb-4"
        @click:close="alert.show = false"
      >
        {{ alert.message }}
      </v-alert>

      <!-- نموذج إنشاء الطلب -->
      <v-form ref="orderForm" @submit.prevent="order2" v-if="!createdOrder">
        <v-row>
          <!-- اختيار العميل -->
          <v-col cols="12" md="6">
            <v-select
              v-model="form.user_id"
              :items="customers"
              item-title="name"
              item-value="id"
              label="اختر العميل"
              required
              :loading="loadingCustomers"
              clearable
            />
          </v-col>

          <!-- ✅ المحافظة -->
          <v-col cols="12" md="6">
            <v-select
              v-model="form.governorate"
              :items="Object.keys(governorates)"
              label="المحافظة"
              required
              @update:modelValue="form.city = ''"
            />
          </v-col>

          <!-- ✅ المدينة (تظهر حسب المحافظة) -->
          <v-col cols="12" md="6">
            <v-select
              v-model="form.city"
              :items="governorates[form.governorate] || []"
              label="المدينة"
              :disabled="!form.governorate"
              required
            />
          </v-col>

          <!-- الشارع ورقم الهاتف -->
          <v-col cols="12" md="6">
            <v-text-field v-model="form.street" label="الشارع" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.phone"
              label=" رقم تليفون العميل  "
              required
              hint="مثال: 010xxxxxxxx"
            />
          </v-col>

          <!-- اسم المتجر وطريقة الدفع -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.store_name"
              label="اسم المتجر (اختياري)"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.payment_method"
              :items="['cod']"
              label="طريقة الدفع"
              clearable
            />
          </v-col>

          <!-- صورة المتجر -->
          <v-col cols="12">
            <v-file-input
              label="صورة المتجر (banner)"
              accept="image/*"
              prepend-icon="mdi-image"
              required
              :show-size="true"
              @change="onFileChange"
              :clearable="true"
            />
          </v-col>

          <!-- معاينة الصورة -->
          <div v-if="previewImage" class="mt-2">
            <img
              :src="previewImage"
              width="150"
              loading="lazy"
              style="border-radius: 8px; object-fit: cover"
            />
          </div>

          <!-- زر الإرسال -->
          <v-col cols="12" class="text-center">
            <v-btn color="primary" type="submit" :loading="loading">
              إنشاء الطلب
            </v-btn>
          </v-col>
        </v-row>
      </v-form>

      <!-- ✅ عرض تفاصيل الطلب بعد الإنشاء -->
      <div v-else>
        <h3 class="mt-6 mb-4 text-h5 text-center">تفاصيل الطلب الجديد</h3>

        <v-card class="pa-4 mb-6" outlined>
          <v-list dense>
            <v-list-item>
              <v-list-item-title>رقم الطلب:</v-list-item-title>
              <v-list-item-subtitle>{{ createdOrder.id }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>العميل:</v-list-item-title>
              <v-list-item-subtitle>{{
                createdOrder.userorder?.name
              }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>الهاتف:</v-list-item-title>
              <v-list-item-subtitle>{{
                createdOrder.phone
              }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>العنوان:</v-list-item-title>
              <v-list-item-subtitle>
                {{ createdOrder.street }}، {{ createdOrder.city }}،
                {{ createdOrder.governorate }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>طريقة الدفع:</v-list-item-title>
              <v-list-item-subtitle>
                {{
                  createdOrder.payment_method === "cod"
                    ? "عند الاستلام"
                    : createdOrder.payment_method
                }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>إجمالي السعر:</v-list-item-title>
              <v-list-item-subtitle>
                {{ createdOrder.total_price }} ج
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- جدول المنتجات -->
        <v-table>
          <thead>
            <tr>
              <th>الصورة</th>
              <th>المنتج</th>
              <th>الكمية</th>
              <th>السعر</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in createdOrder.orderdetels" :key="item.id">
              <td>
                <img
                  :src="domin + item.product.img"
                  alt="product"
                  width="80"
                  loading="lazy"
                  height="80"
                  style="border-radius: 10px; object-fit: cover"
                />
              </td>
              <td>{{ item.product.titel }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ Math.ceil(item.product.price) }} ج</td>
            </tr>
          </tbody>
        </v-table>

        <!-- زر إنشاء طلب جديد -->
        <div class="text-center mt-6">
          <v-btn color="secondary" @click="resetForm">إنشاء طلب آخر</v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import { CartStore1 } from "@/store/Cart";
import { mystore } from "@/store/index";
import axios from "axios";
import { mapActions, mapState } from "pinia";

export default {
  name: "SellerCreateOrder",
  data() {
    return {
      customers: [],
      loading: false,
      total: [],
      loadingCustomers: false,
      alert: { show: false, type: "success", message: "" },
      createdOrder: null,
      itemurl: ["الرئيسية", "السلة", "الدفع"],
      previewImage: "",
      form: {
        user_id: "",
        city: "",
        governorate: "",
        street: "",
        phone: "",
        store_name: "",
        payment_method: "",
        store_banner: null,
      },
      // ✅ المحافظات والمدن
      governorates: {
        القاهرة: [
          "مدينة نصر",
          "المعادي",
          "حلوان",
          "الزمالك",
          "المقطم",
          "عين شمس",
          "حدائق القبة",
          "المهندسين",
          "العمرانية",
          "الدقي",
          "المعادي الجديدة",
          "المعادى القديمة",
        ],
        الجيزة: [
          "الهرم",
          "الجيزة",
          "الطالبية",
          "الوراق",
          "الدقي",
          "العجوزة",
          "العمرانية",
          "كرداسة",
          "أوسيم",
          "الحوامدية",
          "الصف",
          "البدرشين",
        ],
      },
    };
  },
  computed: {
    ...mapState(CartStore1, ["CartProduct2"]),
    ...mapState(mystore, ["CartData", "domin"]),
  },
  methods: {
    ...mapActions(CartStore1, [
      "GetCart",
      "delitem",
      "update",
      "GetCart2",
      "CartDelAll",
      "delitemAll",
    ]),
    ...mapActions(mystore, ["Cart"]),
    onFileChange(file) {
      if (!file || (Array.isArray(file) && file.length === 0)) {
        this.previewImage = "";
        this.form.store_banner = null;
        return;
      }
      const actualFile = Array.isArray(file) ? file[0] : file;
      if (!(actualFile instanceof Blob)) {
        this.previewImage = "";
        this.form.store_banner = null;
        return;
      }
      this.form.store_banner = actualFile;
      const reader = new FileReader();
      reader.onload = (e) => (this.previewImage = e.target.result);
      reader.readAsDataURL(actualFile);
    },
    async order2() {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      Object.entries(this.form).forEach(([key, value]) => {
        formData.append(key, value || "");
      });
      formData.append(
        "total_price",
        this.total.reduce((a, b) => a + b, 0)
      );

      try {
        if (this.CartProduct2.length) {
          const res = await axios.post(
            `${this.domin}orders/seller-create`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          this.CartDelAll();
          this.delitemAll();
          this.showAlert("success", "تم إنشاء الطلب بنجاح ✅");
        }
      } catch (err) {
        console.error(err.response?.data || err);
        alert("تأكد من  ادخال البيانات  بشكل صحيح");
      }
    },
    fun() {
      this.total = [];
      this.CartProduct2.forEach((el) => {
        let num = Math.ceil(el.product.price) * el.quantity;
        this.total.push(num);
      });
    },
    showAlert(type, message) {
      this.alert = { show: true, type, message };
      setTimeout(() => (this.alert.show = false), 4000);
    },
    async fetchCustomers() {
      this.loadingCustomers = true;
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${this.domin}seller/customers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.customers = res.data;
      } catch (err) {
        this.showAlert("error", "فشل تحميل العملاء");
      } finally {
        this.loadingCustomers = false;
      }
    },
    resetForm() {
      this.createdOrder = null;
      this.form = {
        user_id: "",
        city: "",
        governorate: "",
        street: "",
        phone: "",
        store_name: "",
        payment_method: "",
        store_banner: null,
      };
    },
  },
  async mounted() {
    await this.fetchCustomers();
    await this.Cart();
    await this.GetCart2();
    await this.fun();
  },
};
</script>

<style scoped>
.pa-6 {
  direction: rtl;
}
</style>
