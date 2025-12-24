<template>
  <v-container class="pa-6">
    <h1 class="text-h4 font-weight-bold mb-4 text-center">الاستفسارات</h1>
    <p class="text-center mb-6">
      يمكنك إرسال استفسارك عن أي منتج أو خدمة عبر النموذج التالي.
    </p>
    <v-form
      @submit.prevent="
        Addinquiries(this.name, this.email, this.massege, this.phone)
      "
    >
      <v-text-field v-model="this.name" label="الاسم" outlined></v-text-field>
      <v-text-field
        v-model="this.email"
        label="البريد الإلكتروني"
        placeholder="example@email.com"
        type="email"
        outlined
      ></v-text-field>
      <sapn>او </sapn>
      <v-text-field
        v-model="this.phone"
        label="رقم التليفون"
        placeholder="01063887543"
        type="phone"
        outlined
      ></v-text-field>

      <v-textarea v-model="this.massege" label="رسالتك" outlined></v-textarea>
      <v-btn type="submit" color="primary" class="mt-4">إرسال</v-btn>
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
