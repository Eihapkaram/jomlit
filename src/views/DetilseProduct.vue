<template>
  <v-lazy
    :min-height="200"
    :options="{ threshold: 0.5 }"
    transition="fade-transition"
  >
    <div id="zcon" dir="rtl">
      <v-row>
        <!-- صور المنتج -->
        <v-col id="c1" cols="12" lg="6" md="6" sm="12">
          <div class="text-center">
            <div v-if="this.SingleProduct.stock < 1" id="avol">
              <h3 style="color: red; font-size: bold; position: relative">
                المنتج غير متوفر حاليا
              </h3>
            </div>
            <img
              id="big-img"
              :src="tab ? domin + tab.path : domin + this.SingleProduct.img"
              :alt="this.SingleProduct.titel"
              loading="lazy"
            />
            <swiper
              :scrollbar="{ hide: true }"
              :pagination="{ clickable: true }"
              :navigation="true"
              :mousewheel="true"
              :keyboard="true"
              :slides-per-view="2"
              :spaceBetween="3"
              :modules="modules"
              class="mySwiper"
            >
              <swiper-slide id="swip">
                <v-tabs
                  id="tabslide"
                  center-active
                  v-model="tab"
                  style="height: 300px"
                >
                  <v-tab
                    v-for="(pro, index) in this.SingleProduct.images"
                    :key="index"
                    :value="pro"
                    ><img
                      id="my-galleryimg"
                      loading="lazy"
                      alt="image"
                      :src="domin + pro.path"
                  /></v-tab>
                </v-tabs>
              </swiper-slide>
            </swiper>
          </div>
        </v-col>

        <!-- تفاصيل المنتج -->
        <v-col cols="12" lg="6" md="12" sm="12" id="c2">
          <div id="con2" class="product-details">
            <v-card elevation="3" class="pa-6 rounded-xl food-card">
              <v-card-title
                class="text-h5 font-weight-bold green-text mb-3 d-flex align-center"
              >
                <v-icon color="green-darken-3" class="mr-2"
                  >mdi-food-apple</v-icon
                >
                {{ this.SingleProduct.titel }}
              </v-card-title>
              <div class="d-flex align-center mb-2">
                <v-rating
                  v-model="this.SingleProduct.votes"
                  readonly
                  density="compact"
                  :length="5"
                  color="amber"
                  class="mr-2"
                />
                <span class="text-grey"
                  >({{ this.Reviwes.length }} تقييم )</span
                >
              </div>

              <v-card-text class="mb-3 desc-text">
                {{ this.SingleProduct.description }}
              </v-card-text>

              <v-divider class="my-4" color="green"></v-divider>

              <div
                id="ditealtdiv"
                class="d-flex flex-column gap-2 details-text"
              >
                <span
                  ><v-icon color="green">mdi-leaf</v-icon> العلامة التجارية:
                  {{ this.SingleProduct.brand }}</span
                >
                <span v-if="this.SingleProduct.dimensions">
                  <v-icon color="green">mdi-ruler-square</v-icon>
                  الأبعاد: {{ this.SingleProduct.dimensions.width }} ×
                  {{ this.SingleProduct.dimensions.height }} ×
                  {{ this.SingleProduct.dimensions.depth }}
                </span>

                <span style="color: #558b2f" class="mt-2">
                  <v-icon color="green">mdi-refresh</v-icon>
                  سياسة الإرجاع: {{ this.SingleProduct.url }}
                </span>

                <span class="text-h6 mt-2 font-weight-bold green-text">
                  <v-icon color="amber">mdi-cash-multiple</v-icon>
                  السعر: {{ this.SingleProduct.price }} ج.م
                </span>

                <span v-if="this.SingleProduct.stock >= 1"
                  ><v-icon color="green">mdi-check-decagram</v-icon> الحالة:
                  {{
                    this.SingleProduct.availabilityStatus
                      ? this.SingleProduct.availabilityStatus
                      : "متوفر"
                  }}</span
                >
                <span
                  color="red"
                  style="display: flex"
                  class="mt-2 text-denger"
                  v-if="this.SingleProduct.stock < 1"
                >
                  <v-icon color="red">mdi-clock-outline</v-icon>الحالة :

                  <h3 style="color: red; font-size: bold">
                    المنتج غير متوفر حاليا
                  </h3>
                </span>

                <span
                  class="mt-2 text-success"
                  v-if="this.SingleProduct.stock >= 1"
                >
                  <v-icon color="green">mdi-clock-outline</v-icon>
                  أسرع بالشراء! متبقي {{ this.SingleProduct.stock }}
                  <strong> {{ this.SingleProduct.Counttype }}</strong>
                  بالمخزون
                </span>

                <v-progress-linear
                  color="green"
                  height="8"
                  rounded
                  :model-value="this.SingleProduct.stock"
                  striped
                ></v-progress-linear>

                <div class="mt-4 d-flex align-center justify-space-between">
                  <span class="text-h6 green-text">الكمية:</span>
                  <div class="quantity-control">
                    <v-icon @click="muns()" color="grey-darken-1" id="munse"
                      >mdi-minus-circle-outline</v-icon
                    >
                    <input id="qountbtn" type="button" :value="this.quint" />
                    <v-icon @click="this.quint++" color="green" id="plus"
                      >mdi-plus-circle-outline</v-icon
                    >
                  </div>
                  <span class="text-subtitle-2 font-weight-medium green-text">
                    الإجمالي:
                    {{ Math.ceil(this.SingleProduct.price) * this.quint }} ج.م
                  </span>
                </div>

                <div class="mt-5 d-flex align-center justify-space-between">
                  <v-btn
                    @click="this.funvaled(this.SingleProduct), (this.quint = 1)"
                    color="green-darken-2"
                    class="text-white px-6 rounded-lg"
                    id="btnadd"
                  >
                    <v-icon left color="amber">mdi-cart-heart</v-icon>
                    أضف إلى السلة
                    <v-progress-circular
                      v-if="progrssbtn"
                      indeterminate
                      size="18"
                      color="amber"
                      class="ml-2"
                    ></v-progress-circular>
                  </v-btn>

                  <v-btn
                    icon
                    color="amber"
                    id="iconlist"
                    class="hover-scale"
                    @click="this.Addtolist(this.SingleProduct)"
                  >
                    <v-icon>mdi-heart-outline</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-card>
          </div>

          <!-- المراجعات -->
          <div id="revews">
            <v-divider class="mb-4"></v-divider>

            <v-card-title
              style="
                font-weight: bold;
                font-size: 22px;
                display: flex;
                align-items: center;
                gap: 8px;
                color: #2c3e50;
              "
            >
              <v-icon color="amber" size="26"
                >mdi-comment-multiple-outline</v-icon
              >
              آراء العملاء
            </v-card-title>

            <v-list-item style="width: 100%">
              <span
                style="display: flex"
                class="mt-2 text-denger"
                v-if="this.Reviwes.length < 1"
              >
                <h3 style="color: black; font-size: bold">
                  لا تتوفر مراجعات لهذا المنتج
                  <v-icon color="amber" size="26"
                    >mdi-comment-multiple-outline</v-icon
                  >
                </h3>
              </span>
              <transition-group name="fade" tag="div" style="width: 100%">
                <v-card
                  v-for="(rev, i) in this.Reviwes"
                  :key="i"
                  elevation="2"
                  style="
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                    background-color: #fff;
                    border-radius: 12px;
                    padding: 15px 20px;
                    margin-bottom: 12px;
                    transition: 0.3s;
                  "
                  @mouseover="
                    (event) =>
                      (event.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(0,0,0,0.1)')
                  "
                  @mouseleave="
                    (event) => (event.currentTarget.style.boxShadow = '')
                  "
                >
                  <v-avatar
                    v-if="rev.user.img !== 'null'"
                    :image="domin + rev.user.img"
                    size="48"
                  ></v-avatar>

                  <v-avatar
                    v-if="rev.user.img == 'null'"
                    color="grey-lighten-3"
                    size="48"
                  >
                    <v-icon color="grey">mdi-account</v-icon>
                  </v-avatar>

                  <div
                    style="display: flex; flex-direction: column; width: 100%"
                  >
                    <v-card-subtitle
                      style="font-weight: 600; color: #34495e; font-size: 15px"
                    >
                      {{ rev.user.name }} {{ rev.user.last_name }}
                      <span style="color: #888; font-size: 13px">يقول:</span>
                    </v-card-subtitle>

                    <v-card-text
                      style="
                        background-color: #f9f9f9;
                        border-radius: 10px;
                        padding: 10px 12px;
                        font-size: 14.5px;
                        color: #333;
                        line-height: 1.6;
                        border: 1px solid #eee;
                      "
                    >
                      {{ rev.comment }}
                    </v-card-text>
                  </div>
                </v-card>
              </transition-group>
            </v-list-item>
          </div>
          <form
            @submit.prevent="funvaledcom(this.$route.params.idparam)"
            style="
              background-color: #fff;
              padding: 20px;
              border-radius: 14px;
              margin-top: 10px;
              border: 1px solid #eee;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
              width: 100%;
            "
          >
            <v-text-field
              counter
              width="90%"
              style="
                position: relative;
                left: -20px;
                background-color: #fafafa;
                border-radius: 10px;
              "
              placeholder="أدخل تعليقك هنا..."
              name="revewe"
              v-model="reveiwe"
              variant="outlined"
              color="amber"
            ></v-text-field>

            <v-btn
              type="submit"
              color="amber"
              rounded
              class="text-white"
              style="
                font-weight: bold;
                font-size: 15px;
                margin-top: 8px;
                padding: 10px 25px;
              "
            >
              <v-icon left>mdi-send</v-icon> نشر
            </v-btn>
          </form>
        </v-col>
      </v-row>
    </div>
  </v-lazy>
</template>

<script>
import { CartStore1 } from "@/store/Cart";
import { ListsStore1 } from "@/store/Lists";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/scrollbar";
import { Scrollbar } from "swiper/modules";
import { Navigation, Mousewheel, Keyboard } from "swiper/modules";
import { mystore } from "@/store";
import { mapState, mapActions } from "pinia";
import axios from "axios";

export default {
  inject: ["Emitter"],
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      quint: 1,
      iconcolor: "red",
      progrssbtn: false,
      reveiwe: "",
      tab: null,
    };
  },
  setup() {
    return {
      modules: [Navigation, Mousewheel, Keyboard, Scrollbar],
    };
  },
  computed: { ...mapState(mystore, ["SingleProduct", "Reviwes", "domin"]) },
  watch: {
    SingleProduct: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (newVal && newVal.img) {
          // 👇 نرجع للصورة الأساسية بتاعة المنتج الجديد
          this.tab = null;
          const bigImg = document.querySelector("#big-img");
          if (bigImg) bigImg.src = this.domin + newVal.img;
        }
      },
    },
  },
  methods: {
    ...mapActions(mystore, ["getSingle", "getReviwes"]),
    ...mapActions(CartStore1, ["Additem2"]),
    ...mapActions(ListsStore1, ["AdditemL"]),
    Add(item) {
      this.SingleProduct.quantity = this.quint;
      this.Additem2(item);
      this.quint = 1;
      let textem2 = "تم الاضافه ف العربة";
      let act = true;
      let op = { textem2, act };
      this.Emitter.emit("cart", op);
      window.addtext.style.display = "none";
      this.progrssbtn = true;
    },
    funvaled(pro) {
      if (localStorage.getItem("token")) {
        this.funvaled2(pro);
        if (pro.stock >= 1) {
          this.Add(pro);
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
    funvaledcom(id) {
      if (localStorage.getItem("token")) {
        this.Addrev(id);
      } else {
        let textem = "عشان تضيف مراجعه علي  منتج لازم تسجل دخول الأول";
        this.Emitter.emit("sin", textem);
      }
    },
    async Addrev(id) {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.post(
          `${this.domin}add/reviweForProdict/${id}`,
          { comment: this.reveiwe },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("تم إضافة المراجعة:", res.data);
      } catch (err) {
        console.error(err.response?.data || err);
      }
      await this.getReviwes(this.$route.params.idparam);
    },
    Addtolist(item) {
      this.SingleProduct.quantity = this.quint;
      this.AdditemL(item);
      window.iconlist.style.color = "red";
      window.iconlist.style.border = "1px solid red";
      window.iconlist.style.borderRadius = "100px";
    },
    muns() {
      let q = this.quint;
      if (q == 1) return;
      else this.quint--;
    },
  },

  async mounted() {
    await this.getSingle(this.$route.params.idparam);
    await this.getReviwes(this.$route.params.idparam);
    setTimeout(() => {}, 100);
    window.scroll(0, 0);

    document.querySelectorAll("#my-galleryimg").forEach((el) => {
      el.onclick = () => {
        const sr = el.getAttribute("src");
        document.querySelector("#big-img").src = sr;
      };
    });
    document.title = `${this.SingleProduct.titel} | جملة الجملة`;
    let desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", this.SingleProduct.description);
  },
  unmounted() {
    document.querySelector("#big-img").src = "";
  },
};
</script>

<style scoped>
#big-img {
  height: 400px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  max-width: 400px;
}
#c2 {
  position: relative;
  left: 30px;
}
.mySwiper {
  position: relative;
  left: -120px;
  margin-bottom: 50px;
}
#my-galleryimg {
  width: 130px;
  height: fit-content;
  max-height: 190px;
}
#tabslide {
  width: 500px;
  position: relative;
  margin-bottom: 5px;
}
.food-card {
  background: linear-gradient(160deg, #ffffff, #f8fdf8);
  border: 1px solid #d6eadf;
  transition: all 0.3s ease;
}
.food-card:hover {
  box-shadow: 0 8px 24px rgba(85, 139, 47, 0.2);
  transform: translateY(-3px);
}

.green-text {
  color: #388e3c !important;
}

.text-grey {
  color: #9e9e9e;
}

.product-gallery {
  background-color: #f4f8f4;
  padding: 15px;
  border-radius: 16px;
}

.main-image {
  border-radius: 14px;
  object-fit: cover;
  width: 100%;
  box-shadow: 0 4px 10px rgba(56, 142, 60, 0.25);
}

.gallery-card {
  background-color: #f0f9f0;
  border-radius: 10px;
  transition: all 0.3s ease;
  overflow: hidden;
  border: 1px solid #cde7c7;
}
.gallery-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 12px rgba(85, 139, 47, 0.3);
}
.gallery-thumb {
  width: 100%;
  height: 100px;
  object-fit: cover;
}

.desc-text {
  color: #4e5d4b;
  line-height: 1.7;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
}
#qountbtn {
  width: 45px;
  height: 35px;
  border-radius: 8px;
  border: 1px solid #81c784;
  text-align: center;
  background: #f9fff9;
  color: #2e7d32;
  font-weight: bold;
}
.hover-scale:hover {
  transform: scale(1.1);
  transition: 0.25s;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
#zcon {
  direction: rtl;
  text-align: right;
  position: relative;
  top: 50px;
}
#titl {
  font-weight: bold;
  color: #222;
}
#btnadd {
  border-radius: 30px;
  height: 50px;
  width: 500px;
}
#listicon {
  border-radius: 50px;
  margin-right: 10px;
  transition: all 0.3s;
}
#listicon:hover {
  transform: scale(1.1);
}
#qountbtn {
  border: 2px solid #444;
  border-radius: 30px;
  width: 150px;
  height: 50px;
}
#titl {
  font-weight: bold;
}
#ditealtdiv {
  justify-content: flex-start;
}
#listicon {
  border-radius: 50px;
  position: relative;
  top: -6px;
  margin-left: 10px;
  transition: all, 2s;
}
#btnadd {
  border-radius: 30px;
  height: 50px;
  width: 500px;
}
#qointcon {
  display: flex;
  flex-flow: column;
  position: relative;
  left: -280px;
}
#qountbtn {
  position: relative;
  height: 50px;
  left: 0px;
  border-radius: 30px;
  border: 2px solid black;
  width: 150px;
}
#plus {
  position: relative;
  left: -40px;
  z-index: 3;
}
#munse {
  position: relative;
  left: 40px;
  z-index: 3;
}
#revews {
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 👈 يبدأ من فوق */
  align-items: stretch;
  align-content: center;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  margin-top: 30px;
  height: 500px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #cfcfcf #fafafa;
}

#revews::-webkit-scrollbar {
  width: 6px;
}
#revews::-webkit-scrollbar-thumb {
  background-color: #bbb;
  border-radius: 10px;
}
#revews::-webkit-scrollbar-thumb:hover {
  background-color: #888;
}
#avol {
  position: absolute;
  top: 300px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  z-index: 5;
  width: 100%;
  height: 50px;
  background-color: lightcoral;
}

/* Tablet */
@media (max-width: 991px) {
  #plus {
    position: relative;
    left: 50px;
    z-index: 3;
  }
  #munse {
    position: relative;
    left: -50px;
    z-index: 3;
  }
  #c2 {
    position: relative;
    left: -60px;
    top: -200px;
  }
  .food-card {
    background: linear-gradient(160deg, #ffffff, #f8fdf8);
    border: 1px solid #d6eadf;
    left: 20px;
    transition: all 0.3s ease;
    width: 100%;
  }
  #con2 {
    margin-left: 10px;
  }
  .mySwiper {
    position: relative;
    left: -80px;
    width: 400px;
    margin-bottom: 60px;
  }
  #my-galleryimg {
    width: 100px;
    height: fit-content;
    max-height: 150px;
  }
  #btnadd {
    border-radius: 30px;
    height: 50px;
    width: 250px;
    margin-left: 0px;
  }
  #qointcon {
    display: flex;
    flex-flow: column;
    width: fit-content;
    position: relative;
    left: -5px;
  }
  #listicon {
    border-radius: 50px;
    position: relative;
    top: -6px;
    margin-left: 3px;
    transition: all, 2s;
  }
  #zcon {
    width: 90%;
    position: relative;
    top: 20px;
  }
  #big-img {
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    position: relative;
    left: -40px;
    max-width: 350px;
  }
  #listicon {
    border-radius: 50px;
    position: relative;
    top: -6px;
    margin-left: 5px;
    transition: all, 2s;
  }
  #tabslide {
    width: 400px;
  }
  #avol {
    position: absolute;
    top: 160px;
    left: -40px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    z-index: 5;
    width: 100%;
    height: 50px;
    background-color: lightcoral;
  }
}
/* Mobile */
@media (max-width: 500px) {
  #plus {
    position: relative;
    left: 50px;
    z-index: 3;
  }
  #munse {
    position: relative;
    left: -50px;
    z-index: 3;
  }
  #avol {
    position: absolute;
    top: 147px;
    left: -27px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    z-index: 5;
    width: 100%;
    height: 50px;
    background-color: lightcoral;
  }
  #c2 {
    position: relative;
    left: -25px;
    top: -200px;
  }
  .food-card {
    background: linear-gradient(160deg, #ffffff, #f8fdf8);
    border: 1px solid #d6eadf;
    transition: all 0.3s ease;
    width: 110%;
  }
  #con2 {
    margin-left: 0px;
  }
  .mySwiper {
    position: relative;
    left: -20px;
    width: 350px;
    margin-bottom: 30px;
  }
  #my-galleryimg {
    width: 80px;
    height: fit-content;
    max-height: 150px;
  }
  #btnadd {
    border-radius: 30px;
    height: 50px;
    width: 230px;
    margin-left: 0px;
  }
  #qointcon {
    display: flex;
    flex-flow: column;
    width: fit-content;
    position: relative;
    left: -5px;
  }
  #listicon {
    border-radius: 50px;
    position: relative;
    top: -6px;
    margin-left: 3px;
    transition: all, 2s;
  }
  #zcon {
    width: 90%;
    position: relative;
    top: 20px;
  }
  #big-img {
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    position: relative;
    left: -25px;
    max-width: 300px;
    height: fit-content;
  }
  #listicon {
    border-radius: 50px;
    position: relative;
    top: -6px;
    margin-left: 5px;
    transition: all, 2s;
  }
  #tabslide {
    width: 400px;
  }
}
</style>
