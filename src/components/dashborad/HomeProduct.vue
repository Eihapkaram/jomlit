<template>
  <div class="page-wrapper">
    <!-- ✅ شريط الأدوات -->
    <div class="toolbar">
      <v-btn color="primary" elevation="3" icon>
        <router-link :to="{ name: 'create' }" class="router-link">
          <v-icon size="28">mdi-plus</v-icon>
        </router-link>
      </v-btn>

      <v-btn color="secondary" @click="down" elevation="3" icon>
        <v-icon size="28">mdi-download</v-icon>
      </v-btn>

      <v-file-input
        hide-details
        dense
        prepend-icon="mdi-upload"
        label="رفع ملف Excel"
        class="upload-input"
        @change="up"
      ></v-file-input>
    </div>

    <!-- ✅ قائمة المنتجات -->
    <v-container>
      <v-row dense>
        <v-col cols="12" md="6" lg="4" v-for="(pro, i) in all" :key="i">
          <v-card class="product-card" elevation="6" hover>
            <v-img
              v-if="pro.img"
              :src="domin + pro.img"
              height="200"
              cover
            ></v-img>

            <v-card-title class="text-h6 font-weight-bold">
              {{ pro.titel }}
            </v-card-title>
            <v-card-title class="text-h6 font-weight-bold">
              id:{{ pro.id }}
            </v-card-title>

            <v-card-text class="text-body-2 grey--text">
              {{ pro.description }}
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="justify-space-between">
              <v-btn
                color="blue"
                icon
                @click="
                  $router.push({
                    name: 'update',
                    params: { id: pro.id },
                  })
                "
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <v-btn color="red" icon @click="dl(pro.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mystore } from "@/store";
import axios from "axios";
import { mapActions, mapState } from "pinia";
export default {
  data() {
    return {
      text: "",
    };
  },
  computed: {
    ...mapState(mystore, ["all", "domin"]),
  },
  methods: {
    ...mapActions(mystore, ["getall"]),
    async dl(id) {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.delete(`${this.domin}dashboard/destroy/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("تم حذف المنتج:", res.data);
      } catch (err) {
        console.error(err.response?.data || err);
      }

      this.products = this.all.filter((product) => product.id !== id);
      await this.getall();
    },

    async up(event) {
      const token = localStorage.getItem("token");
      const file = event.target.files[0];
      if (!file) return alert("⚠️ لم يتم اختيار ملف.");

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await axios.post(
          `${this.domin}dashboard/products/import`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert(res.data.message || "تم رفع الملف بنجاح ✅");
      } catch (err) {
        alert("حدث خطأ أثناء رفع الملف ❌");
      }
    },

    async down() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${this.domin}dashboard/products/export`, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "products.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error("❌ خطأ أثناء التحميل:", err);
      }
    },
  },

  async mounted() {
    await this.getall();
  },
};
</script>

<style scoped>
.page-wrapper {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
  width: 100%;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 15px;
  margin-bottom: 30px;
}

.router-link {
  color: white;
  text-decoration: none;
}

.upload-input {
  max-width: 250px;
}

.product-card {
  border-radius: 16px;
  width: 300px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.v-card-title {
  padding-top: 10px;
}

.v-card-actions {
  background-color: #fafafa;
}

.v-btn {
  border-radius: 10px;
}
</style>
