import { defineStore } from "pinia";
import axios from "axios";

export const CartStore1 = defineStore("CartS", {
  state: () => ({
    CartProduct: [],
    CartProduct2: [],
    domin: "https://web-production-273ed.up.railway.app/api/",
  }),

  actions: {
    /* ---------------------------------------------- *
     *  LOCAL CART  (بدون تسجيل دخول)
     * ---------------------------------------------- */

    async Additem(item) {
      const exist = this.CartProduct.find((p) => p.id === item.id);

      if (exist) {
        exist.quantity += item.quantity;
      } else {
        this.CartProduct.push(JSON.parse(JSON.stringify(item)));
      }

      localStorage.setItem("todo", JSON.stringify(this.CartProduct));
    },

    async GetCart() {
      const data = localStorage.getItem("todo");
      if (data) {
        this.CartProduct = JSON.parse(data);
      }
    },

    async delitem(id) {
      this.CartProduct = this.CartProduct.filter((p) => p.id !== id);
      localStorage.setItem("todo", JSON.stringify(this.CartProduct));
    },

    async delitemAll() {
      this.CartProduct = [];
      localStorage.setItem("todo", JSON.stringify([]));
    },

    /* ---------------------------------------------- *
     * CART FROM DATABASE (User Logged-in)
     * ---------------------------------------------- */

    async GetCart2() {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(`${this.domin}cart/show`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.CartProduct2 = res.data.cart.pro_c_item;
        console.log(this.CartProduct2);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },

    /* ---------------------- إضافة (أو زيادة كمية) منتج ---------------------- */

    async Additem2(item) {
      const token = localStorage.getItem("token");

      const exist = this.CartProduct2.find((p) => p.product_id === item.id);

      if (exist) {
        // تحديث لحظي للواجهة
        const newQuantity = exist.quantity + item.quantity;

        try {
          await axios.put(
            `${this.domin}cart/item/${exist.id}/update`,
            { quantity: newQuantity },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          exist.quantity = newQuantity; // تحديث محلي لحظي
        } catch (err) {
          console.error(err.response?.data || err);
        }
      } else {
        // منتج جديد
        try {
          await axios.post(
            `${this.domin}cart/add`,
            {
              product_id: item.id,
              quantity: item.quantity,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          // تحديث لحظي فوراً من السيرفر
          await this.GetCart2();
        } catch (err) {
          console.error(err.response?.data || err);
        }
      }
    },

    /* ---------------------- حذف عنصر ---------------------- */

    async delitem2(item) {
      const token = localStorage.getItem("token");

      try {
        await axios.delete(`${this.domin}cart/delete/${item.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // تحديث لحظي
        this.CartProduct2 = this.CartProduct2.filter((p) => p.id !== item.id);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },

    /* ---------------------- حذف كل العناصر ---------------------- */

    async CartDelAll() {
      const token = localStorage.getItem("token");

      try {
        await axios.delete(`${this.domin}cart/deleteAll`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // تحديث لحظي
        this.CartProduct2 = [];
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },

    /* ---------------------- تحديث كمية فقط ---------------------- */

    async quantityupdate(item, quantityChange) {
      const token = localStorage.getItem("token");

      const exist = this.CartProduct2.find((p) => p.product_id === item.id);

      if (exist) {
        // احسب الكمية النهائية
        const newQuantity = exist.quantity + quantityChange;

        try {
          await axios.put(
            `${this.domin}cart/item/${exist.id}/update`,
            { quantity: newQuantity }, // هنا بقينا نبعت الكمية النهائية
            { headers: { Authorization: `Bearer ${token}` } }
          );

          exist.quantity = newQuantity; // تحديث الواجهة
        } catch (err) {
          console.error(err.response?.data || err);
        }
      }
    },
    /* ---------------------- زيادة الكمية +1 ---------------------- */

    async increaseQuantity(item) {
      const token = localStorage.getItem("token");

      const exist = this.CartProduct2.find(
        (p) => p.product_id === item.product.id
      );

      if (exist) {
        const newQuantity = exist.quantity + 1;

        await axios.post(
          `${this.domin}cart/item/${exist.id}/increase`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    },

    async decreaseQuantity(item) {
      const token = localStorage.getItem("token");

      const exist = this.CartProduct2.find(
        (p) => p.product_id === item.product.id
      );
      console.log(exist);
      if (exist) {
        await axios.post(
          `${this.domin}cart/item/${exist.id}/decrease`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    },
  },
});
