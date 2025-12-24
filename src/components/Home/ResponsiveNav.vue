<template>
  <v-app-bar
    id="nav1"
    style="position: fixed; top: 0; z-index: 10"
    height="100"
    width="100%"
    class="bg-white shadow-sm"
  >
    <v-container fluid>
      <v-row class="d-flex justify-space-around align-center">
        <!-- شعار الموقع -->
        <v-col cols="3" md="3">
          <v-list nav id="logop">
            <v-list-item
              style="display: flex; align-items: center; cursor: pointer"
              @click="$router.push({ name: 'home' })"
            >
              <v-icon size="36" color="#c79a00" style="margin-left: 8px">
                mdi-package-variant-closed
              </v-icon>
              <h2
                style="
                  font-family: 'Cairo', sans-serif;
                  color: #c79a00;
                  font-weight: 800;
                  font-size: 24px;
                  margin: 0;
                "
              >
                جُمّلة الجُمّلة
              </h2>
            </v-list-item>
          </v-list>
        </v-col>

        <!-- مربع البحث -->
        <v-col cols="3" id="searshcol">
          <span style="position: relative">
            <v-form @submit.prevent="Search(searchvalue)">
              <input
                id="searchinput"
                style="
                  outline: none;
                  background-color: rgb(240, 240, 240);
                  border-radius: 30px;
                  padding: 10px 15px;
                  width: 100%;
                  border: 1px solid #ccc;
                  text-align: right;
                "
                type="search"
                placeholder="ابحث عن منتج..."
                v-model="searchvalue"
              />
              <img
                @click="Search(searchvalue)"
                src="https://cdn-icons-png.flaticon.com/512/622/622669.png"
                width="22"
                height="22"
                loading="lazy"
                alt="icon"
                style="
                  position: absolute;
                  top: 12px;
                  left: 15px;
                  cursor: pointer;
                "
              />
            </v-form>
          </span>
        </v-col>

        <!-- أيقونات القائمة -->
        <v-col
          cols="6"
          md="2"
          id="icons"
          class="d-flex flex-row align-center justify-end"
        >
          <!-- القائمة -->
          <div id="gropicon-text" @click="openMune()">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1828/1828859.png"
              width="35"
              height="35"
              loading="lazy"
              alt="icon"
            />
            <span>القائمة</span>
          </div>

          <!-- السلة -->
          <div
            v-if="userRole !== 'supplier'"
            id="gropicon-text"
            @click="openCart()"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png"
              width="35"
              height="35"
              loading="lazy"
              alt="icon"
            />
            <v-badge
              offset-x="-8"
              offset-y="-10"
              color="orange"
              max="5"
              :content="CartProduct2.length"
            ></v-badge>
            <span>السلة</span>
          </div>

          <!-- المفضلة -->
          <div
            v-if="userRole !== 'supplier'"
            id="gropicon-text"
            @click="$router.push({ name: 'listpage' })"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/833/833472.png"
              width="35"
              height="35"
              loading="lazy"
              alt="icon"
            />
            <v-badge
              offset-x="-8"
              offset-y="-10"
              color="orange"
              max="5"
              :content="list.length"
            ></v-badge>
            <span>المفضلة</span>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
import { CartStore1 } from "@/store/Cart";
import { ListsStore1 } from "@/store/Lists";
import { mystore } from "@/store";
import { mapState, mapActions } from "pinia";

export default {
  data() {
    return {
      drawer: false,
      drawerCart: false,
      searchvalue: "",
    };
  },
  computed: {
    ...mapState(mystore, ["catigoryies", "userRole"]),
    ...mapState(CartStore1, ["CartProduct2"]),
    ...mapState(ListsStore1, ["list"]),
  },
  methods: {
    ...mapActions(mystore, ["getcatigories", "getSearchProduct"]),
    Search(data) {
      this.$router.push({ name: "searchpage" });
      this.getSearchProduct(data);
    },
    openMune() {
      this.$emit("opneMune");
    },
    openCart() {
      this.$emit("openCart");
    },
  },
  async mounted() {
    await this.getcatigories();
  },
};
</script>

<style scoped>
#logop {
  background-color: transparent;
  padding-top: 5px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

#gropicon-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
  cursor: pointer;
  transition: 0.3s;
}
#gropicon-text:hover {
  transform: scale(1.1);
}
span {
  font-size: 13px;
  color: #333;
}
@media (max-width: 991px) {
  #searshcol {
    display: none;
  }
  #logop {
    background-color: transparent;
    padding-top: 5px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    width: 200px;
    left: -40px;
  }
}
/*/mobile/*/
@media (max-width: 500px) {
  #logop {
    background-color: transparent;
    padding-top: 5px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    width: 190px;
    left: -35px;
  }
  #icons {
    position: relative;
    left: 20px;
  }
}
</style>
