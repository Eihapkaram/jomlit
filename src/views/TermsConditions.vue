<template>
  <v-container class="py-10">
    <v-card elevation="4" class="pa-6 rounded-xl">
      <v-card-title class="text-h5 mb-4">الشروط والأحكام</v-card-title>
      <v-card-text class="text-body-1" v-if="!settings.terms_and_conditions">
        باستخدامك لموقع <strong>جملة الجملة</strong> فإنك توافق على جميع الشروط
        التالية: - الالتزام بسياسات الشراء والإرجاع. - عدم إساءة استخدام الموقع
        أو محتواه. - تحتفظ إدارة الموقع بحق تعديل هذه الشروط في أي وقت دون إشعار
        مسبق.
      </v-card-text>
      <v-card-text class="text-body-1" v-if="settings.terms_and_conditions">
        باستخدامك لموقع <strong>جملة الجملة</strong> فإنك توافق على جميع الشروط
        التالية: {{ settings.terms_and_conditions }}
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
