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
    Lmmitpro: "",
    currentPage: 1,
    lastPage: 1,
    top: "",
    adminSupplierorders: "",
    topsoldproducts: "",
    searchrsult: "",
    userscarts: "",
    topCustomer: "",
    mostaddedproducts: "",
    SingleProduct: "",
    searchCatigoryby: "",
    page: "",
    getCategoriesBypageslug: "",
    getProductsBycategoryslug: "",
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
    domin: "https://web-production-a3905.up.railway.app/api/",
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
    async getall2(page = 1) {
      const res = await fetch(`${this.domin}pro10?page=${page}`);
      const data = await res.json();

      this.Lmmitpro = data.products.data;

      this.currentPage = data.products.current_page;
      this.lastPage = data.products.last_page;

      return data.products;
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
          { headers: { Authorization: `Bearer ${token}` } },
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
          },
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
          },
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
    async usersCarts() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${this.domin}dashboard/cart/show/users/carts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        this.userscarts = res.data.data.data;
        console.log(this.userscarts);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },
    async mostAddedProducts() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${this.domin}dashboard/cart/mostAddedProducts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        this.mostaddedproducts = res.data.data;
        console.log(res);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },
    async topCustomersAddtoCart() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${this.domin}dashboard/cart/show/topCustomers`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        this.topCustomer = res.data;
        console.log(res);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },
    async adminsupplierorders() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${this.domin}dashboard/admin/supplier-orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        this.adminSupplierorders = res.data.orders;
      } catch (err) {
        console.error(err.response?.data || err);
      }
    },
    async supplierordersstatus(id, status) {
      const token = localStorage.getItem("token");

      try {
        await axios.put(
          `${this.domin}dashboard/admin/supplier-orders/${id}/status`,
          { status: status },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
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
    async getNotyfication(page = 1) {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(`${this.domin}notifications?page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.currentPage = res.data.notifications.current_page;
        this.lastPage = res.data.notifications.last_page;

        const notifications = res.data.notifications.data;

        // تشغيل صوت للإشعارات الجديدة
        const newNotifications = notifications.filter(
          (n) => !this.lastNotificationId || n.id > this.lastNotificationId,
        );

        if (newNotifications.length) {
          const audio = new Audio("/sounds/mp.mp3");

          audio.play().catch(() => {});

          this.lastNotificationId = newNotifications[0].id;
        }

        // page الأولى يستبدل
        if (page === 1) {
          this.Notyf = notifications;
        } else {
          // الصفحات التالية يضيف
          this.Notyf = [...this.Notyf, ...notifications];
        }

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
        `${this.domin}search/cate?filter[categorie.name]=${catigory}`,
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
    },
    async getCategoriesByPageSlug(slug) {
      const res = await fetch(`${this.domin}page/${slug}/categories`);
      const data = await res.json();
      this.getCategoriesBypageslug = data;
    },
    async getProductsByCategorySlug(slug) {
      const res = await fetch(`${this.domin}category/${slug}/products`);
      const data = await res.json();
      this.getProductsBycategoryslug = data.products;
    },

    async getSearchProduct(query) {
      const res = await fetch(
        `${this.domin}search/cate?filter[titel]=${query}`,
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
