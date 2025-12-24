<template>
  <div class="register-page d-flex align-center justify-center" dir="rtl">
    <v-card class="pa-8 shadow-lg rounded-lg" width="500">
      <h2 class="text-center mb-6 font-weight-bold">
        {{ showPhoneForm ? "إنشاء حساب جديد برقمك" : "إنشاء حساب جديد" }}
      </h2>

      <!-- زر طلب الموقع -->
      <v-btn
        color="primary"
        class="mb-4"
        @click="requestLocation"
        v-if="!latitude || !longitude"
      >
        اضغط هنا لمشاركة موقعك
      </v-btn>
      <p v-if="latitude && longitude" class="mb-4 text-center">
        الموقع مفعل: {{ latitude.toFixed(5) }}, {{ longitude.toFixed(5) }}
      </p>

      <!-- نموذج تسجيل الدخول / التسجيل برقم الهاتف -->
      <form v-if="showPhoneForm" @submit.prevent="registerPhone">
        <v-text-field
          v-model="name"
          label="الاسم كامل"
          placeholder="اكتب اسمك كامل"
          variant="outlined"
          prepend-inner-icon="mdi-account"
          class="mb-4"
        ></v-text-field>
        <v-text-field
          v-model="phone"
          label="رقم الهاتف"
          placeholder="مثلاً: 01123456789"
          type="tel"
          variant="outlined"
          prepend-inner-icon="mdi-cellphone"
          class="mb-4"
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="كلمة المرور"
          type="password"
          variant="outlined"
          prepend-inner-icon="mdi-lock"
          class="mb-6"
        />

        <!-- السؤال الأمني -->
        <v-text-field
          v-model="security_question"
          label="السوال الامني لاسترداد الحساب"
          placeholder="مثلاً: ما اسم مدرستك؟"
          variant="outlined"
          class="mb-4"
        />
        <v-text-field
          v-model="security_answer"
          label="إجابة السؤال الأمني"
          placeholder="اكتب إجابتك"
          variant="outlined"
          class="mb-4"
        />

        <!-- اختيار الدور -->
        <v-select
          v-model="role"
          :items="[
            { text: 'تاجر', value: 'customer' },
            { text: 'مندوب', value: 'seller' },
            { text: 'مورد', value: 'supplier' },
          ]"
          label="الدور"
          placeholder="اختر الدور"
          variant="outlined"
          class="mb-4"
          item-title="text"
          item-value="value"
        />

        <!-- حقول المندوب تظهر فقط لو الدور seller -->
        <template v-if="role === 'seller'">
          <v-text-field
            v-model="wallet_number"
            label="رقم المحفظة"
            placeholder="اكتب رقم المحفظة"
            variant="outlined"
            class="mb-4"
          />
          <v-file-input
            @change="onFileChange"
            label="صورة البطاقة الامامية"
            accept="image/*"
            variant="outlined"
            class="mb-4"
          />
          <v-file-input
            @change="onFileChange2"
            label="صورة البطاقة الخلفية"
            accept="image/*"
            variant="outlined"
            class="mb-4"
          />
        </template>

        <div class="d-flex justify-center mb-4">
          <v-btn
            type="submit"
            color="black"
            class="text-white square-btn"
            :disabled="!latitude || !longitude"
          >
            تسجيل الدخول
          </v-btn>
        </div>

        <v-divider class="my-6"></v-divider>

        <div class="text-center">
          <v-btn
            variant="outlined"
            color="primary"
            class="square-btn"
            @click="showPhoneForm = false"
          >
            إنشاء حساب جديد بالبريد الإلكتروني
          </v-btn>
        </div>
      </form>

      <!-- نموذج إنشاء حساب جديد -->
      <form v-else @submit.prevent="funregister">
        <v-text-field
          v-model="name"
          label="الاسم الأول"
          placeholder="اكتب اسمك الأول"
          variant="outlined"
          prepend-inner-icon="mdi-account"
          class="mb-4"
        />
        <v-text-field
          v-model="last_name"
          label="اسم العائلة"
          placeholder="اكتب اسم العائلة"
          variant="outlined"
          prepend-inner-icon="mdi-account"
          class="mb-4"
        />
        <v-text-field
          v-model="email"
          label="البريد الإلكتروني"
          placeholder="example@email.com"
          type="email"
          variant="outlined"
          prepend-inner-icon="mdi-email"
          class="mb-4"
        />
        <v-text-field
          v-model="password"
          label="كلمة المرور"
          type="password"
          variant="outlined"
          prepend-inner-icon="mdi-lock"
          class="mb-6"
        />

        <!-- السؤال الأمني -->
        <v-text-field
          v-model="security_question"
          label="السوال الامني لاسترداد الحساب"
          placeholder="مثلاً: ما اسم مدرستك؟"
          variant="outlined"
          class="mb-4"
        />
        <v-text-field
          v-model="security_answer"
          label="إجابة السؤال الأمني"
          placeholder="اكتب إجابتك"
          variant="outlined"
          class="mb-4"
        />

        <!-- اختيار الدور -->
        <v-select
          v-model="role"
          :items="[
            { text: 'تاجر', value: 'customer' },
            { text: 'مندوب', value: 'seller' },
            { text: 'مورد', value: 'supplier' },
          ]"
          label="الدور"
          placeholder="اختر الدور"
          variant="outlined"
          class="mb-4"
          item-title="text"
          item-value="value"
        />

        <!-- حقول المندوب تظهر فقط لو الدور seller -->
        <template v-if="role === 'seller'">
          <v-text-field
            v-model="wallet_number"
            label="رقم المحفظة"
            placeholder="اكتب رقم المحفظة"
            variant="outlined"
            class="mb-4"
          />
          <v-file-input
            @change="onFileChange"
            label="صورة البطاقة الامامية"
            accept="image/*"
            variant="outlined"
            class="mb-4"
          />
          <v-file-input
            @change="onFileChange2"
            label="صورة البطاقة الخلفية"
            accept="image/*"
            variant="outlined"
            class="mb-4"
          />
        </template>

        <div class="d-flex justify-center mb-4">
          <v-btn
            type="submit"
            color="black"
            class="text-white square-btn"
            :disabled="!latitude || !longitude"
          >
            تسجيل حساب
          </v-btn>
        </div>

        <v-divider class="my-6"></v-divider>

        <div class="text-center">
          <v-btn
            variant="outlined"
            color="secondary"
            class="square-btn"
            @click="showPhoneForm = true"
          >
            إنشاء حساب جديد برقم الهاتف
          </v-btn>
        </div>
      </form>

      <v-alert v-if="showLocationAlert" type="error" class="mt-4">
        يجب تفعيل الموقع قبل التسجيل!
      </v-alert>
    </v-card>

    <!-- ✅ تنبيه عند الإرسال -->
    <v-snackbar v-model="snackbar" timeout="4000" color="darkgold" top>
      {{ massage }}
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
import { mystore } from "@/store";
import { mapState } from "pinia";

export default {
  data() {
    return {
      email: "",
      password: "",
      last_name: "",
      name: "",
      phone: "",
      showPhoneForm: true,

      latitude: null,
      longitude: null,
      showLocationAlert: false,
      security_question: "",
      security_answer: "",
      role: "",
      wallet_number: "",
      front_id_image: null,
      back_id_image: null,
      showimg: "",
      active: false,
      massage: "",
      snackbar: false,
    };
  },
  computed: {
    ...mapState(mystore, ["domin", "token"]),
  },
  methods: {
    onFileChange(files) {
      this.front_id_image = files && files.length ? files[0] : null;
    },
    onFileChange2(files) {
      this.back_id_image = files && files.length ? files[0] : null;
    },
    requestLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this.showLocationAlert = false;
          },
          () => (this.showLocationAlert = true),
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        alert("المتصفح لا يدعم خدمة الموقع الجغرافي");
      }
    },
    async funregister() {
      if (!this.latitude || !this.longitude) {
        this.showLocationAlert = true;
        return;
      }
      this.active = true;
      const token = localStorage.getItem("token");
      let formData = new FormData();
      formData.append("name", this.name);
      formData.append("last_name", this.last_name);
      formData.append("email", this.email);
      formData.append("password", this.password);
      formData.append("latitude", this.latitude);
      formData.append("longitude", this.longitude);
      formData.append("security_question", this.security_question);
      formData.append("security_answer", this.security_answer);
      formData.append("role", this.role);
      if (this.role === "seller") {
        formData.append("wallet_number", this.wallet_number);
        if (this.front_id_image)
          formData.append("front_id_image", this.front_id_image);
        if (this.back_id_image)
          formData.append("back_id_image", this.back_id_image);
      }
      try {
        const res = await axios.post(`${this.domin}register`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        this.massage = "تم التسجيل بنجاح";
        this.snackbar = true;
        localStorage.setItem("token", res.data.token);
        this.$router.push("/");
      } catch (err) {
        console.error(err.response?.data || err);
        this.massage = "حدث خطاء ما حاول تسجيل من مكان تاني";
        this.snackbar = true;
        this.active = false;
      }
    },
    async registerPhone() {
      if (!this.latitude || !this.longitude) {
        this.showLocationAlert = true;
        return;
      }
      this.active = true;
      const token = localStorage.getItem("token");
      let formData = new FormData();
      formData.append("phone", this.phone);
      formData.append("name", this.name);
      formData.append("password", this.password);
      formData.append("latitude", this.latitude);
      formData.append("longitude", this.longitude);
      formData.append("security_question", this.security_question);
      formData.append("security_answer", this.security_answer);
      formData.append("role", this.role);
      if (this.role === "seller") {
        formData.append("wallet_number", this.wallet_number);
        if (this.front_id_image)
          formData.append("front_id_image", this.front_id_image);
        if (this.back_id_image)
          formData.append("back_id_image", this.back_id_image);
      }
      try {
        const res = await axios.post(`${this.domin}register-phone`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        this.massage = "تم التسجيل بنجاح";
        this.snackbar = true;
        localStorage.setItem("token", res.data.token);
        this.$router.push("/");
      } catch (err) {
        console.error(err.response?.data || err);
        this.massage = "حدث خطاء ما حاول تسجيل من مكان تاني";
        this.snackbar = true;
        this.active = false;
      }
    },
  },
};
</script>
