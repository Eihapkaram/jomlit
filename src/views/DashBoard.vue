<template>
  <v-container fluid class="dashboard-page">
    <!-- Header -->
    <div class="dashboard-header">
      <div>
        <h1 class="dashboard-title">لوحة التحكم</h1>

        <p class="dashboard-subtitle">متابعة وإدارة جميع بيانات النظام</p>
      </div>
    </div>

    <!-- Cards -->
    <v-row>
      <v-col
        v-for="(cat, i) in asiddashboard"
        :key="i"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <router-link :to="{ name: cat.url }" class="dashboard-link">
          <v-card class="dashboard-card" elevation="0">
            <!-- Top -->
            <div class="card-top">
              <!-- Icon -->
              <div class="icon-box">
                <v-icon size="32">
                  {{ cat.icon }}
                </v-icon>
              </div>

              <!-- Count -->
              <div class="count-box">
                {{ cat.cont }}
              </div>
            </div>

            <!-- Content -->
            <div class="card-content">
              <h3>{{ cat.titel }}</h3>

              <span class="more-text">
                عرض التفاصيل

                <v-icon size="18"> mdi-arrow-left </v-icon>
              </span>
            </div>
          </v-card>
        </router-link>
      </v-col>
    </v-row>

    <!-- Router -->
    <div class="router-container">
      <router-view />
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
import { mystore } from "@/store";
import { mapActions, mapState } from "pinia";

export default {
  name: "Dashboard",

  data() {
    return {
      offers: [],
      offersInterval: null,
    };
  },

  computed: {
    ...mapState(mystore, [
      "domin",
      "user",
      "userscarts",
      "orderCounSeller",
      "ordersbyCoustomer",
      "ordersbySeller",
      "Queries",
      "page",
      "mostaddedproducts",
      "all",
      "catigoryiesDashboard",
      "AllRequst",
      "adminSupplierorders",
    ]),

    asiddashboard() {
      return [
        {
          titel: "المنتجات",
          url: "homedash",
          icon: "mdi-package-variant",
          cont: this.all?.length || 0,
        },

        {
          titel: "الأقسام",
          url: "catigores",
          icon: "mdi-shape",
          cont: this.catigoryiesDashboard?.length || 0,
        },

        {
          titel: "الصفحات",
          url: "pages",
          icon: "mdi-file-document-outline",
          cont: this.page?.length || 0,
        },

        {
          titel: "المستخدمين",
          url: "users",
          icon: "mdi-account-group",
          cont: this.user?.length || 0,
        },

        {
          titel: "الطلبات",
          url: "orders",
          icon: "mdi-cart-outline",
          cont: this.ordersbyCoustomer?.length + this.ordersbySeller?.length || 0,
        },

        {
          titel: "العروض",
          url: "offer",
          icon: "mdi-sale",
          cont: this.offers?.length || 0,
        },

        {
          titel: "الإشعارات",
          url: "send",
          icon: "mdi-bell-outline",
          cont: 0,
        },

        {
          titel: "الإعدادات",
          url: "Settings",
          icon: "mdi-cog-outline",
          cont: 0,
        },

        {
          titel: "الاستفسارات",
          url: "QueriesShow",
          icon: "mdi-help-circle-outline",
          cont: this.Queries?.length || 0,
        },

        {
          titel: "طلبات سحب الأرباح",
          url: "Requests",
          icon: "mdi-cash-multiple",
          cont: this.AllRequst?.length || 0,
        },

        {
          titel: "إدارة الموردين",
          url: "Suppleir",
          icon: "mdi-truck-delivery-outline",
          cont: 0,
        },

        {
          titel: "طلبات الموردين",
          url: "orderSuppler",
          icon: "mdi-clipboard-list-outline",
          cont: 0,
        },

        {
          titel: "عربات المستخدمين",
          url: "Carts",
          icon: "mdi-cart-variant",
          cont: this.userscarts?.length || 0,
        },

        {
          titel: "الأكثر إضافة للعربة",
          url: "mostAddedProducts",
          icon: "mdi-chart-line",
          cont: this.mostaddedproducts?.length || 0,
        },

        {
          titel: "طلبيات التجهيز",
          url: "AdminSupplierOrders",
          icon: "mdi-package-check",
          cont: this.adminSupplierorders?.length || 0,
        },
      ];
    },
  },

  methods: {
    ...mapActions(mystore, [
      "Users",
      "usersCarts",
      "ordersShow",
      "OrdCounSeller",
      "allordersbySeller",
      "QueriesShow",
      "Pages",
      "mostAddedProducts",
      "getall",
      "getCatigoryDash",
      "RequstPrfictAll",
      "adminsupplierorders",
    ]),

    async getOffers() {
      try {
        const res = await axios.get(`${this.domin}offers`);

        this.offers = res.data;
      } catch (error) {
        console.log(error);
      }
    },
  },

  async mounted() {
    await this.Users();

    await this.usersCarts();

    await this.ordersShow();

    await this.allordersbySeller();

    await this.QueriesShow();

    await this.Pages();

    await this.mostAddedProducts();

    await this.getall();

    await this.getCatigoryDash();

    await this.RequstPrfictAll();

    await this.adminsupplierorders();

    await this.getOffers();

    // تحديث العروض تلقائي
    this.offersInterval = setInterval(() => {
      this.getOffers();
    }, 5000);
  },

  beforeUnmount() {
    clearInterval(this.offersInterval);
  },
};
</script>

<style scoped>
.dashboard-page {
  background: #f5f7fb;
  min-height: 100vh;
  padding: 30px;
}

/* Header */
.dashboard-header {
  margin-bottom: 30px;
}

.dashboard-title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.dashboard-subtitle {
  color: #64748b;
  font-size: 15px;
}

/* Link */
.dashboard-link {
  text-decoration: none;
}

/* Card */
.dashboard-card {
  border-radius: 22px;
  padding: 22px;
  transition: 0.3s;
  background: white;
  border: 1px solid #edf2f7;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.dashboard-card::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #2563eb, #4f46e5);
}

.dashboard-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
}

/* Top */
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Icon */
.icon-box {
  width: 65px;
  height: 65px;
  border-radius: 18px;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

/* Count */
.count-box {
  font-size: 32px;
  font-weight: bold;
  color: #0f172a;
}

/* Content */
.card-content {
  margin-top: 25px;
}

.card-content h3 {
  font-size: 20px;
  margin-bottom: 12px;
  color: #1e293b;
  font-weight: 700;
}

/* More */
.more-text {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #2563eb;
  font-size: 14px;
  font-weight: 600;
}

/* Router */
.router-container {
  margin-top: 40px;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-page {
    padding: 18px;
  }

  .dashboard-title {
    font-size: 26px;
  }

  .count-box {
    font-size: 26px;
  }

  .icon-box {
    width: 55px;
    height: 55px;
  }
}
</style>
