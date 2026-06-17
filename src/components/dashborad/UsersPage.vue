<template>
  <v-container class="pa-6" fluid dir="rtl">
    <v-row class="mb-4 d-flex align-center justify-start gap-3 px-3">
      <v-btn
        color="primary"
        elevation="2"
        icon
        height="44"
        width="44"
        class="rounded-lg"
      >
        <router-link
          :to="{ name: 'register' }"
          style="color: white; display: flex; align-items: center"
        >
          <v-icon size="22">mdi-account-plus</v-icon>
        </router-link>
      </v-btn>

      <v-btn
        color="success"
        variant="flat"
        prepend-icon="mdi-file-excel"
        class="rounded-lg font-weight-bold"
        elevation="1"
        @click="down"
      >
        تحميل Excel
      </v-btn>

      <v-btn
        color="indigo-darken-1"
        variant="flat"
        prepend-icon="mdi-upload"
        class="rounded-lg font-weight-bold"
        elevation="1"
      >
        <label
          color="white"
          for="uploadFile"
          style="
            cursor: pointer;
            color: white;
            display: block;
            width: 100%;
            height: 100%;
          "
        >
          رفع Excel
        </label>
        <input id="uploadFile" type="file" @change="up" style="display: none" />
      </v-btn>
    </v-row>

    <v-row class="mb-6 px-3">
      <v-col cols="12" class="pa-0">
        <v-btn-toggle
          v-model="selectedRole"
          mandatory
          color="primary"
          variant="outlined"
          class="rounded-lg bg-white overflow-hidden"
          divided
        >
          <v-btn value="all" class="font-weight-bold">الكل</v-btn>
          <v-btn value="customer" class="font-weight-bold"
            >المستخدمين (العملاء)</v-btn
          >
          <v-btn value="admin" class="font-weight-bold">المدراء (Admin)</v-btn>
          <v-btn value="seller" class="font-weight-bold">البائعين</v-btn>
          <v-btn value="supplier" class="font-weight-bold">الموردين</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col v-for="(pro, i) in filteredUsers" :key="i" cols="12" sm="6" md="4">
        <v-card
          class="pa-4 rounded-xl border-smooth user-card-hover"
          elevation="2"
        >
          <v-row align="start" no-gutters>
            <v-col cols="4" class="d-flex justify-start pt-2">
              <v-avatar
                :size="76"
                class="elevation-2 bg-grey-lighten-4 border-avatar"
              >
                <v-img
                  v-if="pro.img && pro.img !== 'null'"
                  :src="domin + pro.img"
                  cover
                  alt="User Avatar"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        size="20"
                        color="primary"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
                <v-icon v-else size="36" color="grey-darken-1"
                  >mdi-account</v-icon
                >
              </v-avatar>
            </v-col>

            <v-col cols="8" class="ps-2">
              <v-card-title
                class="text-subtitle-1 font-weight-bold pa-0 mb-1 text-slate-800 text-truncate"
              >
                {{ pro.name }} {{ pro.last_name }}
              </v-card-title>

              <div class="user-meta-info d-flex flex-column gap-1">
                <span class="info-item text-caption text-grey-darken-1">
                  <v-icon size="14" class="ml-1" color="grey"
                    >mdi-fingerprint</v-icon
                  >
                  المعرف: <strong class="text-slate-700">{{ pro.id }}</strong>
                </span>

                <span class="info-item text-caption text-grey-darken-1">
                  <v-icon size="14" class="ml-1" color="indigo-lighten-1"
                    >mdi-shield-account</v-icon
                  >
                  الصلاحية:
                  <v-chip
                    size="x-small"
                    color="indigo"
                    variant="tonal"
                    class="font-weight-bold px-2 py-0"
                    >{{ pro.role }}</v-chip
                  >
                </span>

                <span class="info-item text-caption text-grey-darken-1">
                  <v-icon size="14" class="ml-1" color="grey">mdi-phone</v-icon>
                  الهاتف:
                  <strong class="text-slate-700" dir="ltr">{{
                    pro.phone
                  }}</strong>
                </span>
              </div>

              <v-btn
                v-if="pro.latitude && pro.longitude"
                color="teal-darken-1"
                size="small"
                variant="tonal"
                class="mt-3 rounded-lg font-weight-bold text-caption"
                height="28"
                :href="`https://www.google.com/maps?q=${pro.latitude},${pro.longitude}`"
                target="_blank"
              >
                <v-icon left size="14" class="ml-1"
                  >mdi-map-marker-radius</v-icon
                >
                عرض الموقع
              </v-btn>

              <div
                v-if="pro.role == 'seller'"
                class="mt-2 pt-1 border-top-dashed d-flex flex-wrap gap-1"
              >
                <v-chip
                  size="x-small"
                  color="blue-darken-2"
                  variant="flat"
                  class="rounded-md font-weight-bold px-2"
                  label
                  :href="domin + pro.front_id_image"
                  target="_blank"
                >
                  <v-icon left size="12" class="ml-1"
                    >mdi-file-image-outline</v-icon
                  >
                  هوية أمامي
                </v-chip>
                <v-chip
                  size="x-small"
                  color="blue-darken-2"
                  variant="flat"
                  class="rounded-md font-weight-bold px-2"
                  label
                  :href="domin + pro.back_id_image"
                  target="_blank"
                >
                  <v-icon left size="12" class="ml-1"
                    >mdi-file-image-outline</v-icon
                  >
                  هوية خلفي
                </v-chip>
              </div>
            </v-col>
          </v-row>

          <v-divider class="mt-3 mb-1" color="grey-lighten-3" />

          <v-card-actions class="justify-end pa-0">
            <v-tooltip text="تعديل بيانات المستخدم" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  size="small"
                  variant="text"
                  color="amber-darken-3"
                  @click="
                    $router.push({
                      name: 'updateuser',
                      params: { id: pro.id },
                    })
                  "
                >
                  <v-icon size="20">mdi-pencil-outline</v-icon>
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="حذف المستخدم نهائياً" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  size="small"
                  variant="text"
                  color="red-darken-1"
                  @click="dl(pro.id)"
                >
                  <v-icon size="20">mdi-delete-outline</v-icon>
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
      selectedRole: "all",
    };
  },
  computed: {
    ...mapState(mystore, ["user", "domin"]),
    filteredUsers() {
      if (this.selectedRole === "all") {
        return this.user;
      }
      return this.user.filter((u) => u.role === this.selectedRole);
    },
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
          },
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
          },
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
.gap-3 {
  gap: 12px;
}
.gap-1 {
  gap: 4px;
}
.border-smooth {
  border: 1px solid #eef2f6 !important;
}
.border-avatar {
  border: 2px solid #ffffff !important;
}
.text-slate-800 {
  color: #1e293b;
}
.text-slate-700 {
  color: #334155;
}
.border-top-dashed {
  border-top: 1px dashed #e2e8f0;
}
.user-card-hover {
  background: #ffffff;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.user-card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08) !important;
  border-color: #cbd5e1 !important;
}
</style>
