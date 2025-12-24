<template>
  <v-lazy
    :min-height="200"
    :options="{ threshold: 0.5 }"
    transition="fade-transition"
  >
    <div class="categories-slider">
      <v-container>
        <h2 class="section-title">منتجات مميزة</h2>
        <swiper
          :centeredSlides="false"
          :autoplay="{
            delay: 2500,
            disableOnInteraction: false,
          }"
          :slides-per-view="3"
          :spaceBetween="20"
          :modules="modules"
          :loop="true"
          :breakpoints="{
            320: { slidesPerView: 1, spaceBetween: 10 },
            768: { slidesPerView: 2, spaceBetween: 15 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
          }"
        >
          <swiper-slide v-for="(item, i) in top" :key="i">
            <div class="category-card">
              <div class="card-horizontal">
                <div class="image-wrapper">
                  <img
                    :src="domin + item.img"
                    :alt="item.name"
                    loading="lazy"
                  />
                </div>
                <div class="info">
                  <span class="category-name">{{ item.titel }}</span>
                  <span class="category-price"
                    >{{ Math.floor(item.price) }} ج.م</span
                  >
                  <v-btn
                    class="category-price"
                    @click="(item.quantity = 1), funvaled(item)"
                    >اضف للعربة</v-btn
                  >
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </v-container>
    </div>
  </v-lazy>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { CartStore1 } from "@/store/Cart";
import { mapActions, mapState } from "pinia";
import { mystore } from "@/store";
export default {
  components: { Swiper, SwiperSlide },
  inject: ["Emitter"],
  data() {
    return {};
  },
  computed: {
    ...mapState(mystore, ["catigoryProducts1", "domin", "top"]),
    ...mapState(CartStore1, ["CartProduct2"]),
  },
  methods: {
    ...mapActions(mystore, ["getCatigoryProduct1", "topall"]),
    ...mapActions(CartStore1, ["Additem", "Additem2", "GetCart"]),
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
    goToCategory(id) {
      this.$router.push({ name: "derilse", params: { idparam: id } });
    },
  },
  async mounted() {
    await this.getCatigoryProduct1("مميز");
    await this.topall();
  },
  setup() {
    return { modules: [Autoplay] };
  },
};
</script>

<style scoped>
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

.image-wrapper img:hover {
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

  .image-wrapper img:hover {
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
