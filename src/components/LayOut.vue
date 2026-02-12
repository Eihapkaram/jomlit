<template>
  <v-layout>
    <v-navigation-drawer v-model="drawer">
      <!-- ===== رأس المستخدم ===== -->
      <v-row
        justify="space-between"
        align="center"
        class="px-2 py-3"
        style="border-bottom: 1px solid #eee"
      >
        <v-col cols="9" class="d-flex align-center">
          <v-avatar
            size="50"
            class="me-3"
            :image="userinfo.img ? domin + userinfo.img : null"
            style="border: 2px solid #1976d2; background: #e3f2fd"
          >
            <v-icon size="36" color="#1976d2">mdi-account-circle</v-icon>
          </v-avatar>
          <div>
            <h4 style="margin: 0; font-weight: 600; color: #1976d2">
              {{ token ? `${userinfo.name}` : `أهلاً بك 👋` }}
            </h4>
            <small style="color: #555">
              {{ token ? "تم تسجيل دخولك" : "سجل دخولك وابدأ التسوق" }}
            </small>
          </div>
        </v-col>
        <v-col cols="3" class="d-flex justify-end">
          <v-icon
            id="closemenu"
            style="
              cursor: pointer;
              background: #f2f4f7;
              border-radius: 50%;
              padding: 6px;
              transition: 0.3s;
            "
            @click="this.drawer = false"
          >
            mdi-close
          </v-icon>
        </v-col>
      </v-row>
      <v-list style="display: block">
        <!-- ===== الأقسام ===== -->
        <v-list style="display: block; padding-inline: 10px; margin-top: 15px">
          <!-- مشترياتي -->
          <v-list-item
            v-if="userRole !== 'supplier'"
            id="link0"
            hover
            @click="$router.push({ name: 'mypayes' })"
          >
            <div style="display: flex; align-items: center; color: #333">
              <v-icon color="#1976d2" class="me-2"
                >mdi-credit-card-outline</v-icon
              >
              مشترياتي
            </div>
          </v-list-item>
          <!-- اداره العملاء -->
          <v-list-item
            v-if="userRole == 'seller'"
            id="link0"
            hover
            @click="$router.push({ name: 'SellerCustomer' })"
          >
            <div style="display: flex; align-items: center; color: #333">
              <v-icon color="#1976d2" class="me-2">mdi-account-group</v-icon>
              ادارة العملاء
            </div>
          </v-list-item>
          <!-- اداره طلبيات المورد  -->
          <v-list-item
            v-if="userRole == 'supplier'"
            id="link0"
            hover
            @click="$router.push({ name: 'SupplierOrder' })"
          >
            <div style="display: flex; align-items: center; color: #333">
              <v-icon color="#1976d2" class="me-2">mdi-cart-plus</v-icon>
              الطلبيات المرسلة
            </div>
          </v-list-item>

          <!-- قائمتي المفضلة -->
          <v-list-item
            v-if="userRole !== 'supplier'"
            id="link0"
            hover
            @click="$router.push({ name: 'listpage' })"
          >
            <div style="display: flex; align-items: center; color: #333">
              <v-icon color="#1976d2" class="me-2">mdi-heart-outline</v-icon>
              قائمتي المفضلة
            </div>
          </v-list-item>

          <!-- حسابي الشخصي -->
          <v-list-item
            v-if="userRole == 'customer' || 'supplier'"
            id="link0"
            hover
            @click="
              token
                ? $router.push({ name: 'Profile' })
                : $router.push({ name: 'login' })
            "
          >
            <div style="display: flex; align-items: center; color: #333">
              <v-icon color="#1976d2" class="me-2"
                >mdi-account-cog-outline</v-icon
              >
              حسابي الشخصي
            </div>
          </v-list-item>
          <!-- حسابي الشخصي -->
          <v-list-item
            v-if="userRole == 'seller'"
            id="link0"
            hover
            @click="
              token
                ? $router.push({ name: 'SellerProfile' })
                : $router.push({ name: 'login' })
            "
          >
            <div style="display: flex; align-items: center; color: #333">
              <v-icon color="#1976d2" class="me-2"
                >mdi-account-cog-outline</v-icon
              >
              حسابي الشخصي
            </div>
          </v-list-item>
          <!-- لوحة التحكم-->
          <v-list-item
            v-if="userRole == 'admin'"
            id="link0"
            hover
            @click="$router.push({ name: 'dashboard' })"
          >
            <div style="display: flex; align-items: center; color: #333">
              <v-icon color="#1976d2" class="me-2"
                >mdi-microsoft-xbox-controller-menu</v-icon
              >
              لوحة التحكم
            </div>
          </v-list-item>
          <!-- تسجيل الدخول / الخروج -->
          <v-list-item id="link0" hover @click="handleAuth">
            <div
              style="display: flex; align-items: center"
              :style="token ? 'color:#e53935' : 'color:#1976d2'"
            >
              <v-icon :color="token ? '#e53935' : '#1976d2'" class="me-2">
                {{ token ? "mdi-logout-variant" : "mdi-login-variant" }}
              </v-icon>
              {{ token ? "تسجيل الخروج" : "تسجيل الدخول" }}
            </div>
          </v-list-item>
        </v-list>
        <v-list-item id="link0">
          <router-link v-if="userRole !== 'supplier'" :to="{ name: 'home' }"
            >الرئيسية</router-link
          >
          <router-link
            v-if="userRole == 'supplier'"
            :to="{ name: 'supplierhome' }"
            >الرئيسية</router-link
          >
        </v-list-item>
        <v-list-item
          v-for="(cat, i) in page.slice(0, 5)"
          :key="i"
          id="link0"
          style="display: block"
          ><router-link
            style="display: block"
            id="linkcat2"
            :to="{ name: 'catigoryPage', params: { catigory: cat.slug } }"
            >{{ cat.slug }}</router-link
          ></v-list-item
        >
      </v-list>

      <!-- ===== الفوتر ===== -->
      <div
        style="
          text-align: center;
          color: #777;
          font-size: 13px;
          margin-top: 15px;
          border-top: 1px solid #eee;
          padding-top: 10px;
        "
      >
        © جُمّله الجُمّله 2025 | سوق بيع الجملة في مصر 🇪🇬
      </div>
    </v-navigation-drawer>
    <v-navigation-drawer
      id="derowermune"
      location="left"
      v-model="this.drawermenu"
      style="
        background: linear-gradient(180deg, #ffffff 0%, #f8f9fb 100%);
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.08);
        border-right: 1px solid #e0e0e0;
        padding: 15px;
      "
    >
      <!-- ===== رأس المستخدم ===== -->
      <v-row
        justify="space-between"
        align="center"
        class="px-2 py-3"
        style="border-bottom: 1px solid #eee"
      >
        <v-col cols="9" class="d-flex align-center">
          <v-avatar
            size="50"
            class="me-3"
            :image="userinfo.img ? domin + userinfo.img : null"
            style="border: 2px solid #1976d2; background: #e3f2fd"
          >
            <v-icon size="36" color="#1976d2">mdi-account-circle</v-icon>
          </v-avatar>
          <div>
            <h4 style="margin: 0; font-weight: 600; color: #1976d2">
              {{ token ? `${userinfo.name}` : `أهلاً بك 👋` }}
            </h4>
            <small style="color: #555">
              {{ token ? "تم تسجيل دخولك" : "سجل دخولك وابدأ التسوق" }}
            </small>
          </div>
        </v-col>
        <v-col cols="3" class="d-flex justify-end">
          <v-icon
            id="closemenu"
            style="
              cursor: pointer;
              background: #f2f4f7;
              border-radius: 50%;
              padding: 6px;
              transition: 0.3s;
            "
            @click="this.drawermenu = false"
          >
            mdi-close
          </v-icon>
        </v-col>
      </v-row>

      <!-- ===== البحث ===== -->
      <v-row class="px-3 mt-6">
        <span style="position: relative; width: 100%; left: 0px">
          <v-form
            v-if="userRole !== 'supplier'"
            id="formsearch"
            style="
              display: flex;
              align-items: center;
              background: #f5f7fa;
              border-radius: 30px;

              padding: 5px 15px;
              box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
            "
            class="justify-center align-center"
            @submit.prevent="this.Search(this.searchvalue)"
          >
            <v-icon
              @click="this.Search(this.searchvalue)"
              color="#1976d2"
              id="iconsearchdrawer"
              style="cursor: pointer"
            >
              mdi-magnify
            </v-icon>
            <input
              id="searchinputforderwer"
              style="
                outline: none;
                border: none;
                background: transparent;
                flex: 1;
                padding: 8px;
                font-size: 14px;
              "
              type="search"
              placeholder="ابحث عن منتج..."
              v-model="this.searchvalue"
            />
          </v-form>
        </span>
      </v-row>

      <!-- ===== الأقسام ===== -->
      <v-list style="display: block; padding-inline: 10px; margin-top: 15px">
        <!-- مشترياتي -->
        <v-list-item
          v-if="userRole !== 'supplier'"
          id="link0"
          hover
          @click="$router.push({ name: 'mypayes' })"
        >
          <div style="display: flex; align-items: center; color: #333">
            <v-icon color="#1976d2" class="me-2"
              >mdi-credit-card-outline</v-icon
            >
            مشترياتي
          </div>
        </v-list-item>

        <!-- قائمتي المفضلة -->
        <v-list-item
          v-if="userRole !== 'supplier'"
          id="link0"
          hover
          @click="$router.push({ name: 'listpage' })"
        >
          <div style="display: flex; align-items: center; color: #333">
            <v-icon color="#1976d2" class="me-2">mdi-heart-outline</v-icon>
            قائمتي المفضلة
          </div>
        </v-list-item>
        <!-- لوحة التحكم-->
        <v-list-item
          v-if="userRole == 'admin'"
          id="link0"
          hover
          @click="$router.push({ name: 'dashboard' })"
        >
          <div style="display: flex; align-items: center; color: #333">
            <v-icon color="#1976d2" class="me-2"
              >mdi-microsoft-xbox-controller-menu</v-icon
            >
            لوحة التحكم
          </div>
        </v-list-item>
        <!-- اداره العملاء -->
        <v-list-item
          v-if="userRole == 'seller'"
          id="link0"
          hover
          @click="$router.push({ name: 'SellerCustomer' })"
        >
          <div style="display: flex; align-items: center; color: #333">
            <v-icon color="#1976d2" class="me-2">mdi-account-group</v-icon>
            ادارة العملاء
          </div>
        </v-list-item>
        <!-- اداره طلبيات المورد  -->
        <v-list-item
          v-if="userRole == 'supplier'"
          id="link0"
          hover
          @click="$router.push({ name: 'SupplierOrder' })"
        >
          <div style="display: flex; align-items: center; color: #333">
            <v-icon color="#1976d2" class="me-2">mdi-cart-plus</v-icon>
            الطلبيات المرسلة
          </div>
        </v-list-item>

        <!-- حسابي الشخصي -->
        <v-list-item
          v-if="userRole == 'customer' || 'supplier'"
          id="link0"
          hover
          @click="
            token
              ? $router.push({ name: 'Profile' })
              : $router.push({ name: 'login' })
          "
        >
          <div style="display: flex; align-items: center; color: #333">
            <v-icon color="#1976d2" class="me-2"
              >mdi-account-cog-outline</v-icon
            >
            حسابي الشخصي
          </div>
        </v-list-item>
        <!-- حسابي الشخصي -->
        <v-list-item
          v-if="userRole == 'seller'"
          id="link0"
          hover
          @click="
            token
              ? $router.push({ name: 'SellerProfile' })
              : $router.push({ name: 'login' })
          "
        >
          <div style="display: flex; align-items: center; color: #333">
            <v-icon color="#1976d2" class="me-2"
              >mdi-account-cog-outline</v-icon
            >
            حسابي الشخصي
          </div>
        </v-list-item>
        <!-- تسجيل الدخول / الخروج -->
        <v-list-item id="link0" hover @click="handleAuth">
          <div
            style="display: flex; align-items: center"
            :style="token ? 'color:#e53935' : 'color:#1976d2'"
          >
            <v-icon :color="token ? '#e53935' : '#1976d2'" class="me-2">
              {{ token ? "mdi-logout-variant" : "mdi-login-variant" }}
            </v-icon>
            {{ token ? "تسجيل الخروج" : "تسجيل الدخول" }}
          </div>
        </v-list-item>
      </v-list>

      <!-- ===== الفوتر ===== -->
      <div
        style="
          text-align: center;
          color: #777;
          font-size: 13px;
          margin-top: 15px;
          border-top: 1px solid #eee;
          padding-top: 10px;
        "
      >
        © جُمّله الجُمّله 2025 | سوق بيع الجملة في مصر 🇪🇬
      </div>
    </v-navigation-drawer>

    <v-navigation-drawer
      id="drowerCArt"
      width="500"
      location="right"
      v-model="drawerCart"
    >
      <v-container>
        <v-row justify="end">
          <v-icon
            id="closecart"
            style="cursor: pointer; z-index: 10; color: #555; position: fixed"
            @click="this.drawerCart = false"
          >
            mdi-close
          </v-icon>
        </v-row>

        <v-row
          id="headerCart"
          class="d-flex flex-column"
          style="height: fit-content; position: static"
        >
          <span class="text-h4" style="font-weight: bold; color: #2c3e50"
            >عربة التسوق</span
          >
          <span style="color: #555"
            >عدد العناصر: {{ this.CartProduct2.length }}</span
          >
          <br />
          <div style="position: relative; width: 100%; height: fit-content">
            <svg
              :fill="`${
                this.total[this.total.length - 1] / 10 >= 80
                  ? 'green'
                  : this.total[this.total.length - 1] / 10 > 40
                  ? 'orange'
                  : 'red'
              }`"
              width="30px"
              class="icon-shipping-truck"
              :style="`position: absolute; left:calc(${
                this.total[this.total.length - 1] > 950
                  ? 100
                  : this.total.length == 0
                  ? 5
                  : this.total[this.total.length - 1] / 10 <= 5
                  ? this.total[this.total.length - 1] / 10 + 5
                  : this.total[this.total.length - 1] / 10 + 5
              }% - 30px);transition:all,0.3s;top:-17px;`"
              viewBox="0 0 40.55 24"
            >
              <g id="Layer_2" data-name="Layer 2">
                <g id="Layer_1-2" data-name="Layer 1">
                  <path
                    class="truck-body"
                    d="M40.43,11a3.86,3.86,0,0,0-3.68-2.65H28a1.25,1.25,0,0,1-1.43-1.43c0-2.18,0-4.35,0-6.53,0-.31-.08-.36-.37-.36H5.11a1.18,1.18,0,0,0-1.3,1.32c0,.74,0,1.48,0,2.22,0,.21-.06.27-.26.26-.36,0-.71,0-1.07,0a1.19,1.19,0,1,0,0,2.37H7.19c.43,0,.85,0,1.27,0a1,1,0,0,1,1.07,1A1.19,1.19,0,0,1,8.24,8.48H1.35a1.83,1.83,0,0,0-.47,0A1.19,1.19,0,0,0,0,9.85a1.18,1.18,0,0,0,1.19,1h9.66c.34,0,.68,0,1,0A1.19,1.19,0,0,1,13,12.47a1.26,1.26,0,0,1-1.26.76H1.24a1.19,1.19,0,1,0,0,2.38c.76,0,1.51,0,2.26,0,.26,0,.33.07.32.32,0,1,0,2.09,0,3.13A1.18,1.18,0,0,0,5.1,20.36c.63,0,1.26,0,1.9,0,.27,0,.39.06.47.36a4.55,4.55,0,0,0,8.78-.11.29.29,0,0,1,.32-.25H28.09a.3.3,0,0,1,.34.27,4.55,4.55,0,0,0,8.8,0,.31.31,0,0,1,.35-.26c.49,0,1,0,1.47,0a1.37,1.37,0,0,0,1.5-.87V11.41C40.41,11.29,40.47,11.12,40.43,11ZM32.84,21.62A2.18,2.18,0,1,1,35,19.45,2.21,2.21,0,0,1,32.84,21.62Zm-21,0A2.18,2.18,0,1,1,14,19.45,2.2,2.2,0,0,1,11.86,21.62Z"
                  ></path>
                </g>
              </g>
            </svg>

            <v-progress-linear
              :color="`${
                this.total[this.total.length - 1] / 10 >= 80
                  ? 'green'
                  : this.total[this.total.length - 1] / 10 > 40
                  ? 'orange'
                  : 'red'
              }`"
              height="10"
              :model-value="
                this.total[this.total.length - 1] > 950
                  ? 100
                  : this.total.length == 0
                  ? 5
                  : this.total[this.total.length - 1] / 10 <= 5
                  ? this.total[this.total.length - 1] / 10 + 5
                  : this.total[this.total.length - 1] / 10 + 5
              "
              striped
            ></v-progress-linear>
          </div>
        </v-row>

        <div id="itemCartcon" style="height: fit-content">
          <v-row id="cartrow">
            <span
              v-if="this.CartProduct2.length == 0 && token"
              style="margin: auto; font-weight: bold; color: #777"
            >
              سلة التسوق فارغة 🛒
            </span>
            <span
              v-if="!token"
              style="margin: auto; font-weight: bold; color: #777"
            >
              <router-link style="color: blue" :to="{ name: 'login' }"
                >سجل الدخول</router-link
              >
              لاستخدام العربة
            </span>

            <v-table
              v-if="this.CartProduct2.length > 0"
              id="tablecart"
              fixed-header="true"
            >
              <thead>
                <th>المنتج</th>
                <th>السعر</th>
                <th>الكمية</th>
              </thead>

              <tr
                id="itemtr"
                v-for="(item, i) in this.CartProduct2"
                :key="item.id || i"
              >
                <td>
                  <v-row justify="center">
                    <v-col cols="4" class="d-flex flex-column align-center">
                      <img
                        height="100px"
                        width="fit-content"
                        :src="this.domin + item.product.img"
                      />
                      <span class="text-h6">{{ item.product.titel }}</span>
                    </v-col>
                  </v-row>
                </td>
                <td>{{ Math.ceil(item.product.price) }} ج.م</td>
                <td>
                  <v-icon @click="muns(item), this.fun()" color="red-darken-1">
                    mdi-minus
                  </v-icon>
                  {{ item.quantity }}
                  <v-icon
                    @click="increaseQuantity(item), plus(item)"
                    color="green-darken-1"
                  >
                    mdi-plus
                  </v-icon>
                </td>
                <td>
                  <v-icon @click="delone(item), fun()" color="red">
                    mdi-delete
                  </v-icon>
                </td>
              </tr>
            </v-table>
          </v-row>
        </div>

        <div
          v-if="this.CartProduct2.length > 0"
          id="conCartBtn"
          class="d-flex flex-column"
        >
          <div class="d-flex justify-space-between pa-2">
            <h4 style="font-weight: bold">الإجمالي:</h4>
            <span style="font-weight: bold; color: #2c3e50">
              {{ this.total[this.total.length - 1] }} ج.م
            </span>
          </div>

          <v-btn
            @click="
              userRole !== 'seller'
                ? $router.push({ name: 'checkpage' })
                : $router.push({ name: 'checkBySeller' })
            "
            class="text-white"
            color="blue-darken-2"
            variant="flat"
            width="100%"
            prepend-icon="mdi-truck-fast"
          >
            اتمام الشراء
          </v-btn>

          <v-btn
            @click="this.$router.push({ name: 'CartPage' })"
            class="text-white mt-2"
            color="green-darken-2"
            variant="flat"
            width="100%"
            prepend-icon="mdi-cart"
          >
            عرض السلة
          </v-btn>
        </div>
      </v-container>
    </v-navigation-drawer>

    <v-app-bar
      v-if="this.$route.name !== 'dashboard'"
      id="mynave"
      color="#f5f5f5"
      flat
      height="140"
      class="border-b shadow-sm"
    >
      <v-container fluid>
        <v-row align="center" justify="space-between">
          <!-- ✅ شعار الموقع -->
          <v-col
            cols="12"
            sm="3"
            class="d-flex align-center justify-center justify-sm-start"
          >
            <div
              class="d-flex align-center gap-2 cursor-pointer"
              @click="this.$router.push({ name: 'home' })"
            >
              <v-icon size="36" color="#c79a00"
                >mdi-package-variant-closed</v-icon
              >
              <h2 class="text-lg font-bold text-darkgold">جُمّله الجُمّله</h2>
            </div>
          </v-col>

          <!-- ✅ مربع البحث -->
          <v-col cols="12" sm="5">
            <v-form @submit.prevent="this.Search(this.searchvalue)">
              <v-text-field
                v-model="this.searchvalue"
                variant="outlined"
                density="comfortable"
                hide-details
                class="rounded-xl bg-white"
                placeholder="ابحث عن منتج ..."
                prepend-inner-icon="mdi-magnify"
                @click:prepend-inner="this.Search(this.searchvalue)"
              ></v-text-field>
            </v-form>
          </v-col>

          <!-- ✅ الأيقونات -->
          <v-col
            cols="12"
            sm="4"
            class="d-flex justify-center justify-sm-end align-center gap-3"
          >
            <!-- القائمة -->
            <v-btn icon variant="text" color="#444" @click="openaside()">
              <v-icon size="26">mdi-menu</v-icon>
            </v-btn>

            <!-- السلة -->
            <v-btn
              v-if="userRole !== 'supplier'"
              icon
              variant="text"
              color="#444"
              @click="this.openCart()"
            >
              <v-badge
                :content="this.CartProduct2.length"
                color="#c79a00"
                offset-x="-7"
                offset-y="-4"
              >
                <v-icon size="26">mdi-cart-outline</v-icon>
              </v-badge>
            </v-btn>
            <!-- الاشعار -->
            <v-btn
              icon
              variant="text"
              color="#444"
              @click="this.$router.push({ name: 'notifications' })"
            >
              <v-badge
                :content="this.NotyfCount"
                color="#c79a00"
                offset-x="-7"
                offset-y="-4"
              >
                <v-icon size="26">mdi-bell</v-icon>
              </v-badge>
            </v-btn>
            <!-- الحساب -->
            <v-menu>
              <template #activator="{ props }">
                <v-btn icon v-bind="props" variant="text" color="#444">
                  <v-icon size="26">mdi-account-outline</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-if="!token"
                  @click="this.$router.push({ name: 'login' })"
                >
                  <v-list-item-title
                    >تسجيل الدخول / إنشاء حساب</v-list-item-title
                  >
                </v-list-item>
                <v-list-item v-if="token" @click="logout()">
                  <v-list-item-title>تسجيل الخروج</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <!-- المفضلة -->
            <v-btn
              v-if="userRole !== 'supplier'"
              icon
              variant="text"
              color="#444"
              @click="$router.push({ name: 'listpage' })"
            >
              <v-badge
                :content="this.list.length"
                color="#c79a00"
                offset-x="-7"
                offset-y="-4"
              >
                <v-icon size="26">mdi-heart-outline</v-icon>
              </v-badge>
            </v-btn>
          </v-col>
        </v-row>

        <!-- ✅ روابط التصنيفات -->
        <v-row
          class="mt-2 border-t pt-2"
          align="center"
          justify="space-between"
        >
          <v-col
            cols="12"
            sm="8"
            class="d-flex flex-wrap justify-center justify-sm-start gap-3"
          >
            <router-link
              class="nav-link"
              v-if="userRole !== 'supplier'"
              :to="{ name: 'home' }"
              >الرئيسية</router-link
            >
            <router-link
              class="nav-link"
              v-if="userRole == 'supplier'"
              :to="{ name: 'supplierhome' }"
              >الرئيسية</router-link
            >
            <router-link
              v-for="cat in this.page.slice(0, 5)"
              :key="cat.titel"
              :to="{ name: 'catigoryPage', params: { catigory: cat.slug } }"
              class="nav-link"
            >
              {{ cat.slug }}
            </router-link>
          </v-col>

          <!-- ✅ اللغة والمساعدة -->
          <v-col
            cols="12"
            sm="4"
            class="d-flex justify-center justify-sm-end align-center gap-3"
          >
            <router-link to="/contact">
              <v-icon color="#444" size="20">mdi-help-circle-outline</v-icon>
              المساعدة
            </router-link>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <ResponsiveNav
      v-if="
        this.$route.name !== 'homedash' || 'catigores' || 'pages' || 'users'
      "
      @opneMune="openamenu()"
      @openCart="openCart()"
      @openSearch="openSearch()"
    />

    <v-main>
      <slot></slot>
    </v-main>
    <MobileFooter />
  </v-layout>
</template>
<script>
import { mystore } from "@/store";
import { CartStore1 } from "@/store/Cart";
import { ListsStore1 } from "@/store/Lists";
import ResponsiveNav from "./Home/ResponsiveNav.vue";
import { mapState, mapActions } from "pinia";
import MobileFooter from "./Home/MobileFooter.vue";
import axios from "axios";
import router from "@/router";
export default {
  components: { ResponsiveNav, MobileFooter },
  data() {
    return {
      user: "",
      asiddashboard: [
        { titel: "Home", url: "homedash", icon: "mdi-home-circle" },
        { titel: "pages", url: "pages", icon: "mdi-lightbulb-group" },
        { titel: "Users", url: "users", icon: "mdi-account-group" },
        { titel: "Categoris", url: "catigores", icon: "mdi-shape-plus" },
      ],
      drawer: false,
      drawerCart: false,
      drawermenu: false,
      drawerSearch: false,
      quant: 1,

      nums: [],
      total: [],
      localitem: "",
      todolist: [],
      searchvalue: "",
      selectedlang: ["lang"],
      muneactive: false,
      lang: [
        {
          langname: "EN/USD",
          icon: ` <v-icon
                      ><svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        x="0px"
                        y="0px"
                        viewBox="0 0 512 512"
                        style="enable-background: new 0 0 512 512;width: 20px;margin-right: 5px"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        xml:space="preserve"
                      >
                        <circle
                          style="fill: #f0f0f0"
                          cx="256"
                          cy="256"
                          r="256"
                        ></circle>
                        <g>
                          <path
                            style="fill: #0052b4"
                            d="M52.92,100.142c-20.109,26.163-35.272,56.318-44.101,89.077h133.178L52.92,100.142z"
                          ></path>
                          <path
                            style="fill: #0052b4"
                            d="M503.181,189.219c-8.829-32.758-23.993-62.913-44.101-89.076l-89.075,89.076H503.181z"
                          ></path>
                          <path
                            style="fill: #0052b4"
                            d="M8.819,322.784c8.83,32.758,23.993,62.913,44.101,89.075l89.074-89.075L8.819,322.784L8.819,322.784   z"
                          ></path>
                          <path
                            style="fill: #0052b4"
                            d="M411.858,52.921c-26.163-20.109-56.317-35.272-89.076-44.102v133.177L411.858,52.921z"
                          ></path>
                          <path
                            style="fill: #0052b4"
                            d="M100.142,459.079c26.163,20.109,56.318,35.272,89.076,44.102V370.005L100.142,459.079z"
                          ></path>
                          <path
                            style="fill: #0052b4"
                            d="M189.217,8.819c-32.758,8.83-62.913,23.993-89.075,44.101l89.075,89.075V8.819z"
                          ></path>
                          <path
                            style="fill: #0052b4"
                            d="M322.783,503.181c32.758-8.83,62.913-23.993,89.075-44.101l-89.075-89.075V503.181z"
                          ></path>
                          <path
                            style="fill: #0052b4"
                            d="M370.005,322.784l89.075,89.076c20.108-26.162,35.272-56.318,44.101-89.076H370.005z"
                          ></path>
                        </g>
                        <g>
                          <path
                            style="fill: #d80027"
                            d="M509.833,222.609h-220.44h-0.001V2.167C278.461,0.744,267.317,0,256,0   c-11.319,0-22.461,0.744-33.391,2.167v220.44v0.001H2.167C0.744,233.539,0,244.683,0,256c0,11.319,0.744,22.461,2.167,33.391   h220.44h0.001v220.442C233.539,511.256,244.681,512,256,512c11.317,0,22.461-0.743,33.391-2.167v-220.44v-0.001h220.442   C511.256,278.461,512,267.319,512,256C512,244.683,511.256,233.539,509.833,222.609z"
                          ></path>
                          <path
                            style="fill: #d80027"
                            d="M322.783,322.784L322.783,322.784L437.019,437.02c5.254-5.252,10.266-10.743,15.048-16.435   l-97.802-97.802h-31.482V322.784z"
                          ></path>
                          <path
                            style="fill: #d80027"
                            d="M189.217,322.784h-0.002L74.98,437.019c5.252,5.254,10.743,10.266,16.435,15.048l97.802-97.804   V322.784z"
                          ></path>
                          <path
                            style="fill: #d80027"
                            d="M189.217,189.219v-0.002L74.981,74.98c-5.254,5.252-10.266,10.743-15.048,16.435l97.803,97.803   H189.217z"
                          ></path>
                          <path
                            style="fill: #d80027"
                            d="M322.783,189.219L322.783,189.219L437.02,74.981c-5.252-5.254-10.743-10.266-16.435-15.047   l-97.802,97.803V189.219z"
                          ></path>
                        </g>
                      </svg>
                    </v-icon>`,
        },
        {
          langname: "DE/EUR",
          icon: `<v-icon
                      ><svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        x="0px"
                        y="0px"
                        viewBox="0 0 512 512"
                        style="enable-background: new 0 0 512 512;width: 20px;margin-right: 5px"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        xml:space="preserve"
                      >
                        <path
                          style="fill: #ffda44"
                          d="M15.923,345.043C52.094,442.527,145.929,512,256,512s203.906-69.473,240.077-166.957L256,322.783  L15.923,345.043z"
                        ></path>
                        <path
                          d="M256,0C145.929,0,52.094,69.472,15.923,166.957L256,189.217l240.077-22.261C459.906,69.472,366.071,0,256,0z"
                        ></path>
                        <path
                          style="fill: #d80027"
                          d="M15.923,166.957C5.633,194.69,0,224.686,0,256s5.633,61.31,15.923,89.043h480.155  C506.368,317.31,512,287.314,512,256s-5.632-61.31-15.923-89.043H15.923z"
                        ></path></svg></v-icon
                  >`,
        },
      ],
    };
  },
  computed: {
    ...mapState(mystore, [
      "catigoryies",
      "searchrsult",
      "domin",
      "NotyfCount",
      "catigoryiesDashboard",
      "page",
      "userRole",
      "userinfo",
      "token",
    ]),
    ...mapState(CartStore1, ["CartProduct2"]),
    ...mapState(ListsStore1, ["list"]),
  },
  watch: {
    token(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.fetchUser();
      }
    },
  },
  methods: {
    ...mapActions(mystore, ["logoutin"]),

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
    saveToLocalStorage() {
      localStorage.setItem("todo", JSON.stringify(this.CartProduct2));
    },
    async fetchUser() {
      if (!this.token) return;
      try {
        const res = await axios.get(`${this.domin}user/info`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.user = res.data.user || res.data;
        console.log(user.value);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },
    handleAuth() {
      if (this.token) {
        // تسجيل خروج
        this.logoutin();
        this.token = false;
        this.$router.push({ name: "login" });
      } else {
        // تسجيل دخول
        this.$router.push({ name: "login" });
      }
    },
    async logout() {
      try {
        const res = await axios.post(
          `${this.domin}logout`, // عنوان الطلب
          {}, // جسم الطلب (فارغ هنا)
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );

        this.logoutin();

        console.log("تم تسجيل خروج المستخدم:", res.data);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },

    openCart() {
      this.drawerCart = !this.drawerCart;
      this.fun();
    },
    openSearch() {
      this.drawerSearch = !this.drawerSearch;
    },
    openaside() {
      this.drawer = !this.drawer;
    },
    openamenu() {
      this.drawermenu = !this.drawermenu;
    },
    Search(data) {
      this.$router.push({ name: "searchpage", params: { products: data } });
      this.getSearchProduct(data);
    },
    delcart() {
      this.CartProduct2.splice(0, 1);
    },

    ...mapActions(mystore, [
      "getcatigories",
      "getSearchProduct",
      "getNotyfication",
      "getCatigoryDash",
      "Pages",
      "Userinfo",
      "User",
    ]),
    ...mapActions(CartStore1, [
      "increaseQuantity",
      "decreaseQuantity",
      "delitem2",
      "GetCart2",
    ]),
    ...mapActions(ListsStore1, ["updateL", "GetCartL"]),
  },
  async mounted() {
    await this.updateL();
    await this.fun();
    await this.GetCartL();
    await this.getNotyfication();
    await this.getCatigoryDash();
    await this.update();
    await this.Userinfo();
    await this.User();
    await this.GetCart2();
    await this.Pages();
    await this.getcatigories();
    // تحديث المستخدم عند بداية التحميل

    await this.fetchUser();

    // مراقبة تغييرات token من تبويبات أخرى
    window.addEventListener("storage", (event) => {
      if (event.key === "token") {
        this.token = event.newValue || null;
        this.fetchUser();
      }
    });
  },
};
</script>

<style lang="css" scoped>
@import url("https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap");

* {
  font-family: "Cairo", sans-serif;
}
.v-main {
  padding: auto;
  margin: auto;
}
.nav-link {
  text-decoration: none;
  color: black;
  font-weight: 600;
  font-family: "Cairo", sans-serif;
  transition: 0.2s;
  margin: 5px;
  font-size: 15px;
}
.nav-link:hover {
  color: #ff9800;
}
.v-app-bar {
  font-family: "Cairo", sans-serif;
}
.v-text-field input {
  font-family: "Cairo", sans-serif;
}
a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

input {
  background-color: azure;
  height: 50px;
  width: 400px;
  top: 8px;
  border-radius: 30px;
  padding-left: 15px;
  position: relative;
  left: -90px;
}

#iconsearch {
  position: relative;
  left: 70px;
  top: 20px;
  z-index: 2;
  flex-flow: row-reverse;
}

#gropicon {
  margin: 10px;
  position: relative;
  color: rgb(247, 199, 109);
}

#gropicon1 {
  margin: 10px;
  position: relative;
}

#langhelp {
  display: flex;
  flex-flow: row-reverse;
  margin-left: -150px;
  position: relative;
  top: 15px;
  gap: 10px;
}
#langhelp1 {
  display: flex;
  flex-flow: row-reverse;
  margin-left: -150px;
  position: relative;
  top: 15px;
  gap: 10px;
}

#lang {
  position: relative;
  left: 0px;
  top: 0px;
}

#nav-icon-text {
  display: flex;
  flex-flow: column;
}

#gropicon-text {
  margin-left: 20px;
}

#logop {
  background-color: transparent;
  position: relative;
  left: -80px;
}

#logo {
  height: fit-content;
  width: fit-content;
  cursor: pointer;
}

#catigorylinks {
  background-color: transparent;
  overflow: initial;
}

#row1 {
  position: relative;
  top: 10px;
}

#link {
  cursor: pointer;
}

#navlistlng {
  z-index: 5;
  position: fixed;
}

#linkcat {
  margin-left: 10px;
}

#headerCart {
  position: relative;
  top: 10px;
  margin-left: 0px;
  margin-bottom: 20px;
  width: 96%;
  align-items: flex-start;
  background-color: white;
}
#qountbtn {
  position: absolute;
  height: 30px;
  border-radius: 15px;
  border: 2px solid black;
  width: 80px;
  background-color: white;
  top: -10px;
}

#plus {
  position: absolute;
  top: -8px;
  left: -35px;
  z-index: 3;
}

#munse {
  position: absolute;
  top: -8px;
  left: -80px;
  z-index: 3;
}

#qointcon {
  display: flex;
  flex-flow: column;
  justify-content: center;
  left: 100px;
  position: relative;
}
#mynave {
  height: 130px;
}
#conten {
  display: flex;
  flex-flow: column;
}
#tablecart {
  width: 100%;
  position: relative;
  display: flex;
  overflow: hidden;
}
div.v-table__wrapper {
  border-radius: inherit;
  overflow: visible;
}
#conscroll {
  overflow: visible;
}
#btnadd {
  border-radius: 30px;
  height: 50px;
}

#conCartBtn {
  justify-content: center;
  align-items: center;
  gap: 10px;
}

#cartrow {
  height: fit-content;
  position: relative;
  margin-bottom: 10px;
  padding-left: 20px;
  width: 100%;
}

#cartimgside {
  position: relative;
  left: -10px;
  width: 150px;
}

#link0:hover {
  background-color: rgb(224, 224, 224);
}
.text-h6 {
  width: 200px;
}
#drowerSearch {
  display: none;
}
#derowermune {
  display: none;
}
#qointcon {
  width: 100px;
  position: relative;
}
/*/desktop/*/
@media (max-width: 1366px) {
}
/*/tablet/*/
@media (max-width: 991px) {
  #mynave {
    display: none;
  }
  #derowermune {
    display: flex;
  }
  #langhelp {
    left: 100px;
    position: relative;
  }

  #closemenu {
    position: relative;
    left: 40px;
  }

  #menu {
    position: relative;
    left: -30px;
  }

  #searchinputforderwer {
    position: relative;
    width: 300px;
    left: auto;
    background-color: azure;
  }

  #btn-closeserchderwoer {
    border-radius: 5px;
    width: 80px;
    left: 50px;
    position: relative;
    top: 6px;
    height: 49px;
  }
  .text-h6 {
    width: 200px;
  }
  #langhelp1 {
    left: 150px;
  }
  #mynave {
    display: none;
  }
  #derowermune {
    display: flex;
  }
  #langhelp {
    left: 100px;
    position: relative;
  }

  #closemenu {
    position: relative;
    left: 40px;
  }

  #menu {
    position: relative;
    left: -30px;
  }

  #searchinputforderwer {
    position: relative;
    width: 300px;
    left: auto;
    background-color: azure;
  }

  #btn-closeserchderwoer {
    border-radius: 5px;
    width: 80px;
    left: 50px;
    position: relative;
    top: 6px;
    height: 49px;
  }
  .text-h6 {
    width: 200px;
  }
  #langhelp1 {
    left: 150px;
  }
  #cartimgside {
    position: relative;
    left: -10px;
    width: 100px;
  }
}

/*/mobile/*/
@media (max-width: 500px) {
  #cartimgside {
    position: relative;
    left: -10px;
    width: 100px;
  }

  #cartrow {
    width: 150%;
  }

  #langhelp1 {
    left: 100px;
    position: relative;
  }
  #langhelp {
    display: none;
    position: relative;
  }

  #mynave {
    display: none;
  }

  #closemenu {
    position: relative;
    left: 40px;
  }

  #menu {
    position: relative;
    left: -30px;
  }

  #searchinputforderwer {
    position: relative;
    left: 3rem;
    background-color: azure;

    width: 200px;
  }

  #iconsearch2 {
    position: relative;
    top: 20px;
    z-index: 2;
    flex-flow: row-reverse;
  }

  #btn-closeserchderwoer {
    border-radius: 50px;
    width: 80px;
    left: 5px;
    top: 6px;
    height: 49px;
  }
  #iconsearchdrawer {
    position: relative;
    left: 200px;
    top: 20px;
    z-index: 5;
    cursor: pointer;
  }
  #closecart {
    left: 350px;
  }

  #closeitemcart {
    left: -200px;
  }
  #conCartBtn {
    position: relative;
    top: 10px;
  }
  .text-h6 {
    width: 100px;
  }
  #tablecart {
    width: 80%;
    position: relative;
    display: flex;
    overflow: hidden;
    left: -40px;
  }
  #emptycart {
    width: 80%;
    position: relative;
    display: flex;
    overflow: hidden;
    left: 70px;
  }
  #derowermune {
    display: flex;
  }
  #drowerSearch {
    display: block;
  }
}
</style>
