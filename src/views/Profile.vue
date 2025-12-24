<template>
  <v-container class="py-8" dir="rtl">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <!-- ✅ كارت بيانات المشتري -->
        <v-card class="rounded-xl shadow-sm border" variant="outlined">
          <v-card-title class="d-flex align-center justify-space-between">
            <div class="d-flex align-center gap-3">
              <v-avatar size="70">
                <v-img
                  v-if="user.img"
                  :src="domin + user.img"
                  alt="صورة المشتري"
                  loading="lazy"
                  cover
                ></v-img>
                <v-icon v-else size="60" color="darkgold"
                  >mdi-account-circle</v-icon
                >
              </v-avatar>

              <div>
                <h3 class="text-h6 font-weight-bold">{{ user.name }}</h3>
                <p class="text-grey-darken-1 mb-0">{{ user.email }}</p>
              </div>
            </div>

            <v-btn color="red" variant="outlined" size="small" @click="logout">
              تسجيل الخروج
            </v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="text-body-2">
            <!-- ✅ زر رفع الصورة -->
            <div class="mb-4 text-center">
              <v-btn
                color="darkgold"
                variant="outlined"
                size="small"
                @click="$refs.fileInput.click()"
              >
                <v-icon start>mdi-camera</v-icon>
                تغيير الصورة
              </v-btn>
              <input
                type="file"
                ref="fileInput"
                accept="image/*"
                class="d-none"
                @change="uploadPhoto"
              />
            </div>

            <v-divider class="my-4"></v-divider>

            <!-- ✅ معلومات الحساب -->
            <div class="d-flex justify-space-between py-2">
              <span>رقم الهاتف:</span>
              <span>{{ user.phone || "غير محدد" }}</span>
            </div>

            <div class="d-flex justify-space-between py-2">
              <span>تاريخ التسجيل:</span>
              <span>{{ formatDate(user.created_at) }}</span>
            </div>

            <div class="d-flex justify-space-between py-2">
              <span>عدد الطلبات:</span>
              <span>{{ count || 0 }}</span>
            </div>

            <div class="d-flex justify-space-between py-2">
              <span>إجمالي المشتريات:</span>
              <span>{{
                user.total_spent ? user.total_spent + " ج.م" : "-"
              }}</span>
            </div>

            <!-- ✅ شريط مستوى النشاط -->
            <v-divider class="my-4"></v-divider>
            <h4 class="text-subtitle-2 font-weight-bold mb-2">
              مستوى نشاطك كتاجر
            </h4>
            <v-progress-linear
              :model-value="count ? Math.min(count * 10, 100) : 0"
              color="darkgold"
              height="10"
              rounded
            ></v-progress-linear>
            <p class="text-caption mt-2 text-center">
              {{ getActivityText(count) }}
            </p>
          </v-card-text>
        </v-card>

        <!-- ✅ لا توجد بيانات -->
        <v-alert
          v-if="!user || Object.keys(user).length === 0"
          type="info"
          class="mt-6 text-center"
        >
          لم يتم العثور على بيانات المستخدم.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { mystore } from "@/store";

const store = mystore();
const count = ref(0); // سيتم تحديثه تلقائيًا
const domin = store.domin;
const router = useRouter();
const user = ref({});
const fileInput = ref(null);

// ✅ تحميل بيانات المستخدم
onMounted(async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push({ name: "login" });
    return;
  }

  // تحديث عدد الطلبات تلقائيًا
  try {
    await store.orderCountfun(); // دالة في الـ store تجلب عدد الطلبات
    count.value = store.orderCoun; // تحديث reactive count
  } catch (err) {
    console.error(err);
  }

  // تحميل بيانات المستخدم
  try {
    const res = await axios.get(`${store.domin}user/info`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    user.value = res.data.user || res.data;
  } catch (err) {
    console.error(err.response?.data || err);
  }
});

// ✅ رفع الصورة وتحديثها
async function uploadPhoto(e) {
  const file = e.target.files[0];
  if (!file) return;

  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("img", file);

  try {
    const res = await axios.post(`${store.domin}user/addPhoto`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    user.value.img = res.data.photo;
    try {
      const res = await axios.get(`${store.domin}user/info`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      user.value = res.data.user || res.data;
    } catch (err) {
      console.error(err.response?.data || err);
    }
  } catch (err) {
    console.error(err.response?.data || err);
    alert("❌ حدث خطأ أثناء رفع الصورة");
  }
}

// ✅ تسجيل الخروج
async function logout() {
  const token = localStorage.getItem("token");
  try {
    await axios.post(
      `${domin}logout`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch {}
  store.logoutin();
  router.push({ name: "home" });
}

// ✅ تنسيق التاريخ
function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ✅ نص النشاط بناءً على عدد الطلبات
function getActivityText(count = 0) {
  if (count < 3) return "ابدأ رحلتك التسوقية معنا 🌱";
  if (count < 7) return "تاجر نشط 👏 استمر!";
  if (count < 15) return "تاجر مميز 🌟";
  return "أنت من أفضل التجار لدينا 💎";
}
</script>

<style scoped>
.text-darkgold {
  color: #c79a00;
}
.border {
  border: 1px solid #eee;
}
.gap-3 {
  gap: 12px;
}
.d-none {
  display: none;
}
</style>
