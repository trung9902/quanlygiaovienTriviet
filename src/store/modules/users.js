// store/modules/users.js
import axios from "@/axios";

export default {
  state: {
    Users: [],
  },
  getters: {
    allUsers: (state) => state.Users,
  },
  mutations: {
    setUsers: (state, Users) => (state.Users = Users),
    addUser: (state, user) => state.Users.push(user),
    updateUser: (state, updatedUser) => {
      const index = state.Users.findIndex((user) => user.id === updatedUser.id);
      if (index !== -1) {
        state.Users.splice(index, 1, updatedUser); // Thay thế user cũ bằng user mới
      }
    },
    setDeleteUser: (state, id) => {
      state.Users = state.Users.filter((user) => user.id !== id);
    },
  },
  actions: {
    async getUsers({ commit, router }) {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/Admin/get-users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        commit("setUsers", res.data);
      } catch (error) {
        console.error(
          "Lỗi API:",
          error.response ? error.response.data : error.message
        );
        if (error.response && error.response.status === 401) {
          commit("setToken", "");
          commit("setLoginStatus", false);
          router.push("/login");
        }
        throw error;
      }
    },

    async addUser(
      { commit, dispatch },
      { username, password, hoTen, email, sdt, role = "Teacher", subject }
    ) {
      try {
        const token = localStorage.getItem("token");
        if (!username || !password || !hoTen || !email || !sdt || !subject) {
          throw new Error("Vui lòng điền đầy đủ thông tin.");
        }

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(email)) {
          throw new Error("Định dạng email không hợp lệ.");
        }

        const response = await axios.post(
          "/api/Admin/add-user",
          {
            username,
            password,
            hoTen,
            email,
            sdt,
            role,
            subject,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        await dispatch("getUsers");

        return {
          success: true,
          message: "Thêm user thành công!",
          data: response.data,
        };
      } catch (error) {
        console.error(
          "Lỗi khi thêm user:",
          error.response?.data || error.message
        );
        if (error.response?.status === 401) {
          commit("setToken", "");
          commit("setLoginStatus", false);
        }
        throw {
          success: false,
          message: error.response?.data?.message || error.message,
        };
      }
    },
    async updateUser({ commit }, { id, userData }) {
      try {
        const token = localStorage.getItem("token");
        const url = `/api/Admin/update-user/${id}`; // Đường dẫn API
        const response = await axios.put(url, userData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          commit("updateUser", response.data); // Gọi mutation updateUser
          return { success: true, data: response.data };
        }
      } catch (error) {
        console.error(
          "Lỗi khi cập nhật người dùng:",
          error.response?.data || error.message
        );
        return {
          success: false,
          error: error.response?.data || "Đã xảy ra lỗi",
        };
      }
    },
    async deleteUser({ commit }, id) {
      try {
        // Gửi yêu cầu DELETE đến API
        const url = `/api/Admin/delete-user/${id}`;
        const response = await axios.delete(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Token:", localStorage.getItem("token"));

        // Nếu xóa thành công, commit mutation để cập nhật state
        if (response.status === 200) {
          commit("setDeleteUser", id);
          alert("xóa tài khoản thành công");
          window.location.reload();
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("xóa tài khoản thất bại");
      }
    },

    // Action cập nhật user
  },
};
