<template>
  <span v-if="catigoryProducts.length === 0">لم يتم العثور على منتجات</span>
  <!-- البانر -->
  <v-container fluid>
    <banner width="100%" style="position: relative">
      <img
        height="fit-content"
        width="100%"
        style="box-sizing: border-box; width: cover"
        loading="lazy"
        alt="banner"
        :src="domin + this.catigoryProducts.banner"
      />
    </banner>
  </v-container>
  <v-lazy
    :min-height="200"
    :options="{ threshold: 0.5 }"
    transition="fade-transition"
  >
    <v-progress-linear
      color="blue"
      indeterminate
      v-if="load"
    ></v-progress-linear>

    <div class="grid">
      <div
        v-for="pro in catigoryProducts.product"
        :key="pro.id"
        class="product-card"
      >
        <div id="parantimg1" class="img-wrapper">
          <div
            v-if="pro.stock < 1"
            style="
              position: absolute;
              top: 100px;
              left: 0;
              align-content: center;
              z-index: 5;
              width: 100%;
              height: fit-content;
              background-color: lightcoral;
            "
          >
            <h3 style="color: red; font-size: bold; position: relative">
              المنتج غير متوفر حاليا
            </h3>
          </div>
          <v-btn
            @click="this.Emitter.emit('dilog', pro)"
            rounded
            variant="outliened"
            id="quick"
            ripple
            >نظره سريعه</v-btn
          >
          <img loading="lazy" :src="domin + pro.img" :alt="pro.title" />
          <v-row
            style="
              position: absolute;
              gap: auto;
              align-content: center;
              justify-content: center;
            "
          >
            <button
              class="love-btn"
              :class="{ active: pro.loved }"
              @click="toggleLove(pro)"
            >
              <v-icon>{{
                pro.loved ? "mdi-heart" : "mdi-heart-outline"
              }}</v-icon>
              <v-spacer></v-spacer>
            </button>
            <span v-if="pro.discount > 0" id="availbel" class="d-flex"
              >%{{ pro.discount }}</span
            >
          </v-row>
        </div>

        <div class="info">
          <h3 class="title">{{ pro.titel }}</h3>
          <div class="price-row">
            <span v-if="pro.discount != 0">بدلا من </span>
            <span
              v-if="pro.discount != 0"
              style="text-decoration: line-through"
              class=""
              >{{
                Math.floor(pro.price) +
                (pro.discount / 100) * Math.floor(pro.price)
              }}
              ج.م</span
            >

            <span v-if="pro.discount != 0">بسعر :</span
            ><span class="price">{{ Math.floor(pro.price) }} ج.م</span>
          </div>
          <p class="brand">العلامة التجارية: {{ pro.brand }}</p>

          <v-rating
            v-model="pro.votes"
            readonly
            :length="5"
            :size="18"
            active-color="#d4a017"
          />

          <!-- ✅ الوصف القابل للتمرير -->
          <div class="desc">
            {{ pro.description }}
          </div>

          <div class="details">
            🧃 <strong> {{ pro.Counttype }}:</strong> تحتوي على
            <strong>{{ pro.inCount }}</strong> {{ pro.inCounttype }}
            <br />
            💰 <strong>سعر {{ pro.inCounttype }}:</strong>
            <span>{{ Math.floor(pro.price / pro.inCount) }}</span> ج.م
          </div>

          <div>
            <v-btn
              class="cart-btn"
              @click="
                $router.push({ name: 'derilse', params: { idparam: pro.id } })
              "
            >
              تفاصيل
            </v-btn>
            <v-btn class="cart-btn" @click="(pro.quantity = 1), funvaled(pro)">
              🛒 أضف للسلة
            </v-btn>
          </div>
        </div>
      </div>
      <v-container fluid v-if="loading">
        <v-row>
          <v-col cols="12">
            <v-row>
              <v-col cols="12">
                <v-skeleton-loader
                  class="mx-auto border"
                  id="cardskl"
                  style=""
                  type="image, article, button, button"
                ></v-skeleton-loader>
              </v-col> </v-row></v-col></v-row
      ></v-container>
    </div>
  </v-lazy>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { mystore } from "@/store";
import { ListsStore1 } from "@/store/Lists";
import { CartStore1 } from "@/store/Cart";

export default {
  inject: ["Emitter"],
  data() {
    return { load: false };
  },
  computed: {
    ...mapState(mystore, ["searchrsult", "catigoryProducts", "domin"]),
  },
  methods: {
    ...mapActions(mystore, ["getCatigoryProduct"]),
    ...mapActions(CartStore1, ["Additem", "Additem2", "GetCart"]),
    ...mapActions(ListsStore1, ["AdditemL", "updateL"]),
    async Add(pro) {
      if (localStorage.getItem("token")) {
        await this.Additem2(pro);
        await this.Additem(pro);
        await this.GetCart();
      }
    },
    funvaled(pro) {
      if (localStorage.getItem("token")) {
        this.funvaled2(pro);
        if (pro.stock >= 1) {
          this.Add(pro);
          let textem2 = "تم اضافه المنتج ف العربة";
          let act = true;
          let op = { textem2, act };
          this.Emitter.emit("cart", op);
        }
      } else {
        let textem = "عشان تضيف منتج  ف العربة لازم تسجل دخول الأول";
        this.Emitter.emit("sin", textem);
      }
    },
    funvaled2(pro) {
      if (pro.stock < 1) {
        let textem1 = "المنتج غير متوفر حاليا";
        this.Emitter.emit("sin", textem1);
      }
    },
    count(url, price) {
      this.count = price / url;
    },
    check() {
      if (this.all.length <= 30) {
        this.loading = true;
      } else {
        this.loading = false;
      }
    },
    toggleLove(pro) {
      pro.loved = !pro.loved;
      if (pro.loved && localStorage.getItem("token")) {
        pro.quantity = 1;
        this.AdditemL(pro);
      }
    },
  },
  async mounted() {
    window.scroll(0, 0);
    this.load = true;
    setTimeout(() => {
      this.getCatigoryProduct(this.$route.params.catigory);
      this.load = false;
    }, 500);
  },
  watch: {
    $route() {
      this.load = true;
      setTimeout(() => {
        this.getCatigoryProduct(this.$route.params.catigory);
        this.load = false;
      }, 500);
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
