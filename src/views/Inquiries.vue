<template>
  <v-container class="pa-6">
    <h1 class="text-h4 font-weight-bold mb-4 text-center">الاستفسارات</h1>

    <p class="text-center mb-6">
      يمكنك إرسال استفسارك عن أي منتج أو خدمة عبر النموذج التالي.
    </p>

    <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
      <!-- الاسم -->

      <v-text-field
        v-model.trim="name"
        label="الاسم"
        :rules="[rules.required, rules.name]"
        maxlength="50"
        counter
        outlined
      />

      <!-- البريد -->

      <v-text-field
        v-model.trim="email"
        label="البريد الإلكتروني"
        placeholder="example@email.com"
        type="email"
        :rules="[rules.email]"
        maxlength="100"
        counter
        outlined
      />

      <div class="text-center my-2">أو</div>

      <!-- الهاتف -->

      <v-text-field
        v-model.trim="phone"
        label="رقم الهاتف"
        placeholder="01012345678"
        type="tel"
        :rules="[rules.phone]"
        maxlength="11"
        counter
        outlined
      />

      <!-- الرسالة -->

      <v-textarea
        v-model.trim="massege"
        label="رسالتك"
        :rules="[rules.required, rules.message]"
        maxlength="1000"
        counter
        auto-grow
        outlined
      />

      <v-alert v-if="errorMessage" type="error" class="mt-3" density="compact">
        {{ errorMessage }}
      </v-alert>

      <v-btn
        type="submit"
        color="primary"
        class="mt-4"
        :loading="loading"
        :disabled="loading"
        block
      >
        إرسال
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { mystore } from "@/store";

export default {
  data() {
    return {
      valid: false,

      loading: false,

      errorMessage: "",

      name: "",

      email: "",

      massege: "",

      phone: "",

      rules: {
        required: (v) => !!v || "هذا الحقل مطلوب",

        name: (v) =>
          /^[\u0600-\u06FFa-zA-Z\s]{3,50}$/.test(v) || "الاسم غير صحيح",

        email: (v) =>
          !v ||
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
          "البريد الإلكتروني غير صحيح",

        phone: (v) =>
          !v || /^(01)[0125][0-9]{8}$/.test(v) || "رقم الهاتف غير صحيح",

        message: (v) =>
          (v && v.length >= 10 && v.length <= 1000) ||
          "الرسالة يجب أن تكون بين 10 و1000 حرف",
      },
    };
  },

  computed: {
    ...mapState(mystore, ["settings"]),
  },

  methods: {
    ...mapActions(mystore, ["siteinformition", "Addinquiries"]),

    async submitForm() {
      this.errorMessage = "";

      const { valid } = await this.$refs.form.validate();

      if (!valid) return;

      if (!this.email && !this.phone) {
        this.errorMessage = "يجب إدخال البريد الإلكتروني أو رقم الهاتف";
        return;
      }

      if (this.loading) return;

      this.loading = true;

      try {
        const cleanName = this.name.trim();

        const cleanEmail = this.email.trim().toLowerCase();

        const cleanPhone = this.phone.replace(/\D/g, "");

        const cleanMessage = this.massege.replace(/<[^>]*>/g, "").trim();

        await this.Addinquiries(
          cleanName,
          cleanEmail,
          cleanMessage,
          cleanPhone,
        );
      } finally {
        this.loading = false;
      }
    },
  },

  mounted() {
    this.siteinformition();
  },
};
</script>
