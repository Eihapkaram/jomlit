<template>
  <v-container class="py-10">
    <v-card elevation="4" class="pa-6 rounded-xl">
      <v-card-title class="text-h5 mb-4">سياسة الخصوصية</v-card-title>
      <v-card-text class="text-body-1" v-if="!settings.privacy_policy">
        نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. يتم استخدام المعلومات فقط
        لتحسين تجربة التسوق وضمان أمان عمليات الدفع. لا نقوم بمشاركة بياناتك مع
        أي جهة خارجية دون إذنك المسبق.
      </v-card-text>
      <v-card-text class="text-body-1" v-if="settings.privacy_policy">
        {{ settings.privacy_policy }}
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
