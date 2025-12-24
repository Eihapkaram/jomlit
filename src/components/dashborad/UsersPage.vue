<template>
  <v-container class="pa-6">
    <!-- أزرار العمليات -->
    <v-row class="mb-6" align="center" justify="start">
      <v-btn color="primary" class="mr-4" elevation="2" icon>
        <router-link :to="{ name: 'register' }" style="color: white">
          <v-icon>mdi-plus</v-icon>
        </router-link>
      </v-btn>

      <v-btn color="secondary" class="mr-4" elevation="2" @click="down">
        <v-icon left>mdi-download</v-icon>
        تحميل Excel
      </v-btn>

      <v-btn color="info" class="mr-4" elevation="2">
        <label for="uploadFile" style="cursor: pointer; color: white">
          <v-icon left>mdi-upload</v-icon>
          رفع Excel
        </label>
        <input id="uploadFile" type="file" @change="up" style="display: none" />
      </v-btn>
    </v-row>

    <!-- عرض المستخدمين -->
    <v-row dense>
      <v-col v-for="(pro, i) in user" :key="i" cols="12" sm="6" md="4">
        <v-card class="pa-4" elevation="4">
          <v-row align="center">
            <v-col cols="4">
              <v-avatar :size="80" :tile="false">
                <img :src="domin + pro.img" alt="User Avatar" />
              </v-avatar>
            </v-col>
            <v-col cols="8">
              <v-card-title class="text-h6 font-weight-medium">
                {{ pro.name }} {{ pro.last_name }}
              </v-card-title>
              <v-card-subtitle>ID: {{ pro.id }}</v-card-subtitle>
              <v-card-subtitle>Role: {{ pro.role }}</v-card-subtitle>
            </v-col>
          </v-row>

          <v-card-actions class="justify-end mt-2">
            <v-tooltip text="تعديل">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  color="warning"
                  @click="
                    $router.push({
                      name: 'updateuser',
                      params: { id: pro.id },
                    })
                  "
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="حذف">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon color="error" @click="dl(pro.id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
    ...mapState(mystore, ["user", "domin"]),
  },
  methods: {
    ...mapActions(mystore, ["Users"]),
    async dl(id) {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.delete(
          `${this.domin}dashboard/user/delete/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("تم حذف المستخدم:", res.data);
      } catch (err) {
        console.error(err.response?.data || err);
      }

      await this.Users();
    },
    async up(e) {
      const token = localStorage.getItem("token");
      const file = e.target.files[0];

      if (!file) {
        console.warn("⚠️ لم يتم اختيار ملف.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await axios.post(
          `${this.domin}dashboard/import/users`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("✅ تم رفع الملف بنجاح:", res.data);
        alert(res.data.message || "تم رفع الملف بنجاح ✅");
      } catch (err) {
        console.error("❌ خطأ أثناء رفع الملف:", err.response?.data || err);
        alert("حدث خطأ أثناء رفع الملف ❌");
      }
    },
    async down() {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(`${this.domin}dashboard/export/users`, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        });

        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "users.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log("✅ تم تنزيل الملف بنجاح");
      } catch (err) {
        console.error("❌ خطأ أثناء التحميل:", err.response?.data || err);
      }
    },
  },
  async mounted() {
    await this.Users();
  },
};
</script>

<style scoped>
.v-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}
</style>
