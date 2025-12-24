<template>
  <v-container class="pa-6" style="max-width: 500px; margin: auto">
    <v-card>
      <v-card-title class="text-h5">إعادة تعيين كلمة المرور</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="security_question"
            :label="security_question"
            placeholder="اكتب سوال زي كام عمرك لاعاده تعين كلمه المرور فيما بعد"
            variant="outlined"
            class="mb-4"
          ></v-text-field>
          <v-text-field
            v-model="security_answer"
            :label="security_answer"
            placeholder="اكتب إجابتك"
            variant="outlined"
            class="mb-4"
          ></v-text-field>
          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="كلمة المرور الجديدة"
            :rules="[rules.required, rules.min]"
            append-icon="mdi-eye"
            @click:append="showPassword = !showPassword"
            required
          ></v-text-field>

          <v-text-field
            v-model="password_confirmation"
            :type="showPassword ? 'text' : 'password'"
            label="تأكيد كلمة المرور"
            :rules="[rules.required, matchPassword]"
            append-icon="mdi-eye"
            @click:append="showPassword = !showPassword"
            required
          ></v-text-field>

          <v-btn
            :disabled="!valid || loading"
            color="primary"
            class="mt-4"
            @click="submit"
          >
            إعادة التعيين
          </v-btn>
        </v-form>

        <v-alert v-if="error" type="error" class="mt-4" dense outlined>
          {{ error }}
        </v-alert>

        <v-alert v-if="success" type="success" class="mt-4" dense outlined>
          {{ success }}
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import { mapState, mapActions } from "pinia";
import { mystore } from "@/store";
export default {
  name: "ResetPassword",
  data() {
    return {
      password: "",
      password_confirmation: "",
      showPassword: false,
      valid: false,
      security_question: "",
      security_answer: "",
      loading: false,
      error: null,
      success: null,
      rules: {
        required: (v) => !!v || "هذا الحقل مطلوب",
        min: (v) => v.length >= 6 || "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
      },
    };
  },
  computed: {
    ...mapState(mystore, ["domin"]),

    matchPassword() {
      return (v) => v === this.password || "تأكيد كلمة المرور لا يطابق";
    },
    token() {
      return this.$route.query.token || null;
    },
    phone() {
      return this.$route.query.phone || null;
    },
  },
  methods: {
    async submit() {
      this.error = null;
      this.success = null;

      if (!this.token || !this.phone) {
        this.error = "الرابط غير صالح أو منتهي";
        return;
      }

      this.loading = true;
      try {
        const response = await axios.post(`${this.domin}resetpassword`, {
          token: this.token,
          identifier: this.phone,
          phone: this.phone,
          password: this.password,
          new_password_confirmation: this.password_confirmation,
          new_password: this.password,
          security_question: this.security_question,
          security_answer: this.security_answer,
        });
        this.success =
          response.data.message || "تم اعاده تعين كلمه المرور و تسجيل الدخول";
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("user_role", "customer");
        this.$router.push("/");
      } catch (err) {
        this.error =
          err.response?.data?.message || "حدث خطأ أثناء إعادة التعيين";
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
