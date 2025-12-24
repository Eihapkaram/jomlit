<template>
  <footer class="footer" dir="rtl">
    <v-container>
      <v-row class="footer-top">
        <!-- الأقسام -->
        <v-col cols="12" sm="3" class="footer-col">
          <h4 class="footer-title">الأقسام</h4>
          <ul class="footer-list">
            <li v-for="(item, i) in page.slice(0, 5)" :key="i">
              <router-link
                :to="{ name: 'catigoryPage', params: { catigory: item.slug } }"
              >
                {{ item.slug }}</router-link
              >
            </li>
          </ul>
        </v-col>

        <!-- معلومات إضافية -->
        <v-col cols="12" sm="3" class="footer-col">
          <h4 class="footer-title">معلومات إضافية</h4>
          <ul class="footer-list">
            <li><router-link to="/aboutus">من نحن</router-link></li>
            <li>
              <router-link to="/customer-service">خدمة العملاء</router-link>
            </li>
            <li>
              <router-link to="/shipping-policy"
                >سياسة الشحن والإرجاع</router-link
              >
            </li>
            <li>
              <router-link to="/privacy-policy">سياسة الخصوصية</router-link>
            </li>
            <li><router-link to="/terms">الشروط والأحكام</router-link></li>
          </ul>
        </v-col>

        <!-- خدماتنا -->
        <v-col cols="12" sm="3" class="footer-col">
          <h4 class="footer-title">خدماتنا</h4>
          <ul class="footer-list">
            <li>
              <router-link disable to="/supplier-register"
                >تسجيل الموردين</router-link
              >
            </li>
            <li>
              <router-link disable to="/wholesale-orders"
                >الطلبات بالجملة</router-link
              >
            </li>
            <li><router-link to="/inquiries">الاستفسارات</router-link></li>
            <li><router-link to="/faq">الأسئلة الشائعة</router-link></li>
            <li><router-link to="/contact">اتصل بنا</router-link></li>
          </ul>
        </v-col>

        <!-- معلومات التواصل -->
        <v-col>
          <v-icon
            class="footer-logo"
            size="36"
            color="#c79a00"
            style="margin-left: 8px"
          >
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
            class="site-name"
          >
            {{ settings.site_name }}
          </h2>
          <p>
            <v-icon>mdi-map-marker</v-icon
            >{{ settings.location || "شارع النصر، القاهرة، مصر" }}
          </p>
          <p><v-icon>mdi-phone</v-icon> {{ settings.phone1 }}</p>
          <div class="social-links">
            <a :href="settings.facebook"
              ><v-icon class="social">mdi-facebook</v-icon></a
            >
            <a :href="settings.instgrame"
              ><v-icon class="social">mdi-instagram</v-icon></a
            >
            <a :href="settings.whatsApp"
              ><v-icon class="social">mdi-whatsapp</v-icon></a
            >
          </div>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <!-- الأسفل -->
      <v-row class="footer-bottom">
        <v-col cols="12" sm="6" class="text-right">
          <small>
            © 2025 <strong>{{ settings.site_name }}</strong> - جميع الحقوق
            محفوظة.
            <br />
            تصميم وتطوير بواسطة <strong>Eihap Karam</strong>
          </small>
        </v-col>

        <v-col cols="12" sm="6" class="text-left payment-icons">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
            alt="Visa"
            title="بطاقة فيزا"
            loading="lazy"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
            alt="MasterCard"
            title="ماستر كارد"
            loading="lazy"
          />
          <img
            src="/src/assets/pngaaa.com-3078140.png"
            alt="Vodafone Cash"
            loading="lazy"
            title="فودافون كاش"
          />
          <img
            src="/src/assets/wallet.png"
            alt="محافظ إلكترونية"
            loading="lazy"
            title="محافظ إلكترونية أخرى"
          />
        </v-col>
      </v-row>
    </v-container>
  </footer>
</template>

<script>
import { mystore } from "@/store";
import { mapActions, mapState } from "pinia";
export default {
  computed: {
    ...mapState(mystore, ["page", "domin", "settings"]),
  },
  methods: {
    ...mapActions(mystore, ["Pages", "siteinformition"]),
  },
  async mounted() {
    await this.Pages();
    await this.siteinformition();
  },
};
</script>

<style scoped>
.footer {
  background: linear-gradient(to top, #f9fbf6, #edf5e8);
  padding: 50px 0 0;
  font-family: "Cairo", sans-serif;
  color: #2f2f2f;
}

.footer-top {
  margin-bottom: 30px;
}

.footer-title {
  font-size: 20px;
  font-weight: 700;
  color: #4a6f28;
  margin-bottom: 12px;
  position: relative;
}
.footer-title::after {
  content: "";
  position: absolute;
  bottom: -4px;
  right: 0;
  width: 60px;
  height: 3px;
  background: #a6ce39;
  border-radius: 2px;
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footer-list li {
  margin-bottom: 8px;
  opacity: 0.85;
  transition: all 0.3s ease;
}
.footer-list li:hover {
  opacity: 1;
  color: #5c9e1f;
  transform: translateX(-5px);
}

.footer-list li a {
  text-decoration: none;
  color: inherit;
}

.footer-logo {
  width: 120px;
  margin-bottom: 5px;
  filter: brightness(1.1);
}
.site-name {
  font-size: 22px;
  color: #4f7d2b;
  font-weight: 800;
  margin-bottom: 10px;
}
.footer-contact p {
  margin: 6px 0;
  font-size: 15px;
}
.social-links {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 10px;
}
.social {
  background: #5a7c2f;
  color: white;
  border-radius: 50%;
  padding: 8px;
  font-size: 22px;
  cursor: pointer;
  transition: 0.3s;
}
.social:hover {
  background: #8fc13a;
  transform: scale(1.15);
}

.footer-bottom {
  background: #fff;
  padding: 15px 0;
  margin-top: 20px;
  display: flex;
  align-items: center;
  border-top: 2px solid #d9e8d0;
}
.footer-bottom small {
  color: #555;
  line-height: 1.5;
}
.payment-icons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  align-items: center;
}
.payment-icons img {
  width: 55px;
  height: 35px;
  object-fit: contain;
  transition: 0.3s;
  filter: grayscale(40%);
}
.payment-icons img:hover {
  transform: scale(1.1);
  filter: grayscale(0%);
}

/* Responsiveness */
@media (max-width: 768px) {
  .footer-top {
    text-align: center;
  }
  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
  .payment-icons {
    justify-content: center;
    margin-top: 10px;
  }
}
</style>
