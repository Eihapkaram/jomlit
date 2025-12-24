<template>
  <v-lazy
    :min-height="200"
    :options="{ threshold: 0.5 }"
    transition="fade-transition"
  >
    <v-row id="con" class="d-flex flex-row">
      <v-progress-linear color="blue" indeterminate v-if="load" />

      <!-- البانر -->
      <v-container fluid>
        <banner width="100%">
          <img
            height="fit-content"
            width="100%"
            style="box-sizing: border-box; width: cover"
            :src="domin + searchCatigoryby[0].categories[0].banner"
          />
        </banner>
      </v-container>

      <!-- الأقسام: صورة + اسم فقط -->
      <v-container fluid id="topcato">
        <h2 class="section-title">الاصناف {{ this.$route.params.idp }}</h2>
        <div class="categories-grid">
          <div
            class="category-item"
            v-for="pro in displayedCategories"
            :key="pro.id"
          >
            <v-card
              height="200px"
              style="
                display: flex;
                align-content: center;
                justify-content: center;
              "
              @click="
                this.$router.push({
                  name: 'catigory',
                  params: { catigory: pro.name },
                })
              "
              class="category-item"
            >
              <img
                @click="
                  this.$router.push({
                    name: 'catigory',
                    params: { catigory: pro.name },
                  })
                "
                :src="domin + pro.img"
                :alt="pro.name"
                loading="lazy"
              />

              <h2 class="category-name" style="margin-block: 5px">
                {{ pro.name }}
              </h2>
            </v-card>
          </div>
          <div id="catgoryitem">
            <v-card
              id="catgoryitem"
              class="d-flex flex-column align-center justify-center"
              elevation="4"
              @click="toggleShowMore"
              style="cursor: pointer; height: 200px; width: 160px"
            >
              <v-icon size="60" color="#c79a00">
                {{
                  showAll
                    ? "mdi-minus-circle-outline"
                    : "mdi-plus-circle-outline"
                }}
              </v-icon>
              <span
                style="
                  margin-top: 10px;
                  font-weight: 600;
                  color: #c79a00;
                  font-size: 1.1rem;
                "
              >
                {{ showAll ? "عرض أقل" : "عرض المزيد" }}
              </span>
            </v-card>
          </div>
        </div>
      </v-container>

      <!-- منتجات مميزة -->
      <v-container fluid>
        <div class="categories-slider">
          <v-container>
            <h2 class="section-title">الاكثر مبيعا</h2>

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
              <swiper-slide v-for="(item, i) in topsoldproducts" :key="i">
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
      </v-container>
    </v-row>
  </v-lazy>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper/modules";
import { mystore } from "@/store";
import { ListsStore1 } from "@/store/Lists";
import { CartStore1 } from "@/store/Cart";
import { mapActions, mapState } from "pinia";
import "swiper/css";
import "swiper/css/scrollbar";

export default {
  inject: ["Emitter"],
  components: { Swiper, SwiperSlide },
  data() {
    return {
      load: false,
      showAll: false,
    };
  },
  methods: {
    ...mapActions(mystore, [
      "searchCatigorybyname",
      "getCatigoryProduct1",
      "topsold",
    ]),
    ...mapActions(CartStore1, ["Additem", "Additem2", "GetCart"]),
    ...mapActions(ListsStore1, ["AdditemL", "updateL"]),
    toggleShowMore() {
      this.showAll = !this.showAll;
    },
    goToCategory(id) {
      this.$router.push({ name: "derilse", params: { idparam: id } });
    },
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
  },
  setup() {
    return { modules: [Autoplay] };
  },
  computed: {
    ...mapState(mystore, [
      "searchCatigoryby",
      "catigoryProducts1",
      "domin",
      "topsoldproducts",
    ]),
    displayedCategories() {
      return this.showAll
        ? this.searchCatigoryby[0].categories
        : this.searchCatigoryby[0].categories.slice(0, 6);
    },
  },
  async mounted() {
    await this.getCatigoryProduct1("الاكثر");
    this.topsold(this.$route.params.catigory);
    await this.searchCatigorybyname(this.$route.params.catigory);
    window.scroll(0, 0);
    this.load = true;

    setTimeout(() => {
      this.load = false;
    }, 500);

    document.title = `${this.$route.params.catigory} | جملة الجملة`;

    let desc = document.querySelector('meta[name="description"]');
    if (desc)
      desc.setAttribute(
        "content",
        `منتجات قسم ${this.$route.params.catigory} بالجملة من السوق المصري.`
      );
  },
  watch: {
    $route() {
      this.load = true;
      setTimeout(() => {
        this.searchCatigorybyname(this.$route.params.catigory);
        this.topsold(this.$route.params.catigory);
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
