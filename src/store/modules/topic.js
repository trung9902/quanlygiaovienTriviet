import axios from "@/axios";

export default {
  state: {
    Exames: [],
  },
  mutations: {
    setExames: (state, Exames) => (state.Exames = Exames),
    addExame: (state, Exame) => state.Exames.push(Exame),
    updateExame: (state, updatedExame) => {
      const index = state.Exames.findIndex(
        (Exame) => Exame.id === updatedExame.id
      );
      if (index !== -1) {
        state.Exames.splice(index, 1, updatedExame);
      }
    },
    setDeleteExame: (state, id) => {
      state.Exames = state.Exames.filter((Exame) => Exame.id !== id);
    },
  },
  getters: {
    allExames: (state) => state.Exames,
    allExamesUser: (state, getters, rootState) => {
      // Lấy user từ rootState thay vì dùng getter
      const currentUser = rootState.auth.user;
      console.log("Current user from rootState:", currentUser);

      // Kiểm tra và lấy UserId
      const userId = parseInt(currentUser?.UserId);
      console.log("User ID:", userId);

      // Filter exams
      const filteredExams = state.Exames.filter((Exame) => {
        console.log("Exam CreatedBy:", Exame.createdBy);
        console.log("Comparing:", Exame.createdBy === userId);
        return Exame.createdBy === userId;
      });

      console.log("Filtered Exams:", filteredExams);
      return filteredExams;
    },
  },
  actions: {
    async getExam({ commit }) {
      try {
        const res = await axios.get("/api/Exam");
        commit("setExames", res.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        console.log(
          "Lỗi:",
          error.response ? error.response.data : error.message
        );
      }
    },
    async addExam({ commit }, formData) {
      try {
        const res = await axios.post("/api/Exam", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (res.data) {
          commit("addExame", res.data);
          return { success: true };
        }
      } catch (error) {
        console.error("Lỗi khi thêm danh mục:", error);
        console.log(
          "Lỗi:",
          error.response ? error.response.data : error.message
        );
        return { success: false };
      }
    },
    async updateExame({ commit }, formData) {
      console.log("Dữ liệu gửi API:", formData); // Kiểm tra dữ liệu gửi lên
      try {
        const res = await axios.patch(`/api/Exam/${formData.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Response từ API:", res); // Kiểm tra dữ liệu trả về
        if (res.data) {
          commit("updateExame", res.data);
          return { success: true };
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật danh mục:", error);
        console.log(
          "Lỗi:",
          error.response ? error.response.data : error.message
        );
        return { success: false };
      }
    },
    async deleteExame({ commit }, id) {
      try {
        await axios.delete(`/api/Exam/${id}`);
        commit("setDeleteExame", id);
        return { success: true };
      } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
        return { success: false };
      }
    },
    async downloadFile(_, id) {
      try {
        const response = await axios.get(`/api/Exam/DownloadFile/${id}`, {
          responseType: "blob",
        });
        console.log("Full response:", response); // Log toàn bộ response
        console.log("Headers:", response.headers); // Log headers
        // 🔹 Lấy headers từ response
        const contentDisposition = response.headers["content-disposition"];
        let fileName = "document.pdf"; // Mặc định nếu không lấy được tên file

        // 🔹 Trích xuất tên file từ `Content-Disposition`
        if (contentDisposition) {
          const matches = contentDisposition.match(/filename="(.+?)"/);
          if (matches && matches.length > 1) {
            fileName = matches[1];
          }
        }

        // 🔹 Tạo blob để tải file
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName; // Đặt tên file lấy từ API
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return { success: true };
      } catch (error) {
        console.error("Lỗi tải file:", error);
        return { success: false };
      }
    },
  },
};
