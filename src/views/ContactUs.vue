<template>
  <v-container class="pa-6 text-center">
    <h1 class="text-h4 font-weight-bold mb-4">اتصل بنا</h1>
    <p class="mb-4">يسعدنا تواصلك معنا لأي استفسار أو دعم فني.</p>

    <v-card class="pa-6 mx-auto" max-width="500">
      <p><strong>العنوان:</strong> {{ settings.location }}</p>
      <p><strong>الهاتف:</strong> {{ settings.hotphone }}</p>
      <p>
        <span>✉️ {{ settings.email }}: <strong>البريد الإلكتروني</strong></span>
      </p>
    </v-card>

    <v-divider class="my-6"></v-divider>

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
