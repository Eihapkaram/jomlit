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
                <span class="text-grey">({{ this.countReviws }} تقييم )</span>
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

          <!-- حاوية المراجعات -->
          <div class="reviews-section-container">
            <div class="reviews-header-block">
              <div class="d-flex align-center gap-2">
                <v-icon color="green-darken-2" size="28"
                  >mdi-forum-outline</v-icon
                >
                <span class="header-title-text">آراء وتقييمات العملاء</span>
              </div>
              <v-chip
                color="green-lighten-5"
                text-color="green-darken-3"
                class="font-weight-bold"
                size="small"
              >
                {{ this.Reviwes.length }} مراجعة
              </v-chip>
            </div>

            <!-- قائمة عرض التعليقات -->
            <div id="revews" class="reviews-scroll-area">
              <v-list-item class="pa-0 w-100">
                <div class="no-reviews-fallback" v-if="this.Reviwes.length < 1">
                  <v-icon color="grey-lighten-1" size="44" class="mb-2"
                    >mdi-message-draw</v-icon
                  >
                  <div class="text-subtitle-1 font-weight-bold text-slate-700">
                    لا توجد مراجعات بعد
                  </div>
                  <div class="text-caption text-grey">
                    شاركنا رأيك وكن أول من يكتب مراجعة لهذا المنتج!
                  </div>
                </div>

                <transition-group name="fade" tag="div" class="w-100">
                  <div
                    v-for="(rev, i) in this.Reviwes"
                    :key="i"
                    class="review-modern-card"
                  >
                    <v-avatar
                      v-if="rev.user.img !== 'null'"
                      :image="domin + rev.user.img"
                      size="44"
                      class="review-user-avatar elevation-1"
                    ></v-avatar>

                    <v-avatar
                      v-if="rev.user.img == 'null'"
                      color="green-lighten-5"
                      size="44"
                      class="review-user-avatar"
                    >
                      <v-icon color="green-darken-2" size="20"
                        >mdi-account</v-icon
                      >
                    </v-avatar>

                    <div class="review-body-content">
                      <div class="review-top-meta">
                        <span class="user-fullname">
                          {{ rev.user.name }} {{ rev.user.last_name }}
                        </span>

                        <div class="review-action-group">
                          <v-btn
                            icon
                            variant="text"
                            size="x-small"
                            color="blue-darken-1"
                            class="control-action-btn"
                            @click="openEditDialog(rev)"
                          >
                            <v-icon size="16">mdi-pencil-outline</v-icon>
                            <v-tooltip activator="parent" location="top"
                              >تعديل</v-tooltip
                            >
                          </v-btn>
                          <v-btn
                            icon
                            variant="text"
                            size="x-small"
                            color="red-lighten-1"
                            class="control-action-btn"
                            @click="deleteReview(rev.id)"
                          >
                            <v-icon size="16">mdi-delete-outline</v-icon>
                            <v-tooltip activator="parent" location="top"
                              >حذف</v-tooltip
                            >
                          </v-btn>
                        </div>
                      </div>

                      <div class="review-speech-bubble">
                        {{ rev.comment }}
                      </div>
                    </div>
                  </div>
                </transition-group>
              </v-list-item>
            </div>

            <!-- فورم إضافة مراجعة جديدة -->
            <div class="add-review-form-card">
              <div class="form-title-mini">
                <v-icon size="18" color="green" class="ml-1"
                  >mdi-plus-circle-outline</v-icon
                >
                أضف مراجعتك الخاصة
              </div>
              <form @submit.prevent="funvaledcom(this.$route.params.idparam)">
                <v-textarea
                  counter="500"
                  maxlength="500"
                  :rules="[(v) => !!v.trim() || 'لا يمكن نشر تعليق فارغ']"
                  placeholder="اكتب رأيك وتجربتك مع المنتج بكل أمانة هنا..."
                  name="revewe"
                  v-model="reveiwe"
                  variant="outlined"
                  color="green-darken-1"
                  rows="3"
                  no-resize
                  bg-color="grey-keep-light"
                  class="modern-textarea"
                  hide-details="auto"
                ></v-textarea>

                <div class="d-flex justify-end mt-3">
                  <v-btn
                    type="submit"
                    color="green-darken-2"
                    rounded
                    :disabled="!reveiwe.trim()"
                    class="text-white px-6 elevation-1 font-weight-bold"
                    height="42"
                  >
                    <v-icon left class="ml-1" size="18"
                      >mdi-send-outline</v-icon
                    >
                    نشر مراجعتي
                  </v-btn>
                </div>
              </form>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- الـ Popup الخاص بتعديل المراجعة -->
    <v-dialog v-model="editDialog" max-width="500px" persistent>
      <v-card class="rounded-xl pa-4" dir="rtl">
        <v-card-title class="text-h6 font-weight-bold mb-2">
          <v-icon color="blue-darken-1" class="ml-2">mdi-pencil-outline</v-icon>
          تعديل التعليق
        </v-card-title>
        <v-card-text>
          <v-textarea
            v-model="selectedReviewComment"
            placeholder="اكتب تعليقك الجديد هنا..."
            variant="outlined"
            color="green"
            rows="4"
            no-resize
            counter="500"
            maxlength="500"
            :rules="[(v) => !!v.trim() || 'لا يمكن ترك التعليق فارغاً']"
          ></v-textarea>
        </v-card-text>
        <v-card-actions class="justify-end gap-2">
          <v-btn
            color="grey-darken-1"
            variant="text"
            rounded
            @click="editDialog = false"
          >
            إلغاء
          </v-btn>
          <v-btn
            color="green-darken-2"
            variant="flat"
            class="text-white px-4"
            rounded
            :disabled="!selectedReviewComment.trim()"
            :loading="loadingUpdate"
            @click="updateReview"
          >
            حفظ التعديل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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

      reviewPage: 1,
      loadingReviews: false,
      reviewPagination: null,

      editDialog: false,
      selectedReviewId: null,
      selectedReviewComment: "",
      loadingUpdate: false,
    };
  },
  setup() {
    return {
      modules: [Navigation, Mousewheel, Keyboard, Scrollbar],
    };
  },
  computed: {
    ...mapState(mystore, ["SingleProduct", "Reviwes", "domin", "countReviws"]),
  },
  watch: {
    SingleProduct: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (newVal && newVal.img) {
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
      if (!this.reveiwe.trim()) return;

      if (localStorage.getItem("token")) {
        this.Addrev(id);
      } else {
        let textem = "عشان تضيف مراجعه علي  منتج لازم تسجل دخول الأول";
        this.Emitter.emit("sin", textem);
      }
    },
    async Addrev(id) {
      const token = localStorage.getItem("token");
      const cleanComment = this.reveiwe.trim();
      try {
        const res = await axios.post(
          `${this.domin}add/reviweForProdict/${id}`,
          { comment: cleanComment },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        console.log("تم إضافة المراجعة:", res.data);
      } catch (err) {
        console.error(err.response?.data || err);
      }

      await this.getReviwes(this.$route.params.idparam);
      this.reveiwe = "";
      this.reviewPage = 1;

      // تحريك الاسكرول تلقائياً لأسفل صندوق التعليقات
      this.$nextTick(() => {
        const reviewsBox = document.querySelector("#revews");
        if (reviewsBox) {
          reviewsBox.scrollTo({
            top: reviewsBox.scrollHeight,
            behavior: "smooth",
          });
        }
      });
    },

    openEditDialog(review) {
      this.selectedReviewId = review.id;
      this.selectedReviewComment = review.comment;
      this.editDialog = true;
    },

    async updateReview() {
      if (!this.selectedReviewComment.trim()) return;

      const token = localStorage.getItem("token");
      this.loadingUpdate = true;
      try {
        const res = await axios.post(
          `${this.domin}update/reviwe/${this.selectedReviewId}`,
          { comment: this.selectedReviewComment.trim() },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        console.log("تم تعديل المراجعة:", res.data);
        await this.getReviwes(this.$route.params.idparam);
        this.editDialog = false;
      } catch (err) {
        console.error("خطأ أثناء التعديل:", err.response?.data || err);
      } finally {
        this.loadingUpdate = false;
      }
    },

    deleteReview(reviewId) {
      console.log("حذف المراجعة ذات الرقم:", reviewId);
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
    async loadMoreReviews() {
      if (this.loadingReviews) return;

      if (
        this.reviewPagination &&
        this.reviewPage >= this.reviewPagination.last_page
      ) {
        return;
      }

      this.loadingReviews = true;
      this.reviewPage++;

      const res = await fetch(
        `${this.domin}show/reviwe/${this.$route.params.idparam}?page=${this.reviewPage}`,
      );
      const data = await res.json();
      this.Reviwes.push(...data.Proreviwes.data);
      this.loadingReviews = false;
    },

    initReviewScroll() {
      const reviewsBox = document.querySelector("#revews");
      if (!reviewsBox) return;

      reviewsBox.addEventListener("scroll", async () => {
        const nearBottom =
          reviewsBox.scrollTop + reviewsBox.clientHeight >=
          reviewsBox.scrollHeight - 100;

        if (nearBottom) {
          await this.loadMoreReviews();
        }
      });
    },
  },

  async mounted() {
    await this.getSingle(this.$route.params.idparam);
    await this.getReviwes(this.$route.params.idparam);
    this.initReviewScroll();
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
.reviews-section-container {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 24px;
  margin-top: 35px;
  box-shadow: 0 4px 20px rgba(148, 163, 184, 0.06);
}
.reviews-header-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 16px;
  margin-bottom: 20px;
}
.header-title-text {
  font-weight: 700;
  font-size: 20px;
  color: #1e293b;
}
.reviews-scroll-area {
  max-height: 420px;
  overflow-y: auto;
  padding-right: 4px;
  margin-bottom: 24px;
}
.no-reviews-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 16px;
}
.review-modern-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background-color: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 14px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.review-modern-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.03);
  border-color: #cbd5e1;
}
.review-user-avatar {
  border: 2px solid #f1f5f9;
  flex-shrink: 0;
}
.review-body-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.review-top-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.user-fullname {
  font-weight: 600;
  color: #334155;
  font-size: 14.5px;
}
.review-action-group {
  display: flex;
  gap: 4px;
}
.control-action-btn {
  background-color: #f8fafc;
  border-radius: 8px !important;
}
.control-action-btn:hover {
  background-color: #f1f5f9;
}
.review-speech-bubble {
  background-color: #f8fafc;
  color: #475569;
  font-size: 14px;
  line-height: 1.6;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  word-break: break-word;
}
.add-review-form-card {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
}
.form-title-mini {
  font-weight: 600;
  font-size: 15px;
  color: #334155;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}
.modern-textarea :deep(.v-field) {
  border-radius: 12px !important;
  background-color: #ffffff !important;
}
.reviews-scroll-area::-webkit-scrollbar {
  width: 5px;
}
.reviews-scroll-area::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}
.reviews-scroll-area::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
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
#qointcon {
  display: flex;
  flex-flow: column;
  position: relative;
  left: -280px;
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
    border: 1px solid #d6eadf;
    left: 20px;
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
    max-height: 150px;
  }
  #btnadd {
    border-radius: 30px;
    height: 50px;
    width: 250px;
  }
  #qointcon {
    display: flex;
    flex-flow: column;
    width: fit-content;
    position: relative;
    left: -5px;
  }
  #zcon {
    width: 90%;
    top: 20px;
  }
  #big-img {
    border-radius: 20px;
    position: relative;
    left: -40px;
    max-width: 350px;
  }
  #tabslide {
    width: 400px;
  }
  #avol {
    position: absolute;
    top: 160px;
    left: -40px;
    width: 100%;
    height: 50px;
    background-color: lightcoral;
  }
}
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
    max-height: 150px;
  }
  #btnadd {
    border-radius: 30px;
    height: 50px;
    width: 230px;
  }
  #qointcon {
    display: flex;
    flex-flow: column;
    width: fit-content;
    position: relative;
    left: -5px;
  }
  #zcon {
    width: 90%;
    top: 20px;
  }
  #big-img {
    border-radius: 20px;
    position: relative;
    left: -25px;
    max-width: 300px;
  }
  #tabslide {
    width: 400px;
  }
}
</style>
