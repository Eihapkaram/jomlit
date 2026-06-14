<template>
  <div class="login-page d-flex align-center justify-center" dir="rtl">
    <v-card class="pa-8 shadow-lg rounded-lg" width="500">
      <h2 class="text-center mb-6 font-weight-bold">
        {{
          showPhoneForm
            ? "تسجيل الدخول برقم الهاتف"
            : "تسجيل الدخول بالبريد الإلكتروني"
        }}
      </h2>
      <span style="margin: auto; font-weight: bold; color: #777">
        ليس لديك حساب
        <router-link style="color: blue" :to="{ name: 'register' }">
          انشاء حساب
        </router-link>
      </span>
      <br />

      <!-- ✅ نموذج تسجيل الدخول برقم الهاتف -->
      <form v-if="showPhoneForm" @submit.prevent="this.funloginphone()">
        <v-text-field
          v-model="phone"
          label="رقم الهاتف"
          placeholder="مثلاً: 01123456789"
          name="phone"
          variant="outlined"
          prepend-inner-icon="mdi-cellphone"
          class="mb-4"
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="كلمة المرور"
          placeholder="اكتب كلمة المرور"
          name="password"
          type="password"
          variant="outlined"
          prepend-inner-icon="mdi-lock"
          class="mb-6"
        ></v-text-field>

        <div class="d-flex justify-center">
          <v-btn
            type="submit"
            color="black"
            style="align-content: center"
            class="text-white px-10 py-5 square-btn"
          >
            تسجيل الدخول
          </v-btn>
        </div>
        <router-link style="color: blue" :to="{ name: 'forget' }">
          نسيت كلمه المرور
        </router-link>
        <v-divider class="my-6"></v-divider>

        <div class="text-center">
          <v-btn
            variant="outlined"
            color="primary"
            class="square-btn"
            @click="showPhoneForm = false"
          >
            تسجيل بالبريد الإلكتروني
          </v-btn>
        </div>
      </form>

      <!-- ✅ نموذج تسجيل الدخول بالبريد الإلكتروني -->
      <form v-else @submit.prevent="this.funlogin()">
        <v-text-field
          v-model="email"
          label="البريد الإلكتروني"
          placeholder="example@email.com"
          name="email"
          type="email"
          variant="outlined"
          prepend-inner-icon="mdi-email"
          class="mb-4"
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="كلمة المرور"
          placeholder="اكتب كلمة المرور"
          name="password"
          type="password"
          variant="outlined"
          prepend-inner-icon="mdi-lock"
          class="mb-6"
        ></v-text-field>

        <div class="d-flex justify-center">
          <v-btn
            type="submit"
            color="black"
            style="align-content: center"
            class="text-white px-10 py-5 square-btn"
          >
            تسجيل الدخول
          </v-btn>
        </div>
        <router-link style="color: blue" :to="{ name: 'forget' }">
          نسيت كلمه المرور
        </router-link>
        <v-divider class="my-6"></v-divider>

        <div class="text-center">
          <v-btn
            variant="outlined"
            color="secondary"
            class="square-btn"
            @click="showPhoneForm = true"
          >
            تسجيل برقم الهاتف
          </v-btn>
        </div>
      </form>
      <!-- عرض رسالة -->
      <v-alert v-if="message" :type="messageType" class="mt-4">
        {{ message }}
      </v-alert>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import { mystore } from "@/store";
import { mapState, mapActions } from "pinia";

export default {
  data() {
    return {
      email: "",
      password: "",
      phone: "",
      showPhoneForm: true,

      message: "",
      messageType: "error",

      // 🔐 security additions
      submitting: false,
      lastSubmitTime: 0,
    };
  },

  computed: {
    ...mapState(mystore, ["domin"]),
  },

  methods: {
    ...mapActions(mystore, ["login"]),

    // ================= 🔐 SECURITY HELPERS =================

    sanitize(val) {
      if (!val) return "";
      return String(val).trim().replace(/\s+/g, " ").replace(/[<>]/g, ""); // منع basic injection
    },

    canSubmit() {
      const now = Date.now();
      if (now - this.lastSubmitTime < 2000) return false; // منع spam clicks
      this.lastSubmitTime = now;
      return true;
    },

    isWeakPassword(pwd) {
      return !pwd || pwd.length < 6;
    },

    // ================= EMAIL LOGIN =================

    async funlogin() {
      if (this.submitting) return;
      if (!this.canSubmit()) return;

      this.submitting = true;

      try {
        const email = this.sanitize(this.email);

        if (this.isWeakPassword(this.password)) {
          this.message = "كلمة المرور ضعيفة";
          this.messageType = "error";
          return;
        }

        const res = await axios.post(`${this.domin}login`, {
          email,
          password: this.password,
        });

        this.login(res.data.token, "customer");
        this.$router.push("/");
      } catch (err) {
        this.message = err.response?.data?.message || "حدث خطأ، حاول مرة أخرى";
        this.messageType = "error";
      } finally {
        this.submitting = false;
      }
    },

    // ================= PHONE LOGIN =================

    async funloginphone() {
      if (this.submitting) return;
      if (!this.canSubmit()) return;

      this.submitting = true;

      try {
        const phone = this.sanitize(this.phone);

        if (this.isWeakPassword(this.password)) {
          this.message = "كلمة المرور ضعيفة";
          this.messageType = "error";
          return;
        }

        const res = await axios.post(`${this.domin}login-phone`, {
          phone,
          password: this.password,
        });

        this.login(res.data.token, "customer");
        this.$router.push("/");
      } catch (err) {
        this.message = err.response?.data?.message || "حدث خطأ، حاول مرة أخرى";
        this.messageType = "error";
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  height: 100vh;
  background: linear-gradient(135deg, #f8f9fa, #e3eaf1);
  direction: rtl;
  font-family: "Cairo", sans-serif;
}

.v-card {
  background-color: white;
  border-radius: 10px;
}

.v-text-field,
.v-btn {
  text-align: right;
}

.square-btn {
  border-radius: 4px !important;
  font-weight: 600;
}
</style>
