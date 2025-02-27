import axios from "@/axios";
export default {
  state: {
    commentAdmin: [],
  },
  mutations: {
    setCommentAdmin: (state, comment) => (state.commentAdmin = comment),
    setDeleteComment: (state, id) => {
      state.commentAdmin = state.commentAdmin.filter(
        (comment) => comment.id !== id
      );
    },
  },
  getters: {
    allCommentAdmin: (state) => state.commentAdmin,
  },
  actions: {
    async getCommentAdmin({ commit }) {
      try {
        const response = await axios.get("/api/Comments");
        console.log("API Response:", response.data); // Kiểm tra dữ liệu trả về từ API
        commit("setCommentAdmin", response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bình luận:", error);
      }
    },
    async deleteCommentAdmin({ commit }, id) {
      try {
        var response = await axios.delete(`/api/Comments/${id}`);
        if (response.data.success) {
          commit("setDeleteComment", id);
          return {
            success: true,
            message: "Đã xóa bình luận",
          };
        }
      } catch (error) {
        console.error("Lỗi khi xóa bình luận:", error);
        throw {
          success: false,
          message: error.response?.data?.message || error.message,
        };
      }
    },
  },
};
