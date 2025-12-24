<template>
  <div>
    <keep-alive>
      <form @submit.prevent="this.actfun(this.$route.params.id)" method="Post">
        <v-file-input
          @change="onFileChange"
          placeholder="img"
          name="img"
          id="img"
        ></v-file-input>
        <v-file-input
          @change="onFileChange2"
          placeholder="banner"
          name="banner"
          id="banner"
        ></v-file-input>
        <v-text-field
          v-model="name"
          placeholder="name"
          name="name"
        ></v-text-field>
        <v-textarea
          placeholder="description"
          v-model="description"
          rows="10"
          name="description"
        ></v-textarea>
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
      name: "",
      description: "",
      slug: "",
      img: null,
      banner: null,
      showimg: "",
    };
  },
  computed: {
    ...mapState(mystore, ["domin"]),
  },
  methods: {
    onFileChange(e) {
      this.img = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(this.img);
      reader.onload = (event) => {
        this.showimg = event.target.result;
      };
    },
    onFileChange2(e) {
      this.banner = e.target.files[0];
    },
    async actfun(id) {
      this.active = true;
      this.updatePage(id);
    },

    async updatePage(id) {
      const token = localStorage.getItem("token");

      let formData = new FormData();
      formData.append("name", this.name);
      formData.append("description", this.description);
      formData.append("slug", this.slug);
      formData.append("img", this.img);
      formData.append("banner", this.banner);

      try {
        const res = await axios.post(
          `${this.domin}dashboard/categorie/update/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("تم تعديل categories:", res.data);
        let textem2 = "تم التعديل ";
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
