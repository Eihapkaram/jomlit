<template>
  <v-container class="py-10">
    <v-card elevation="4" class="pa-6 rounded-xl">
      <v-card-title class="text-h5 mb-4">خدمة العملاء</v-card-title>
      <v-card-text class="text-body-1">
        يسعدنا تواصلك معنا لأي استفسار أو مشكلة في الطلبات.
        <br /><br />
        <span>📞 رقم الهاتف: {{ settings.phone1 }}</span> <br />
        <span>✉️ {{ settings.email }}: البريد الإلكتروني</span>
        <br />
        🕒 ساعات العمل: من السبت إلى الخميس – 9 صباحاً حتى 6 مساءً
      </v-card-text>
    </v-card>
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
    };
  },
  computed: {
    ...mapState(mystore, ["settings"]),
  },
  methods: {
    ...mapActions(mystore, ["siteinformition", "Addinquiries"]),
  },
  mounted() {
    this.siteinformition();
  },
};
</script>
