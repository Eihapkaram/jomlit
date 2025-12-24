<template>
  <div class="page-wrapper">
    <div class="toolbar">
      <v-btn class="action-btn" color="primary" elevation="3" icon>
        <router-link :to="{ name: 'addpage' }" class="router-link">
          <v-icon size="28">mdi-plus</v-icon>
        </router-link>
      </v-btn>

      <v-btn
        class="action-btn"
        color="secondary"
        @click="down"
        elevation="3"
        icon
      >
        <v-icon size="28">mdi-download</v-icon>
      </v-btn>

      <v-file-input
        hide-details
        class="upload-input"
        prepend-icon="mdi-upload"
        label="رفع ملف Excel"
        @change="up"
      ></v-file-input>
    </div>

    <v-container>
      <v-row dense>
        <v-col cols="12" md="6" lg="4" v-for="(pro, i) in page" :key="i">
          <v-card class="offer-card" elevation="5" hover>
            <v-img :src="domin + pro.img" cover></v-img>

            <v-card-title class="headline">صفحة رقم {{ pro.id }}</v-card-title>

            <v-card-subtitle class="slug-text"
              >Slug: {{ pro.slug }}</v-card-subtitle
            >

            <v-card-text>
              <div class="info-row">
                <v-icon color="green" class="mr-2">mdi-package-variant</v-icon>
                عدد الاقسام: {{ pro.pageproducts.length }}
              </div>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="justify-space-between">
              <v-btn
                icon
                color="blue"
                @click="
                  $router.push({
                    name: 'updatepage',
                    params: { id: pro.id },
                  })
                "
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <v-btn icon color="red" @click="dl(pro.id)">
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
      catigoryies: "",
    };
  },
  computed: {
    ...mapState(mystore, ["page", "domin"]),
  },
  methods: {
    ...mapActions(mystore, ["Pages"]),
    async up(event) {
      const token = localStorage.getItem("token");
      const file = event.target.files?.[0];
      if (!file) return alert("⚠️ لم يتم اختيار ملف.");

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await axios.post(
          `${this.domin}dashboard/pages/import`,
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
        const res = await axios.get(`${this.domin}dashboard/pages/export`, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        });

        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "pages.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error("❌ خطأ أثناء التحميل:", err);
      }
    },

    async dl(id) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${this.domin}dashboard/page/Delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error(err.response?.data || err);
      }
      await this.Pages();
    },
  },
  async mounted() {
    await this.Pages();
  },
};
</script>

<style scoped>
.page-wrapper {
  padding: 20px;
  background-color: #f9f9f9;
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
  text-decoration: none;
  color: white;
}

.action-btn {
  border-radius: 50%;
  transition: all 0.3s ease;
}
.action-btn:hover {
  transform: scale(1.1);
}

.upload-input {
  max-width: 250px;
}

.offer-card {
  border-radius: 16px;
  overflow: hidden;
  height: fit-content;
  width: 300px;
  background-color: #fff;
  transition: transform 0.3s ease;
}
.offer-card:hover {
  transform: translateY(-5px);
}

.slug-text {
  color: #777;
  font-size: 0.9rem;
}

.info-row {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #333;
}
</style>
