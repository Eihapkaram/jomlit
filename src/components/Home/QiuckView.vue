<template>
  <v-dialog
    style="transition: all 0.5s ease-in-out"
    max-width="90%"
    v-model="diloge"
  >
    <div
      style="overflow-y: scroll; overflow-x: hidden"
      id="zcon"
      class="bg-white d-flex flex-column"
    >
      <v-icon
        style="
          color: white;
          background: linear-gradient(45deg, #1a1a1a, #000);
          align-self: flex-end;
          z-index: 5;
          position: fixed;
          border-radius: 50%;
          padding: 8px;
          margin: 10px;
        "
        @click="this.diloge = false"
        id="closepopup"
        >mdi-close-circle-outline</v-icon
      >

      <v-row>
        <!-- صور المنتج -->
        <v-col cols="12" lg="6" md="6" sm="12">
          <div class="text-center">
            <div
              v-if="this.SingleProduct.stock < 1"
              style="
                position: absolute;
                top: 200px;
                left: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                z-index: 5;
                width: 100%;
                height: 50px;
                background-color: lightcoral;
              "
            >
              <h3 style="color: red; font-size: bold; position: relative">
                المنتج غير متوفر حاليا
              </h3>
            </div>
            <img
              id="big-img"
              loading="lazy"
              alt="image"
              height="fit-content"
              :src="tab ? domin + tab.path : domin + this.SingleProduct.img"
              style="
                border-radius: 20px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                max-width: 400px;
                height: fit-content;
              "
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
                      :src="domin + pro.path"
                      loading="lazy"
                      alt="icon"
                  /></v-tab>
                </v-tabs>
              </swiper-slide>
            </swiper>
          </div>
        </v-col>

        <!-- تفاصيل المنتج -->
        <v-col cols="12" lg="6" md="12" sm="12" id="c2">
          <div id="con2" dir="rtl">
            <div>
              <v-card-title
                id="titl"
                class="text-h5 font-weight-bold text-end mb-2"
                style="text-align: right !important"
              >
                {{ this.SingleProduct.titel }}
              </v-card-title>

              <div class="justify-end mb-2">
                <span class="ml-2 text-grey-darken-2">التقييم:</span>
                <v-rating
                  v-model="this.SingleProduct.votes"
                  readonly
                  :length="5"
                  :size="22"
                  active-color="amber"
                />
              </div>

              <v-card-text
                class="text-subtitle-1 text-end mb-3"
                style="
                  white-space: pre-wrap;
                  color: #444;
                  text-align: right !important;
                "
              >
                {{ this.SingleProduct.description }}
              </v-card-text>

              <v-divider></v-divider>

              <div id="ditealtdiv" class="d-flex flex-column text-end mt-3">
                <span
                  ><strong>الماركة:</strong>
                  {{ this.SingleProduct.brand }}</span
                >
                <span v-if="this.SingleProduct.dimensions">
                  <strong>الأبعاد:</strong>
                  العرض {{ this.SingleProduct.dimensions.width }} / الارتفاع
                  {{ this.SingleProduct.dimensions.height }} / العمق
                  {{ this.SingleProduct.dimensions.depth }}
                </span>

                <span style="color: #558b2f" class="mt-2">
                  <v-icon color="green">mdi-refresh</v-icon>
                  سياسة الإرجاع: {{ this.SingleProduct.url }}
                </span>
                <span
                  class="text-h6 font-weight-bold mt-1"
                  style="color: #c69749"
                >
                  السعر: {{ this.SingleProduct.price }} ج.م
                </span>
                <span v-if="this.SingleProduct.stock >= 1">
                  <v-icon color="green">mdi-check-decagram</v-icon> الحالة :
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

                <v-progress-linear
                  color="amber"
                  height="10"
                  width="60%"
                  :model-value="this.SingleProduct.stock"
                  striped
                  class="my-2 rounded-lg"
                ></v-progress-linear>
                <span class="text-red-darken-1"
                  >باقي فقط {{ this.SingleProduct.stock }}
                  <strong> {{ this.SingleProduct.Counttype }}</strong> في
                  المخزون!</span
                >

                <!-- الكمية -->
                <div id="qointcon" class="mt-4">
                  <span class="text-h6 mb-2">الكمية:</span>
                  <div class="d-flex align-center justify-center">
                    <v-icon @click="muns()" id="munse" color="amber-darken-3"
                      >mdi-minus-circle-outline</v-icon
                    >
                    <input
                      id="qountbtn"
                      type="button"
                      :value="this.quint"
                      style="
                        text-align: center;
                        font-weight: bold;
                        text-align: center !important;
                      "
                    />
                    <v-icon
                      @click="this.quint++"
                      id="plus"
                      color="amber-darken-3"
                      >mdi-plus-circle-outline</v-icon
                    >
                  </div>

                  <span class="mt-2 text-subtitle-1">
                    الإجمالي:
                    {{ Math.ceil(this.SingleProduct.price) * this.quint }} ج.م
                  </span>
                </div>

                <!-- الأزرار -->
                <div class="d-flex align-center justify-center mt-5">
                  <v-btn
                    @click="this.funvaled(this.SingleProduct), (this.quint = 1)"
                    id="btnadd"
                    elevation="5"
                    style="color: black"
                    size="large"
                  >
                    <v-icon class="mr-2">mdi-cart-plus</v-icon>أضف إلى السلة

                    <v-progress-circular
                      v-if="progrssbtn"
                      indeterminate
                      color="black"
                      size="20"
                    ></v-progress-circular>
                  </v-btn>

                  <v-btn
                    id="iconlist"
                    icon="mdi-heart-outline"
                    size="large"
                    class="ml-3"
                    color="amber-darken-2"
                    variant="outlined"
                    rounded
                    @click="this.Addtolist(this.SingleProduct)"
                  ></v-btn>
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
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
                type="image,table-heading, list-item-two-line,button,button"
              ></v-skeleton-loader>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
</template>

<style scoped>
.mySwiper {
  position: relative;
  left: -50px;
}
#my-galleryimg {
  width: 100px;
}
#tabslide {
  width: 500px;
}
#cardskl {
  height: 100%;
  width: 100%;
  position: absolute;
  background-color: white;
  top: 0px;
  left: 0px;
  z-index: 20;
}
#zcon {
  scrollbar-width: thin;
  scrollbar-color: #c69749 #f8f8f8;
  text-align: right !important;
  font-family: "Cairo", "Tajawal", sans-serif !important;
}
#c2 {
  text-align: right !important;
  font-family: "Cairo", "Tajawal", sans-serif !important;
}

#zcon::-webkit-scrollbar {
  width: 5px;
}
#zcon::-webkit-scrollbar-thumb {
  background-color: #c69749;
  border-radius: 10px;
}
#zcon::-webkit-scrollbar-track {
  background-color: #f8f8f8;
}
#btnadd {
  border-radius: 30px;
  height: 50px;
  width: 260px;
  margin: 10px;
  font-weight: bold;
  letter-spacing: 1px;
}
#qountbtn {
  border-radius: 30px;
  border: 2px solid #c69749;
  height: 50px;
  width: 100px;
  margin-inline: 10px;
  font-size: 18px;
}
#titl {
  color: #1a1a1a;
}
#listicon:hover,
#btnadd:hover {
  transform: scale(1.05);
  transition: 0.3s ease;
}
* {
  direction: rtl !important;
  text-align: right !important;
}

/*/tablet/*/
@media (max-width: 991px) {
  #my-galleryimg {
    width: 50px;
  }
  .v-tab {
    margin: 0px;
  }
  #tabslide {
    width: 400px;
  }
  #c2 {
    position: relative;
    top: -150px;
    margin: 5px;
  }
  #big-img {
    width: 300px;
    height: 300px;
  }
  #cardskl {
    height: 100%;
    width: 100%;
    position: absolute;
    background-color: white;
    top: 0px;
    left: 0px;
  }
  #zcon {
    scrollbar-width: thin;
    scrollbar-color: #c69749 #f8f8f8;
  }
  #zcon::-webkit-scrollbar {
    width: 5px;
  }
  #zcon::-webkit-scrollbar-thumb {
    background-color: #c69749;
    border-radius: 10px;
  }
  #zcon::-webkit-scrollbar-track {
    background-color: #f8f8f8;
  }
  #btnadd {
    border-radius: 30px;
    height: 50px;
    width: 200px;
    margin: 10px;
    font-weight: bold;
    letter-spacing: 1px;
  }
  #qountbtn {
    border-radius: 30px;
    border: 2px solid #c69749;
    height: 50px;
    width: 100px;
    margin-inline: 10px;
    font-size: 18px;
  }
  #titl {
    color: #1a1a1a;
  }
  #listicon:hover,
  #btnadd:hover {
    transform: scale(1.05);
    transition: 0.3s ease;
  }
}
/*/mobile/*/
@media (max-width: 500px) {
  .mySwiper {
    position: relative;
    left: 10px;
    padding-inline: 10px;
  }
  #my-galleryimg {
    width: 50px;
    left: 0px;
  }
  .v-tab {
    margin: 0px;
  }
  #tabslide {
    width: 800px;
  }
  #c2 {
    position: relative;
    top: -150px;
    margin: 5px;
  }
  #big-img {
    width: 300px;
    height: 300px;
  }
  #cardskl {
    height: 100%;
    width: 100%;
    position: absolute;
    background-color: white;
    top: 0px;
    left: 0px;
  }
  #zcon {
    scrollbar-width: thin;
    scrollbar-color: #c69749 #f8f8f8;
  }
  #zcon::-webkit-scrollbar {
    width: 5px;
  }
  #zcon::-webkit-scrollbar-thumb {
    background-color: #c69749;
    border-radius: 10px;
  }
  #zcon::-webkit-scrollbar-track {
    background-color: #f8f8f8;
  }
  #btnadd {
    border-radius: 30px;
    height: 50px;
    width: 200px;
    margin: 10px;
    font-weight: bold;
    letter-spacing: 1px;
  }
  #qountbtn {
    border-radius: 30px;
    border: 2px solid #c69749;
    height: 50px;
    width: 100px;
    margin-inline: 10px;
    font-size: 18px;
  }
  #titl {
    color: #1a1a1a;
  }
  #listicon:hover,
  #btnadd:hover {
    transform: scale(1.05);
    transition: 0.3s ease;
  }
}
</style>

<script>
/*import $ from "jquery";*/
import { CartStore1 } from "@/store/Cart";
import { ListsStore1 } from "@/store/Lists";
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";
// Import Swiper styles
import "swiper/css";
import "swiper/css/scrollbar";
// import required modules
import { Scrollbar } from "swiper/modules";
// import required modules
import { Navigation, Mousewheel, Keyboard } from "swiper/modules";

import { mystore } from "@/store";
import { mapState, mapActions } from "pinia";
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
      diloge: false,
      SingleProduct: "",
      tab: "",
      progrssbtn: false,
      loading: "",
    };
  },
  setup() {
    return {
      modules: [Navigation, Mousewheel, Keyboard, Scrollbar],
    };
  },
  computed: { ...mapState(mystore, ["SingleProduct", "domin"]) },
  methods: {
    ...mapActions(mystore, ["getSingle"]),
    ...mapActions(CartStore1, ["Additem2"]),
    ...mapActions(ListsStore1, ["AdditemL"]),
    Add(item) {
      this.SingleProduct.quantity = this.quint;
      this.Additem2(item);
      this.quint = 1;
      let textem2 = "تم اضافه المنتج ف العربة";
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
    Addtolist(item) {
      this.SingleProduct.quantity = this.quint;
      this.AdditemL(item);
      window.iconlist.style.color = "red";
      window.iconlist.style.border = "1px solid red";
      window.iconlist.style.borderRadius = "100px";
    },
    muns() {
      let q = this.quint;
      if (q == 1) {
        return;
      } else {
        this.quint--;
      }
    },
    fun() {},
  },
  async mounted() {
    this.Emitter.on("dilog", (data) => {
      this.diloge = true;
      this.loading = true;
      this.SingleProduct = "";
      setTimeout(() => {
        this.loading = false;
        this.SingleProduct = data;
      }, 3000);

      if (this.SingleProduct) {
        document.querySelectorAll("#my-galleryimg").forEach((el) => {
          el.onclick = () => {
            const sr = el.getAttribute("src");
            document.querySelector("#big-img").src = sr;
          };
        });
      }
    });

    window.scroll(0, 0);
  },
};
</script>
