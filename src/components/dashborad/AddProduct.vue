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
        <v-file-input
          placeholder="images_url"
          multiple
          name="images_url"
          @change="onFileChange2"
        ></v-file-input>
        <v-text-field
          v-model="titel"
          placeholder="title"
          name="titel"
        ></v-text-field>
        <v-textarea
          placeholder="description"
          v-model="description"
          rows="10"
          name="description"
        ></v-textarea>
        <v-text-field
          v-model="brand"
          placeholder="brand"
          name="brand"
        ></v-text-field>
        <v-text-field
          v-model="page_id"
          placeholder="page_id"
          name="page_id"
        ></v-text-field>
        <v-text-field
          placeholder="votes"
          v-model="votes"
          name="votes"
          type="number"
        ></v-text-field>
        <v-text-field
          v-model="stock"
          placeholder="stock"
          name="stock"
          type="number"
        ></v-text-field>
        <v-text-field
          v-model="price"
          placeholder="price"
          name="price"
          type="number"
        ></v-text-field>
        <v-text-field
          v-model="category_id"
          placeholder="category_id"
          name="category_id"
          type="number"
        ></v-text-field>
        <v-text-field
          v-model="url"
          placeholder="سياسه الارجاع"
          name="url"
        ></v-text-field>
        <v-text-field
          v-model="count"
          placeholder="عدد العلب او الاكياس"
          name="count"
        ></v-text-field>

        <v-text-field
          v-model="discount"
          placeholder="تخفيض"
          name="discount"
        ></v-text-field>

        <v-text-field
          v-model="inCounttype"
          placeholder="الحاجه الي جوه الكرتونه علبه\كيس\برطمان"
          name="inCounttype"
        ></v-text-field>

        <v-text-field
          v-model="Counttype"
          placeholder="كرتونه"
          name="Counttype"
        ></v-text-field>
        <span class="d-flex">
          <v-btn
            type="submit"
            @click="active = true"
            class="bg-black"
            id="btnadd"
            variant="outline"
            ><span id="addtext">
              <span v-if="!active"> Add to product</span></span
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
      showimg: "",
      showimges: [],
      titel: "",
      description: "",
      price: "",
      page_id: "",
      stock: "",
      category_id: "",
      votes: "",
      brand: "",
      url: "",
      count: "",
      Counttype: "",
      inCounttype: "",
      discount: "",
      img: null, // الصورة الأساسية
      images: [], // باقي الصور
    };
  },
  computed: {
    ...mapState(mystore, ["domin"]),
  },
  methods: {
    async actfun() {
      this.active = true;

      this.createProduct();
    },
    onFileChange2(e) {
      this.images = Array.from(e.target.files);
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
      formData.append("titel", this.titel);
      formData.append("description", this.description);
      formData.append("votes", this.votes);
      formData.append("stock", this.stock);
      formData.append("brand", this.brand);
      formData.append("page_id", this.page_id);
      formData.append("category_id", this.category_id);
      formData.append("url", this.url);
      formData.append("inCount", this.count);
      formData.append("Counttype", this.Counttype);
      formData.append("inCounttype", this.inCounttype);
      formData.append("discount", this.discount);
      formData.append("price", this.price);
      formData.append("img", this.img);

      // رفع الصور الإضافية
      if (this.images && this.images.length > 0) {
        this.images.forEach((file, index) => {
          formData.append(`images_url[${index}]`, file);
        });
      }

      try {
        const res = await axios.post(
          `${this.domin}dashboard/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("تم إضافة المنتج:", res.data);
        let textem2 = "تم اضافه المنتج";
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
