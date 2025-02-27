// store/modules/auth.js
import axios from "@/axios";
import { jwtDecode } from "jwt-decode";
export default {
  state: {
    navbarCollapsed: false,
    token: localStorage.getItem("token") || "",
    isLoggedIn: !!localStorage.getItem("token"),
    otpSent: false,
    emailForReset: null,
    user: null,
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    isOtpSent: (state) => state.otpSent,
    getEmailForReset: (state) => state.emailForReset,
    getUser: (state) => state.user || {},
    getUserName: (state) => state.user?.name || "Người dùng",
    getUserID: (state) => {
      console.log("Current user state:", state.user); // Thêm log để debug
      return parseInt(state.user?.UserId, 10) || 0; // Thử với 'userId' thay vì 'UserId'
    },
  },
  mutations: {
    setNavbarCollapsed(state, collapsed) {
      state.navbarCollapsed = collapsed;
    },
    setToken: (state, token) => {
      if (token) {
        state.token = token;
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; // Gán token vào header của Axios
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded); // Kiểm tra nội dung token
        state.user = decoded;
        const meo = parseInt(state.user?.UserId, 10);
        console.log("meo:", meo);

        console.log("State user sau khi cập nhật:", state.user.name); // Kiểm tra state user
      } else {
        state.token = null;
        localStorage.removeItem("token");
      }
    },
    setUser(state, user) {
      state.user = user;
    },
    setLoginStatus: (state, status) => {
      state.isLoggedIn = status;
    },
    setOtpStatus: (state, status) => {
      state.otpSent = status;
    },
    setEmailForReset: (state, email) => {
      state.emailForReset = email;
    },
  },
  actions: {
    async login({ commit }, { username, password, router }) {
      try {
        const res = await axios.post("/api/login", { username, password });
        const { token, role } = res.data;

        commit("setToken", token);
        commit("setLoginStatus", true);

        if (role === "Admin") {
          router.push({ name: "AdminView" });
        } else if (role === "Teacher") {
          router.push({ name: "HomeView" });
        } else {
          console.warn("Role không hợp lệ:", role);
          router.push({ name: "login" });
        }

        return { success: true, message: "Đăng nhập thành công" };
      } catch (error) {
        console.error(
          "Lỗi khi đăng nhập:",
          error.response ? error.response.data : error.message
        );
        throw error;
      }
    },

    async register({ commit }, forndata) {
      try {
        const response = await axios.post("/api/register", forndata);

        commit("setLoginStatus", true);
        commit("setToken", response.data.token);
        localStorage.setItem("token", response.data.token);

        return { success: true, message: "Đăng ký thành công!" };
      } catch (error) {
        const message =
          error.response && error.response.data
            ? error.response.data.message
            : "Đăng ký thất bại. Vui lòng thử lại!";
        throw new Error(message);
      }
    },

    logout({ commit }, router) {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"]; // Xóa token khỏi header
        commit("setToken", "");
        commit("setLoginStatus", false);
        if (router) {
          router.push("/");
        } else {
          // Fallback nếu router không được cung cấp
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Lỗi khi đăng xuất:", error);
        throw error;
      }
    },
    async sendOtp({ commit }, email) {
      try {
        // Validate email before sending
        if (!email) {
          return {
            success: false,
            message: "Vui lòng nhập email",
          };
        }

        // Match API expected format
        const response = await axios.post(`/api/send-otp?email=${email}`);
        if (response.data.success) {
          commit("setOtpStatus", true);
          commit("setEmailForReset", email);
          return {
            success: true,
            message: "Đã gửi mã OTP thành công",
          };
        }

        return {
          success: false,
          message: response.data.message || "Không thể gửi mã OTP",
        };
      } catch (error) {
        // Handle validation errors specifically
        if (error.response?.status === 400 && error.response?.data?.errors) {
          const validationErrors = Object.values(
            error.response.data.errors
          ).flat();
          console.error("Lỗi validation:", validationErrors);
          return {
            success: false,
            message: validationErrors[0] || "Dữ liệu không hợp lệ",
          };
        }

        console.error("Chi tiết lỗi:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        commit("setOtpStatus", false);
        throw new Error("Không thể gửi mã OTP, vui lòng thử lại");
      }
    },

    async verifyOtp({ commit, state }, { otp, newPassword }) {
      try {
        const response = await axios.post(
          `/api/reset-password?email=${state.emailForReset}&otp=${otp}&newPassword=${newPassword}`
        );

        if (response.data.success) {
          commit("clearEmailForReset");
          return {
            success: true,
            message: "Password reset successfully",
          };
        }

        return {
          success: false,
          message: response.data.message || "Failed to reset password",
        };
      } catch (error) {
        return {
          success: false,
          message:
            error.response?.data?.message ||
            "An error occurred during password reset",
        };
      }
    },
  },
};
