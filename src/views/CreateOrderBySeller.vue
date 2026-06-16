<template>
  <div>
    <v-card>
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

      <v-alert
        v-if="alert.show"
        :type="alert.type"
        closable
        class="mb-4"
        @click:close="alert.show = false"
      >
        {{ alert.message }}
      </v-alert>

      <v-form
        ref="orderForm"
        @submit.prevent="handleSubmit"
        v-if="!createdOrder"
      >
        <v-row>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.user_id"
              :items="customers"
              item-title="name"
              item-value="id"
              label="اختر العميل"
              :rules="[(v) => !!v || 'يجب اختيار العميل']"
              required
              :loading="loadingCustomers"
              clearable
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="form.governorate"
              :items="Object.keys(governorates)"
              label="المحافظة"
              :rules="[(v) => !!v || 'المحافظة مطلوبة']"
              required
              @update:modelValue="form.city = ''"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="form.city"
              :items="governorates[form.governorate] || []"
              label="المدينة"
              :disabled="!form.governorate"
              :rules="[(v) => !!v || 'المدينة مطلوبة']"
              required
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model.trim="form.street"
              label="الشارع"
              :rules="[(v) => !!v || 'اسم الشارع مطلوب']"
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model.trim="form.phone"
              label="رقم تليفون العميل"
              :rules="[
                (v) => !!v || 'رقم الهاتف مطلوب',
                (v) =>
                  /^(010|011|012|015)[0-9]{8}$/.test(v) ||
                  'برجاء إدخال رقم هاتف مصري صحيح مكون من 11 رقم',
              ]"
              required
              hint="مثال: 010xxxxxxxx"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model.trim="form.store_name"
              label="اسم المتجر (اختياري)"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.payment_method"
              :items="['cod']"
              label="طريقة الدفع"
              :rules="[(v) => !!v || 'طريقة الدفع مطلوبة']"
              required
              clearable
            />
          </v-col>

          <v-col cols="12">
            <v-file-input
              label="صورة المتجر (banner)"
              accept="image/*"
              prepend-icon="mdi-image"
              :rules="[(v) => !!v || 'صورة المتجر مطلوبة']"
              required
              :show-size="true"
              :clearable="true"
              @update:modelValue="onFileChange"
            />
          </v-col>

          <div v-if="previewImage" class="mt-2">
            <img
              :src="previewImage"
              width="150"
              loading="lazy"
              style="border-radius: 8px; object-fit: cover"
            />
          </div>

          <v-col cols="12" class="text-center">
            <v-btn color="primary" type="submit" :loading="loading">
              إنشاء الطلب
            </v-btn>
          </v-col>
        </v-row>
      </v-form>

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

    // 🔄 دالة ضغط وتصغير الصور داخلياً
    compressImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.7) {
      return new Promise((resolve, reject) => {
        if (!file) return resolve(null);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
              }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                if (!blob) return reject(new Error("Canvas empty"));
                const compressedFile = new File([blob], file.name, {
                  type: file.type || "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              },
              file.type || "image/jpeg",
              quality
            );
          };
          img.onload.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
      });
    },

    async onFileChange(file) {
      console.log("banner =>", file);

      if (!file) {
        this.previewImage = "";
        this.form.store_banner = null;
        return;
      }

      let rawFile;
      // لو Array (بعض مكونات الـ Vuetify القديمة أو الإعدادات الخاصة تعيد مصفوفة)
      if (Array.isArray(file)) {
        rawFile = file[0];
      } else {
        rawFile = file;
      }

      // ⚡ تطبيق عملية الضغط فوراً قبل إضافتها للـ state
      try {
        const compressed = await this.compressImage(rawFile);
        this.form.store_banner = compressed;
      } catch (error) {
        console.error("خطأ أثناء ضغط صورة المتجر:", error);
        this.form.store_banner = rawFile; // حماية في حال فشل الضغط لأي سبب
      }

      // إنشاء رابط للمعاينة (Preview)
      this.previewImage = URL.createObjectURL(this.form.store_banner);

      console.log("final compressed file =>", this.form.store_banner);
    },

    async handleSubmit() {
      const { valid } = await this.$refs.orderForm.validate();
      if (valid) {
        this.order2();
      } else {
        this.showAlert("error", "برجاء ملء الحقول المطلوبة بشكل صحيح");
      }
    },
    async order2() {
      const token = localStorage.getItem("token");
      this.loading = true;

      const formData = new FormData();

      formData.append("user_id", this.form.user_id);
      formData.append("city", this.form.city);
      formData.append("governorate", this.form.governorate);
      formData.append("street", this.form.street);
      formData.append("phone", this.form.phone);
      formData.append("store_name", this.form.store_name || "");
      formData.append("payment_method", this.form.payment_method || "cod");

      // ✅ الصورة المضغوطة
      if (this.form.store_banner instanceof File) {
        formData.append("store_banner", this.form.store_banner);
      }

      formData.append(
        "total_price",
        this.total.reduce((a, b) => a + b, 0),
      );

      try {
        if (this.CartProduct2.length) {
          const res = await axios.post(
            `${this.domin}orders/seller-create`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            },
          );

          console.log(res.data);

          this.createdOrder = res.data.order;

          this.CartDelAll();
          this.delitemAll();

          this.showAlert("success", "تم إنشاء الطلب بنجاح ✅");
        }
      } catch (err) {
        console.log(err.response?.data || err);

        this.showAlert("error", "تأكد من إدخال البيانات بشكل صحيح");
      } finally {
        this.loading = false;
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