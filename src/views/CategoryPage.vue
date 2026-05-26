<template>
  <span v-if="!catigoryProducts?.product?.length && !load">
    لم يتم العثور على منتجات
  </span>

  <!-- البانر -->
  <v-container fluid v-if="catigoryProducts?.banner">
    <banner width="100%" style="position: relative">
      <img
        height="fit-content"
        width="100%"
        style="box-sizing: border-box; width: cover"
        loading="lazy"
        alt="banner"
        :src="domin + catigoryProducts.banner"
      />
    </banner>
  </v-container>

  <v-lazy
    :min-height="200"
    :options="{ threshold: 0.5 }"
    transition="fade-transition"
  >
    <!-- loader أول تحميل -->
    <v-progress-linear
      color="blue"
      indeterminate
      v-if="load"
    ></v-progress-linear>

    <div class="grid">
      <div
        v-for="pro in catigoryProducts?.product || []"
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
            @click="Emitter.emit('dilog', pro)"
            rounded
            variant="outlined"
            id="quick"
            ripple
          >
            نظره سريعه
          </v-btn>

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
              <v-icon>
                {{ pro.loved ? "mdi-heart" : "mdi-heart-outline" }}
              </v-icon>
            </button>

            <span v-if="pro.discount > 0" id="availbel" class="d-flex">
              %{{ pro.discount }}
            </span>
          </v-row>
        </div>

        <div class="info">
          <h3 class="title">{{ pro.titel }}</h3>

          <div class="price-row">
            <span v-if="pro.discount != 0">بدلا من </span>

            <span
              v-if="pro.discount != 0"
              style="text-decoration: line-through"
            >
              {{
                Math.floor(pro.price) +
                (pro.discount / 100) * Math.floor(pro.price)
              }}
              ج.م
            </span>

            <span v-if="pro.discount != 0">بسعر :</span>

            <span class="price"> {{ Math.floor(pro.price) }} ج.م </span>
          </div>

          <p class="brand">العلامة التجارية: {{ pro.brand }}</p>

          <v-rating
            v-model="pro.votes"
            readonly
            :length="5"
            :size="18"
            active-color="#d4a017"
          />

          <div class="desc">
            {{ pro.description }}
          </div>

          <div class="details">
            🧃 <strong>{{ pro.Counttype }}:</strong>
            تحتوي على
            <strong>{{ pro.inCount }}</strong>
            {{ pro.inCounttype }}

            <br />

            💰 <strong>سعر {{ pro.inCounttype }}:</strong>

            <span>
              {{ Math.floor(pro.price / pro.inCount) }}
            </span>

            ج.م
          </div>

          <div>
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

            <v-btn class="cart-btn" @click="(pro.quantity = 1), funvaled(pro)">
              🛒 أضف للسلة
            </v-btn>
          </div>
        </div>
      </div>

      <!-- infinite scroll loading -->
      <v-container fluid v-if="loadingMore">
        <v-row justify="center">
          <v-col cols="12" md="4">
            <v-skeleton-loader
              class="mx-auto border"
              type="image, article, button, button"
            ></v-skeleton-loader>
          </v-col>
        </v-row>
      </v-container>
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
    return {
      load: false,
      loadingMore: false,
    };
  },

  computed: {
    ...mapState(mystore, [
      "searchrsult",
      "catigoryProducts",
      "domin",
      "currentPage",
      "lastPage",
    ]),
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

    async loadMore() {
      // منع تكرار الطلبات
      if (this.loadingMore) return;

      // لو وصلنا لآخر صفحة
      if (this.currentPage >= this.lastPage) return;

      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      const windowHeight = window.innerHeight;

      const fullHeight = document.documentElement.scrollHeight;

      // تحميل قبل نهاية الصفحة بـ 250px
      if (scrollTop + windowHeight >= fullHeight - 250) {
        this.loadingMore = true;

        try {
          await this.getCatigoryProduct(
            this.$route.params.catigory,
            this.currentPage + 1,
          );
        } catch (err) {
          console.log(err);
        } finally {
          this.loadingMore = false;
        }
      }
    },

    async firstLoad() {
      this.load = true;

      try {
        await this.getCatigoryProduct(this.$route.params.catigory, 1);
      } catch (err) {
        console.log(err);
      } finally {
        this.load = false;
      }
    },
  },

  async mounted() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    await this.firstLoad();

    // تحسين الأداء
    window.addEventListener("scroll", this.loadMore, {
      passive: true,
    });
  },

  beforeUnmount() {
    window.removeEventListener("scroll", this.loadMore);
  },

  watch: {
    async $route() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      await this.firstLoad();
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap");

* {
  font-family: "Cairo", sans-serif;
}
.section-title {
  color: #c79a00;
  font-weight: bold;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #c79a00;
  display: inline-block;
  padding-bottom: 0.3rem;
}
#topcato {
  direction: rtl;
  margin: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #faf9f6;
  padding: 30px 20px;
  border-radius: 20px;
  width: 100%;
}
.category-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.card-horizontal {
  display: flex;
  flex-direction: row-reverse; /* الصورة على اليمين */
  align-items: center;
  gap: 1rem;
}

.image-wrapper {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  background: #fafafa;
}

.image-wrapper img {
  width: fit-content;
  height: 100%;
  transition: all 0.3s ease;
}

.info {
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.categories-slider {
  direction: rtl; /* اتجاه عربي */
  background-color: #f4f4f4;
  padding: 2rem 0;
}
.categories-grid-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 24px;
  justify-items: center;
  align-items: center;
  max-width: 900px;
  width: 100%;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: 0.3s ease;
}

.category-item img {
  width: 100%;
  max-width: 150px;
  transition: 0.3s ease;
}

.category-name {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.category-price {
  font-weight: bold;
  color: #c79a00;
  margin-top: 0.3rem;
  font-size: 0.95rem;
}

.categories-slider {
  background: linear-gradient(180deg, #f7f7f5, #ffffff);
  border-radius: 16px;
  padding: 20px 10px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.05);
}

.section-title {
  text-align: center;
  font-weight: 800;
  color: #c79a00;
  margin-bottom: 16px;
  font-size: 1.4rem;
}

.category-card {
  background: #fff;
  border-radius: 14px;
  padding: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
  transition: 0.3s ease;
}
.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.1);
}

.card-horizontal {
  display: flex;
  align-items: center;
  gap: 14px;
}

.image-wrapper {
  width: 100px;
  height: 90px;
  border-radius: 10px;
  overflow: hidden;
}

.image-wrapper img {
  width: fit-content;
  height: 100%;
  transition: all 0.3s ease;
}
.info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

#con {
  margin: 0px;
}

/* استجابة */
@media (max-width: 768px) {
  .card-horizontal {
    flex-direction: column-reverse;
    text-align: center;
  }
  .image-wrapper {
    width: 100px;
    height: 100px;
  }
  .categories-slider {
    direction: rtl; /* اتجاه عربي */
    background-color: #f4f4f4;
    padding: 2rem 0;
  }

  .section-title {
    color: #c79a00;
    font-weight: bold;
    font-size: 2rem;
    text-align: center;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #c79a00;
    display: inline-block;
    padding-bottom: 0.3rem;
  }

  .category-card {
    background-color: #fff;
    border-radius: 12px;
    padding: 0.5rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .category-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  }

  .card-horizontal {
    display: flex;
    flex-direction: row-reverse; /* الصورة على اليمين */
    align-items: center;
    gap: 1rem;
  }

  .image-wrapper {
    width: 120px;
    height: 120px;
    border-radius: 12px;
    overflow: hidden;
    flex-shrink: 0;
    background: #fafafa;
  }

  .image-wrapper img {
    width: fit-content;
    height: 100%;
    transition: all 0.3s ease;
  }

  .info {
    text-align: right;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .category-name {
    font-weight: 600;
    color: #333;
    font-size: 1rem;
  }

  .category-price {
    font-weight: bold;
    color: #c79a00;
    margin-top: 0.3rem;
    font-size: 0.95rem;
  }
}
</style>
