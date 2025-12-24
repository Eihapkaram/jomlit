<template>
  <v-container fluid class="pa-6">
    <h2 class="text-h5 mb-6">إدارة طلبات السحب</h2>

    <!-- ✅ أرباح المندوبين الموافق عليها -->
    <v-card class="pa-4 mb-6 elevation-2">
      <h3 class="text-h6 mb-4">إجمالي أرباح المندوبين (الموافق عليها)</h3>
      <v-simple-table class="elevation-1">
        <thead>
          <tr>
            <th class="pa-3 text-center">اسم المندوب</th>
            <th class="pa-3 text-center">رقم الهاتف</th>
            <th class="pa-3 text-center">إجمالي الأرباح (الموافق عليها)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(seller, index) in sellerProfits"
            :key="index"
            class="text-center"
          >
            <td class="pa-3">{{ seller.seller_name }}</td>
            <td class="pa-3">{{ seller.seller_phone }}</td>
            <td class="pa-3">{{ seller.total }} ج.م</td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>

    <!-- ✅ الأرباح غير المسحوبة -->
    <v-card class="pa-4 mb-6 elevation-2">
      <h3 class="text-h6 mb-4">مجموع ارباحه</h3>
      <v-simple-table class="elevation-1">
        <thead>
          <tr>
            <th class="pa-3 text-center">اسم المندوب</th>
            <th class="pa-3 text-center">عدد الطلبيات</th>
            <th class="pa-3 text-center">كل ارباحه المحققه</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(seller, index) in sellersProfits"
            :key="'p-' + index"
            class="text-center"
          >
            <td class="pa-3">{{ seller.seller_name }}</td>
            <td class="pa-3">{{ seller.total_orders }}</td>
            <td class="pa-3">{{ seller.total_profit }} ج.م</td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>

    <!-- ✅ جدول طلبات السحب -->
    <v-data-table
      :headers="headers"
      :items="localRequests"
      :loading="loading"
      class="elevation-2 mt-6"
      dense
    >
      <template #item.status="{ item }">
        <v-chip :color="getStatusColor(item.status)" dark label small>
          {{ statusLabel(item.status) }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <v-btn
          icon
          color="green"
          variant="text"
          @click="openDialog(item, 'approved')"
          :disabled="item.status !== 'pending'"
        >
          <v-icon>mdi-check</v-icon>
        </v-btn>

        <v-btn
          icon
          color="red"
          variant="text"
          @click="openDialog(item, 'rejected')"
          :disabled="item.status !== 'pending'"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- ✅ نافذة الملاحظات -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">
          تأكيد {{ dialogAction === "approved" ? "الموافقة" : "الرفض" }}
        </v-card-title>

        <v-card-text>
          <v-textarea
            v-model="note"
            label="ملاحظة (اختياري)"
            rows="3"
            outlined
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text color="grey" @click="dialog = false">إلغاء</v-btn>
          <v-btn
            color="primary"
            @click="updateStatus(selectedWithdraw.id, dialogAction, note)"
            :loading="updating"
          >
            تأكيد
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mystore } from "@/store";
import axios from "axios";
import { mapActions, mapState } from "pinia";

export default {
  data() {
    return {
      localRequests: [],
      loading: false,
      updating: false,
      dialog: false,
      note: "",
      selectedWithdraw: null,
      dialogAction: "",
      headers: [
        { text: "المعرف", value: "id" },
        { text: "اسم المندوب", value: "seller_name" },
        { text: "رقم الهاتف", value: "seller_phone" },
        { text: "المبلغ", value: "amount" },
        { text: "الحالة", value: "status" },
        { text: "تاريخ الطلب", value: "created_at" },
        { text: "ملاحظات", value: "note" },
        { text: "إجراءات", value: "actions", sortable: false },
      ],
    };
  },
  computed: {
    ...mapState(mystore, ["domin", "AllRequst", "sellersProfits"]),

    sellerProfits() {
      const totals = {};
      this.localRequests.forEach((req) => {
        if (req.status === "approved") {
          if (!totals[req.seller_id]) {
            totals[req.seller_id] = {
              seller_name: req.seller_name,
              seller_phone: req.seller_phone,
              total: 0,
            };
          }
          totals[req.seller_id].total += Number(req.amount);
        }
      });
      return Object.values(totals);
    },
  },

  methods: {
    ...mapActions(mystore, ["RequstPrfictAll", "SellersPrfictAll"]),

    getStatusColor(status) {
      return {
        pending: "orange",
        approved: "green",
        rejected: "red",
      }[status];
    },

    statusLabel(status) {
      return {
        pending: "قيد المراجعة",
        approved: "تمت الموافقة",
        rejected: "تم الرفض",
      }[status];
    },

    openDialog(item, action) {
      this.selectedWithdraw = item;
      this.dialogAction = action;
      this.note = "";
      this.dialog = true;
    },

    async updateStatus(id, status, note) {
      this.updating = true;
      const token = localStorage.getItem("token");

      try {
        const res = await axios.patch(
          `${this.domin}dashboard/withdraw-requests/${id}`,
          {
            status,
            note: note || "",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const index = this.localRequests.findIndex(
          (w) => w.id === this.selectedWithdraw.id
        );
        if (index !== -1) {
          this.localRequests[index].status = status;
          this.localRequests[index].note = note;
        }

        this.dialog = false;
      } catch (err) {
        console.error("❌ خطأ أثناء التعديل:", err.response?.data || err);
      } finally {
        this.updating = false;
      }
    },
  },

  async mounted() {
    this.loading = true;
    await this.RequstPrfictAll();
    await this.SellersPrfictAll();
    this.localRequests = [...this.AllRequst];
    this.loading = false;
  },
};
</script>
``` --- هل تحب أضيف **تجميع أرباح المندوبين في جدول واحد** (فيه عمود للأرباح
المسحوبة وغير المسحوبة سوا) بدل فصلهم في جدولين؟ ده ممكن يخلي الصفحة أبسط وأوضح
بصريًا.
