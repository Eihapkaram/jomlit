<template>
  <v-container class="py-10">
    <v-card elevation="4" class="pa-6 rounded-xl">
      <v-card-title class="text-h5 mb-4">سياسة الشحن والإرجاع</v-card-title>
      <v-card-text
        class="text-body-1"
        v-if="!settings.shipping_and_return_policy"
      >
        🚚 يتم توصيل الطلبات خلال 2 - 3 أيام عمل داخل مصر. يمكن إرجاع المنتج
        خلال 7 أيام من تاريخ الاستلام بشرط أن يكون بحالته الأصلية. في حال وجود
        عيب في المنتج، تتحمل انت تكاليف الشحن بالكامل.
      </v-card-text>
      <v-card-text
        class="text-body-1"
        v-if="settings.shipping_and_return_policy"
      >
        {{ settings.shipping_and_return_policy }}
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
