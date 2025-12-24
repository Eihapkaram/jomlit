<template>
  <div class="admin-create-order-page">
    <v-card elevation="3" class="main-card">
      <div class="header-section">
        <v-icon color="primary" size="32">mdi-cart-plus</v-icon>
        <h2 class="title">إنشاء طلب تجهيز لمورد</h2>
      </div>

      <!-- Alert -->
      <v-alert
        v-if="alert.show"
        :type="alert.type"
        variant="tonal"
        closable
        class="mb-4"
        @click:close="alert.show = false"
      >
        {{ alert.message }}
      </v-alert>

      <!-- بحث واختيار المورد -->
      <v-text-field
        v-model="search"
        label="بحث عن مورد"
        prepend-inner-icon="mdi-magnify"
        @input="fetchSuppliers"
        class="mb-4"
      />
      <v-data-table
        :headers="headers"
        :items="suppliers"
        :loading="loading"
        item-key="id"
        class="mb-4"
      >
        <template #item.actions="{ item }">
          <v-btn color="info" small @click="openSupplierProducts(item.id)">
            المنتجات
          </v-btn>
        </template>
      </v-data-table>

      <!-- مودال منتجات المورد -->
      <v-dialog v-model="showProductsDialog" max-width="900px">
        <v-card>
          <v-card-title>
            <v-icon start color="primary">mdi-package-variant</v-icon>
            منتجات المورد
          </v-card-title>
          <v-card-text>
            <v-alert v-if="supplierProducts.length === 0" type="info">
              لا توجد منتجات مرتبطة بهذا المورد
            </v-alert>
            <v-list v-else>
              <v-list-item
                v-for="p in supplierProducts"
                :key="p.id"
                class="mb-3"
              >
                <div class="d-flex gap-4">
                  <div>
                    <img width="100px" :src="domin + p.img" />
                  </div>
                  <div style="flex: 1">
                    <div><strong>الاسم:</strong> {{ p.titel }}</div>
                    <div><strong>ID:</strong> {{ p.id }}</div>
                    <div>
                      <strong>سعر المورد:</strong>
                      {{ p.pivot.supplier_price }} ج
                    </div>
                    <div>
                      <strong>الحد الأدنى:</strong> {{ p.pivot.min_quantity }}
                    </div>
                    <div>
                      <strong>الحالة:</strong>
                      {{ p.pivot.active ? "نشط" : "موقوف" }}
                    </div>
                    <v-text-field
                      v-model.number="p.selectedQuantity"
                      type="number"
                      :min="p.pivot.min_quantity || 1"
                      label="الكمية"
                      dense
                      class="mt-2"
                    />
                  </div>
                  <div class="d-flex flex-column gap-2">
                    <v-btn small color="success" @click="addProductToOrder(p)">
                      أضف للطلب
                    </v-btn>
                  </div>
                </div>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              variant="tonal"
              color="primary"
              @click="showProductsDialog = false"
            >
              إغلاق
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- جدول الطلب النهائي -->
      <v-card class="mt-4" v-if="orderItems.length">
        <v-card-title>الطلب النهائي</v-card-title>
        <v-data-table
          :headers="orderHeaders"
          :items="orderItems"
          item-key="product_id"
        >
          <template #item.total="{ item }">
            {{ item.quantity * item.supplier_price }}
          </template>
          <template #item.actions="{ item }">
            <v-btn color="error" small @click="removeOrderItem(item)">
              حذف
            </v-btn>
          </template>
        </v-data-table>
        <div class="mt-2 text-end">
          <strong>الإجمالي: </strong> {{ totalPrice }} ج
        </div>
        <v-btn color="primary" class="mt-2" @click="submitOrder">
          إرسال الطلب
        </v-btn>
      </v-card>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import { mystore } from "@/store";
import { mapState } from "pinia";

export default {
  inject: ["Emitter"],
  data() {
    return {
      suppliers: [],
      supplierProducts: [],
      orderItems: [],
      alert: { show: false, type: "success", message: "" },
      search: "",
      loading: false,
      showProductsDialog: false,
      selectedSupplier: null,
      currentSupplierId: null,
      headers: [
        { title: "اسم المورد", key: "name" },
        { title: "الهاتف", key: "phone" },
        { title: "ID", key: "id" },
        { title: "إجراءات", key: "actions", sortable: false },
      ],
      orderHeaders: [
        { title: "المنتج", key: "product_name" },
        { title: "الكمية", key: "quantity" },
        { title: "سعر الوحدة", key: "supplier_price" },
        { title: "الإجمالي", key: "total" },
        { title: "إجراءات", key: "actions", sortable: false },
      ],
    };
  },
  computed: {
    ...mapState(mystore, ["domin"]),
    totalPrice() {
      return this.orderItems.reduce(
        (sum, item) => sum + item.quantity * item.supplier_price,
        0
      );
    },
  },
  methods: {
    showAlert(type, message) {
      this.alert = { show: true, type, message };
      setTimeout(() => (this.alert.show = false), 3000);
    },

    async fetchSuppliers() {
      this.loading = true;
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${this.domin}dashboard/suppliers`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { search: this.search },
        });
        this.suppliers = res.data.suppliers;
      } catch {
        this.showAlert("error", "فشل تحميل الموردين");
      } finally {
        this.loading = false;
      }
    },

    async openSupplierProducts(id) {
      this.currentSupplierId = id;
      this.showProductsDialog = true;
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${this.domin}dashboard/suppliers/${id}/products`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.supplierProducts = res.data.products.map((p) => ({
          ...p,
          selectedQuantity: p.pivot.min_quantity || 1,
        }));
      } catch {
        this.showAlert("error", "فشل تحميل منتجات المورد");
      }
    },

    addProductToOrder(product) {
      const minQty = product.pivot.min_quantity || 1;

      if (!product.selectedQuantity || product.selectedQuantity < minQty) {
        this.showAlert("error", `الكمية لا تقل عن ${minQty}`);
        return;
      }

      const exists = this.orderItems.find((p) => p.product_id === product.id);

      if (exists) {
        exists.quantity = product.selectedQuantity;
      } else {
        this.orderItems.push({
          product_id: product.id,
          product_name: product.titel,
          quantity: product.selectedQuantity,
          supplier_price: product.pivot.supplier_price,
        });
      }

      this.showAlert("success", "تم إضافة المنتج للطلب");
      let textem2 = "تم اضافه المنتج للطلب";
      let act = true;
      let op = { textem2, act };
      this.Emitter.emit("cart", op);
    },

    removeOrderItem(item) {
      this.orderItems = this.orderItems.filter(
        (p) => p.product_id !== item.product_id
      );
    },

    async submitOrder() {
      if (!this.currentSupplierId) {
        this.showAlert("error", "من فضلك اختر مورد أولاً");
        return;
      }

      if (!this.orderItems.length) {
        this.showAlert("error", "أضف منتج واحد على الأقل");
        return;
      }

      const token = localStorage.getItem("token");

      // تجهيز الداتا بنفس الشكل اللي Laravel مستنيه
      const payload = {
        supplier_id: this.currentSupplierId,
        items: this.orderItems.map((item) => ({
          product_id: item.product_id,
          quantity: Number(item.quantity),
          supplier_price: Number(item.supplier_price),
        })),
      };

      try {
        await axios.post(
          `${this.domin}dashboard/orders/supplier-create`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        this.showAlert("success", "تم إنشاء الطلب بنجاح ✅");
        let textem2 = "تم عمل الطلبية للمورد  ";
        let act = true;
        let op = { textem2, act };
        this.Emitter.emit("cart", op);
        // reset
        this.orderItems = [];
        this.supplierProducts = [];
        this.showProductsDialog = false;
        this.currentSupplierId = null;
      } catch (error) {
        console.error(error.response?.data);
        this.showAlert(
          "error",
          error.response?.data?.message || "فشل إنشاء الطلب"
        );
      }
    },
  },
  mounted() {
    this.fetchSuppliers();
  },
};
</script>

<style scoped>
.admin-create-order-page {
  padding: 24px;
  background: #f9fafc;
}
.main-card {
  border-radius: 16px;
  padding: 24px;
}
.header-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.title {
  font-weight: 700;
  color: #333;
}
</style>
