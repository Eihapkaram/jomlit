<template>
  <div>
    <img width="200px" :src="showimg" />

    <keep-alive>
      <form @submit.prevent="this.actfun(this.$route.params.id)" method="Post">
        <v-file-input
          @change="onFileChange"
          placeholder="img"
          name="img"
          id="img"
        ></v-file-input>

        <v-text-field
          v-model="name"
          placeholder="name"
          name="name"
        ></v-text-field>

        <v-text-field
          v-model="last_name"
          placeholder="last_name"
          name="last_name"
        ></v-text-field>

        <v-text-field
          placeholder="password"
          v-model="password"
          name="password"
          type="password"
        ></v-text-field>

        <v-text-field
          v-model="role"
          placeholder="role"
          name="role"
          type="text"
        ></v-text-field>

        <span class="d-flex">
          <v-btn
            type="submit"
            @click="active = true"
            class="bg-black"
            id="btnadd"
            variant="outline"
          >
            <span id="addtext">
              <span v-if="!active">update to user</span>
            </span>
            <v-progress-circular
              v-if="active"
              indeterminate
            ></v-progress-circular>
          </v-btn>
        </span>
      </form>
    </keep-alive>
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
      active: false,
      showimg: "",
      name: "",
      last_name: "",
      password: "",
      role: "",
      img: null,
      latitude: null,
      longitude: null,
    };
  },
  computed: {
    ...mapState(mystore, ["domin"]),
  },
  mounted() {
    this.getLocation();
  },
  methods: {
    async actfun(id) {
      this.active = true;
      await this.createProduct(id);
    },
    onFileChange(e) {
      this.img = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(this.img);
      reader.onload = (event) => {
        this.showimg = event.target.result;
      };
    },
    // ✅ جلب الموقع الجغرافي
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
          },
          (error) => {
            console.warn("تعذر الحصول على الموقع:", error.message);
          }
        );
      } else {
        console.warn("المتصفح لا يدعم تحديد الموقع.");
      }
    },
    async createProduct(id) {
      const token = localStorage.getItem("token");
      let formData = new FormData();
      formData.append("name", this.name);
      formData.append("last_name", this.last_name);
      formData.append("password", this.password);
      formData.append("role", this.role);
      formData.append("img", this.img || null);

      // ✅ أضف الإحداثيات
      if (this.latitude && this.longitude) {
        formData.append("latitude", this.latitude);
        formData.append("longitude", this.longitude);
      }

      try {
        const res = await axios.post(
          `${this.domin}dashboard/user/update/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("تم تعديل معلومات المستخدم:", res.data);
        let textem2 = "تم التعديل ";
        let act = true;
        let op = { textem2, act };
        this.Emitter.emit("cart", op);
      } catch (err) {
        console.error("خطأ أثناء التحديث:", err.response?.data || err);
      } finally {
        this.active = false;
      }
    },
  },
};
</script>

<style scoped>
.v-text-field,
.v-file-input,
.v-textarea {
  width: 600px;
}
#btnadd {
  border-radius: 30px;
  height: 50px;
  width: 300px;
}
</style>
