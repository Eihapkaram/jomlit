<template>
  <div class="suppliers-page">
    <v-card elevation="3" class="main-card">
      <!-- العنوان -->
      <div class="header-section">
        <v-icon color="primary" size="32">mdi-factory</v-icon>
        <h2 class="title">إدارة الموردين</h2>
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

      <!-- بحث -->
      <v-text-field
        v-model="search"
        label="بحث عن مورد"
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
        @input="fetchSuppliers"
        class="mb-6"
        hide-details
      />

      <!-- جدول الموردين -->
      <v-card>
        <v-card-title>
          <v-icon start color="primary">mdi-table</v-icon>
          قائمة الموردين
        </v-card-title>

        <v-data-table
          :headers="headers"
          :items="suppliers"
          :loading="loading"
          :items-per-page="10"
          :page.sync="page"
          :server-items-length="total"
          no-data-text="لا يوجد موردين"
        >
          <template #item.actions="{ item }">
            <v-btn
              color="info"
              variant="tonal"
              size="small"
              @click="openSupplierProducts(item.id)"
            >
              المنتجات
            </v-btn>
          </template>
        </v-data-table>
      </v-card>

      <!-- مودال منتجات المورد -->
      <v-dialog v-model="showProductsDialog" max-width="900px">
        <v-card>
          <v-card-title>
            <v-icon start color="primary">mdi-package-variant</v-icon>
            منتجات المورد
          </v-card-title>
          <v-card-actions class="justify-end">
            <v-btn
              variant="tonal"
              color="primary"
              @click="showProductsDialog = false"
            >
              إلغاء
            </v-btn>
          </v-card-actions>
          <v-divider />

          <v-card-text>
            <v-alert v-if="supplierProducts.length === 0" type="info">
              لا توجد منتجات مرتبطة بهذا المورد
            </v-alert>

            <v-list v-else>
              <!-- أزرار تنزيل الإكسل -->
              <div class="mt-4 d-flex gap-2">
                <v-btn
                  color="primary"
                  outlined
                  @click="downloadSupplierProductsExcel"
                >
                  المنتجات Pivot
                </v-btn>
                <v-btn
                  color="success"
                  outlined
                  @click="downloadSupplierProductsDataExcel"
                >
                  بيانات المنتجات
                </v-btn>
              </div>
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
                  </div>
                  <div class="d-flex flex-column gap-2">
                    <v-btn small color="warning" @click="openEditPivotModal(p)">
                      تعديل
                    </v-btn>
                    <v-btn small color="error" @click="removeProduct(p.id)">
                      حذف
                    </v-btn>
                    <v-btn
                      small
                      color="info"
                      @click="openProductSuppliers(p.id)"
                    >
                      موردو المنتج
                    </v-btn>
                    <v-btn small color="success" @click="openCreateOrder(p)">
                      عمل طلب
                    </v-btn>
                  </div>
                </div>
              </v-list-item>
            </v-list>

            <!-- ربط منتجات عبر قائمة منسدلة -->
            <v-autocomplete
              v-model="selectedProduct"
              :items="this.all"
              item-title="id"
              item-value="id"
              label="اختر المنتج لربطه"
              dense
              clearable
              :loading="loadingProducts"
              class="mt-4"
              placeholder="بحث عن منتج"
            />
            <v-btn
              color="success"
              block
              class="mt-2"
              @click="attachProductFromSelect"
            >
              ربط المنتج
            </v-btn>
          </v-card-text>

          <v-card-actions class="justify-end">
            <v-btn
              variant="tonal"
              color="primary"
              @click="showProductsDialog = false"
            >
              إلغاء
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- مودال تعديل pivot -->
      <v-dialog v-model="editProduct" max-width="500px">
        <v-card>
          <v-card-title>تعديل بيانات المنتج</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="editProduct.pivot.supplier_price"
              label="سعر المورد"
              type="number"
            />
            <v-text-field
              v-model="editProduct.pivot.min_quantity"
              label="الحد الأدنى"
              type="number"
            />
            <v-switch
              v-model="editProduct.pivot.active"
              label="الحالة"
            ></v-switch>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="primary" @click="updatePivot">حفظ</v-btn>
            <v-btn color="grey" @click="editProduct = null">إلغاء</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- مودال الموردين لكل منتج -->
      <v-dialog v-model="showProductSuppliersDialog" max-width="700px">
        <v-card>
          <v-card-title>
            <v-icon start color="primary">mdi-account-group</v-icon>
            موردو المنتج
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-alert v-if="productSuppliers.length === 0" type="info">
              لا يوجد موردين مرتبطين بهذا المنتج
            </v-alert>

            <v-list v-else>
              <v-list-item
                v-for="s in productSuppliers"
                :key="s.id"
                class="border rounded mb-2 d-flex justify-space-between align-center"
              >
                <div>
                  <div>
                    <strong>{{ s.name }}</strong>
                  </div>
                  <div>سعر المورد: {{ s.pivot.supplier_price }}</div>
                  <div>الحد الأدنى: {{ s.pivot.min_quantity }}</div>
                  <div>الحالة: {{ s.pivot.active ? "نشط" : "موقوف" }}</div>
                </div>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              variant="tonal"
              color="primary"
              @click="showProductSuppliersDialog = false"
            >
              إغلاق
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- مودال إنشاء طلب المورد -->
      <v-dialog v-model="showCreateOrderDialog" max-width="500px">
        <v-card>
          <v-card-title>
            إنشاء طلب تجهيز: {{ orderForm.product_name }}
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model.number="orderForm.quantity"
              label="الكمية"
              type="number"
              min="1"
            />
            <div class="mt-2">
              <strong>سعر الوحدة:</strong> {{ orderForm.supplier_price }} ج
            </div>
            <div>
              <strong>الإجمالي:</strong>
              {{ orderForm.quantity * orderForm.supplier_price }} ج
            </div>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="success" @click="createSupplierOrder"
              >إنشاء الطلب</v-btn
            >
            <v-btn color="grey" @click="showCreateOrderDialog = false"
              >إلغاء</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import { mystore } from "@/store";
import { mapState, mapActions } from "pinia";

export default {
  inject: ["Emitter"],
  name: "SupplierManager",
  data() {
    return {
      suppliers: [],
      supplierProducts: [],
      productSuppliers: [],
      all1: [],
      selectedProduct: null,
      page: 1,
      total: 0,
      search: "",
      loading: false,
      loadingProducts: false,
      showProductsDialog: false,
      showProductSuppliersDialog: false,
      currentSupplierId: null,
      currentProductId: null,
      editProduct: null,
      alert: { show: false, type: "success", message: "" },
      showCreateOrderDialog: false,
      orderForm: {
        supplier_id: null,
        product_id: null,
        product_name: "",
        quantity: 1,
        supplier_price: 0,
      },
      headers: [
        { title: "اسم المورد", key: "name" },
        { title: "الهاتف", key: "phone" },
        { title: "ID", key: "id" },
        { title: "الإجراءات", key: "actions", sortable: false },
      ],
    };
  },
  computed: {
    ...mapState(mystore, ["domin", "all"]),
  },
  methods: {
    ...mapActions(mystore, ["getall"]),

    showAlert(type, message) {
      this.alert = { show: true, type, message };
      setTimeout(() => (this.alert.show = false), 3000);
    },

    async fetchSuppliers() {
      const token = localStorage.getItem("token");
      this.loading = true;
      try {
        const res = await axios.get(`${this.domin}dashboard/suppliers`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { search: this.search, page: this.page },
        });
        this.suppliers = res.data.suppliers;
        this.total = res.data.count || res.data.length;
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
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.supplierProducts = res.data.products || [];
        this.loadAllProducts();
      } catch {
        this.showAlert("error", "فشل تحميل المنتجات");
      }
    },

    async loadAllProducts() {
      this.loadingProducts = true;
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${this.domin}dashboard/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.all = res.data.products || [];
      } catch {
        this.showAlert("error", "فشل تحميل قائمة المنتجات");
      } finally {
        this.loadingProducts = false;
      }
    },

    async attachProductFromSelect() {
      if (!this.selectedProduct) {
        this.showAlert("error", "يجب اختيار منتج");
        return;
      }
      const token = localStorage.getItem("token");
      try {
        await axios.post(
          `${this.domin}dashboard/suppliers/${this.currentSupplierId}/products/attach`,
          {
            product_id: this.selectedProduct,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.showAlert("success", "تم ربط المنتج بنجاح");
        let textem2 = "تم ربط المنتج ب المورد  ";
        let act = true;
        let op = { textem2, act };
        this.Emitter.emit("cart", op);
        this.openSupplierProducts(this.currentSupplierId);
        this.selectedProduct = null;
      } catch {
        this.showAlert("error", "فشل ربط المنتج");
      }
    },

    openEditPivotModal(product) {
      this.editProduct = JSON.parse(JSON.stringify(product));
    },

    async updatePivot() {
      if (!this.editProduct) return;
      const token = localStorage.getItem("token");
      try {
        await axios.post(
          `${this.domin}dashboard/suppliers/${this.currentSupplierId}/products/update-pivot`,
          {
            product_id: this.editProduct.id,
            supplier_price: this.editProduct.pivot.supplier_price,
            min_quantity: this.editProduct.pivot.min_quantity,
            active: this.editProduct.pivot.active,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.showAlert("success", "تم تحديث بيانات المنتج");
        let textem2 = "تم تحديث بيانات المنتج";
        let act = true;
        let op = { textem2, act };
        this.Emitter.emit("cart", op);
        this.openSupplierProducts(this.currentSupplierId);
        this.editProduct = null;
      } catch {
        this.showAlert("error", "فشل تحديث بيانات المنتج");
      }
    },

    async removeProduct(productId) {
      const token = localStorage.getItem("token");
      try {
        await axios.post(
          `${this.domin}dashboard/suppliers/${this.currentSupplierId}/products/detach`,
          {
            product_id: productId,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.showAlert("success", "تم حذف المنتج بنجاح");
        let textem2 = "تم ازالة المنتج";
        let act = true;
        let op = { textem2, act };
        this.Emitter.emit("cart", op);
        this.openSupplierProducts(this.currentSupplierId);
      } catch {
        this.showAlert("error", "فشل حذف المنتج");
      }
    },

    async openProductSuppliers(productId) {
      this.currentProductId = productId;
      this.showProductSuppliersDialog = true;
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${this.domin}dashboard/products/${productId}/suppliers`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.productSuppliers = res.data.suppliers || [];
      } catch {
        this.showAlert("error", "فشل تحميل الموردين للمنتج");
      }
    },

    openCreateOrder(product) {
      this.orderForm = {
        supplier_id: this.currentSupplierId,
        product_id: product.id,
        product_name: product.titel,
        quantity: product.pivot.min_quantity || 1,
        supplier_price: product.pivot.supplier_price,
      };
      this.showCreateOrderDialog = true;
    },
    // إضافة: تنزيل إكسل المنتجات مع Pivot
    async downloadSupplierProductsExcel() {
      if (!this.currentSupplierId) return;

      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${this.domin}dashboard/suppliers/${this.currentSupplierId}/products/export`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          }
        );

        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `supplier_${this.currentSupplierId}_products.xlsx`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        let textem2 = "تم تنزيل الاكسل";
        let act = true;
        let op = { textem2, act };
        this.Emitter.emit("cart", op);
      } catch {
        this.showAlert("error", "فشل تنزيل الملف");
      }
    },

    // إضافة: تنزيل إكسل بيانات المنتجات فقط
    async downloadSupplierProductsDataExcel() {
      if (!this.currentSupplierId) return;

      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${this.domin}dashboard/suppliers/${this.currentSupplierId}/products/export-data`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          }
        );

        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `supplier_${this.currentSupplierId}_products_data.xlsx`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        let textem2 = "تم تنزيل الاكسل";
        let act = true;
        let op = { textem2, act };
        this.Emitter.emit("cart", op);
      } catch {
        this.showAlert("error", "فشل تنزيل الملف");
      }
    },
    async createSupplierOrder() {
      const token = localStorage.getItem("token");

      try {
        await axios.post(
          `${this.domin}dashboard/orders/supplier-create`,
          {
            supplier_id: this.orderForm.supplier_id,
            items: [
              {
                product_id: this.orderForm.product_id,
                quantity: Number(this.orderForm.quantity),
                supplier_price: Number(this.orderForm.supplier_price),
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        this.showAlert("success", "تم إنشاء طلب التجهيز بنجاح ✅");
        let textem2 = "تم إنشاء الطلب بنجاح";
        let act = true;
        let op = { textem2, act };
        this.Emitter.emit("cart", op);
        this.showCreateOrderDialog = false;
      } catch {
        this.showAlert("error", "فشل إنشاء طلب التجهيز");
      }
    },
  },

  mounted() {
    this.fetchSuppliers();
    this.getall();
    console.log(this.all);
  },
};
</script>

<style scoped>
.suppliers-page {
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
