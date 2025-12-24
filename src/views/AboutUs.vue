<template>
  <v-container class="py-10">
    <v-card elevation="4" class="pa-6 rounded-xl">
      <v-card-title class="text-h5 mb-4">من نحن</v-card-title>
      <v-card-text class="text-body-1">
        نحن في <strong>جملة الجملة</strong> نعمل على توفير أفضل المنتجات بأسعار
        تنافسية للتجار والموزعين في جميع أنحاء مصر. هدفنا هو تسهيل عملية الشراء
        بالجملة وتوفير تجربة تسوق سريعة وآمنة وسهلة الاستخدام.
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
