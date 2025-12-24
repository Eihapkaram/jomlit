import { createRouter, createWebHistory } from "vue-router";
import { mystore } from "@/store";

// === Lazy-loaded Pages ===
const HomeView = () => import("@/views/HomeView.vue");
const AboutView = () => import("@/views/AboutView.vue");
const DetilseProduct = () => import("@/views/DetilseProduct.vue");
const CatigoryProduct = () => import("@/views/CatigoryProduct.vue");
const CategoryPage = () => import("@/views/CategoryPage.vue");
const CartPage = () => import("@/views/CartPage.vue");
const ListsPage = () => import("@/views/ListsPage.vue");
const CheckOutpage = () => import("@/views/CheckOutpage.vue");
const MyPayes = () => import("@/views/MyPayes.vue");
const Notifications = () => import("@/views/Notifications.vue");
const Profile = () => import("@/views/Profile.vue");
const SellerProfile = () => import("@/views/SellerProfile.vue");
const CreateOrderBySeller = () => import("@/views/CreateOrderBySeller.vue");
const SellerCustomers = () => import("@/views/SellerCustomers.vue");
const UserForgetPass = () => import("@/views/UserForgetPass.vue");
const ResetPassword = () => import("@/views/Resetpassword.vue");
const DashBoard = () => import("@/views/DashBoard.vue");
const AboutUs = () => import("@/views/AboutUs.vue");
const CustomerService = () => import("@/views/CustomerService.vue");
const ShippingPolicy = () => import("@/views/ShippingPolicy.vue");
const PrivacyPolicy = () => import("@/views/PrivacyPolicy.vue");
const TermsConditions = () => import("@/views/TermsConditions.vue");
const Inquiries = () => import("@/views/Inquiries.vue");
const FAQ = () => import("@/views/FAQ.vue");
const ContactUs = () => import("@/views/ContactUs.vue");
const OffersPage = () => import("@/views/OffersPage.vue");

// === Lazy-loaded dashboard components ===
const LogIn = () => import("@/components/dashborad/LogIn.vue");
const UserRegister = () => import("@/components/dashborad/UserRegister.vue");
const AddProduct = () => import("@/components/dashborad/AddProduct.vue");
const UpdateProduct = () => import("@/components/dashborad/UpdateProduct.vue");
const HomeProduct = () => import("@/components/dashborad/HomeProduct.vue");
const CategoriesCom = () => import("@/components/dashborad/CategoriesCom.vue");
const AddCategories = () => import("@/components/dashborad/AddCategories.vue");
const UpdateCategories = () =>
  import("@/components/dashborad/UpdateCategories.vue");
const PagesCom = () => import("@/components/dashborad/PagesCom.vue");
const AddPage = () => import("@/components/dashborad/AddPage.vue");
const UpdatePage = () => import("@/components/dashborad/UpdatePage.vue");
const UsersPage = () => import("@/components/dashborad/UsersPage.vue");
const UpdateUser = () => import("@/components/dashborad/UpdateUser.vue");
const ShowOrders = () => import("@/components/dashborad/ShowOrders.vue");
const Settings = () => import("@/components/dashborad/Settings.vue");
const AdminSendNotification = () =>
  import("@/components/dashborad/AdminSendNotification.vue");
const QueriesShow = () => import("@/components/dashborad/QueriesShow.vue");
const AdminWithdrawRequests = () =>
  import("@/components/dashborad/AdminWithdrawRequests.vue");

// =========================================
// ✅ Routes
// =========================================
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { title: "جُمـلـة الجُـمـلـة | منتجات الجملة في السوق المصري" },
  },
  { path: "/products", name: "all", component: AboutView },
  { path: "/Profile", name: "Profile", component: Profile },
  { path: "/SProfile", name: "SellerProfile", component: SellerProfile },
  { path: "/detilse/:idparam", name: "derilse", component: DetilseProduct },
  {
    path: "/CatigoryProduct/:catigory",
    name: "catigory",
    component: CatigoryProduct,
  },
  {
    path: "/CatigoryPage/:catigory",
    name: "catigoryPage",
    component: CategoryPage,
  },
  { path: "/cartpage", name: "CartPage", component: CartPage },
  { path: "/listpage", name: "listpage", component: ListsPage },
  { path: "/checkpage", name: "checkpage", component: CheckOutpage },
  {
    path: "/checkpageBySeller",
    name: "checkBySeller",
    component: CreateOrderBySeller,
  },
  {
    path: "/SellerCustomer",
    name: "SellerCustomer",
    component: SellerCustomers,
  },
  {
    path: "/shearch/:products",
    name: "searchpage",
    component: () => import("@/views/SearchPage.vue"),
  },
  { path: "/login", name: "login", component: LogIn },
  { path: "/forgetPassword", name: "forget", component: UserForgetPass },
  { path: "/resetpassword", name: "ResetPassword", component: ResetPassword },
  { path: "/register", name: "register", component: UserRegister },
  { path: "/mypayes", name: "mypayes", component: MyPayes },
  { path: "/myNotifications", name: "notifications", component: Notifications },
  { path: "/aboutus", name: "AboutUs", component: AboutUs },
  {
    path: "/customer-service",
    name: "CustomerService",
    component: CustomerService,
  },
  {
    path: "/shipping-policy",
    name: "ShippingPolicy",
    component: ShippingPolicy,
  },
  { path: "/privacy-policy", name: "PrivacyPolicy", component: PrivacyPolicy },
  { path: "/terms", name: "TermsConditions", component: TermsConditions },
  { path: "/inquiries", name: "Inquiries", component: Inquiries },
  { path: "/faq", name: "FAQ", component: FAQ },
  { path: "/contact", name: "ContactUs", component: ContactUs },
  { path: "/offer", name: "offer", component: OffersPage },

  // === Dashboard Routes with children ===
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashBoard,
    children: [
      { path: "create", name: "create", component: AddProduct },
      { path: "update/:id?", name: "update", component: UpdateProduct },
      { path: "homedash", name: "homedash", component: HomeProduct },
      { path: "catigores", name: "catigores", component: CategoriesCom },
      { path: "catigoreAdd", name: "catigoreAdd", component: AddCategories },
      {
        path: "catigoreUpdate/:id",
        name: "catigoreUpdate",
        component: UpdateCategories,
      },
      { path: "pages", name: "pages", component: PagesCom },
      { path: "page/add", name: "addpage", component: AddPage },
      { path: "pages/update/:id", name: "updatepage", component: UpdatePage },
      { path: "users", name: "users", component: UsersPage },
      { path: "updateuser/:id", name: "updateuser", component: UpdateUser },
      { path: "orders", name: "orders", component: ShowOrders },
      { path: "sendNotify", name: "send", component: AdminSendNotification },
      { path: "Settings", name: "Settings", component: Settings },
      { path: "QueriesShow", name: "QueriesShow", component: QueriesShow },
      {
        path: "AdminWithdrawRequests",
        name: "Requests",
        component: AdminWithdrawRequests,
      },
    ],
  },

  { path: "/:pathMatch(.*)*", redirect: "/" },
];

// =========================================
// ✅ Router Setup
// =========================================
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.onError((error) => {
  console.error("Router Error:", error);
});

// Example: Auth Guard
router.beforeEach((to, from, next) => {
  if (to.path.startsWith("/dashboard")) {
    const auth = mystore();
    const userRole = auth.userRole;
    if (userRole !== "admin") return next("/");
  }
  next();
});

export default router;
