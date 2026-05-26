<template>
  <v-container class="py-8" dir="rtl">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <!-- العنوان -->
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

        <!-- Virtual Scroll -->
        <v-card class="rounded-xl pa-2">
          <v-virtual-scroll
            :items="Notyf"
            :height="700"
            :item-height="180"
            @scroll.passive="handleScroll"
          >
            <template v-slot:default="{ item: note, index: i }">
              <v-card
                :key="note.id || i"
                class="mb-4 rounded-xl shadow-sm border"
                variant="outlined"
              >
                <v-card-title class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center gap-3">
                    <v-icon
                      :color="note.read_at ? 'grey' : '#c79a00'"
                      size="26"
                    >
                      mdi-bell-outline
                    </v-icon>

                    <span
                      :class="{ 'text-grey': note.read_at }"
                      class="font-weight-bold"
                    >
                      {{ note.data?.title || "إشعار جديد" }}
                    </span>
                  </div>

                  <small class="text-grey">
                    {{ formatDate(note.created_at) }}
                  </small>
                </v-card-title>

                <!-- نص الإشعار -->
                <v-card-text class="text-body-2 text-grey-darken-2">
                  {{
                    expandedNotifications[note.id]
                      ? note.data?.message
                      : truncate(note.data?.message)
                  }}
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions class="justify-space-between">
                  <v-btn
                    color="#c79a00"
                    variant="text"
                    @click="toggleDetails(note)"
                  >
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
            </template>
          </v-virtual-scroll>

          <!-- loading -->
          <div v-if="loading" class="d-flex justify-center align-center py-4">
            <v-progress-circular
              indeterminate
              color="#c79a00"
            ></v-progress-circular>
          </div>
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
      refreshTimer: null,

      page: 1,
      loading: false,
      finished: false,
    };
  },

  computed: {
    ...mapState(mystore, ["domin", "Notyf", "NotyfCount"]),
  },

  methods: {
    ...mapActions(mystore, ["getNotyfication"]),

    truncate(text) {
      if (!text) return "";
      return text.length > 60 ? text.substring(0, 60) + "..." : text;
    },

    async loadMore() {
      if (this.loading || this.finished) return;

      this.loading = true;

      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(
          `${this.domin}notifications?page=${this.page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const newNotifications = res.data.notifications.data;

        if (this.page === 1) {
          this.Notyf = newNotifications;
        } else {
          this.Notyf.push(...newNotifications);
        }

        this.NotyfCount = res.data.unread_count;

        if (
          !res.data.notifications.next_page_url ||
          newNotifications.length === 0
        ) {
          this.finished = true;
        } else {
          this.page++;
        }
      } catch (err) {
        console.error(err.response?.data || err);
      }

      this.loading = false;
    },

    async handleScroll(e) {
      const element = e.target;

      const bottom =
        element.scrollHeight - element.scrollTop <= element.clientHeight + 100;

      if (bottom) {
        await this.loadMore();
      }
    },

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
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },

    async deleteNotification(id) {
      const token = localStorage.getItem("token");

      if (!confirm("هل أنت متأكد من حذف هذا الإشعار؟")) return;

      try {
        await axios.delete(`${this.domin}notifications/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.Notyf = this.Notyf.filter((item) => item.id !== id);
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
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        this.Notyf = this.Notyf.map((n) => ({
          ...n,
          read_at: new Date(),
        }));
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },

    startAutoRefresh() {
      if (this.refreshTimer) {
        clearInterval(this.refreshTimer);
      }

      this.refreshTimer = setInterval(async () => {
        this.page = 1;
        this.finished = false;

        await this.loadMore();
      }, 15000);
    },
  },

  async mounted() {
    window.scroll(0, 0);

    await this.loadMore();

    this.startAutoRefresh();
  },

  beforeUnmount() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
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

.border {
  border: 1px solid #eee;
}
</style>
