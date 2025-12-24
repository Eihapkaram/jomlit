<template>
  <div class="pa-6">
    <v-card class="pa-4" elevation="3">
      <h2 class="mb-4">تحديث إعدادات الموقع</h2>

      <!-- الفورم للتحديث فقط -->
      <v-form @submit.prevent="UpdateSettings" ref="form">
        <!-- عرض شعار الموقع -->
        <div v-if="logoPreview" class="mb-4 text-center">
          <img
            :src="logoPreview"
            width="150"
            class="rounded"
            alt="Logo Preview"
          />
        </div>

        <v-file-input
          v-model="logo"
          label="رفع الشعار (Logo)"
          prepend-icon="mdi-image"
          accept="image/*"
          outlined
          show-size
          @update:modelValue="onFileChange"
        />

        <!-- عرض التوقيع -->
        <div v-if="signaturePreview" class="mb-4 text-center">
          <img
            :src="signaturePreview"
            width="150"
            class="rounded"
            alt="Signature Preview"
          />
        </div>

        <v-file-input
          v-model="signature"
          label="رفع التوقيع (Signature)"
          prepend-icon="mdi-signature"
          accept="image/*"
          outlined
          show-size
          @update:modelValue="onFileChange2"
        />

        <!-- الحقول الجديدة -->
        <v-text-field v-model="site_name" label="اسم الموقع" outlined />
        <v-text-field v-model="location" label="العنوان" outlined />
        <v-text-field v-model="email" label="البريد الإلكتروني" outlined />
        <v-text-field v-model="facebook" label="Facebook" outlined />
        <v-text-field v-model="instgrame" label="Instagram" outlined />
        <v-text-field v-model="twiter" label="Twitter" outlined />
        <v-text-field v-model="whatsApp" label="WhatsApp" outlined />
        <v-text-field v-model="phone1" label="الهاتف 1" outlined />
        <v-text-field v-model="phone2" label="الهاتف 2" outlined />
        <v-text-field v-model="hotphone" label="الخط الساخن" outlined />

        <v-btn type="submit" :loading="loading" color="primary" class="mt-4">
          تحديث الإعدادات
        </v-btn>
      </v-form>
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
      loading: false,
      site_name: "",
      logo: null,
      signature: null,
      logoPreview: null,
      signaturePreview: null,
      email: "",
      facebook: "",
      instgrame: "",
      twiter: "",
      location: "",
      whatsApp: "",
      phone1: "",
      phone2: "",
      hotphone: "",
    };
  },
  computed: {
    ...mapState(mystore, ["domin"]),
  },
  mounted() {
    this.fetchSettings();
  },
  methods: {
    onFileChange(file) {
      const f = Array.isArray(file) ? file[0] : file;
      if (!f) return;
      this.logo = f;
      this.logoPreview = null;
      const reader = new FileReader();
      reader.onload = (e) => (this.logoPreview = e.target.result);
      reader.readAsDataURL(f);
    },

    onFileChange2(file) {
      const f = Array.isArray(file) ? file[0] : file;
      if (!f) return;
      this.signature = f;
      this.signaturePreview = null;
      const reader = new FileReader();
      reader.onload = (e) => (this.signaturePreview = e.target.result);
      reader.readAsDataURL(f);
    },

    async UpdateSettings() {
      this.loading = true;
      const token = localStorage.getItem("token");

      try {
        const formData = new FormData();
        formData.append("site_name", this.site_name || "");
        formData.append("email", this.email || "");
        formData.append("location", this.location || "");
        formData.append("facebook", this.facebook || "");
        formData.append("instgrame", this.instgrame || "");
        formData.append("twiter", this.twiter || "");
        formData.append("whatsApp", this.whatsApp || "");
        formData.append("phone1", this.phone1 || "");
        formData.append("phone2", this.phone2 || "");
        formData.append("hotphone", this.hotphone || "");
        if (this.logo) formData.append("logo", this.logo);
        if (this.signature) formData.append("signature", this.signature);

        const res = await axios.post(
          `${this.domin}dashboard/settings/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        this.$toast?.success(res.data.message || "تم تحديث الإعدادات بنجاح");
      } catch (error) {
        console.error("خطأ أثناء تحديث الإعدادات:", error);
        this.$toast?.error(
          error.response?.data?.message || "فشل تحديث الإعدادات"
        );
      } finally {
        this.loading = false;
      }
    },

    async fetchSettings() {
      try {
        const res = await axios.get(`${this.domin}settings`);
        const data = res.data.settings || {};

        this.site_name = data.site_name || "";
        this.email = data.email || "";
        this.location = data.location || "";
        this.facebook = data.facebook || "";
        this.instgrame = data.instgrame || "";
        this.twiter = data.twiter || "";
        this.whatsApp = data.whatsApp || "";
        this.phone1 = data.phone1 || "";
        this.phone2 = data.phone2 || "";
        this.hotphone = data.hotphone || "";

        const baseUrl = this.domin.replace("/api/", "/");
        this.logoPreview = data.logo ? `${baseUrl}storage/${data.logo}` : null;
        this.signaturePreview = data.signature
          ? `${baseUrl}storage/${data.signature}`
          : null;
      } catch (error) {
        console.error("خطأ أثناء جلب الإعدادات:", error);
      }
    },
  },
};
</script>

<style scoped>
img {
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
}
</style>
