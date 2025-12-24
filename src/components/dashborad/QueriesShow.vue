<template>
  <v-container class="pa-6 inquiries-page">
    <v-card elevation="4" class="pa-6 rounded-xl">
      <div class="text-center mb-6">
        <v-icon color="primary" size="36">mdi-email-outline</v-icon>
        <h2 class="text-h5 font-weight-bold mt-2">قائمة الاستفسارات</h2>
      </div>

      <!-- لا توجد بيانات -->
      <v-alert
        v-if="!Queries.length"
        type="info"
        border="start"
        variant="tonal"
        class="my-4"
      >
        لا توجد استفسارات حالياً
      </v-alert>

      <!-- جدول العرض -->
      <v-simple-table v-else class="elevation-1 rounded-lg">
        <thead>
          <tr>
            <th>الاسم</th>
            <th>البريد الإلكتروني</th>
            <th>رقم الهاتف</th>
            <th>الرسالة</th>
            <th>الحالة</th>
            <th class="text-center">خيارات</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in Queries" :key="item.id" class="table-row">
            <td>{{ item.name }}</td>
            <td>{{ item.email || "-" }}</td>
            <td>{{ item.phone || "-" }}</td>
            <td class="truncate-text">{{ item.message || "-" }}</td>

            <td>
              <v-chip
                small
                :color="getStatusColor(item.status)"
                text-color="white"
                variant="flat"
              >
                {{ getStatusLabel(item.status) }}
              </v-chip>
            </td>

            <td class="text-center">
              <v-btn
                v-for="status in statuses"
                :key="status.value"
                @click="updateStatus(item, status.value)"
                size="x-small"
                class="ma-1 status-btn"
                :color="getStatusColor(status.value)"
                variant="tonal"
              >
                {{ status.label }}
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import { mapState, mapActions } from "pinia";
import { mystore } from "@/store";

export default {
  name: "AdminInquiriesSimple",

  data() {
    return {
      statuses: [
        { label: "قيد المراجعة", value: "pending" },
        { label: "تم الرد", value: "replied" },
        { label: "مغلق", value: "closed" },
      ],
    };
  },

  computed: {
    ...mapState(mystore, ["Queries", "domin"]),
  },

  methods: {
    ...mapActions(mystore, ["QueriesShow"]),

    getStatusColor(status) {
      return (
        { pending: "orange", replied: "green", closed: "red" }[status] || "grey"
      );
    },

    getStatusLabel(status) {
      return (
        { pending: "قيد المراجعة", replied: "تم الرد", closed: "مغلق" }[
          status
        ] || "غير معروف"
      );
    },

    async updateStatus(item, status) {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.patch(
          `${this.domin}dashboard/inquiries/${item.id}/status`,
          { status },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        item.status = status;
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },
  },

  mounted() {
    this.QueriesShow();
  },
};
</script>

<style scoped>
.inquiries-page {
  direction: rtl;
  text-align: right;
}

th {
  background-color: #fafafa;
  color: #444;
  font-weight: 600;
  padding: 12px;
}

td {
  padding: 10px;
  vertical-align: middle;
  border-bottom: 1px solid #eee;
}

.table-row:hover {
  background-color: #f9f9f9;
  transition: background-color 0.2s ease;
}

.v-card {
  background-color: #fff;
}

.truncate-text {
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-btn {
  font-size: 0.75rem;
  border-radius: 12px;
}

.v-chip {
  font-weight: 500;
  text-transform: none;
}
</style>
