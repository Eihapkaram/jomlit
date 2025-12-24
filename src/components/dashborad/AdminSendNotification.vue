<template>
  <v-container class="py-10" dir="rtl">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="rounded-xl shadow-lg pa-6">
          <v-card-title class="text-h6 font-weight-bold text-darkgold">
            إرسال إشعار للمستخدمين
          </v-card-title>

          <v-divider class="my-4"></v-divider>

          <!-- ✅ نموذج الإرسال -->
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="title"
              label="عنوان الإشعار"
              variant="outlined"
              color="darkgold"
              :rules="[(v) => !!v || 'العنوان مطلوب']"
              required
            ></v-text-field>

            <v-textarea
              v-model="message"
              label="محتوى الإشعار"
              variant="outlined"
              color="darkgold"
              rows="4"
              :rules="[(v) => !!v || 'المحتوى مطلوب']"
              required
            ></v-textarea>

            <!-- ✅ اختيار مستخدم محدد -->
            <v-select
              v-model="selectedUser"
              :items="users"
              item-title="name"
              item-value="id"
              label="إرسال إلى مستخدم محدد (اختياري)"
              variant="outlined"
              color="darkgold"
              clearable
            ></v-select>

            <v-divider class="my-4"></v-divider>

            <v-card-actions class="justify-space-between">
              <v-btn
                color="#c79a00"
                variant="flat"
                @click="sendNotification"
                :loading="loading"
              >
                <v-icon start>mdi-bell-ring-outline</v-icon>
                إرسال الإشعار
              </v-btn>

              <v-btn color="grey" variant="text" @click="resetForm">
                مسح الحقول
              </v-btn>
            </v-card-actions>
          </v-form>

          <!-- ✅ تنبيه عند الإرسال -->
          <v-snackbar v-model="snackbar" timeout="4000" color="darkgold" top>
            {{ snackbarMessage }}
          </v-snackbar>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { mystore } from "@/store";
import { mapActions, mapState } from "pinia";

export default {
  name: "AdminSendNotification",
  data() {
    return {
      valid: false,
      title: "",
      message: "",
      selectedUser: null,
      users: [],
      loading: false,
      snackbar: false,
      snackbarMessage: "",
    };
  },
  computed: {
    ...mapState(mystore, ["domin", "user"]),
  },
  methods: {
    ...mapActions(mystore, ["Users"]),

    async sendNotification() {
      const token = localStorage.getItem("token");
      if (!this.$refs.form.validate()) return;
      this.loading = true;

      try {
        const res = await axios.post(
          `${this.domin}dashboard/notifications/send`,
          {
            title: this.title,
            message: this.message,
            user_id: this.selectedUser,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        this.snackbarMessage = res.data.message;
        this.snackbar = true;
        this.resetForm();
      } catch (err) {
        this.snackbarMessage =
          err.response?.data?.message || "حدث خطأ أثناء الإرسال ❌";
        this.snackbar = true;
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.title = "";
      this.message = "";
      this.selectedUser = null;
      this.$refs.form.resetValidation();
    },
  },
  async mounted() {
    window.scrollTo(0, 0);
    await this.Users();
    this.users = this.user;
  },
};
</script>

<style scoped>
.text-darkgold {
  color: #c79a00;
}
</style>
