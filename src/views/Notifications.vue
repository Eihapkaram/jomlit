<template>
  <v-container class="py-8" dir="rtl">
    <!-- العنوان -->
    <v-row justify="center">
      <v-col cols="12" md="8">
        <div class="d-flex justify-space-between align-center mb-6">
          <h2 class="text-h5 font-weight-bold text-darkgold">الإشعارات</h2>
          <v-btn
            color="#c79a00"
            variant="outlined"
            size="small"
            @click="markAllAsRead"
          >
            تمييز الكل كمقروء
          </v-btn>
        </div>

        <!-- قائمة الإشعارات -->
        <v-card
          v-for="(note, i) in Notyf"
          :key="note.id || i"
          class="mb-4 rounded-xl shadow-sm border"
          variant="outlined"
        >
          <v-card-title class="d-flex align-center justify-space-between">
            <div class="d-flex align-center gap-3">
              <v-icon :color="note.read_at ? 'grey' : '#c79a00'" size="26">
                mdi-bell-outline
              </v-icon>

              <span
                :class="{ 'text-grey': note.read_at }"
                class="font-weight-bold"
              >
                {{ note.data?.title || "إشعار جديد" }}
              </span>
            </div>
            <small class="text-grey">{{ formatDate(note.created_at) }}</small>
          </v-card-title>

          <!-- نص الإشعار -->
          <v-card-text class="text-body-2 text-grey-darken-2">
            {{
              expandedNotifications[note.id]
                ? note.data?.message
                : (note.data?.message || "").substring(0, 60) + "..."
            }}
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="justify-space-between">
            <v-btn color="#c79a00" variant="text" @click="toggleDetails(note)">
              {{
                expandedNotifications[note.id]
                  ? "إخفاء التفاصيل"
                  : "عرض التفاصيل"
              }}
            </v-btn>

            <v-btn
              color="red"
              variant="text"
              @click="deleteNotification(note.id)"
            >
              حذف
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- لا توجد إشعارات -->
        <v-alert
          v-if="Notyf.length === 0"
          type="info"
          variant="tonal"
          class="mt-6 text-center"
        >
          لا توجد إشعارات حالياً.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mystore } from "@/store";
import axios from "axios";
import { mapActions, mapState } from "pinia";

export default {
  name: "NotificationsPage",
  data() {
    return {
      expandedNotifications: {},
      refreshTimer: null, // ✅ المؤقت لتحديث الإشعارات
    };
  },
  computed: {
    ...mapState(mystore, ["domin", "Notyf", "NotyfCount"]),
  },
  methods: {
    ...mapActions(mystore, ["getNotyfication"]),

    toggleDetails(note) {
      this.read(note.id);
      this.expandedNotifications[note.id] =
        !this.expandedNotifications[note.id];
    },

    formatDate(utcString) {
      const date = new Date(utcString);
      return date.toLocaleString("ar-EG", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    },

    async read(id) {
      const token = localStorage.getItem("token");
      try {
        await axios.post(
          `${this.domin}notifications/${id}/read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await this.getNotyfication();
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },

    async deleteNotification(id) {
      const token = localStorage.getItem("token");
      if (!confirm("هل أنت متأكد من حذف هذا الإشعار؟")) return;
      try {
        await axios.delete(`${this.domin}notifications/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await this.getNotyfication();
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },

    async markAllAsRead() {
      const token = localStorage.getItem("token");
      try {
        await axios.post(
          `${this.domin}notifications/read-all`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await this.getNotyfication();
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },

    // ✅ تحديث تلقائي مستمر كل 15 ثانية
    startAutoRefresh() {
      if (this.refreshTimer) clearInterval(this.refreshTimer);
      this.refreshTimer = setInterval(async () => {
        await this.getNotyfication();
      }, 15000);
    },
  },

  async mounted() {
    window.scroll(0, 0);
    await this.getNotyfication();
    this.startAutoRefresh();
  },

  beforeUnmount() {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
  },
};
</script>

<style scoped>
.text-darkgold {
  color: #c79a00;
}
.text-grey {
  color: #888;
}
.gap-3 {
  gap: 12px;
}
</style>
