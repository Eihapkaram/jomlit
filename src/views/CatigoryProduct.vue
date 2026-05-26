<template>
  <span v-if="!products?.length"> لم يتم العثور على منتجات </span>

  <!-- Banner -->
  <v-container fluid>
    <img
      style="width: 100%; object-fit: cover"
      loading="lazy"
      :src="domin + catigoryProducts.banner"
    />
  </v-container>

  <!-- Loading -->
  <v-progress-linear v-if="load" indeterminate color="blue" />

  <!-- 🔥 Virtual Scroll -->
  <v-virtual-scroll
    :items="products"
    :item-height="420"
    height="80vh"
    class="virtual-wrapper"
    @scroll="onScroll"
  >
    <template #default="{ item }">
      <div class="product-card">
        <!-- Image -->
        <div class="img-wrapper">
          <img :src="domin + item.img" />

          <button
            class="love-btn"
            :class="{ active: item.loved }"
            @click="toggleLove(item)"
          >
            <v-icon>
              {{ item.loved ? "mdi-heart" : "mdi-heart-outline" }}
            </v-icon>
          </button>

          <span v-if="item.discount > 0" id="availbel">
            %{{ item.discount }}
          </span>
        </div>

        <!-- Info -->
        <div class="info">
          <h3 class="title">{{ item.titel }}</h3>

          <div class="price-row">
            <span class="price"> {{ Math.floor(item.price) }} ج.م </span>
          </div>

          <p class="brand">{{ item.brand }}</p>

          <div class="desc">
            {{ item.description }}
          </div>

          <v-btn class="cart-btn" @click="addToCart(item)">
            🛒 أضف للسلة
          </v-btn>
        </div>
      </div>
    </template>
  </v-virtual-scroll>

  <!-- Loader عند تحميل صفحات جديدة -->
  <div v-if="scrollLoading" class="text-center pa-4">
    <v-progress-circular indeterminate />
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { mystore } from "@/store";
import { CartStore1 } from "@/store/Cart";
import { ListsStore1 } from "@/store/Lists";

export default {
  inject: ["Emitter"],

  data() {
    return {
      load: false,
      scrollLoading: false,
      page: 1,
    };
  },

  computed: {
    ...mapState(mystore, ["catigoryProducts", "domin"]),

    // 👇 أهم سطر: مصدر البيانات
    products() {
      return this.catigoryProducts?.product || [];
    },
  },

  methods: {
    ...mapActions(mystore, ["getCatigoryProduct"]),
    ...mapActions(CartStore1, ["Additem", "Additem2", "GetCart"]),
    ...mapActions(ListsStore1, ["AdditemL"]),

    async init() {
      this.load = true;
      this.page = 1;

      await this.getCatigoryProduct(this.$route.params.catigory, 1);

      this.load = false;
    },

    // 🔥 Load more عند الوصول للنهاية
    async onScroll(e) {
      const el = e.target;

      if (
        el.scrollTop + el.clientHeight >= el.scrollHeight - 200 &&
        !this.scrollLoading
      ) {
        await this.loadMore();
      }
    },

    async loadMore() {
      const next = this.page + 1;

      if (next > this.categoryPagination.lastPage) return;

      this.scrollLoading = true;
      this.page = next;

      await this.getCatigoryProduct(this.$route.params.catigory, next);

      this.scrollLoading = false;
    },

    async addToCart(pro) {
      if (!localStorage.getItem("token")) {
        this.Emitter.emit("sin", "سجل دخول أولاً");
        return;
      }

      pro.quantity = 1;

      await this.Additem2(pro);
      await this.Additem(pro);
      await this.GetCart();

      this.Emitter.emit("cart", {
        textem2: "تم إضافة المنتج",
        act: true,
      });
    },

    toggleLove(pro) {
      pro.loved = !pro.loved;

      if (pro.loved && localStorage.getItem("token")) {
        pro.quantity = 1;
        this.AdditemL(pro);
      }
    },
  },

  mounted() {
    window.scrollTo(0, 0);
    this.init();
  },

  watch: {
    $route() {
      this.init();
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap");

* {
  font-family: "Cairo", sans-serif;
}
.products-wrapper {
  background: #f8f9fa;
  padding: 40px 20px;
  font-family: "Cairo", sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}
.header h2 {
  font-weight: 700;
  color: #333;
}
.btn-view-all {
  background: linear-gradient(135deg, #7da453, #a6ce39);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}
.btn-view-all:hover {
  transform: scale(1.05);
  background: linear-gradient(135deg, #6e944a, #93be2e);
}

.grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 25px;
}

.card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}
.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 20px rgba(125, 164, 83, 0.2);
}

.image-box {
  position: relative;
  background: #f3f5f1;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.image-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.image-box img.product-img {
  max-width: 60%;
  position: relative;
  top: -5%;
  left: 25%;
  max-height: 160px;
  object-fit: contain;
  transition: 0.3s;
}
.image-box:hover img {
  transform: scale(1.05);
}

.info {
  padding: 15px;
}
.title {
  font-size: 17px;
  font-weight: 700;
  color: #2f3e2f;
}
.brand {
  font-size: 14px;
  color: #666;
  margin: 5px 0 10px;
}

.desc {
  font-size: 13px;
  color: #555;
  max-height: 60px;
  overflow-y: auto;
  margin-top: 6px;
  padding-inline: 4px;
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
}
.desc::-webkit-scrollbar {
  width: 4px;
}
.desc::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 4px;
}

.details {
  background: #f9faf7;
  border-left: 4px solid #a6ce39;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 13px;
  color: #4b4b3f;
  margin-top: 8px;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
.price {
  color: #7da453;
  font-weight: 700;
  font-size: 16px;
}
.btns {
  display: flex;
  gap: 8px;
}
.btn {
  background: #a6ce39;
  border: none;
  color: white;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}
.btn:hover {
  background: #93be2e;
}
.btn.secondary {
  background: #f0f0f0;
  color: #333;
}
.btn.secondary:hover {
  background: #ddd;
}
#parantimg1:hover #quick {
  opacity: 1 !important;
}
.btn-view-all {
  background: linear-gradient(135deg, #7da453, #a6ce39);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}
.btn-view-all:hover {
  transform: scale(1.05);
  background: linear-gradient(135deg, #6e944a, #93be2e);
}
#quick {
  position: absolute;
  opacity: 0;
  font-size: 12px;
  top: 50%;
  background-color: rgb(255, 255, 255);
  z-index: 8;
  left: 35%;
  transition: all, 500;
}
.mySwiper.swiper-button-next:after {
  background-color: white;
}
#availbel {
  color: rgb(255, 0, 0);
  border-radius: 5px;
  padding: 5px;
  background-color: rgb(245, 165, 165);
  width: fit-content;
  position: relative;
  left: -104px;
  top: -70px;
  height: 35px;
}
.food-section {
  background-color: #faf8f3;
  padding: 25px;
  font-family: "Cairo", sans-serif;
  color: #333;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  font-weight: bold;
  color: #3f422b;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 20px;
}

.product-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e8e5da;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: 0.3s;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0px 4px 12px rgba(163, 163, 108, 0.15);
}

.img-wrapper {
  position: relative;
  background-color: #f7f5ef;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.img-wrapper img {
  max-width: 80%;
  max-height: 150px;
  object-fit: contain;
  transition: 0.3s;
}
.img-wrapper img:hover {
  transform: scale(1.05);
}

.love-btn {
  position: absolute;
  top: -70px;
  left: 85px;
  background: rgba(255, 255, 255, 0.85);
  border: none;
  border-radius: 10px;
  padding: 6px 10px;
  cursor: pointer;
  transition: 0.3s;
  font-size: 18px;
  color: #6c8642;
}
.love-btn:hover {
  background-color: #f2e9cf;
}
.love-btn.active {
  background-color: #ffe7e0;
  color: #e94f37;
}

.info {
  padding: 10px 12px;
}

.title {
  font-size: 16px;
  font-weight: bold;
  color: #3a3a3a;
}

.brand {
  color: #888;
  font-size: 14px;
  margin: 3px 0;
}

/* ✅ وصف المنتج بخاصية scroll */
.desc {
  font-size: 13px;
  color: #555;
  max-height: 60px;
  overflow-y: auto;
  margin-top: 6px;
  padding-inline: 4px;
  scrollbar-width: thin;
  scrollbar-color: #c7c4b1 transparent;
}

/* ✅ شكل شريط التمرير */
.desc::-webkit-scrollbar {
  width: 4px;
  top: 30px;
}
.desc::-webkit-scrollbar-thumb {
  background-color: #d6b85a;
  border-radius: 10px;
}
.desc::-webkit-scrollbar-track {
  background: transparent;
}

.details {
  background: #f9faf7;
  border-left: 4px solid #a6ce39;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 13px;
  color: #4b4b3f;
  margin-top: 8px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.price {
  font-weight: bold;
  color: #6c8642;
  font-size: 15px;
}

.cart-btn {
  background-color: #d6b85a;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-weight: 600;
  margin: 10px;
  cursor: pointer;
  transition: 0.3s;
}
.cart-btn:hover {
  background-color: #6c8642;
}

/*/tablet/*/
@media (max-width: 991px) {
  .food-section {
    position: relative;
    left: 0px;
  }
  #cardskl {
    position: absolute;
    top: 0px;
    width: 18rem;
    height: 33rem;
    left: 0px;
    background-color: rgb(255, 255, 255);
  }

  #parantimg1:hover #quick {
    opacity: 1 !important;
  }
  #quick {
    position: absolute;
    opacity: 0;
    font-size: 12px;
    top: 50%;
    background-color: rgb(255, 255, 255);
    z-index: 8;
    left: 30%;
    transition: all, 500;
  }
  .mySwiper.swiper-button-next:after {
    background-color: white;
  }
  #availbel {
    color: rgb(252, 0, 0);
    border-radius: 5px;
    padding: 5px;
    background-color: rgb(247, 158, 158);
    width: fit-content;
    position: relative;
    left: -120px;
    top: -70px;
    height: 30px;
  }
  .food-section {
    background-color: #faf8f3;
    padding: 25px;
    font-family: "Cairo", sans-serif;
    color: #333;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .header h2 {
    font-weight: bold;
    color: #3f422b;
  }

  .btn-view-all {
    background: linear-gradient(135deg, #7da453, #a6ce39);
    color: white;
    border: none;
    padding: 10px 18px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    transition: 0.3s;
  }
  .btn-view-all:hover {
    transform: scale(1.05);
    background: linear-gradient(135deg, #6e944a, #93be2e);
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 20px;
  }

  .product-card {
    background: #ffffff;
    border-radius: 12px;
    width: 270px;
    border: 1px solid #e8e5da;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    transition: 0.3s;
  }
  .product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0px 4px 12px rgba(163, 163, 108, 0.15);
  }

  .img-wrapper {
    position: relative;
    background-color: #f7f5ef;
    height: 180px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .img-wrapper img {
    max-width: 80%;
    max-height: 150px;
    object-fit: contain;
    transition: 0.3s;
  }
  .img-wrapper img:hover {
    transform: scale(1.05);
  }

  .love-btn {
    position: absolute;
    top: -70px;
    left: 100px;
    background: rgba(255, 255, 255, 0.85);
    border: none;
    border-radius: 10px;
    padding: 6px 10px;
    cursor: pointer;
    transition: 0.3s;
    font-size: 18px;
    color: rgb(243, 6, 6);
  }
  .love-btn:hover {
    background-color: #f2e9cf;
  }
  .love-btn.active {
    background-color: #ffe7e0;
    color: #e94f37;
  }

  .info {
    padding: 10px 12px;
  }

  .title {
    font-size: 16px;
    font-weight: bold;
    color: #3a3a3a;
  }

  .brand {
    color: #888;
    font-size: 14px;
    margin: 3px 0;
  }

  /* ✅ وصف المنتج بخاصية scroll */
  .desc {
    font-size: 13px;
    color: #555;
    max-height: 60px;
    overflow-y: auto;
    margin-top: 6px;
    padding-inline: 4px;
    scrollbar-width: thin;
    scrollbar-color: #c7c4b1 transparent;
  }

  /* ✅ شكل شريط التمرير */
  .desc::-webkit-scrollbar {
    width: 4px;
  }
  .desc::-webkit-scrollbar-thumb {
    background-color: #d6b85a;
    border-radius: 10px;
  }
  .desc::-webkit-scrollbar-track {
    background: transparent;
  }
  .price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
  }

  .price {
    font-weight: bold;
    color: #6c8642;
    font-size: 15px;
  }

  .cart-btn {
    background-color: #d6b85a;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;
  }
  .cart-btn:hover {
    background-color: #bfa14d;
  }
}
/*/mobile/*/
@media (max-width: 500px) {
  #cardskl {
    position: absolute;
    top: 0px;
    width: 14rem;
    height: 420px;
    margin-inline: auto;
    background-color: rgb(255, 255, 255);
  }
  .mySwiper {
    padding: 0;
  }
  #swip {
    width: fit-content;
    height: fit-content;
  }

  #parantimg1:hover #quick {
    opacity: 1 !important;
  }
  #quick {
    position: absolute;
    opacity: 0;
    font-size: 12px;
    top: 50%;
    background-color: rgb(255, 255, 255);
    z-index: 8;
    left: 40%;
    transition: all, 500;
  }
  .mySwiper.swiper-button-next:after {
    background-color: white;
  }
  #availbel {
    color: rgb(243, 16, 16);
    border-radius: 5px;
    padding: 2px;
    background-color: rgb(236, 216, 216);
    width: fit-content;
    position: relative;
    top: -70px;
    left: -140px;
    height: 30px;
  }
  .love-btn {
    position: absolute;
    top: -70px;
    left: 110px;
    background: rgba(255, 255, 255, 0.85);
    border: none;
    border-radius: 10px;
    padding: 6px 10px;
    cursor: pointer;
    transition: 0.3s;
    font-size: 18px;
    color: #6c8642;
  }
  .love-btn:hover {
    background-color: #f2e9cf;
  }
  .love-btn.active {
    background-color: #ffe7e0;
    color: #e94f37;
  }
  .food-section {
    background-color: #faf8f3;
    padding: 25px;
    font-family: "Cairo", sans-serif;
    color: #333;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .header h2 {
    font-weight: bold;
    color: #3f422b;
  }

  .view-all {
    background-color: #b8c98a;
    color: white;
    border: none;
    padding: 8px 14px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;
  }
  .view-all:hover {
    background-color: #9db86c;
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 20px;
  }

  .product-card {
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e8e5da;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    transition: 0.3s;
    width: 308px;
  }
  .product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0px 4px 12px rgba(163, 163, 108, 0.15);
  }

  .img-wrapper {
    position: relative;
    background-color: #f7f5ef;
    height: 180px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .img-wrapper img {
    max-width: 80%;
    max-height: 150px;
    object-fit: contain;
    transition: 0.3s;
  }
  .img-wrapper img:hover {
    transform: scale(1.05);
  }

  .info {
    padding: 10px 12px;
  }

  .title {
    font-size: 16px;
    font-weight: bold;
    color: #3a3a3a;
  }

  .brand {
    color: #888;
    font-size: 14px;
    margin: 3px 0;
  }

  /* ✅ وصف المنتج بخاصية scroll */
  .desc {
    font-size: 13px;
    color: #555;
    max-height: 60px;
    overflow-y: auto;
    margin-top: 6px;
    padding-inline: 4px;
    scrollbar-width: thin;
    scrollbar-color: #c7c4b1 transparent;
  }

  /* ✅ شكل شريط التمرير */
  .desc::-webkit-scrollbar {
    width: 4px;
  }
  .desc::-webkit-scrollbar-thumb {
    background-color: #d6b85a;
    border-radius: 10px;
  }
  .desc::-webkit-scrollbar-track {
    background: transparent;
  }

  .price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
  }

  .price {
    font-weight: bold;
    color: #6c8642;
    font-size: 15px;
  }

  .cart-btn {
    background-color: #d6b85a;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    margin: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;
  }
  .cart-btn:hover {
    background-color: #bfa14d;
  }
}
</style>
