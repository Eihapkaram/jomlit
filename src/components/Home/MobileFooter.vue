<template>
  <v-bottom-navigation
    app
    fixed
    height="65"
    color="white"
    class="mobile-footer elevation-10"
  >
    <!-- 🏠 الصفحة الرئيسية -->
    <v-btn
      variant="text"
      class="footer-btn"
      :class="{ active: $route.name === 'home' }"
      :to="{ name: 'home' }"
    >
      <v-icon size="26" color="darkgold">mdi-home-outline</v-icon>
      <span>الرئيسية</span>
    </v-btn>

    <!-- 👤 الملف الشخصي / تسجيل الدخول -->
    <v-btn
      variant="text"
      class="footer-btn"
      :class="{ active: isProfileActive }"
      @click="goToAccount"
    >
      <v-icon size="26" color="darkgold"> mdi-account-outline </v-icon>
      <span>{{ isLoggedIn ? userLabel : "تسجيل الدخول" }}</span>
    </v-btn>

    <!-- 💳 مشترياتي (للعميل فقط) -->
    <v-btn
      v-if="store.userRole === 'customer'"
      variant="text"
      class="footer-btn"
      :class="{ active: $route.name === 'mypayes' }"
      :to="{ name: 'mypayes' }"
    >
      <v-icon size="26" color="darkgold">mdi-credit-card-outline</v-icon>
      <span>مشترياتي</span>
    </v-btn>

    <!-- 👥 إدارة العملاء (للبائع فقط) -->
    <v-btn
      v-if="store.userRole === 'seller'"
      variant="text"
      class="footer-btn"
      :class="{ active: $route.name === 'SellerCustomer' }"
      :to="{ name: 'SellerCustomer' }"
    >
      <v-icon size="26" color="darkgold">mdi-account-group</v-icon>
      <span>إدارة العملاء</span>
    </v-btn>

    <!-- 🔔 الإشعارات -->
    <v-btn
      variant="text"
      class="footer-btn"
      :class="{ active: $route.name === 'notifications' }"
      :to="{ name: 'notifications' }"
    >
      <v-badge
        v-if="NotyfCount > 0"
        :content="NotyfCount"
        color="red"
        offset-x="24"
        offset-y="1"
      >
        <v-icon size="26" color="darkgold">mdi-bell-outline</v-icon>
      </v-badge>
      <template v-else>
        <v-icon size="26" color="darkgold">mdi-bell-outline</v-icon>
      </template>
      <span>إشعاراتي</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { mystore } from "@/store";

const store = mystore();
const router = useRouter();
const route = useRoute();

// ✅ حالة تسجيل الدخول
const isLoggedIn = computed(() => !!store.token);

// ✅ عدد الإشعارات
const NotyfCount = computed(() => store.NotyfCount || 0);

// ✅ النص تحت أيقونة الملف الشخصي
const userLabel = computed(() => {
  switch (store.userRole) {
    case "admin":
      return "لوحة التحكم";
    case "seller":
      return "ملف المندوب";
    case "customer":
      return "ملفي الشخصي";
    default:
      return "ملفي الشخصي";
  }
});

// ✅ تحديد الزر النشط
const isProfileActive = computed(() => {
  if (!isLoggedIn.value) return route.name === "login";
  if (["admin", "customer"].includes(store.userRole))
    return route.name === "profile";
  if (store.userRole === "seller") return route.name === "SellerProfile";
  return false;
});

// ✅ الانتقال للملف أو تسجيل الدخول
function goToAccount() {
  if (!isLoggedIn.value) {
    router.push({ name: "login" });
  } else {
    if (store.userRole === "seller") {
      router.push({ name: "SellerProfile" });
    } else if (store.userRole === "admin") {
      router.push({ name: "dashboard" });
    } else {
      router.push({ name: "Profile" });
    }
  }
}

// ✅ تسجيل الخروج
function logout() {
  if (confirm("هل تريد تسجيل الخروج؟")) {
    store.logoutin();
    router.push({ name: "home" });
  }
}
</script>

<style scoped>
.mobile-footer {
  display: none;
  border-top: 1px solid #eee;
  background-color: #fff;
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom);
}

.footer-btn {
  display: flex;
  flex-direction: column;
  color: #555;
  font-size: 13px;
  min-width: 80px;
  text-transform: none;
}

/* ✅ الزر النشط */
.footer-btn.active {
  color: #c79a00 !important;
  font-weight: 600;
}
.footer-btn.active v-icon {
  color: #c79a00 !important;
}

/* ✅ يظهر فقط على الموبايل */
@media (max-width: 1024px) {
  .mobile-footer {
    display: flex !important;
    justify-content: space-around;
  }
}
</style>
