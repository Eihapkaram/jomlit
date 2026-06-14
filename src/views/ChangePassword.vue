<template>
  <v-container class="pa-6">
    <v-card class="pa-6 mx-auto" elevation="3" max-width="500">
      <h2 class="text-h6 mb-4">تغيير كلمة المرور</h2>

      <v-form ref="form" v-model="valid" @submit.prevent="changePassword">
        <!-- الحالية -->

        <v-text-field
          v-model.trim="form.current_password"
          label="كلمة المرور الحالية"
          :type="showCurrent ? 'text' : 'password'"
          :append-inner-icon="showCurrent ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showCurrent = !showCurrent"
          autocomplete="current-password"
          maxlength="100"
          counter
          :rules="[rules.required]"
        />

        <!-- الجديدة -->

        <v-text-field
          v-model.trim="form.new_password"
          label="كلمة المرور الجديدة"
          :type="showNew ? 'text' : 'password'"
          :append-inner-icon="showNew ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showNew = !showNew"
          autocomplete="new-password"
          maxlength="100"
          counter
          :rules="[rules.required, rules.password]"
        />

        <!-- التأكيد -->

        <v-text-field
          v-model.trim="form.new_password_confirmation"
          label="تأكيد كلمة المرور الجديدة"
          :type="showConfirm ? 'text' : 'password'"
          :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showConfirm = !showConfirm"
          autocomplete="new-password"
          maxlength="100"
          counter
          @paste.prevent
          @copy.prevent
          :rules="[rules.required, rules.confirm]"
        />

        <v-btn
          type="submit"
          color="primary"
          class="mt-4"
          :loading="loading"
          :disabled="loading"
          block
        >
          حفظ التغيير
        </v-btn>
      </v-form>

      <v-alert
        v-if="alert.show"
        :type="alert.type"
        class="mt-4"
        closable
        @click:close="alert.show = false"
      >
        {{ alert.message }}
      </v-alert>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import { mapState } from "pinia";
import { mystore } from "@/store";

export default {
  name: "ChangePassword",

  data() {
    return {
      valid: true,

      loading: false,

      showCurrent: false,
      showNew: false,
      showConfirm: false,

      form: {
        current_password: "",

        new_password: "",

        new_password_confirmation: "",
      },

      alert: {
        show: false,

        type: "success",

        message: "",
      },

      rules: {
        required: (v) => !!v || "هذا الحقل مطلوب",

        password: (v) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).{8,100}$/.test(v) ||
          "يجب أن تحتوي كلمة المرور على حرف كبير وصغير ورقم ورمز و8 أحرف على الأقل",

        confirm: (v) =>
          v === this.form.new_password || "كلمتا المرور غير متطابقتين",
      },
    };
  },

  computed: {
    ...mapState(mystore, ["domin"]),
  },

  methods: {
    async changePassword() {
      if (this.loading) return;

      const { valid } = await this.$refs.form.validate();

      if (!valid) return;

      const token = localStorage.getItem("token");

      if (!token) {
        this.alert = {
          show: true,

          type: "error",

          message: "يرجى تسجيل الدخول مرة أخرى.",
        };

        return;
      }

      this.form.current_password = this.form.current_password.trim();

      this.form.new_password = this.form.new_password.trim();

      this.form.new_password_confirmation =
        this.form.new_password_confirmation.trim();

      if (this.form.current_password === this.form.new_password) {
        this.alert = {
          show: true,

          type: "warning",

          message: "يجب أن تكون كلمة المرور الجديدة مختلفة عن الحالية.",
        };

        return;
      }

      if (this.form.new_password !== this.form.new_password_confirmation) {
        this.alert = {
          show: true,

          type: "error",

          message: "كلمتا المرور غير متطابقتين.",
        };

        return;
      }

      this.loading = true;

      try {
        const res = await axios.post(
          `${this.domin}user/change-password`,

          this.form,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        this.alert = {
          show: true,

          type: "success",

          message: res.data.message,
        };

        this.form = {
          current_password: "",

          new_password: "",

          new_password_confirmation: "",
        };
      } catch (err) {
        this.alert = {
          show: true,

          type: "error",

          message:
            err.response?.data?.message || "حدث خطأ أثناء تغيير كلمة المرور.",
        };
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
