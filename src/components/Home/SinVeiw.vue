<template>
  <v-dialog
    v-model="diloge"
    max-width="500px"
    transition="dialog-bottom-transition"
    persistent
  >
    <v-card
      class="pa-6"
      style="
        border-radius: 20px;
        background: linear-gradient(135deg, #ffffff 0%, #f6f7fb 100%);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        text-align: center;
      "
    >
      <v-card-title
        class="text-h6 font-weight-bold mb-4"
        style="color: #222; font-size: 20px"
      >
        {{ text }}
      </v-card-title>

      <v-card-actions class="justify-center">
        <v-btn
          v-if="!close"
          ripple
          elevation="4"
          size="large"
          style="
            background-color: #e53935;
            color: white;
            border-radius: 12px;
            font-weight: bold;
            padding-inline: 25px;
            letter-spacing: 0.5px;
          "
          @click="
            this.$router.push({ name: 'login' });
            this.diloge = false;
          "
        >
          🛍️ سجل دلوقتي
        </v-btn>
        <v-btn
          v-if="close"
          ripple
          elevation="4"
          size="large"
          style="
            background-color: #e53935;
            color: white;
            border-radius: 12px;
            font-weight: bold;
            padding-inline: 25px;
            letter-spacing: 0.5px;
          "
          @click="this.diloge = false"
        >
          اغلاق
        </v-btn>
      </v-card-actions>

      <v-divider class="my-4"></v-divider>

      <v-card-subtitle style="color: #555; font-size: 14px; line-height: 1.6">
        سجل حسابك على <strong>جمله الجمله</strong> وابدأ تشتري منتجاتك بأفضل سعر
        جملة في مصر 🇪🇬
      </v-card-subtitle>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-card-title {
  text-align: center;
}
.v-dialog > .v-overlay__content {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* تحسين مظهر الزر عند اللمس */
.v-btn:hover {
  transform: scale(1.05);
  transition: all 0.3s ease;
  background-color: #d32f2f !important;
}

/* الموبايل */
@media (max-width: 500px) {
  .v-card {
    padding: 20px !important;
  }
  .v-card-title {
    font-size: 18px !important;
  }
  .v-card-subtitle {
    font-size: 13px !important;
  }
}
</style>

<script>
import { CartStore1 } from "@/store/Cart";
import { ListsStore1 } from "@/store/Lists";
import { mystore } from "@/store";
import { mapState, mapActions } from "pinia";

export default {
  inject: ["Emitter"],
  data() {
    return {
      diloge: false,
      loading: "",
      text: "",
      close: false,
    };
  },
  computed: { ...mapState(mystore, ["SingleProduct", "domin"]) },
  methods: {
    ...mapActions(mystore, ["getSingle"]),
    ...mapActions(CartStore1, ["Additem"]),
    ...mapActions(ListsStore1, ["AdditemL"]),
  },
  async mounted() {
    this.Emitter.on("sin", (data) => {
      this.diloge = true;
      this.text = data;
      if (localStorage.getItem("token")) {
        this.close = true;
      }
    });
    window.scroll(0, 0);
  },
};
</script>
