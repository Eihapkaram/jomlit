<template>
  <br />
  <div id="parantConten">
    <!-- Breadcrumbs -->
    <v-breadcrumbs :items="this.itemurl">
      <template v-slot:divider>
        <v-icon color="#B8860B">mdi-chevron-left</v-icon>
      </template>
    </v-breadcrumbs>

    <!-- Header and Progress -->
    <v-row id="headerRow">
      <span id="header" class="text-h3" style="color: #333">سلتك</span>
      <br /><br /><br /><br />
      <div style="position: relative; width: 97%; height: fit-content">
        <svg
          :fill="`${
            this.total[this.total.length - 1] / 10 >= 80
              ? '#228B22'
              : this.total[this.total.length - 1] / 10 > 40
              ? '#FFA500'
              : this.total[this.total.length - 1] / 10 <= 40
              ? '#FF4500'
              : '#FF4500'
          }`"
          width="30px"
          class="icon-shipping-truck"
          :style="`position: absolute; left:calc(${
            this.total[this.total.length - 1] > 950
              ? 100
              : this.total.length == 0
              ? 5.3
              : this.total[this.total.length - 1] / 10 <= 5
              ? this.total[this.total.length - 1] / 10 + 5
              : this.total[this.total.length - 1] / 10 >= 0
              ? this.total[this.total.length - 1] / 10 + 5
              : this.total[this.total.length - 1] / 10 >= 100
              ? 100
              : this.total[this.total.length - 1] / 10
          }% - 30px);transition:all,0.3s;top:-17px;`"
          viewBox="0 0 40.55 24"
        ></svg>

        <v-progress-linear
          :color="`${
            this.total[this.total.length - 1] / 10 >= 80
              ? '#228B22'
              : this.total[this.total.length - 1] / 10 > 40
              ? '#FFA500'
              : this.total[this.total.length - 1] / 10 <= 40
              ? '#FF4500'
              : '#FF4500'
          }`"
          height="10"
          id="progrees"
          style="z-index: 5; border-radius: 8px"
          :model-value="`${
            this.total[this.total.length - 1] > 950
              ? 100
              : this.total.length == 0
              ? 5.3
              : this.total[this.total.length - 1] / 10 <= 5
              ? this.total[this.total.length - 1] / 10 + 5
              : this.total[this.total.length - 1] / 10 >= 0
              ? this.total[this.total.length - 1] / 10 + 5
              : this.total[this.total.length - 1] / 10 >= 100
              ? 100
              : this.total[this.total.length - 1] / 10
          }`"
          striped
        ></v-progress-linear>
      </div>
      <br />
    </v-row>

    <br />

    <!-- Cart Items -->
    <v-row>
      <v-col cols="12" lg="7" md="7" sm="12" id="itemcon">
        <v-table id="itemCartcon" height="fit-content" fixed-header="true">
          <thead class="bg-black" style="color: #ffd700">
            <th style="border: 2px solid #333" width="600px">المنتج</th>
            <v-spacer></v-spacer>
            <th width="100px">السعر</th>
            <th width="100px">الكمية</th>
            <th>الإجمالي</th>
          </thead>
          <br />
          <tr v-for="item in CartProduct2" :key="item.id" id="trall">
            <td>
              <v-row justify="start" id="colditels">
                <v-divider></v-divider>
                <v-col cols="4">
                  <img
                    id="img"
                    height="100px"
                    width="fit-content"
                    :alt="item.product.titel"
                    loading="lazy"
                    :src="domin + item.product.img"
                    style="border-radius: 10px; border: 1px solid #ccc"
                  />
                </v-col>
                <v-col
                  cols="12"
                  lg="7"
                  md="7"
                  sm="7"
                  style="
                    position: relative;
                    height: 100%;
                    display: flex;
                    flex-flow: column;
                    align-items: center;
                  "
                  align-self="center"
                  id="detilseproduct"
                >
                  <span class="text-h6" style="color: #333">{{
                    item.product.titel
                  }}</span>
                </v-col>
              </v-row>
            </td>
            <v-spacer></v-spacer>
            <td style="color: #333">{{ Math.ceil(item.product.price) }}ج</td>
            <td>
              <span id="qointcon" style="padding: 4px 8px">
                <span class="d-flex align-center gap-2">
                  <v-icon
                    @click="muns(item), this.fun()"
                    id="munse"
                    color="#FF4500"
                    >mdi-minus-circle-outline</v-icon
                  >
                  <input
                    id="qountbtn"
                    type="button"
                    :value="item.quantity"
                    style="
                      border: none;
                      width: 40px;
                      text-align: center;
                      font-weight: 600;
                    "
                  />
                  <v-icon
                    @click="increaseQuantity(item), plus(item)"
                    id="plus"
                    color="#228B22"
                    >mdi-plus-circle-outline</v-icon
                  >
                </span>
              </span>
            </td>
            <td>
              <span class="text-subtitle-2" style="color: #333">
                {{ Math.ceil(item.product.price) * item.quantity }}ج
              </span>
            </td>
            <td>
              <v-icon
                id="remov"
                @click="delone(item), fun()"
                style="position: relative; top: -60px; color: #ff4500"
                >mdi-delete</v-icon
              >
            </td>
          </tr>
        </v-table>
      </v-col>

      <!-- Order Summary with Total Only -->
      <v-col id="samery" cols="12" lg="5" md="5" sm="12">
        <v-card
          id="conCartBtn"
          class="pa-4"
          style="background-color: #f4f4f4; border-radius: 12px"
        >
          <span class="text-h5" style="color: #333">الإجمالي :</span>
          <span class="text-h5" style="float: right; color: #ffd700">
            {{ total[total.length - 1] }}ج
          </span>
          <br /><br />
          <v-btn
            @click="
              userRole !== 'seller'
                ? $router.push({ name: 'checkpage' })
                : $router.push({ name: 'checkBySeller' })
            "
            class="mb-2"
            style="
              background-color: #333;
              color: #ffd700;
              font-weight: 600;
              border-radius: 10px;
            "
            variant="outline"
            width="100%"
            height="50px"
            prepend-icon="mdi-cart-outline"
          >
            المتابعة للدفع
          </v-btn>
          <v-btn
            @click="$router.go(-1)"
            style="
              background-color: #ffd700;
              color: #333;
              font-weight: 600;
              border-radius: 10px;
            "
            variant="outline"
            width="100%"
            height="50px"
          >
            متابعة التسوق
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { CartStore1 } from "@/store/Cart";
import { mystore } from "@/store";
import { mapActions, mapState } from "pinia";

export default {
  data() {
    return {
      quint: 1,
      nums: [],
      total: [],
      itemurl: ["الرئيسية", "سلة المشتريات"],
    };
  },
  methods: {
    ...mapActions(CartStore1, [
      "GetCart2",
      "delitem2",
      "increaseQuantity",
      "decreaseQuantity",
    ]),
    async delone(item) {
      await this.delitem2(item), this.fun();
    },

    async muns(item) {
      let q = item.quantity;
      if (q == 1) {
        return;
      } else {
        item.quantity--;
      }
      await this.decreaseQuantity(item);
    },
    plus(item) {
      item.quantity++, this.fun();
    },
    fun() {
      this.nums = [];
      this.total = [];
      this.CartProduct2.forEach((el) => {
        const num = Math.ceil(el.product.price) * el.quantity;
        this.nums.push(num);
        const my = this.nums.reduce((acc, cur) => acc + cur, 0);
        this.total.push(my);
      });
    },
  },
  computed: {
    ...mapState(CartStore1, ["CartProduct2"]),
    ...mapState(mystore, ["domin", "userRole"]),
  },
  async mounted() {
    window.scroll(0, 0);
    await this.GetCart2();
    await this.fun();
  },
};
</script>

<style scoped>
#itemCartcon::-webkit-scrollbar {
  width: 5px;
}
#itemCartcon::-webkit-scrollbar-thumb {
  background-color: #333;
}
#itemCartcon::-webkit-scrollbar-track {
  background-color: #f4f4f4;
}
#progrees {
  width: 102%;
}
#header {
  width: 90%;
  position: relative;
  left: -80px;
}
#parantConten {
  width: 100%;
  top: 0px;
  position: relative;
  left: 15px;
}
.v-table__wrapper {
  overflow: visible;
}
.v-table--fixed-height > .v-table__wrapper {
  overflow-y: visible;
}

/* Tablet */
@media (max-width: 991px) {
  #colditels {
    height: 250px;
    width: 80%;
    position: relative;
    left: -50px;
  }
  #img {
    position: relative;
    left: 25px;
    top: 25px;
  }
  #header {
    width: 90%;
    position: relative;
    left: -25px;
  }

  #qointcon {
    width: 300px;
  }
  #itemCartcon {
    position: relative;
    left: 0px;
  }
  #parantConten {
    width: 90%;
    top: 0px;
    position: relative;
    left: -50px;
  }
  #trall {
    width: 50%;
  }
  #progrees {
    width: 100%;
  }
  #detilseproduct {
    position: relative;
    justify-content: center;
  }
  #samery {
    position: relative;
    left: 5px;
  }
}

/* Mobile */
@media (max-width: 500px) {
  #colditels {
    height: 250px;
    width: 90%;
    position: relative;
    left: -30px;
  }
  #img {
    position: relative;
    left: 25px;
    top: 25px;
    width: fit-content;
  }
  #detilseproduct {
    position: relative;
    left: 25px;
  }
  .text-h6 {
    position: relative;
    top: -80px;
  }
  #header {
    width: 90%;
    position: relative;
    left: -25px;
  }

  #qointcon {
    width: 300px;
  }
  #itemCartcon {
    position: relative;
    left: 0px;
  }
  #parantConten {
    width: 90%;
    top: 0px;
    position: relative;
    left: -20px;
  }
  #trall {
    width: 50%;
  }
  #progrees {
    width: 100%;
    left: -50px;
  }
  #samery {
    position: relative;
    left: 5px;
  }
}
</style>
