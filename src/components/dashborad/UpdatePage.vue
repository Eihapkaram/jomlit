<template>
  <div>
    <keep-alive>
      <form @submit.prevent="this.actfun(this.$route.params.id)" method="Post">
        <!-- رفع الصورة -->
        <v-file-input
          @change="onFileChange"
          placeholder="اختر صورة"
          name="img"
          id="img"
          accept="image/*"
        ></v-file-input>

        <!-- عرض الصورة قبل الرفع -->
        <div v-if="showimg" class="mb-3">
          <img :src="showimg" alt="preview" width="200px" />
        </div>

        <v-text-field
          v-model="slug"
          placeholder="slug"
          name="slug"
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
              <span v-if="!active">Update Page</span>
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
      slug: "",
      img: null,
      showimg: "", // عرض الصورة قبل الرفع
    };
  },
  computed: {
    ...mapState(mystore, ["domin"]),
  },
  methods: {
    async actfun(id) {
      this.active = true;
      await this.updatePage(id);
    },

    // عند اختيار صورة جديدة
    onFileChange(e) {
      this.img = e.target.files[0];
      if (this.img) {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.showimg = event.target.result;
        };
        reader.readAsDataURL(this.img);
      }
    },

    async updatePage(id) {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("slug", this.slug);
      if (this.img) {
        formData.append("img", this.img);
      }

      try {
        const res = await axios.post(
          `${this.domin}dashboard/page/Update/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("✅ تم تعديل الصفحة:", res.data);
        let textem2 = "تم التعديل ";
        let act = true;
        let op = { textem2, act };
        this.Emitter.emit("cart", op);
      } catch (err) {
        console.error("❌ خطأ أثناء التعديل:", err.response?.data || err);
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
