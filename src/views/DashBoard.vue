<template>
  <v-container class="dashboard-page" fluid>
    <h1>لوحة التحكم</h1>

    <v-row>
      <v-col v-for="(cat, i) in asiddashboard" :key="i" cols="12" sm="6" md="3">
        <v-card class="pa-4" outlined>
          <v-card-title>
            <v-icon class="me-2">{{ cat.icon }}</v-icon>
            <router-link :to="{ name: cat.url }">
              {{ cat.titel }}
            </router-link>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <div
    align-content="center"
    style="display: flex; justify-content: center; align-content: center"
  >
    <router-view style="position: relative; top: 30px"></router-view>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      asiddashboard: [
        { titel: "منتجات", url: "homedash", icon: "mdi-home" },
        {
          titel: "الاقسام",
          url: "catigores",
          icon: "mdi-format-list-bulleted",
        },
        { titel: "الصفحات", url: "pages", icon: "mdi-file-document" },
        { titel: "المستخدمين", url: "users", icon: "mdi-account" },
        { titel: "طلبات", url: "orders", icon: "mdi-cart" },
        { titel: "العروض", url: "offer", icon: "mdi-cart" },
        { titel: "الاشعارات", url: "send", icon: "mdi-cart" },
        { titel: "اعدادات", url: "Settings", icon: "mdi-cart" },
        { titel: "الاستفسارات", url: "QueriesShow", icon: "mdi-cart" },
        { titel: "طلبات سحب الارباح", url: "Requests", icon: "mdi-cart" },
      ],
    };
  },
};
</script>

<style scoped>
.dashboard-page {
  padding: 20px;
}

router-link {
  text-decoration: none;
  color: inherit;
}
</style>
