<template>
  <v-container class="py-8" dir="rtl">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="rounded-xl shadow-sm border" elevation="4">
          <v-card-title class="d-flex align-center justify-space-between">
            <div class="d-flex align-center gap-3">
              <v-avatar size="80">
                <v-img
                  v-if="user.img"
                  :src="domin + user.img"
                  alt="صورة المستخدم"
                  loading="lazy"
                  cover
                />
                <v-icon v-else size="70" color="amber-darken-3">
                  mdi-account-circle
                </v-icon>
              </v-avatar>

              <div>
                <h2 class="text-h6 font-weight-bold">{{ user.name }}</h2>
                <p class="text-grey-darken-1 mb-1">{{ user.email }}</p>
                <v-chip
                  v-if="progressLabel"
                  :color="levelColor"
                  text-color="white"
                  size="small"
                >
                  {{ progressLabel }} - {{ levelName }}
                </v-chip>
              </div>
            </div>

            <v-btn color="red" variant="outlined" size="small" @click="logout">
              <v-icon start>mdi-logout</v-icon>
              تسجيل الخروج
            </v-btn>
          </v-card-title>

          <v-divider />

          <v-card-text>
            <div class="mb-4 text-center">
              <v-btn
                color="amber-darken-3"
                variant="outlined"
                size="small"
                @click="$refs.fileInput.click()"
              >
                <v-icon start>mdi-camera</v-icon>
                تحديث الصورة الشخصية
              </v-btn>
              <input
                type="file"
                ref="fileInput"
                accept="image/*"
                class="d-none"
                @change="uploadPhoto"
              />
            </div>

            <v-row dense>
              <v-col cols="6">
                <div class="d-flex justify-space-between py-1">
                  <span>رقم الهاتف:</span>
                  <strong>{{ user.phone || "غير محدد" }}</strong>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="d-flex justify-space-between py-1">
                  <span>تاريخ التسجيل:</span>
                  <strong>{{ formatDate(user.created_at) }}</strong>
                </div>
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <v-row dense>
              <v-col cols="12" sm="4" v-for="(stat, i) in stats" :key="i">
                <v-card
                  class="pa-4 text-center"
                  :color="stat.color"
                  dark
                  elevation="2"
                >
                  <v-icon size="28" class="mb-2">{{ stat.icon }}</v-icon>
                  <div>{{ stat.title }}</div>
                  <div class="text-h6 font-weight-bold">{{ stat.value }}</div>
                </v-card>
              </v-col>
            </v-row>

            <div class="mt-6">
              <div class="d-flex justify-space-between mb-1">
                <span>مستوى الإنجاز</span>
                <strong>{{ progressValue }}%</strong>
              </div>
              <v-progress-linear
                :model-value="progressValue"
                :color="progressColor"
                height="12"
                rounded
                striped
              ></v-progress-linear>
            </div>

            <v-alert
              class="mt-6"
              :color="progressColor"
              variant="tonal"
              elevation="2"
              border="start"
            >
              <strong>💡 نصيحة تحفيزية:</strong>
              {{ motivationText }}
            </v-alert>
          </v-card-text>
        </v-card>

        <v-card class="mt-6 rounded-xl border" elevation="3">
          <v-card-title class="text-h6 font-weight-bold"
            >🎯 أهدافك القادمة</v-card-title
          >
          <v-divider />
          <v-card-text>
            <v-row dense>
              <v-col cols="12" sm="6" v-for="goal in goals" :key="goal.id">
                <v-card
                  class="pa-3 d-flex flex-column align-center justify-center"
                  :class="goal.achieved ? 'goal-achieved' : 'goal-pending'"
                  elevation="1"
                >
                  <v-icon
                    size="36"
                    :color="goal.achieved ? 'green' : 'grey'"
                    class="mb-2"
                  >
                    {{ goal.icon }}
                  </v-icon>
                  <div class="text-center">
                    <strong>{{ goal.title }}</strong>
                    <p class="text-caption">{{ goal.desc }}</p>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="mt-6 rounded-xl border" elevation="3">
          <v-card-title class="text-h6 font-weight-bold">
            💰 سحب الأرباح
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="withdrawAmount"
                  label="المبلغ المراد سحبه (ج.م)"
                  type="number"
                  min="1"
                  outlined
                  prepend-inner-icon="mdi-cash"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-textarea
                  v-model="withdrawNote"
                  label="ملاحظات (اختياري)"
                  auto-grow
                  outlined
                  rows="1"
                  prepend-inner-icon="mdi-note-text-outline"
                ></v-textarea>
              </v-col>
            </v-row>

            <v-btn
              color="green-darken-2"
              class="mt-3"
              block
              large
              @click="rqustmyprfites(withdrawNote, withdrawAmount)"
            >
              <v-icon start>mdi-bank-transfer</v-icon>
              إرسال طلب السحب
            </v-btn>

            <v-divider class="my-4" />
            <h3 class="text-h6 font-weight-bold mb-3">
              🧾 طلبات السحب السابقة
            </h3>
            <v-list v-if="PayRequst.length" density="compact">
              <v-list-item
                v-for="req in PayRequst"
                :key="req.id"
                class="d-flex justify-space-between align-center"
              >
                <div>
                  <strong>{{ req.amount }} ج.م</strong>
                  <span class="text-grey-darken-1 ms-2"
                    >({{ req.status }})</span
                  >
                  <span class="text-grey-darken-1 ms-2">{{ req.note }}</span>
                </div>
                <small>{{ formatDate(req.created_at) }}</small>
              </v-list-item>
            </v-list>
            <v-alert
              v-else
              type="info"
              variant="tonal"
              border="start"
              class="text-center"
            >
              لا توجد طلبات سحب بعد.
            </v-alert>
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

<script>
import axios from "axios";
import { mapState, mapActions } from "pinia";
import { mystore } from "@/store";

export default {
  name: "SellerProfile",

  data() {
    return {
      user: {},
      stats: [
        {
          title: "عدد الطلبات المقبوله",
          value: "0",
          color: "blue",
          icon: "mdi-cart",
        },
        {
          title: "إجمالي الأرباح",
          value: "0 ج.م",
          color: "indigo",
          icon: "mdi-cash",
        },
        {
          title: "نسبة النمو",
          value: "0%",
          color: "green",
          icon: "mdi-trending-up",
        },
      ],
      progressValue: 0,
      goals: [],
      withdrawAmount: null,
      withdrawNote: "",
      withdrawRequests: [],
    };
  },

  computed: {
    ...mapState(mystore, [
      "domin",
      "orderCounSeller",
      "totalProfitSeller",
      "userinfo",
      "sellermyProfits",
      "PayRequst",
    ]),

    progressColor() {
      if (this.progressValue < 30) return "red";
      if (this.progressValue < 60) return "amber";
      if (this.progressValue < 90) return "blue";
      return "green";
    },
    progressLabel() {
      if (this.progressValue < 30) return "مبتدئ";
      if (this.progressValue < 60) return "متوسط";
      if (this.progressValue < 90) return "متميز";
      return "خبير";
    },
    levelName() {
      if (this.progressValue < 30) return "برونزي 🥉";
      if (this.progressValue < 60) return "فضي 🥈";
      if (this.progressValue < 90) return "ذهبي 🥇";
      return "بلاتيني 💎";
    },
    levelColor() {
      if (this.progressValue < 30) return "brown-darken-2";
      if (this.progressValue < 60) return "grey-darken-1";
      if (this.progressValue < 90) return "amber-darken-2";
      return "indigo-darken-3";
    },
    motivationText() {
      if (this.progressValue < 30)
        return "ابدأ بخطوات صغيرة ولكن بثقة، كل طلب يقربك من هدفك 💪";
      if (this.progressValue < 60)
        return "عمل رائع! استمر في بيع منتجاتك بانتظام 🚀";
      if (this.progressValue < 90)
        return "أنت قريب جدًا من القمة، لا تتوقف الآن 🔥";
      return "مبروك! أنت من أفضل البائعين على المنصة 🏆";
    },
  },

  async mounted() {
    this.Userinfo();
    this.sellerPayRequst();
    const token = localStorage.getItem("token");
    if (!token) {
      this.$router.push({ name: "login" });
      return;
    }

    try {
      await axios.get(`${this.domin}user/info`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.user = this.userinfo;

      await this.OrdCounSeller();
      await this.sellerProfits();
      this.updateStats();
      this.updateGoals();

      this.fetchWithdrawRequests();
    } catch (err) {
      console.error(err.response?.data || err);
    }
  },

  methods: {
    ...mapActions(mystore, [
      "OrdCounSeller",
      "Userinfo",
      "sellerProfits",
      "sellerPayRequst",
      "logoutin",
    ]),

    updateStats() {
      const totalOrders = this.sellermyProfits.total_orders || 0;
      const totalProfit = this.sellermyProfits.available_profit || 0;
      const createdAt = new Date(this.user.created_at);
      const now = new Date();
      const diffDays = Math.max(
        Math.floor((now - createdAt) / (1000 * 60 * 60 * 24)),
        1,
      );

      let growthRate = Math.min(
        (totalOrders / diffDays) * 100,
        totalOrders * 0.5,
      );
      growthRate = Math.round(growthRate);

      this.stats[0].value = totalOrders;
      this.stats[1].value = `${Math.round(totalProfit)} ج.م`;
      this.stats[2].value = `${growthRate}%`;
      this.progressValue = Math.min(totalOrders * 10, 10);
    },

    updateGoals() {
      const totalOrders = this.sellermyProfits.total_orders || 0;
      const totalProfit = this.sellermyProfits.total_profit || 0;
      const growthRate = parseInt(this.stats[2].value) || 0;

      this.goals = [
        {
          id: 1,
          title: "أكمل 10 طلبات",
          desc: "تحصل على شارة البائع النشط 🏅",
          icon: "mdi-flag-checkered",
          achieved: totalOrders >= 10,
        },
        {
          id: 2,
          title: "حقق 1000 ج.م أرباح",
          desc: "مكافأة إضافية تظهر في حسابك 💰",
          icon: "mdi-trophy",
          achieved: totalProfit >= 1000,
        },
        {
          id: 3,
          title: "حافظ على نمو يومي مستمر",
          desc: "يزيد ترتيبك في قائمة البائعين 🔝",
          icon: "mdi-trending-up",
          achieved: growthRate >= 30,
        },
      ];
    },

    // 🛠️ دالة مساعدة لضغط الصورة والحفاظ على الأبعاد الأصلية تماماً بدون تعديل شكلها
    compressImageAsync(file, quality = 0.6) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // أخذ نفس الطول والعرض الأصليين دون مساس
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(new File([blob], file.name, { type: "image/jpeg" }));
                } else {
                  reject(new Error("Canvas context is empty"));
                }
              },
              "image/jpeg",
              quality, // نسبة الضغط والجودة المحددة
            );
          };
          img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
      });
    },

    async uploadPhoto(e) {
      let file = e.target.files[0];
      if (!file) return;

      const token = localStorage.getItem("token");

      try {
        // 1️⃣ ضغط حجم الصورة العشوائي قبل تجميع الـ FormData
        file = await this.compressImageAsync(file, 0.6);

        const formData = new FormData();
        formData.append("img", file);

        // 2️⃣ إرسال الملف المضغوط إلى الخادم
        await axios.post(`${this.domin}user/addPhoto`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        const res = await axios.get(`${this.domin}user/info`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.user = res.data.user || res.data;

        await this.OrdCounSeller();
        this.updateStats();
        this.updateGoals();
      } catch (err) {
        console.error(err.response?.data || err);
        alert("❌ حدث خطأ أثناء معالجة أو رفع الصورة");
      }
    },

    async logout() {
      const token = localStorage.getItem("token");
      try {
        await axios.post(
          `${this.this.domin}logout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        this.logoutin();
        this.$router.push({ name: "home" });
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },
    async rqustmyprfites(note, amount) {
      const token = localStorage.getItem("token");

      try {
        if (!amount || amount <= 0) {
          alert("الرجاء إدخال مبلغ صالح للسحب");
          return;
        }

        const hasPending = this.PayRequst?.some(
          (req) => req.status === "pending",
        );
        if (hasPending) {
          alert(
            "⚠️ لديك طلب سحب قيد المراجعة بالفعل، يرجى الانتظار حتى يتم الرد عليه",
          );
          return;
        }

        const available = this.sellermyProfits?.available_profit || 0;
        if (amount > available) {
          alert(
            `❌ لا يمكنك سحب ${amount} ج.م لأن رصيدك المتاح هو ${available} ج.م فقط`,
          );
          return;
        }

        await axios.post(
          `${this.domin}seller/withdraw`,
          { amount: amount, note: note || null },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        alert("✅ تم إرسال طلب السحب بنجاح!");
        this.sellerPayRequst();
      } catch (err) {
        console.error("❌ خطأ أثناء إرسال الطلب:", err.response?.data || err);
        alert("حدث خطأ أثناء إرسال الطلب، حاول لاحقًا.");
      }
    },

    formatDate(dateString) {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
};
</script>

<style scoped>
.border {
  border: 1px solid #eee;
}
.gap-3 {
  gap: 12px;
}
.d-none {
  display: none;
}
.goal-achieved {
  background-color: #e8f5e9;
  border: 1px solid #81c784;
}
.goal-pending {
  background-color: #fafafa;
  border: 1px dashed #ccc;
}
</style>
