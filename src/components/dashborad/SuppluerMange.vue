<template>
  <v-container>
    <v-row>
      <!-- جدول الموردين ومنتجاتهم -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>الموردين ومنتجاتهم</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="supplierHeaders"
              :items="suppliers"
              item-key="id"
            >
              <template #item.products="{ item }">
                <div v-if="item.products.length">
                  <v-chip
                    v-for="product in item.products"
                    :key="product.id"
                    class="ma-1"
                    color="primary"
                    small
                  >
                    {{ product.titel }}
                  </v-chip>
                </div>
                <div v-else>لا يوجد منتجات</div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- جدول المنتجات والموردين -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>المنتجات ومورديها</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="productHeaders"
              :items="products"
              item-key="id"
            >
              <template #item.suppliers="{ item }">
                <div v-if="item.suppliers.length">
                  <v-chip
                    v-for="supplier in item.suppliers"
                    :key="supplier.id"
                    class="ma-1"
                    color="secondary"
                    small
                  >
                    {{ supplier.name }}
                  </v-chip>
                </div>
                <div v-else>لا يوجد موردين</div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- ربط منتجات بمورد -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>ربط منتجات بمورد</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="attachProducts">
              <v-select
                v-model="selectedSupplier"
                :items="suppliers"
                item-text="name"
                item-value="id"
                label="اختر المورد"
                required
              />
              <v-select
                v-model="selectedProducts"
                :items="products"
                item-text="titel"
                item-value="id"
                label="اختر المنتجات"
                multiple
                required
              />
              <v-btn type="submit" color="primary" class="mt-3">
                ربط المنتجات
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const suppliers = ref([]);
const products = ref([]);
const selectedSupplier = ref(null);
const selectedProducts = ref([]);

const supplierHeaders = [
  { text: "ID", value: "id" },
  { text: "اسم المورد", value: "name" },
  { text: "المنتجات", value: "products" },
];

const productHeaders = [
  { text: "ID", value: "id" },
  { text: "اسم المنتج", value: "titel" },
  { text: "الموردين", value: "suppliers" },
];

// جلب الموردين ومنتجاتهم
const fetchSuppliers = async () => {
  try {
    const res = await axios.get("/api/suppliers");
    suppliers.value = res.data.map((s) => ({
      ...s,
      products: [],
    }));
    // جلب المنتجات لكل مورد
    for (let s of suppliers.value) {
      const resp = await axios.get(`/api/suppliers/${s.id}/products`);
      s.products = resp.data || [];
    }
  } catch (error) {
    console.error(error);
  }
};

// جلب كل المنتجات ومورديها
const fetchProducts = async () => {
  try {
    const res = await axios.get("/api/products");
    products.value = res.data.map((p) => ({
      ...p,
      suppliers: [],
    }));
    // جلب الموردين لكل منتج
    for (let p of products.value) {
      const resp = await axios.get(`/api/products/${p.id}/suppliers`);
      p.suppliers = resp.data || [];
    }
  } catch (error) {
    console.error(error);
  }
};

// ربط منتجات بمورد
const attachProducts = async () => {
  if (!selectedSupplier.value || !selectedProducts.value.length) return;
  try {
    await axios.post(
      `/api/suppliers/${selectedSupplier.value}/products/attach`,
      {
        product_ids: selectedProducts.value,
      }
    );
    alert("تم ربط المنتجات بالمورد بنجاح");
    selectedSupplier.value = null;
    selectedProducts.value = [];
    fetchSuppliers();
    fetchProducts();
  } catch (error) {
    console.error(error);
    alert("حدث خطأ أثناء الربط");
  }
};

onMounted(() => {
  fetchSuppliers();
  fetchProducts();
});
</script>

<style scoped></style>
