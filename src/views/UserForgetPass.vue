<template>
  <div
    class="forgot-password-page d-flex align-center justify-center"
    dir="rtl"
  >
    <v-card class="pa-8 shadow-lg rounded-lg" width="500">
      <h2 class="text-center mb-6 font-weight-bold">نسيت كلمة المرور</h2>

      <!-- الخطوة 1: إدخال البريد أو الهاتف -->
      <form v-if="step === 1" @submit.prevent="getSecurityQuestion">
        <v-text-field
          v-model="emailOrPhone"
          label="البريد الإلكتروني أو رقم الهاتف"
          placeholder="example@email.com أو 01123456789"
          variant="outlined"
          prepend-inner-icon="mdi-account"
          class="mb-6"
        ></v-text-field>

        <div>
          <v-btn type="submit" color="primary"> متابعة </v-btn>
        </div>
      </form>

      <!-- الخطوة 2: عرض السؤال الأمني -->
      <form v-else-if="step === 2" @submit.prevent="resetPassword">
        <v-text-field
          v-model="security_answer"
          :label="security_question"
          placeholder="اكتب إجابتك"
          variant="outlined"
          class="mb-4"
        ></v-text-field>

        <v-text-field
          v-model="new_password"
          label="كلمة المرور الجديدة"
          type="password"
          variant="outlined"
          class="mb-4"
        ></v-text-field>

        <v-text-field
          v-model="new_password_confirmation"
          label="تأكيد كلمة المرور"
          type="password"
          variant="outlined"
          class="mb-4"
        ></v-text-field>

        <div class="d-flex justify-center mb-4">
          <v-btn type="submit" color="black" class="text-white square-btn">
            تحديث كلمة المرور
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
import { mapState } from "pinia";

export default {
  data() {
    return {
      step: 1, // 1 = إدخال بريد/هاتف, 2 = السؤال الأمني
      emailOrPhone: "",
      security_question: "",
      security_answer: "",
      new_password: "",
      new_password_confirmation: "",
      message: "",
      messageType: "error",
    };
  },
  computed: {
    ...mapState(mystore, ["domin"]),
  },
  methods: {
    async getSecurityQuestion() {
      try {
        const res = await axios.post(`${this.domin}security-question`, {
          identifier: this.emailOrPhone,
        });
        this.security_question = res.data.question;
        this.step = 2;
        this.message = "";
      } catch (err) {
        this.message = err.response?.data?.message || "حدث خطأ، حاول مرة أخرى";
        this.messageType = "error";
      }
    },

    async resetPassword() {
      try {
        await axios.post(`${this.domin}reset-password`, {
          identifier: this.emailOrPhone,
          security_answer: this.security_answer,
          new_password: this.new_password,
          new_password_confirmation: this.new_password_confirmation,
        });
        this.message = "تم تغيير كلمة المرور بنجاح ✅";
        this.messageType = "success";
        this.step = 1;
        this.emailOrPhone = "";
        this.security_answer = "";
        this.new_password = "";
        this.new_password_confirmation = "";
      } catch (err) {
        this.message =
          err.response?.data?.message || "حدث خطأ، تحقق من الإجابة";
        this.messageType = "error";
      }
    },
  },
};
</script>

<style scoped>
.forgot-password-page {
  height: 100vh;
  background: linear-gradient(135deg, #f8f9fa, #e3eaf1);
  font-family: "Cairo", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
}

.v-card {
  background-color: white;
  border-radius: 10px;
}

.square-btn {
  border-radius: 4px !important;
  font-weight: 600;
}
</style>
