<template>
  <div id="conb">
    <swiper
      :spaceBetween="30"
      :slides-per-view="1"
      :centeredSlides="false"
      :loop="true"
      :autoplay="{
        delay: 6000,
      }"
      :pagination="{
        clickable: true,
      }"
      :navigation="true"
      :modules="modules"
      class="mySwiper"
    >
      <swiper-slide v-for="(item, i) in offers" :key="i"
        ><img
          id="item"
          alt="banner"
          loading="lazy"
          :src="domin + item.banner"
          @click="
            $router.push({ name: 'derilse', params: { idparam: item.id } })
          "
        />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles
import "swiper/css";
import { mystore } from "@/store";
import { mapState, mapActions } from "pinia";
import "swiper/css/pagination";
import "swiper/css/navigation";
// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import $ from "jquery";
export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      isactive: false,
    };
  },
  inject: ["fun", "trialmovis"],
  setup() {
    return {
      modules: [Autoplay, Pagination, Navigation],
    };
  },
  props: ["st"],
  mounted: async function () {
    await this.Offers();
    window.setTimeout(function () {
      window.setInterval(function () {
        let mu = $(".swiper-slide-active");
        if (mu) {
          $(".swiper-slide-active .content").animate({ left: "0px" }, 1000);
          $(".swiper-slide-active .content").css({ display: "flex" });
        }
      }, 3000);
    }, 1000);
  },
  computed: {
    ...mapState(mystore, ["offers", "domin"]),
  },
  methods: {
    ...mapActions(mystore, ["Offers"]),
    async trialasync(id) {
      await this.trialmovis(id);
      this.$router.push({ name: "about", params: { filmid: id } });
    },
    itemhover() {
      $(".popup").css({ display: "flex" });
      $(".btn1").css({ display: "flex" });
    },
    itemhover2() {
      $(".popup").css({ display: "none" });
      $(".btn1").css({ display: "none" });
    },

    itemhover0() {
      $(".popup2").css({ display: "flex" });
      $(".btn2").css({ display: "flex" });
    },
    itemhover1() {
      $(".popup2").css({ display: "none" });
      $(".btn2").css({ display: "none" });
    },
    itemhover3() {
      $(".popup3").css({ display: "flex" });
      $(".btn3").css({ display: "flex" });
    },
    itemhover4() {
      $(".popup3").css({ display: "none" });
      $(".btn3").css({ display: "none" });
    },

    itemhover5() {
      $(".popup4").css({ display: "flex" });
      $(".btn4").css({ display: "flex" });
    },
    itemhover6() {
      $(".popup4").css({ display: "none" });
      $(".btn4").css({ display: "none" });
    },
    itemhover7() {
      $(".popup5").css({ display: "flex" });
      $(".btn5").css({ display: "flex" });
    },
    itemhover8() {
      $(".popup5").css({ display: "none" });
      $(".btn5").css({ display: "none" });
    },
    tolast(view, src, discrption, filmname, srcvl) {
      this.$router.push({
        name: view,
        query: {
          imgsrc: src,
          discrptione: discrption,
          name: filmname,
          video: srcvl,
        },
      });
    },
    tosun(view, src, discrption, filmname, srcvsu) {
      this.$router.push({
        name: view,
        query: {
          imgsrc: src,
          discrptione: discrption,
          name: filmname,
          video: srcvsu,
        },
      });
    },
    tojocker(view, src, discrption, filmname, srcvjo) {
      this.$router.push({
        name: view,
        query: {
          imgsrc: src,
          discrptione: discrption,
          name: filmname,
          video: srcvjo,
        },
      });
    },
  },
};
</script>
<style scoped>
/* ===================== RTL + النص فوق البنر للعروض الغذائية ===================== */
#conb,
.swiper,
.swiper-slide,
.condis,
.content {
  direction: rtl;
  text-align: right;
  font-family: "Cairo", sans-serif; /* خط عربي مناسب */
}

/* صندوق النصوص فوق البانر */
.condis {
  position: absolute;
  top: 15px;
  right: 15px;
  left: 15px;
  width: auto;
  max-width: calc(100% - 30px);
  background: rgba(255, 255, 255, 0.85); /* خلفية فاتحة شفافة */
  padding: 15px 20px;
  border-radius: 12px;
  color: #333;
  z-index: 10;
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* عرض المحتوى عند الشريحة النشطة */
.swiper-slide-active .condis {
  opacity: 1;
  transform: translateY(0);
}

/* تحسين شكل النصوص */
.title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 5px;
  color: #e74c3c; /* لون أحمر جذاب للعروض */
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
}

.subtitel {
  font-size: 1rem;
  margin-bottom: 5px;
  color: #27ae60; /* لون أخضر للخصم أو السعر */
  font-weight: 600;
}

.discr {
  font-size: 0.9rem;
  margin-top: 8px;
  line-height: 1.4;
  color: #555;
}

/* زر الشراء */
#textbtn {
  right: 0;
  left: auto;
  padding: 8px 14px;
  border-radius: 40px;
  background-color: #ff9d00; /* برتقالي جذاب للطعام */
  color: #fff;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  align-content: center;
  gap: 6px;
  transition: all 0.3s ease;
}
#textbtn :hover {
  width: 400px;
}
.contianer-fliud {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-content: center;
}
#head {
  align-self: end;
  margin-right: 20px;
  margin-block: 30px;
  color: rgb(0, 0, 0);
}
.progress {
  position: relative;
  height: 100px;
  border-radius: none;
  width: 100px;
  cursor: pointer;
  background-color: transparent;
  left: 20px;
}
.progress:hover .progress-bar {
  width: 100%;
}
.progress-bar {
  width: 50%;
  border-radius: 2px;
  padding: 5px;
}
#textbtn:hover {
  transform: scale(0.9);
  transition: all, 1s;
}
.checked {
  color: orange;
}
.swiper {
  width: 100%;
  height: 100%;
  position: relative;
  top: 20px;
  z-index: 2;
}
.condis {
  position: absolute;
  left: 0px;
  width: 400px;
}
.content {
  position: relative;
  overflow: hidden;
  left: -500px;
  display: none;
  flex-flow: column;
  justify-content: center;
  align-content: center;
}
.swiper-slide-active {
  color: aliceblue;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: transparent;
  filter: drop-shadow();

  /* Center slide text vertically */
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide #item {
  display: block;
  width: 100%;
  height: fit-content;
  object-fit: cover;
  gap: 100rem;
  border-radius: 5px;
}
.swiper-slide #item:hover {
  transform: scale(1.1);
  transition: all, 1s;
}
.btn1 {
  width: 50px;
  height: 50px;
  cursor: pointer;
  border: 2px solid orange;
  border-radius: 50%;
  justify-content: center;
  align-content: center;
  position: fixed;
  top: 180px;
  align-self: center;
  right: auto;
  background-color: orange;
}
.btn1 {
  animation: btnani 2s infinite linear;
}
@keyframes btnani {
  0% {
    box-shadow: 0 0 0 0 rgba(226, 193, 7, 0.8);
    opacity: 1;
  }
  40% {
    box-shadow: 0 0 0 0 rgba(226, 193, 7, 0.8);
    opacity: 0.7;
  }
  80% {
    box-shadow: 0 0 0 50px rgba(226, 193, 7, 0.8);
    opacity: 0.7;
  }
  100% {
    box-shadow: 0 0 0 0 rgba(226, 193, 7, 0.8);
    opacity: 0.7;
  }
}
#movename {
  position: absolute;
  z-index: 3;
  color: rgb(245, 245, 245);
  top: 320px;
  font-size: large;
  align-self: center;
}
#moveitem {
  position: absolute;
  z-index: 3;
  color: whitesmoke;
  top: 350px;
  font-size: small;
  align-self: center;
}
.coninform {
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: flex-end;
  position: absolute;
  top: 0px;
  right: 0px;
  row-gap: 3px;
  height: 100%;
  width: 290px;
}

.btn5 {
  width: 50px;
  height: 50px;
  align-self: center;
  cursor: pointer;
  border: 2px solid orange;
  border-radius: 50%;
  justify-content: center;
  align-content: center;
  position: relative;
  align-self: center;
  right: auto;
  background-color: orange;
}
.btn5:hover {
  animation: btnani 2s infinite linear;
}
/*/desktop/*/
@media (max-width: 1366px) {
  .swiper-button-next,
  .swiper-button-prev {
    display: none !important;
  }
  #conb {
    height: fit-content;
    position: relative;
    top: 0px;
  }
  .mySwiper {
    position: relative;
    margin-bottom: 0px;
    padding: 0px;
  }
}
/*/tablet/*/
@media (max-width: 991px) {
  .condis {
    top: 12px;
    right: 10px;
    left: 10px;
    padding: 12px 15px;
  }
  .title {
    font-size: 1.3rem;
  }
  .subtitel {
    font-size: 0.95rem;
  }
  .discr {
    font-size: 0.85rem;
  }
  .mySwiper {
    position: relative;
    top: 0px;
    margin-bottom: 0px;
  }
  #conb {
    height: fit-content;
    width: 99%;
    top: 0px;
    position: relative;
  }
  .swiper-slide #item {
    display: block;
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 5px;
  }
  #textbtn {
    z-index: 5;
    color: brown;
    width: 100px;
    position: fixed;
    display: flex;
    position: relative;
    left: -50px;
    flex-flow: row, nowrap;
  }
}
/*/mobile/*/
@media (max-width: 500px) {
  .condis {
    top: -15px;
    right: 5px;
    left: 5px;
    padding: 10px 12px;
  }
  .title {
    font-size: 1.1rem;
  }
  .subtitel {
    font-size: 0.8rem;
  }
  .discr {
    font-size: 0.75rem;
  }
  .mySwiper {
    position: relative;
    margin: 0px;
    top: 0px;
  }
  .swiper-slide #item {
    display: block;
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 5px;
  }
  .swiper {
    width: 100%;
  }
  #conb {
    height: fit-content;
    width: 99%;
    left: 0px;
    top: 0px;
    position: relative;
  }
  .discr {
    width: 200px;
    position: relative;
    left: -100px;
  }

  /* ✅ منع الانزياح الأفقي في أي مقاس */
  html,
  body {
    overflow-x: hidden;
    padding: auto;
    margin: auto;
  }
}
</style>
