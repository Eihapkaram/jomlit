<template>
  <div>
    <img width="200px" :src="showimg" />
    <keep-alive>
      <form @submit.prevent="this.actfun()" method="Post">
        <v-file-input
          @change="onFileChange"
          placeholder="img"
          name="img"
          id="img"
        ></v-file-input>
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
            ><span id="addtext">
              <span v-if="!active"> Add Categoreis</span></span
            >
            <v-progress-circular
              v-if="active"
              indeterminate
            ></v-progress-circular
          ></v-btn>
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
      showimg: "",
    };
  },
  computed: {
    ...mapState(mystore, ["domin"]),
  },
  methods: {
    async actfun() {
      this.active = true;
      this.createProduct();
      setTimeout(function () {
        this.active = false;
      }, 0);
    },
    onFileChange(e) {
      this.img = e.target.files[0];

      let reader = new FileReader();
      reader.readAsDataURL(this.img);
      reader.onload = (event) => {
        this.showimg = event.target.result;
      };
    },

    async createProduct() {
      const token = localStorage.getItem("token");
      let formData = new FormData();
      formData.append("slug", this.slug);
      formData.append("img", this.img);
      try {
        const res = await axios.post(
          `${this.domin}dashboard/page/add`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("تم اضافه الصفحه ", res.data);
        let textem2 = "تم اضافه الصفحه";
        let act = true;
        let op = { textem2, act };
        this.Emitter.emit("cart", op);
      } catch (err) {
        console.error(err.response?.data || err);
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
