<template>
  <div dir="rtl" class="products-wrapper">
    <div class="grid">
      <!-- المنتجات -->
      <div v-for="pro in Lmmitpro" :key="pro.id" class="product-card">
        <div id="parantimg1" class="img-wrapper">
          <!-- غير متوفر -->
          <div v-if="pro.stock < 1" class="not-available">
            <h3>المنتج غير متوفر حاليا</h3>
          </div>

          <!-- نظرة سريعة -->
          <v-btn
            @click="Emitter.emit('dilog', pro)"
            rounded
            variant="outlined"
            id="quick"
            ripple
          >
            نظره سريعه
          </v-btn>

          <!-- الصورة -->
          <img :src="domin + pro.img" :alt="pro.titel" loading="lazy" />

          <!-- الخصم والمفضلة -->
          <v-row class="top-actions">
            <button
              class="love-btn"
              :class="{ active: pro.loved }"
              @click="toggleLove(pro)"
            >
              <v-icon>
                {{ pro.loved ? "mdi-heart" : "mdi-heart-outline" }}
              </v-icon>
            </button>

            <span v-if="pro.discount > 0" id="availbel">
              %{{ pro.discount }}
            </span>
          </v-row>
        </div>

        <!-- البيانات -->
        <div class="info">
          <h3 class="title">
            {{ pro.titel }}
          </h3>

          <!-- السعر -->
          <div class="price-row">
            <template v-if="pro.discount != 0">
              <span>بدلا من</span>

              <span class="old-price">
                {{
                  Math.floor(pro.price) +
                  (pro.discount / 100) * Math.floor(pro.price)
                }}
                ج.م
              </span>

              <span>بسعر :</span>
            </template>

            <span class="price"> {{ Math.floor(pro.price) }} ج.م </span>
          </div>

          <!-- البراند -->
          <p class="brand">
            العلامة التجارية:
            {{ pro.brand }}
          </p>

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
            🧃
            <strong>{{ pro.Counttype }}:</strong>

            تحتوي على

            <strong>{{ pro.inCount }}</strong>

            {{ pro.inCounttype }}

            <br />

            💰
            <strong> سعر {{ pro.inCounttype }}: </strong>

            <span>
              {{ Math.floor(pro.price / pro.inCount) }}
            </span>

            ج.م
          </div>

          <!-- الأزرار -->
          <div class="btns-wrapper">
            <v-btn
              class="cart-btn"
              @click="
                $router.push({
                  name: 'derilse',
                  params: {
                    idparam: pro.id,
                  },
                })
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

      <!-- loading -->
      <v-container fluid v-if="loading">
        <v-row>
          <v-col cols="12">
            <v-skeleton-loader
              class="mx-auto border"
              id="cardskl"
              type="image, article, button, button"
            ></v-skeleton-loader>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- pagination -->
    <div class="pagination-wrapper">
      <v-pagination
        v-model="currentPage"
        :length="lastPage"
        rounded="circle"
        @update:modelValue="changePage"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import { ListsStore1 } from "@/store/Lists";
import { CartStore1 } from "@/store/Cart";
import { mystore } from "@/store";

import { mapActions, mapState } from "pinia";

export default {
  inject: ["Emitter"],

  data() {
    return {
      loading: false,
    };
  },

  computed: {
    ...mapState(mystore, ["Lmmitpro", "domin", "currentPage", "lastPage"]),

    ...mapState(CartStore1, ["CartProduct2"]),
  },

  methods: {
    ...mapActions(mystore, ["getall2"]),

    ...mapActions(CartStore1, ["Additem", "Additem2", "GetCart2"]),

    ...mapActions(ListsStore1, ["AdditemL"]),

    async changePage(page) {
      this.loading = true;

      await this.getall2(page);

      this.loading = false;

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },

    async Add(pro) {
      if (localStorage.getItem("token")) {
        await this.Additem2(pro);

        await this.GetCart2();
      }
    },

    funvaled(pro) {
      if (localStorage.getItem("token")) {
        this.funvaled2(pro);

        if (pro.stock >= 1) {
          this.Add(pro);

          let textem2 = "تم اضافه المنتج ف العربة";

          let act = true;

          let op = {
            textem2,
            act,
          };

          this.Emitter.emit("cart", op);
        }
      } else {
        let textem = "عشان تضيف منتج ف العربة لازم تسجل دخول الأول";

        this.Emitter.emit("sin", textem);
      }
    },

    funvaled2(pro) {
      if (pro.stock < 1) {
        let textem1 = "المنتج غير متوفر حاليا";

        this.Emitter.emit("sin", textem1);
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
    this.loading = true;

    await this.getall2(1);

    this.loading = false;
  },
};
</script>

<style scoped>
.products-wrapper {
  background: #f8f9fa;
  padding: 40px 20px;
  font-family: "Cairo", sans-serif;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 25px;
}

.product-card {
  width: 300px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e8e5da;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: 0.3s;
}

.product-card:hover {
  transform: translateY(-4px);
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

.not-available {
  position: absolute;
  top: 100px;
  left: 0;
  z-index: 5;
  width: 100%;
  background-color: lightcoral;
  text-align: center;
}

.not-available h3 {
  color: red;
}

#quick {
  position: absolute;
  opacity: 0;
  top: 50%;
  left: 35%;
  z-index: 8;
  transition: 0.3s;
}

#parantimg1:hover #quick {
  opacity: 1 !important;
}

.top-actions {
  position: absolute;
  justify-content: center;
  align-items: center;
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
}

.love-btn.active {
  background-color: #ffe7e0;
  color: #e94f37;
}

#availbel {
  color: red;
  border-radius: 5px;
  padding: 5px;
  background-color: #f5a5a5;
  position: relative;
  left: -104px;
  top: -70px;
}

.info {
  padding: 12px;
}

.title {
  font-size: 16px;
  font-weight: bold;
}

.brand {
  color: #888;
  font-size: 14px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.old-price {
  text-decoration: line-through;
}

.price {
  font-weight: bold;
  color: #6c8642;
}

.desc {
  font-size: 13px;
  color: #555;
  max-height: 60px;
  overflow-y: auto;
  margin-top: 6px;
}

.details {
  background: #f9faf7;
  border-left: 4px solid #a6ce39;
  padding: 8px;
  border-radius: 8px;
  font-size: 13px;
  margin-top: 8px;
}

.btns-wrapper {
  margin-top: 10px;
}

.cart-btn {
  background-color: #d6b85a;
  color: #fff;
  margin: 5px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

#cardskl {
  width: 18rem;
  height: 33rem;
}
</style>
