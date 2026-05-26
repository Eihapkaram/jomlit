<template>
  <div dir="rtl" class="products-wrapper">
    <!-- المنتجات -->
    <div class="grid">
      <div v-for="pro in products" :key="pro.id" class="product-card">
        <!-- الصورة -->
        <div class="img-wrapper" id="parantimg1">
          <div v-if="pro.stock < 1" class="out-stock">
            المنتج غير متوفر حاليا
          </div>

          <v-btn
            id="quick"
            rounded
            variant="outlined"
            @click="Emitter.emit('dilog', pro)"
          >
            نظرة سريعة
          </v-btn>

          <img :src="domin + pro.img" :alt="pro.titel" loading="lazy" />

          <div class="top-actions">
            <button
              class="love-btn"
              :class="{ active: pro.loved }"
              @click="toggleLove(pro)"
            >
              <v-icon>
                {{ pro.loved ? "mdi-heart" : "mdi-heart-outline" }}
              </v-icon>
            </button>

            <span v-if="pro.discount > 0" class="discount">
              %{{ pro.discount }}
            </span>
          </div>
        </div>

        <!-- البيانات -->
        <div class="info">
          <h3 class="title">
            {{ pro.titel }}
          </h3>

          <div class="price-row">
            <template v-if="pro.discount > 0">
              <span class="old-price">
                {{
                  Math.floor(pro.price) +
                  (pro.discount / 100) * Math.floor(pro.price)
                }}
                ج.م
              </span>
            </template>

            <span class="price"> {{ Math.floor(pro.price) }} ج.م </span>
          </div>

          <p class="brand">
            العلامة التجارية :
            {{ pro.brand }}
          </p>

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
            🧃 {{ pro.Counttype }} :
            <strong>{{ pro.inCount }}</strong>
            {{ pro.inCounttype }}

            <br />

            💰 سعر {{ pro.inCounttype }} :
            <strong>
              {{ Math.floor(pro.price / pro.inCount) }}
            </strong>
            ج.م
          </div>

          <!-- الأزرار -->
          <div class="buttons">
            <v-btn
              class="cart-btn"
              @click="
                $router.push({
                  name: 'derilse',
                  params: { idparam: pro.id },
                })
              "
            >
              تفاصيل
            </v-btn>

            <v-btn class="cart-btn" @click="addToCart(pro)">
              🛒 أضف للسلة
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-box">
      <v-skeleton-loader
        type="image, article, button, button"
        class="skeleton"
      />
    </div>

    <!-- نهاية -->
    <div v-if="finished" class="finished">تم تحميل جميع المنتجات</div>
  </div>
</template>

<script>
import { mystore } from "@/store";
import { CartStore1 } from "@/store/Cart";
import { ListsStore1 } from "@/store/Lists";
import { mapActions, mapState } from "pinia";

export default {
  inject: ["Emitter"],

  data() {
    return {
      page: 1,
      loading: false,
      finished: false,
      products: [],
    };
  },

  computed: {
    ...mapState(mystore, ["Lmmitpro", "currentPage", "lastPage", "domin"]),
  },

  methods: {
    ...mapActions(mystore, ["getall2"]),
    ...mapActions(CartStore1, ["Additem2", "GetCart2"]),
    ...mapActions(ListsStore1, ["AdditemL"]),

    // تحميل المنتجات
    async loadProducts() {
      if (this.loading || this.finished) return;

      this.loading = true;

      try {
        await this.getall2(this.page);

        if (this.Lmmitpro.length > 0) {
          this.products.push(...this.Lmmitpro);
        }

        // آخر صفحة
        if (this.currentPage >= this.lastPage) {
          this.finished = true;
        } else {
          this.page++;
        }
      } catch (err) {
        console.log(err);
      }

      this.loading = false;
    },

    // Infinite Scroll
    async handleScroll() {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= fullHeight - 300) {
        await this.loadProducts();
      }
    },

    // إضافة للسلة
    async addToCart(pro) {
      if (!localStorage.getItem("token")) {
        this.Emitter.emit("sin", "يجب تسجيل الدخول أولاً");
        return;
      }

      if (pro.stock < 1) {
        this.Emitter.emit("sin", "المنتج غير متوفر حاليا");
        return;
      }

      pro.quantity = 1;

      await this.Additem2(pro);
      await this.GetCart2();

      this.Emitter.emit("cart", {
        textem2: "تم إضافة المنتج للعربة",
        act: true,
      });
    },

    // المفضلة
    toggleLove(pro) {
      pro.loved = !pro.loved;

      if (pro.loved && localStorage.getItem("token")) {
        pro.quantity = 1;
        this.AdditemL(pro);
      }
    },
  },

  async mounted() {
    await this.loadProducts();

    window.addEventListener("scroll", this.handleScroll);
  },

  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style scoped>
.products-wrapper {
  background: #f8f9fa;
  padding: 20px;
  min-height: 100vh;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.product-card {
  width: 300px;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  transition: 0.3s;
  border: 1px solid #eee;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.product-card:hover {
  transform: translateY(-5px);
}

.img-wrapper {
  position: relative;
  height: 220px;
  background: #f7f7f7;
  display: flex;
  justify-content: center;
  align-items: center;
}

.img-wrapper img {
  max-width: 80%;
  max-height: 180px;
  object-fit: contain;
}

.out-stock {
  position: absolute;
  width: 100%;
  top: 90px;
  background: rgba(255, 0, 0, 0.2);
  color: red;
  text-align: center;
  z-index: 5;
  font-weight: bold;
  padding: 8px;
}

#quick {
  position: absolute;
  top: 50%;
  opacity: 0;
  transition: 0.3s;
  z-index: 5;
}

#parantimg1:hover #quick {
  opacity: 1;
}

.top-actions {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 10px;
}

.love-btn {
  background: white;
  border: none;
  border-radius: 8px;
  padding: 6px;
  cursor: pointer;
}

.love-btn.active {
  color: red;
}

.discount {
  background: #ffdede;
  color: red;
  padding: 5px 8px;
  border-radius: 8px;
  font-weight: bold;
}

.info {
  padding: 15px;
}

.title {
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 10px;
}

.brand {
  color: #777;
  font-size: 14px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.old-price {
  text-decoration: line-through;
  color: #888;
}

.price {
  color: #6c8642;
  font-size: 18px;
  font-weight: bold;
}

.desc {
  margin-top: 10px;
  max-height: 60px;
  overflow-y: auto;
  font-size: 13px;
  color: #555;
}

.details {
  margin-top: 10px;
  background: #f9faf7;
  padding: 10px;
  border-radius: 10px;
  border-right: 4px solid #a6ce39;
  font-size: 13px;
}

.buttons {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.cart-btn {
  background: #d6b85a;
  color: white;
}

.loading-box {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.skeleton {
  width: 300px;
}

.finished {
  text-align: center;
  margin-top: 30px;
  font-weight: bold;
  color: #666;
}

/* Mobile */
@media (max-width: 600px) {
  .product-card {
    width: 100%;
  }

  .buttons {
    flex-direction: column;
  }
}
</style>
