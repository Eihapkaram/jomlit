<template>
  <v-container class="pa-6 text-center">
    <h1 class="text-h4 font-weight-bold mb-4">اتصل بنا</h1>

    <p class="mb-4">
      يسعدنا تواصلك معنا لأي استفسار أو دعم فني.
    </p>

    <v-card class="pa-6 mx-auto" max-width="500">
      <p><strong>العنوان:</strong> {{ settings.location }}</p>

      <p><strong>الهاتف:</strong> {{ settings.hotphone }}</p>

      <p>
        <span>
          ✉️ {{ settings.email }}
          :
          <strong>البريد الإلكتروني</strong>
        </span>
      </p>
    </v-card>

    <v-divider class="my-6"></v-divider>

    <v-form ref="form" @submit.prevent="secureSubmit">

      <!-- Honeypot ضد البوتات -->
      <input
        v-model="website"
        type="text"
        autocomplete="off"
        tabindex="-1"
        style="display:none"
      />

      <!-- الاسم -->

      <v-text-field
        v-model.trim="name"
        label="الاسم"
        maxlength="50"
        counter
        :rules="[rules.required, rules.name]"
        outlined
      />

      <!-- البريد -->

      <v-text-field
        v-model.trim="email"
        label="البريد الإلكتروني"
        placeholder="example@email.com"
        type="email"
        maxlength="100"
        counter
        autocomplete="email"
        :rules="[rules.email]"
        outlined
      />

      <div class="my-2">
        أو
      </div>

      <!-- الهاتف -->

      <v-text-field
        v-model.trim="phone"
        label="رقم التليفون"
        placeholder="01012345678"
        type="tel"
        maxlength="11"
        counter
        autocomplete="tel"
        :rules="[rules.phone]"
        outlined
      />

      <!-- الرسالة -->

      <v-textarea
        v-model.trim="massege"
        label="رسالتك"
        maxlength="1000"
        counter
        auto-grow
        :rules="[rules.required, rules.message]"
        outlined
      />

      <v-btn
        type="submit"
        color="primary"
        class="mt-4"
        :loading="loading"
        :disabled="loading"
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
      name: "",
      email: "",
      massege: "",
      phone: "",

      loading: false,

      // Honeypot
      website: "",

      rules: {
        required: (v) =>
          !!v || "هذا الحقل مطلوب",

        name: (v) =>
          !v ||
          /^[\u0600-\u06FFa-zA-Z\s]{3,50}$/.test(v) ||
          "الاسم غير صحيح",

        email: (v) =>
          !v ||
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
          "البريد الإلكتروني غير صحيح",

        phone: (v) =>
          !v ||
          /^(01)[0125][0-9]{8}$/.test(v) ||
          "رقم الهاتف غير صحيح",

        message: (v) =>
          !v ||
          (v.length >= 10 && v.length <= 1000) ||
          "الرسالة يجب أن تكون بين 10 و1000 حرف",
      },
    };
  },

  computed: {
    ...mapState(mystore, ["settings"]),
  },

  methods: {
    ...mapActions(mystore, [
      "siteinformition",
      "Addinquiries",
    ]),

    async secureSubmit() {

      // منع البوتات
      if (this.website) return;

      // منع الضغط المتكرر
      if (this.loading) return;

      // يجب إدخال بريد أو هاتف
      if (!this.email && !this.phone) {
        alert("يجب إدخال البريد الإلكتروني أو رقم الهاتف");
        return;
      }

      // تحقق من الرسالة
      if (this.massege.trim().length < 10) {
        alert("الرسالة قصيرة جداً");
        return;
      }

      this.loading = true;

      try {

        await this.Addinquiries(

          this.name.trim(),

          this.email.trim().toLowerCase(),

          this.massege
            .replace(/<[^>]*>?/gm, "")
            .trim(),

          this.phone.replace(/\D/g, "")

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