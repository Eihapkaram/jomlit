<template>
  <v-container class="py-8" dir="rtl">
    <v-row justify="center">
      <v-col cols="12" md="6">
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

            <v-divider v-if="user.role == 'customer'" class="my-4"></v-divider>
            <h4
              v-if="user.role == 'customer'"
              class="text-subtitle-2 font-weight-bold mb-2"
            >
              مستوى نشاطك كتاجر
            </h4>
            <v-progress-linear
              v-if="user.role == 'customer'"
              :model-value="count ? Math.min(count * 10, 100) : 0"
              color="darkgold"
              height="10"
              rounded
            ></v-progress-linear>
            <p
              v-if="user.role == 'customer'"
              class="text-caption mt-2 text-center"
            >
              {{ getActivityText(count) }}
            </p>
          </v-card-text>
        </v-card>

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
const count = ref(0);
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

  try {
    await store.orderCountfun();
    count.value = store.orderCoun;
  } catch (err) {
    console.error(err);
  }

  try {
    const res = await axios.get(`${store.domin}user/info`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    user.value = res.data.user || res.data;
  } catch (err) {
    console.error(err.response?.data || err);
  }
});

// 🛠️ دالة مساعدة لضغط الصورة والحفاظ على أبعادها الأصلية
function compressImage(file, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // استخدام الأبعاد الأصلية للصورة تماماً دون تغيير
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // هنا يتم الضغط وتقليص الحجم الفعلي للملف عبر تقليل الجودة (Quality)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // إرجاع الملف الجديد بنفس الاسم الأصلي
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            } else {
              reject(new Error("Canvas to Blob conversion failed"));
            }
          },
          "image/jpeg",
          quality, // نسبة الجودة من 0.0 إلى 1.0 (0.6 تعتبر ممتازة لتقليل المساحة بشكل كبير جداً وبجودة ممتازة)
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

// ✅ رفع الصورة وتحديثها بعد الضغط
async function uploadPhoto(e) {
  let file = e.target.files[0];
  if (!file) return;

  try {
    // 1️⃣ ضغط الصورة أولاً قبل إرسالها (سيتم خفض حجمها لأكثر من 60% من حجمها الأصلي)
    file = await compressImage(file, 0.6);

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("img", file);

    // 2️⃣ إرسال الصورة المضغوطة للسيرفر
    const res = await axios.post(`${store.domin}user/addPhoto`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    user.value.img = res.data.photo;

    // إعادة جلب بيانات المستخدم للتأكيد والـ Reactivity
    const userRes = await axios.get(`${store.domin}user/info`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    user.value = userRes.data.user || userRes.data;
  } catch (err) {
    console.error(err.response?.data || err);
    alert("❌ حدث خطأ أثناء معالجة أو رفع الصورة");
  }
}

// ✅ تسجيل الخروج
async function logout() {
  const token = localStorage.getItem("token");
  try {
    await axios.post(
      `${domin}logout`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
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
