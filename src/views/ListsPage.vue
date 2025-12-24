<template>
  <div>
    <v-row width="100%" justify="center" id="con0b">
      <v-table
        id="itemCartcon"
        height="fit-content"
        fixed-header="true"
        class="elegant-table"
      >
        <thead class="table-header">
          <tr>
            <th colspan="4" class="wishlist-header">
              <v-icon size="28" color="#d4af37" class="mr-2"
                >mdi-heart-outline</v-icon
              >
              <span>الشراء لاحقًا</span>
            </th>
          </tr>
          <tr>
            <th width="600px">المنتج</th>
            <v-spacer></v-spacer>
            <th width="100px">السعر</th>
          </tr>
        </thead>

        <tr v-for="item in this.list" :key="item.id" class="table-row">
          <td>
            <v-row justify="start" align="center">
              <v-col cols="12" lg="4" md="4" sm="4" class="img-col">
                <img
                  id="img"
                  height="100px"
                  width="100px"
                  :src="domin + item.img"
                  :alt="item.title"
                  loading="lazy"
                  class="product-img"
                />
              </v-col>
              <v-col
                id="detilse"
                cols="12"
                lg="7"
                md="7"
                sm="5"
                align-self="center"
              >
                <span class="product-title">{{ item.title }}</span>
              </v-col>
            </v-row>
          </td>

          <v-spacer></v-spacer>
          <td class="price">{{ Math.ceil(item.price) }} ج.م</td>

          <td class="d-flex" id="btns">
            <v-btn class="btn-remove" @click="this.delitemL(item.id)">
              <v-icon left>mdi-delete-outline</v-icon>
              إزالة
            </v-btn>
            <v-btn
              class="btn-show"
              @click="
                $router.push({ name: 'derilse', params: { idparam: item.id } })
              "
            >
              <v-icon left>mdi-eye-outline</v-icon>
              تفاصيل
            </v-btn>
          </td>
        </tr>
      </v-table>
    </v-row>
  </div>
</template>

<script>
import { ListsStore1 } from "@/store/Lists";
import { mystore } from "@/store";
import { mapActions, mapState } from "pinia";
export default {
  data() {
    return {
      shipping: 20,
      item: "",
      nums: [],
      total: [],
      itemurl: ["home", "cartpage", "checkout"],
      cantry: ["Egypt", "afercan", "alex"],
      email: "",
      select: "",
      checkbox: "",
    };
  },
  computed: {
    ...mapState(ListsStore1, ["list"]),
    ...mapState(mystore, ["domin"]),
  },
  methods: {
    ...mapActions(ListsStore1, ["GetCartL", "delitemL", "updateL"]),
    muns(item) {
      let q = item.quantity;
      if (q == 1) return;
      else item.quantity--;
    },
  },
  async mounted() {
    window.scroll(0, 0);
    await this.GetCartL();
  },
};
</script>

<style scoped>
#con0b {
  width: 90%;
  position: relative;
  top: 20px;
  left: -50px;
  direction: rtl;
  padding: 20px;
}

/* 🖤 الجدول */
.elegant-table {
  border-collapse: collapse;
  width: 95%;
  background: transparent;
  border-radius: 14px;
  box-shadow: none;
  color: #333;
  border: 1px solid #e0e0e0;
}

/* رأس الجدول */
.table-header th {
  text-align: center;
  padding: 15px;
  font-weight: 600;
  border-bottom: 2px solid #d4af37;
}

/* 🖤 عنوان الجدول */
.wishlist-header {
  font-size: 24px;
  color: #d4af37;
  font-weight: 700;
  text-align: center;
  background: linear-gradient(to right, #000, #1a1a1a);
  letter-spacing: 1px;
  border-radius: 14px 14px 0 0;
  box-shadow: 0 2px 15px rgba(212, 175, 55, 0.3);
}

/* صفوف */
.table-row {
  background: transparent;
  transition: all 0.3s ease;
  border-bottom: 1px solid #eaeaea;
  animation: fadeIn 0.7s ease-in;
}
.table-row:hover {
  background: rgba(212, 175, 55, 0.05);
  transform: scale(1.005);
}

/* الصورة */
.product-img {
  border-radius: 12px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  height: fit-content;
}
.product-img:hover {
  transform: scale(1.07);
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
}

/* العنوان */
.product-title {
  color: #222;
  font-size: 17px;
  font-weight: 600;
  transition: color 0.3s;
}
.product-title:hover {
  color: #d4af37;
}

/* السعر */
.price {
  color: #b8860b;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

/* الأزرار */
#btns {
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding-top: 10px;
}

/* زر الحذف */
.btn-remove {
  background-color: transparent;
  border: 2px solid #ff5252;
  color: #ff5252;
  border-radius: 25px;
  padding: 8px 16px;
  transition: all 0.3s;
  font-weight: 500;
}
.btn-remove:hover {
  background-color: #ff5252;
  color: #fff;
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(255, 82, 82, 0.4);
}

/* زر التفاصيل */
.btn-show {
  background: linear-gradient(45deg, #d4af37, #b8860b);
  color: #000 !important;
  border-radius: 25px;
  padding: 8px 20px;
  font-weight: 600;
  transition: all 0.3s;
}
.btn-show:hover {
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
  transform: scale(1.05);
}

/* تأثير الدخول */
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* تجاوب */
@media (max-width: 991px) {
  #con0b {
    top: 10px;
    padding: 10px;
    left: -30px;
    width: 90%;
  }
  .product-title {
    font-size: 15px;
  }
  .btn-show,
  .btn-remove {
    font-size: 13px;
    padding: 6px 12px;
  }
}
@media (max-width: 500px) {
  #con0b {
    top: 10px;
    width: 90%;
    left: -30px;
  }
  #btns {
    flex-wrap: wrap;
  }
}
</style>
