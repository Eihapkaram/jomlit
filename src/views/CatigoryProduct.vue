# CategoryProducts.vue ```vue
<template>
  <div>
    <!-- لا يوجد منتجات -->
    <div v-if="!products.length && !load" class="empty-products">
      لم يتم العثور على منتجات
    </div>

    <!-- البانر -->
    <v-container fluid class="pa-0 mb-4">
      <div class="banner-wrapper">
        <img
          v-if="catigoryProducts?.banner"
          class="banner-img"
          loading="lazy"
          alt="banner"
          :src="domin + catigoryProducts.banner"
        />
      </div>
    </v-container>

    <!-- loading -->
    <v-progress-linear v-if="load" color="green" indeterminate class="mb-4" />

    <!-- المنتجات -->
    <div class="grid">
      <div v-for="pro in products" :key="pro.id" class="product-card">
        <!-- الصورة -->
        <div class="img-wrapper" id="parantimg1">
          <div v-if="pro.stock < 1" class="out-stock">
            المنتج غير متوفر حاليا
          </div>

          <!-- خصم -->
          <span v-if="pro.discount > 0" class="discount-badge">
            %{{ pro.discount }}
          </span>

          <!-- المفضلة -->
          <button
            class="love-btn"
            :class="{ active: pro.loved }"
            @click="toggleLove(pro)"
          >
            <v-icon>
              {{ pro.loved ? "mdi-heart" : "mdi-heart-outline" }}
            </v-icon>
          </button>

          <!-- نظرة سريعة -->
          <v-btn
            id="quick"
            rounded
            variant="outlined"
            @click="Emitter.emit('dilog', pro)"
          >
            نظرة سريعة
          </v-btn>

          <img loading="lazy" :src="domin + pro.img" :alt="pro.titel" />
        </div>

        <!-- البيانات -->
        <div class="info">
          <h3 class="title">{{ pro.titel }}</h3>

          <p class="brand">العلامة التجارية: {{ pro.brand }}</p>

          <!-- السعر -->
          <div class="price-row">
            <template v-if="pro.discount > 0">
              <span class="old-price">
                {{ oldPrice(pro.price, pro.discount) }} ج.م
              </span>
            </template>

            <span class="price"> {{ Math.floor(pro.price) }} ج.م </span>
          </div>

          <!-- التقييم -->
          <v-rating
            v-model="pro.votes"
            readonly
            :length="5"
            :size="18"
            active-color="#d4a017"
          />

          <!-- الوصف -->
          <div class="desc">
            {{ pro.description }}
          </div>

          <!-- التفاصيل -->
          <div class="details">
            <div>
              🧃
              <strong>{{ pro.Counttype }}</strong>
              تحتوي على
              <strong>{{ pro.inCount }}</strong>
              {{ pro.inCounttype }}
            </div>

            <div>
              💰 سعر {{ pro.inCounttype }}:
              <strong>
                {{ Math.floor(pro.price / pro.inCount) }}
              </strong>
              ج.م
            </div>
          </div>

          <!-- الأزرار -->
          <div class="btns-wrapper">
            <v-btn class="cart-btn" @click="goDetails(pro.id)"> تفاصيل </v-btn>

            <v-btn
              class="cart-btn"
              :disabled="pro.stock < 1"
              @click="addToCart(pro)"
            >
              🛒 أضف للسلة
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- loading more -->
    <div v-if="loadingMore" class="loading-more">
      <v-progress-circular indeterminate color="green" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { mystore } from "@/store";
import { ListsStore1 } from "@/store/Lists";
import { CartStore1 } from "@/store/Cart";

export default {
  inject: ["Emitter"],

  data() {
    return {
      load: false,
      currentPage: 1,
      lastPage: 1,
      loadingMore: false,
    };
  },

  computed: {
    ...mapState(mystore, ["catigoryProducts", "domin"]),

    products() {
      return this.catigoryProducts?.product?.data || [];
    },
  },

  methods: {
    ...mapActions(mystore, ["getCatigoryProduct"]),
    ...mapActions(CartStore1, ["Additem", "Additem2", "GetCart"]),
    ...mapActions(ListsStore1, ["AdditemL"]),

    oldPrice(price, discount) {
      return Math.floor(price + (discount / 100) * price);
    },

    async loadProducts(page = 1) {
      await this.getCatigoryProduct(this.$route.params.catigory, page);

      this.currentPage = this.catigoryProducts?.product?.current_page || 1;

      this.lastPage = this.catigoryProducts?.product?.last_page || 1;
    },

    async handleScroll() {
      if (this.loadingMore) return;

      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      const windowHeight = window.innerHeight;

      const fullHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight + 300 >= fullHeight) {
        if (this.currentPage < this.lastPage) {
          this.loadingMore = true;

          this.currentPage++;

          await this.getCatigoryProduct(
            this.$route.params.catigory,
            this.currentPage,
          );

          this.loadingMore = false;
        }
      }
    },

    async Add(pro) {
      await this.Additem2(pro);
      await this.Additem(pro);
      await this.GetCart();
    },

    async addToCart(pro) {
      if (!localStorage.getItem("token")) {
        this.Emitter.emit(
          "sin",
          "عشان تضيف منتج ف العربة لازم تسجل دخول الأول",
        );

        return;
      }

      if (pro.stock < 1) {
        this.Emitter.emit("sin", "المنتج غير متوفر حاليا");

        return;
      }

      pro.quantity = 1;

      await this.Add(pro);

      this.Emitter.emit("cart", {
        textem2: "تم اضافه المنتج ف العربة",
        act: true,
      });
    },

    toggleLove(pro) {
      if (!localStorage.getItem("token")) {
        this.Emitter.emit("sin", "يجب تسجيل الدخول أولا");

        return;
      }

      pro.loved = !pro.loved;

      if (pro.loved) {
        pro.quantity = 1;
        this.AdditemL(pro);
      }
    },

    goDetails(id) {
      this.$router.push({
        name: "derilse",
        params: {
          idparam: id,
        },
      });
    },
  },

  async mounted() {
    window.scrollTo(0, 0);

    this.load = true;

    await this.loadProducts(1);

    this.load = false;

    window.addEventListener("scroll", this.handleScroll);
  },

  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },

  watch: {
    async $route() {
      window.scrollTo(0, 0);

      this.currentPage = 1;
      this.lastPage = 1;

      this.load = true;

      await this.loadProducts(1);

      this.load = false;
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap");

* {
  font-family: "Cairo", sans-serif;
}

.empty-products {
  text-align: center;
  padding: 40px;
  font-size: 22px;
  font-weight: bold;
}

.banner-wrapper {
  width: 100%;
  overflow: hidden;
  border-radius: 16px;
}

.banner-img {
  width: 100%;
  max-height: 350px;
  object-fit: cover;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
}

.product-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #eee;
  transition: 0.3s;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.product-card:hover {
  transform: translateY(-5px);
}

.img-wrapper {
  position: relative;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8f8f8;
}

.img-wrapper img {
  max-width: 80%;
  max-height: 170px;
  object-fit: contain;
  transition: 0.3s;
}

.img-wrapper:hover img {
  transform: scale(1.05);
}

#quick {
  position: absolute;
  opacity: 0;
  top: 50%;
  transition: 0.3s;
  z-index: 5;
}

#parantimg1:hover #quick {
  opacity: 1;
}

.out-stock {
  position: absolute;
  width: 100%;
  background: rgba(255, 0, 0, 0.2);
  color: red;
  text-align: center;
  padding: 10px;
  z-index: 5;
  font-weight: bold;
}

.discount-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #ffdddd;
  color: red;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: bold;
}

.love-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  z-index: 5;
}

.love-btn.active {
  color: red;
}

.info {
  padding: 15px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.brand {
  color: #777;
  margin-bottom: 10px;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}

.old-price {
  text-decoration: line-through;
  color: #999;
}

.price {
  color: #6c8642;
  font-weight: bold;
  font-size: 18px;
}

.desc {
  max-height: 60px;
  overflow-y: auto;
  font-size: 14px;
  color: #555;
  margin: 10px 0;
}

.details {
  background: #f9faf7;
  padding: 10px;
  border-radius: 10px;
  margin-top: 10px;
  font-size: 14px;
}

.btns-wrapper {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.cart-btn {
  flex: 1;
  background: #d6b85a;
  color: white;
  border-radius: 10px;
}

.cart-btn:hover {
  background: #6c8642;
}

.loading-more {
  display: flex;
  justify-content: center;
  padding: 20px;
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
    padding: 10px;
  }

  .product-card {
    width: 100%;
  }

  .btns-wrapper {
    flex-direction: column;
  }
}
</style>
```
