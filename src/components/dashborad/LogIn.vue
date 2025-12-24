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
      showPhoneForm: true, // ✅ الافتراضي تسجيل برقم الهاتف
      message: "",
      messageType: "error",
    };
  },
  computed: {
    ...mapState(mystore, ["domin"]),
  },
  methods: {
    ...mapActions(mystore,["login"]),
    funlogin() {
      axios
        .post(`${this.domin}`, {
          email: this.email,
          password: this.password,
        })
        .then((res) => {
           this.login(res.data.token,"customer")
          this.$router.push("/");
          console.log(res);
        })
        .catch((err) => console.log(err));
      this.message = err.response?.data?.message || "حدث خطأ، حاول مرة أخرى";
      this.messageType = "error";
    },
    funloginphone() {
      axios
        .post(`${this.domin}login-phone`, {
          phone: this.phone,
          password: this.password,
        })
        .then((res) => {
            this.login(res.data.token,"customer")
          this.$router.push("/");
          console.log(res);
        })
        .catch((err) => console.log(err));
      this.message = err.response?.data?.message || "حدث خطأ، حاول مرة أخرى";
      this.messageType = "error";
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
