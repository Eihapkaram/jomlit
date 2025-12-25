import { createPinia, defineStore } from "pinia";
import axios from "axios";

// ✅ إنشاء الـ Pinia store الأساسي
const store = createPinia();
export default store; // <--- مهم جداً علشان main.js يقدر يستخدمه

// ✅ إنشاء الـ mystore الخاص بتطبيقك
export const mystore = defineStore("mystore", {
  state: () => ({
    result: [],
    all: "",
    top: "",
    topsoldproducts: "",
    searchrsult: "",
    SingleProduct: "",
    searchCatigoryby: "",
    page: "",
    Notyf: "",
    NotyfCount: "",
    user: "",
    userRole: "",
    token: localStorage.getItem("token") || null,
    userinfo: "",
    Reviwes: "",
    PayRequst: "",
    AllRequst: "",
    sellersProfits: "",
    settings: "",
    ordersbyCoustomer: "",
    ordersbySeller: "",
    Queries: "",
    sellermyProfits: "",
    offers: "",
    orderCoun: "",
    orderCounSeller: "",
    catigoryProducts: "",
    catigoryProducts1: "",
    catigoryiesDashboard: "",
    userorders: "",
    CartData: "",
    CartData2: "",
    domin: "https://web-production-b1ce5.up.railway.app/api/",
  }),

  actions: {
    async login(token, role) {
      this.token = token;
      localStorage.setItem("token", token);
      this.User();
      this.userRole = this.userRole;
    },
    async logoutin() {
      this.token = null;
      this.userRole = null;

      localStorage.removeItem("token");
    },
    async getruslt(item) {
      this.result.push(item);
    },
    async getall() {
      const res = await fetch(`${this.domin}pro`);
      const data = await res.json();
      this.all = data.products;
    },

    async topall() {
      const res = await fetch(`${this.domin}products/most-ordered`);
      const data = await res.json();
      this.top = data.products;
    },

    async topsold(id) {
      const res = await fetch(`${this.domin}products/top-sold/${id}`);
      const data = await res.json();
      this.topsoldproducts = data.products;
      console.log(this.topsoldproducts);
    },
    async getSingle(id) {
      const res = await fetch(`${this.domin}show/${id}`);
      const data = await res.json();
      this.SingleProduct = data.data;
    },

    async getReviwes(id) {
      const res = await fetch(`${this.domin}show/reviwe/${id}`);
      const data = await res.json();
      this.Reviwes = data.Proreviwes;
    },
    async Addinquiries(name, email, message, phone, subject) {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.post(
          `${this.domin}inquiries`,
          {
            name: name,
            email: email || null,
            phone: phone || null,
            subject: subject || null,
            message: message,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error(err.response?.data || err);
      }
      await this.getReviwes(this.$route.params.idparam);
    },
    async Offers() {
      const res = await fetch(`${this.domin}offers/active`);
      const data = await res.json();
      this.offers = data;
    },

    async Cart() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${this.domin}cart/show`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.CartData = res.data.user;
        this.CartData2 = res.data;
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },

    async ordersShow() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${this.domin}dashboard/orders/customers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.ordersbyCoustomer = res.data.orders;
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },
    async QueriesShow() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${this.domin}dashboard/inquiries`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.Queries = res.data;
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },
    async sellerProfits() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${this.domin}seller/myProfits`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.sellermyProfits = res.data;
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },
    async sellerPayRequst() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${this.domin}seller/withdraws`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.PayRequst = res.data;
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },
    async RequstPrfictAll() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${this.domin}dashboard/withdraw-requests`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.AllRequst = res.data.withdraw_requests;
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },
    async SellersPrfictAll() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${this.domin}dashboard/sellersProfits`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.sellersProfits = res.data;
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },
    async allordersbySeller() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${this.domin}dashboard/allorderbyseller/ApprovedOrders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.ordersbySeller = res.data.orders;
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },
    async orderCountfun() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${this.domin}order/count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.orderCoun = res.data.orderCount;
        console.log(this.orderCoun);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },
    async OrdCounSeller() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${this.domin}sellerApprovedOrdershow`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.orderCounSeller = res.data.orders;
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },
    async userordersShow() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${this.domin}order/show`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.userorders = res.data.order;
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },
    /*async getNotyfication() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${this.domin}notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.Notyf = res.data.notifications;
        this.NotyfCount = res.data.unread_count;
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },
    async getNotyfication() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${this.domin}notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // مقارنة الإشعارات الجديدة باللي موجودة قبل كده
        const newNotifications = res.data.notifications.filter(
          (n) => !this.lastNotificationId || n.id > this.lastNotificationId
        );

        if (newNotifications.length) {
          // تشغيل صوت عند وجود إشعار جديد
          const audio = new Audio("/sounds/mp.mp3");
          audio.play().catch(() => {});

          // تحديث آخر Notification ID
          this.lastNotificationId = newNotifications[0].id;
        }

        // تحديث البيانات
        this.Notyf = res.data.notifications;
        this.NotyfCount = res.data.unread_count;
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },*/
    async getNotyfication() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${this.domin}notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // مقارنة الإشعارات الجديدة باللي موجودة قبل كده
        const newNotifications = res.data.notifications.filter(
          (n) => !this.lastNotificationId || n.id > this.lastNotificationId
        );

        if (newNotifications.length) {
          // تشغيل صوت عند وجود إشعار جديد في المتصفح
          const audio = new Audio("/sounds/mp.mp3");
          audio.play().catch(() => {});

          // تحديث آخر Notification ID
          this.lastNotificationId = newNotifications[0].id;

          // اظهار الإشعارات في Android Nav/Status Bar
          newNotifications.forEach(async (n) => {
            await LocalNotifications.schedule({
              notifications: [
                {
                  title: n.title,
                  body: n.message,
                  id: n.id,
                  sound: "mp.mp3", // لو حطيت الصوت في android/app/src/main/res/raw
                  smallIcon: "ic_stat_icon", // أيقونة صغيرة في navbar
                },
              ],
            });
          });
        }

        // تحديث البيانات
        this.Notyf = res.data.notifications;
        this.NotyfCount = res.data.unread_count;
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },

    async getCatigoryProduct(catigory) {
      const res = await fetch(`${this.domin}search/category?q=${catigory}`);
      const data = await res.json();
      this.catigoryProducts = data.category;
    },

    async getCatigoryProduct1(catigory) {
      const res = await fetch(
        `${this.domin}search/cate?filter[categorie.name]=${catigory}`
      );
      const data = await res.json();
      this.catigoryProducts1 = data.result;
    },

    async getCatigoryDash() {
      const res = await fetch(`${this.domin}categorie/show`);
      const data = await res.json();
      this.catigoryiesDashboard = data.pro;
    },

    async Users() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${this.domin}dashboard/usersinfo`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.user = res.data.user;
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },

    async User() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${this.domin}user/info`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.userRole = res.data.user.role;
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },
    async Userinfo() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${this.domin}user/info`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.userinfo = res.data.user;
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },
    async siteinformition() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${this.domin}settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.settings = res.data.settings;
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },

    async Pages() {
      const res = await fetch(`${this.domin}pageProducts/show`);
      const data = await res.json();
      this.page = data.pro;
      console.log(data);
    },

    async getSearchProduct(query) {
      const res = await fetch(
        `${this.domin}search/cate?filter[titel]=${query}`
      );
      const data = await res.json();
      this.searchrsult = data.result;
    },
    async searchCatigorybyname(catigory) {
      const res = await fetch(`${this.domin}search?filter[slug]=${catigory}`);
      const data = await res.json();
      this.searchCatigoryby = data.result;
    },
  },
});
