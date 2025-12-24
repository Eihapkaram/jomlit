<template>
  <v-container class="pa-6">
    <v-card class="pa-6" elevation="3" max-width="500" mx-auto>
      <h2 class="text-h6 mb-4">تغيير كلمة المرور</h2>

      <v-form @submit.prevent="changePassword">
        <v-text-field
          v-model="form.current_password"
          label="كلمة المرور الحالية"
          type="password"
          required
        />
        <v-text-field
          v-model="form.new_password"
          label="كلمة المرور الجديدة"
          type="password"
          required
        />
        <v-text-field
          v-model="form.new_password_confirmation"
          label="تأكيد كلمة المرور الجديدة"
          type="password"
          required
        />

        <v-btn type="submit" color="primary" class="mt-4" :loading="loading">
          حفظ التغيير
        </v-btn>
      </v-form>

      <v-alert
        v-if="alert.show"
        :type="alert.type"
        class="mt-4"
        @click:close="alert.show = false"
        closable
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
      form: {
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      },
      alert: { show: false, type: "success", message: "" },
      loading: false,
    };
  },
  computed: {
    ...mapState(mystore, ["domin"]),
  },
  methods: {
    async changePassword() {
      const token = localStorage.getItem("token");
      this.loading = true;
      try {
        const res = await axios.post(
          `${this.domin}user/change-password`,
          this.form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.alert = { show: true, type: "success", message: res.data.message };
        this.form = {
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        };
      } catch (err) {
        this.alert = {
          show: true,
          type: "error",
          message: err.response?.data?.message || "حدث خطأ أثناء التغيير",
        };
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
