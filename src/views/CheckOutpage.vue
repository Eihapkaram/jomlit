<template>
  <div id="con2">
    <v-row>
      <!-- العمود الأيسر: تفاصيل المنتجات -->
      <v-col cols="12" lg="6" md="6" sm="12" id="detilsechuck">
        <div style="display: flex; flex-flow: column; position: relative">
          <span class="text-h4">تفاصيل الطلب</span>
          <v-breadcrumbs :items="itemurl">
            <template v-slot:divider>
              <v-icon icon="mdi-chevron-left"></v-icon>
            </template>
          </v-breadcrumbs>
        </div>

        <!-- جدول عرض المنتجات -->
        <v-table>
          <thead>
            <tr>
              <th>الصورة</th>
              <th>المنتج</th>
              <th>الكمية</th>
              <th>السعر</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in CartProduct2" :key="item.id">
              <td>
                <img
                  id="img"
                  height="100px"
                  width="fit-content"
                  :src="domin + item.product.img"
                  :alt="item.product.titel"
                  loading="lazy"
                />
              </td>
              <td>{{ item.product.titel }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ Math.ceil(item.product.price) }}ج</td>
            </tr>
          </tbody>
        </v-table>

        <!-- المجموع الكلي -->
        <v-card outlined class="mt-3">
          <v-card-text class="text-h5">
            المجموع الكلي: {{ total.reduce((a, b) => a + b, 0) + shipping }}ج
          </v-card-text>
        </v-card>
      </v-col>
      <!-- العمود الأيمن: نموذج الدفع وعمليات الدفع -->
      <v-col id="col2" cols="12" lg="6" md="6" sm="12">
        <v-row
          style="width: 100%; position: relative; left: 0"
          align-content="center"
        >
          <span id="payheader" class="text-h4"> الدفع السريع</span>
        </v-row>

        <br /><br />

        <!-- اختيار طريقة الدفع -->
        <v-radio-group v-model="paymentMethod" required>
          <v-radio label="الدفع الإلكتروني" value="online"></v-radio>
          <v-radio label="الدفع عند الاستلام" value="cod"></v-radio>
        </v-radio-group>

        <!-- نموذج الدفع الإلكتروني -->
        <div v-if="paymentMethod === 'online'">
          <v-row id="shiprow"><h4>عنوان الشحن</h4></v-row>
          <br /><br />

          <v-btn
            v-if="payurl"
            style="background-color: lightskyblue; height: 60px; width: 200px"
            type="button"
          >
            <a
              @click="order1()"
              style="
                padding-inline: 57px;
                padding-block: 23px;
                position: absolute;
                text-decoration: none;
                left: 2px;
                top: 0px;
                color: black;
              "
              target="_blank"
              :href="payurl"
            >
              استمرار الدفع >>
            </a>
          </v-btn>

          <form
            v-if="!payurl"
            @submit.prevent="
              funvaled(total.reduce((a, b) => a + b, 0) + this.shipping)
            "
          >
            <v-row style="position: relative; left: 0">
              <v-col cols="12">
                <input
                  style="
                    width: 100%;
                    height: 50px;
                    border: 1px solid black;
                    border-radius: 5px;
                    padding-left: 10px;
                  "
                  required
                  type="text"
                  placeholder="اسم المحل"
                  v-model="store"
                />
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="province"
                  :items="governorates"
                  item-text="label"
                  item-value="value"
                  label="اختر المحافظة"
                  outlined
                  dense
                  required
                ></v-select>
                <span v-if="province" style="margin-left: 10px">
                  {{ governorates.find((g) => g.value === province)?.label }}
                </span>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="city"
                  :items="cities[province] || []"
                  label="اختر المدينة"
                  outlined
                  dense
                  :disabled="!province"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12">
                <input
                  style="
                    width: 100%;
                    height: 50px;
                    border: 1px solid black;
                    border-radius: 5px;
                    padding-left: 10px;
                  "
                  required
                  type="text"
                  placeholder="الشارع"
                  v-model="street"
                />
              </v-col>
              <v-col cols="12">
                <input
                  style="
                    width: 100%;
                    height: 50px;
                    border: 1px solid black;
                    border-radius: 5px;
                    padding-left: 10px;
                    direction: rtl;
                  "
                  required
                  type="tel"
                  placeholder="رقم الهاتف للتواصل معك"
                  v-model="phone_number"
                  @input="debouncedValidate"
                />
                <p v-if="phoneError" style="color: red; font-size: 14px">
                  {{ phoneError }}
                </p>
              </v-col>

              <v-col id="col2" cols="12" align-self="flex-end">
                <v-btn
                  id="continuebtn"
                  style="
                    background-color: lightgreen;
                    height: 60px;
                    width: 200px;
                  "
                  prepend-icon="mdi-cart"
                  type="submit"
                >
                  متابعة الشحن
                </v-btn>
              </v-col>
            </v-row>
          </form>
        </div>

        <!-- نموذج الدفع عند الاستلام -->
        <div v-if="paymentMethod === 'cod'">
          <v-row id="shiprow"><h4>عنوان الاستلام عند الدفع نقداً</h4></v-row>
          <br /><br />
          <v-row style="position: relative; left: 0">
            <v-col cols="12">
              <input
                style="
                  width: 100%;
                  height: 50px;
                  border: 1px solid black;
                  border-radius: 5px;
                  padding-left: 10px;
                "
                required
                type="text"
                placeholder="اسم المحل"
                v-model="store"
              />
            </v-col>

            <v-col cols="12">
              <v-select
                v-model="province"
                :items="governorates"
                item-text="label"
                item-value="value"
                label="اختر المحافظة"
                outlined
                dense
                required
              ></v-select>
              <span v-if="province" style="margin-left: 10px">
                {{ governorates.find((g) => g.value === province)?.label }}
              </span>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="city"
                :items="cities[province] || []"
                label="اختر المدينة"
                outlined
                dense
                :disabled="!province"
                required
              ></v-select>
            </v-col>
            <v-col cols="12">
              <input
                style="
                  width: 100%;
                  height: 50px;
                  border: 1px solid black;
                  border-radius: 5px;
                  padding-left: 10px;
                "
                required
                type="text"
                placeholder="الشارع"
                v-model="street"
              />
            </v-col>
            <v-col cols="12">
              <input
                style="
                  width: 100%;
                  height: 50px;
                  border: 1px solid black;
                  border-radius: 5px;
                  padding-left: 10px;
                  direction: rtl;
                "
                required
                type="tel"
                placeholder="رقم الهاتف للتواصل معك"
                v-model="phone_number"
                @input="debouncedValidate"
              />
              <p v-if="phoneError" style="color: red; font-size: 14px">
                {{ phoneError }}
              </p>
            </v-col>

            <v-col cols="12" align-self="flex-end">
              <v-btn
                id="continuebtn2"
                style="background-color: lightgreen; height: 60px; width: 200px"
                prepend-icon="mdi-cart"
                type="button"
                @click="submitCOD(total.reduce((a, b) => a + b, 0) + shipping)"
              >
                تأكيد الطلب عند الاستلام
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { CartStore1 } from "@/store/Cart";
import { mystore } from "@/store/index";
import axios from "axios";
import { mapActions, mapState } from "pinia";

export default {
  inject: ["Emitter"],
  data() {
    return {
      shipping: 0,
      total: [],
      itemurl: ["الرئيسية", "السلة", "الدفع"],
      email: "",
      checkbox: "",
      province: "",
      city: "",
      street: "",
      store: "",
      phone_number: "",
      phoneError: "",
      payurl: "",
      order: "",
      paymentMethod: "online",
      governorates: ["Cairo", "Giza"],
      cities: {
        Cairo: [
          "مدينة نصر",
          "المعادي",
          "حلوان",
          "الزمالك",
          "المقطم",
          "عين شمس",
          "حدائق القبة",
          "المهندسين",
          "العمرانية",
          "الدقي",
          "المعادي الجديدة",
          "المعادى القديمة",
        ],
        Giza: [
          "الهرم",
          "الجيزة",
          "الطالبية",
          "الوراق",
          "الدقي",
          "العجوزة",
          "العمرانية",
          "كرداسة",
          "أوسيم",
          "الحوامدية",
          "الصف",
          "البدرشين",
        ],
      },
    };
  },
  methods: {
    ...mapActions(CartStore1, [
      "GetCart",
      "delitem",
      "update",
      "GetCart2",
      "CartDelAll",
      "delitemAll",
    ]),
    ...mapActions(mystore, ["Cart"]),
    validatePhone() {
      const regex = /^(010|011|012|015)[0-9]{8}$/;
      if (!regex.test(this.phone_number)) {
        this.phoneError = "دخل رقم صح عشان تعمل الطلبيه ";
      } else {
        this.phoneError = "";
      }
    },
    funvaled(total) {
      if (localStorage.getItem("token")) {
        this.pay(total);
      } else {
        let textem = "عشان تعمل الطلبية لازم تسجل دخول الأول";
        this.Emitter.emit("sin", textem);
      }
    },

    debouncedValidate() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.validatePhone();
      }, 500); // ← التأخير نصف ثانية (500ms)
    },
    async pay(total) {
      const token = localStorage.getItem("token");
      const paymobItems = this.CartProduct2.map((item) => ({
        name: item.product.titel,
        amount_cents: parseInt(item.product.price) * 100,
        quantity: item.quantity,
      }));
      const payload = {
        email: this.CartData.email,
        phone_number: this.phone_number,
        first_name: this.CartData.name,
        last_name: this.CartData.last_name,
        country: this.province || "eg",
        city: this.city,
        street: this.street,
        items: paymobItems,
      };
      try {
        const res = await axios.post(`${this.domin}pay`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        this.payurl = res.data.checkout_url;
        this.order = res.data.response;
        console.log(this.order);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },
    async order1() {
      const token = localStorage.getItem("token");
      if (this.CartProduct2.length >= 1) {
        const payload2 = {
          product_id: this.CartData.id,
          quantity: this.CartData.quantity,
          price: this.order.amount_cents,
          city: this.city,
          governorate: this.province,
          phone: this.phone_number,
          street: this.street,
          store_name: this.store,
          payment_method: "credit_card",
        };
        try {
          const res = await axios.post(`${this.domin}order/add`, payload2, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });
          this.CartDelAll();
          this.delitemAll();
          localStorage.setItem("todo", JSON.stringify(this.CartProduct2));
        } catch (err) {
          console.error(err.response?.data || err);
          alert("دخل رقم تليفون صح عشان يتم عمل الطلبيه");
        }
      }
    },
    async order2(total) {
      const token = localStorage.getItem("token");
      if (this.CartProduct2.length >= 1) {
        const payload3 = {
          product_id: this.CartData.id,
          quantity: this.CartData.quantity,
          price: total,
          city: this.city,
          governorate: this.province,
          phone: this.phone_number,
          street: this.street,
          store_name: this.store,
          payment_method: "cod",
        };
        try {
          const res = await axios.post(`${this.domin}order/add`, payload3, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });
          this.CartDelAll();
          this.delitemAll();
          localStorage.setItem("todo", JSON.stringify(this.CartProduct2));
        } catch (err) {
          console.error(err.response?.data || err);
          alert("دخل رقم تليفون صح عشان يتم عمل الطلبيه");
        }
      }
    },
    submitCOD(total) {
      if (localStorage.getItem("token")) {
        this.order2(total);
        this.CartDelAll();
        this.delitemAll();
      } else {
        let textem = "عشان تعمل الطلبية لازم تسجل دخول الأول";
        this.Emitter.emit("sin", textem);
      }
      alert(
        "تم تأكيد الطلبية و الدفع عند الاستلام! سوف يتم الاتصال بك لتاكيد الطلب و موعد التسليم"
      );
    },
    fun() {
      this.total = [];
      this.CartProduct2.forEach((el) => {
        let num = Math.ceil(el.product.price) * el.quantity;
        this.total.push(num);
      });
    },
  },
  watch: {
    CartProduct2(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.fun();
      }
    },
  },
  computed: {
    ...mapState(CartStore1, ["CartProduct2"]),
    ...mapState(mystore, ["CartData", "domin"]),
  },
  async mounted() {
    window.scroll(0, 0);
    await this.GetCart2();
    await this.Cart();
    this.fun();
  },
};
</script>

<style scoped>
#con2 {
  direction: rtl;
  top: 100px;
  left: -50px;
  width: 90%;
  position: relative;
}
#detilsechuck {
  margin-bottom: 0px;
  position: relative;
}
#shiprow h4 {
  text-align: right;
}
@media (max-width: 991px) {
  #con2 {
    direction: rtl;
    top: 20px;
    left: -30px;
    width: 90%;
    position: relative;
  }
  #detilsechuck {
    position: relative;
    width: 300px;
  }
  #payheader {
    margin-inline: 10px;
  }
  #shiprow h4 {
    text-align: right;
    margin-inline: 10px;
  }
  #col2 {
    position: relative;
  }
  #continuebtn {
    position: relative;
    margin-bottom: 60px;
  }
  #continuebtn2 {
    position: relative;
    margin-bottom: 60px;
  }
}
/* Mobile */
@media (max-width: 500px) {
  #con2 {
    direction: rtl;
    top: 20px;
    width: 80%;
    left: -10px;
    position: relative;
  }
  #detilsechuck {
    position: relative;
  }
  #col2 {
    position: relative;
    left: -10px;
  }
  #continuebtn {
    position: relative;
  }
}
</style>
