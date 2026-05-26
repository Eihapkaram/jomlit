<template>
  <v-progress-linear indeterminate v-if="load"></v-progress-linear>
  <lay-out style="top: -130px; position: relative" :my="this.catigory0"
    ><router-view
  /></lay-out>
  <QiuckView />
  <SinVeiw />
  <CartVeiw />
</template>

<style lang="scss">
.v-main[data-v-ff182e94] {
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 100px !important;
  padding-bottom: 0px;
  margin: 0 !important;
}
div.v-btn--icon.v-btn--size-default {
  --v-btn-size: 2rem;
}
div.v-table--fixed-height > div.v-table__wrapper {
  overflow-y: visible;
}
div.v-table__wrapper {
  border-radius: inherit;
  overflow: visible;
  flex: 1 1 auto;
}
div.v-navigation-drawer__content::-webkit-scrollbar {
  width: 5px;
}

div.v-navigation-drawer__content::-webkit-scrollbar-thumb {
  width: 5px;
  background-color: rgb(0, 0, 0);
}

div.v-navigation-drawer__content::-webkit-scrollbar-track {
  width: 5px;
  background-color: rgb(253, 253, 253);
}
div.v-navigation-drawer__content::-webkit-scrollbar-button {
  display: none;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
nav {
  a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
/*/tablet/*/
@media (max-width: 991px) {
  .v-main[data-v-ff182e94] {
    margin: 0 !important;
    padding: 0 !important;
  }
}
/*/mobile/*/
@media (max-width: 500px) {
  .v-main[data-v-ff182e94] {
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 100px !important;
    padding-bottom: 0px;
    margin: 0 !important;
  }
}
</style>
<script>
import LayOut from "./components/LayOut.vue";
import QiuckView from "./components/Home/QiuckView.vue";
import SinVeiw from "./components/Home/SinVeiw.vue";
import CartVeiw from "./components/Home/CartVeiw.vue";
import { CartStore1 } from "@/store/Cart";
import { mystore } from "@/store";
import { mapActions, mapState } from "pinia";
import { useHead } from "@vueuse/head";
import { computed, reactive } from "vue";
export default {
  components: { LayOut, QiuckView, SinVeiw, CartVeiw },
  data() {
    return {
      load: "",
    };
  },
  setup() {
    // ✅ تعديل معلومات SEO الخاصة بالموقع
    const siteData = reactive({
      title: "تاجر البلد | منتجات الجملة في السوق المصري",
      description:
        "تاجر البلد هو أكبر موقع لبيع منتجات الجملة في السوق المصري بأسعار تنافسية تشمل الشاي، اللبان، الملبس، الكيكة، والمصاصات وأكثر.",
    });

    useHead({
      title: computed(() => siteData.title),
      meta: [
        {
          name: "description",
          content: computed(() => siteData.description),
        },
        {
          name: "keywords",
          content:
            "تاجر البلد, منتجات جملة, السوق المصري, تجارة الجملة, لبان, شاي, ملبس, كيك, مصاصات",
        },
        { property: "og:title", content: computed(() => siteData.title) },
        {
          property: "og:description",
          content: computed(() => siteData.description),
        },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "ar_EG" },
      ],
    });
  },
  provide() {
    return {
      catigory: this.catigory0,
    };
  },
  watch() {
    this.load = true;
    setTimeout(() => {
      this.load = false;
    }, 2000);
  },
  computed: {
    ...mapState(mystore, ["catigory0"]),
  },
  methods: {
    ...mapActions(CartStore1, ["GetCart2"]),
    ...mapActions(mystore, [
      "getcatigories",
      "getNotyfication",
      "User",
      "Userinfo",
    ]),
    async requestPermissions() {
      try {
        // ✅ 1. صلاحية الموقع
        const geoPerm = await Geolocation.requestPermissions();
        console.log("📍 صلاحية الموقع:", geoPerm);

        // ✅ 2. صلاحية الإشعارات (خاصة بأندرويد 13 وفوق)
        const notiPerm = await PushNotifications.requestPermissions();
        console.log("🔔 صلاحية الإشعارات:", notiPerm);

        if (notiPerm.receive === "granted") {
          await PushNotifications.register();
          console.log("✅ تم التسجيل لتلقي الإشعارات");
        } else {
          console.warn("🚫 المستخدم رفض الإشعارات");
        }

        // ✅ عند الحصول على التوكن
        PushNotifications.addListener("registration", (token) => {
          console.log("🔑 Firebase Token:", token.value);
        });

        // ✅ عند استلام إشعار جديد
        PushNotifications.addListener(
          "pushNotificationReceived",
          (notification) => {
            console.log("📨 إشعار جديد:", notification);
          },
        );
      } catch (err) {
        console.error("❌ خطأ أثناء طلب الأذونات:", err);
      }
    },
  },
  async mounted() {
    this.load = true;
    this.requestPermissions();
    setTimeout(() => {
      this.load = false;
    }, 2000);
    await this.User();
    await this.GetCart2();
    await this.Userinfo();
  },
  unmounted() {
    this.User();
    if (localStorage.getItem("Cart-item")) {
      localStorage.setItem("Cart-item", JSON.stringify(this.CartProduct));
    }
  },
};
</script>
