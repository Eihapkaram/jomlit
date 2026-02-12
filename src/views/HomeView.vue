<template>
  <SuppluerHome v-if="userRole == 'supplier'" />
  <div v-else class="home">
    <BannerSlider />
    <TopCatogery />
    <TopsSc />
    <NewProduct />
    <FooterSction />
  </div>
</template>

<script>
import { mystore } from "@/store";
import { mapActions, mapState } from "pinia";
import FooterSction from "@/components/Home/FooterSction.vue";
import BannerSlider from "@/components/Home/BannerSlider.vue";
import NewProduct from "@/components/Home/NewProduct.vue";
import TopCatogery from "@/components/Home/TopCatogery.vue";
import TopsSc from "@/components/Home/TopsSc.vue";
import SuppluerHome from "@/components/Home/DashSupplier.vue";

// @ is an alias to /src
export default {
  inject: ["Emitter"],
  name: "HomeView",
  components: {
    TopCatogery,
    NewProduct,

    FooterSction,
    BannerSlider,

    TopsSc,
    SuppluerHome,
  },
  data() {
    return {
      diloge: false,
      SingleProduct: "",
    };
  },
  computed: { ...mapState(mystore, ["userRole"]) },
  methods: {
    ...mapActions(mystore, ["getall", "getcatigories"]),
    viwediloge(data) {
      this.diloge = true;
      this.SingleProduct = data;
    },
  },
  async mounted() {
    await this.getcatigories();
  },
};
</script>
<style scoped></style>
