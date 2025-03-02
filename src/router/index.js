import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/users/HomeView.vue";
import login from "../views/login-View.vue";
import registed from "@/views/registed-view.vue";
import AdminView from "@/views/Admin/AdminHome.vue";
import AdminUsers from "@/views/Admin/AdminUsers.vue";
import AdminTeachers from "@/views/Admin/AdminTeacher.vue";
import AdminNews from "@/views/Admin/AdminNews.vue";
import AdminCategoryNews from "@/views/Admin/AdminCategoryNews.vue";
import AdminAssignment from "@/views/assignmentTeacher.vue";
import forgotPassword from "@/views/forgotPassword.vue";
import topicBank from "@/views/users/topicBank.vue";
import topicBankAdmin from "@/views/Admin/topic-BankAdmin.vue";
import topicBankUser from "@/views/users/topicBankUser.vue";
import automaticAssignment from "@/views/Admin/automaticAssignment.vue";
import infoUser from "@/views/users/infoUser.vue";
import lichGiangDay from "@/views/users/lichGiangDayUser.vue";
import AdminComment from "@/views/Admin/AdminComment.vue";
const routes = [
  {
    path: "/",
    name: "login",
    component: login,
  },
  {
    path: "/Home",
    name: "HomeView",
    component: HomeView,
  },
  {
    path: "/registed",
    name: "registed",
    component: registed,
  },
  {
    path: "/admin",
    name: "AdminView",
    component: AdminView,
  },
  {
    path: "/admin/AddUser",
    name: "AdminUsers",
    component: AdminUsers,
  },
  {
    path: "/admin/teachers",
    name: "Adminteachers",
    component: AdminTeachers,
  },
  {
    path: "/admin/newsAdmin",
    name: "AdminNews",
    component: AdminNews,
  },
  {
    path: "/admin/CategoryNewsAdmin",
    name: "CategoryNewsAdmin",
    component: AdminCategoryNews,
  },
  {
    path: "/admin/Assignment",
    name: "AdminAssignment",
    component: AdminAssignment,
  },
  {
    path: "/admin/forgot-password",
    name: "forgotPassword",
    component: forgotPassword,
  },
  {
    path: "/topicBankAdmin",
    name: "topicBankAdmin",
    component: topicBankAdmin,
  },
  {
    path: "/automaticAssignment",
    name: "automaticAssignment",
    component: automaticAssignment,
  },
  {
    path: "/AdminComment",
    name: "AdminComment",
    component: AdminComment,
  },
  //User
  {
    path: "/topicBank",
    name: "topicBank",
    component: topicBank,
  },
  {
    path: "/infoUser",
    name: "infoUser",
    component: infoUser,
  },
  {
    path: "/topicBankUser",
    name: "topicBankUser",
    component: topicBankUser,
  },
  {
    path: "/lichGiangDay",
    name: "lichGiangDay",
    component: lichGiangDay,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Thêm guard để kiểm tra vai trò người dùng
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Danh sách các trang công khai không cần đăng nhập
  const publicPages = ["/", "/registed", "/admin/forgot-password"];
  const isPublicPage = publicPages.includes(to.path);

  if (to.path === "/" && token && user && user.role === "admin") {
    next({ path: "/admin" });
  } else if (to.path === "/" && token && user && user.role === "teacher") {
    next({ path: "/Home" });
  } else if (!isPublicPage && !token) {
    next({ path: "/" }); // Chuyển về trang login nếu chưa đăng nhập và không phải trang công khai
  } else {
    next();
  }
});

export default router;
