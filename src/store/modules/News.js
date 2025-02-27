import axios from "@/axios";

export default {
  state: {
    News: [],
    categories: [],
    comment: [],
  },
  mutations: {
    setCategories: (state, categories) => (state.categories = categories),
    ađCategory: (state, category) => state.categories.push(category),
    updateCategory: (state, updatedCategory) => {
      const index = state.categories.findIndex(
        (category) => category.id === updatedCategory.id
      );
      if (index !== -1) {
        state.categories.splice(index, 1, updatedCategory);
      }
    },
    setDeleteCategory: (state, id) => {
      state.categories = state.categories.filter(
        (category) => category.id !== id
      );
    },
    setNews: (state, News) => (state.News = News),
    addNews: (state, News) => state.News.push(News),
    updateNews: (state, updatedNews) => {
      const index = state.News.findIndex((News) => News.id === updatedNews.id);
      if (index !== -1) {
        state.News.splice(index, 1, updatedNews);
      }
    },
    setDeleteNews: (state, id) => {
      state.News = state.News.filter((News) => News.id !== id);
    },
    getComment: (state, comment) => state.comment.push(comment),
    addComment: (state, { newsId, comment }) => {
      if (!state.comment) {
        state.comment = {}; // Đảm bảo state.comment tồn tại
      }
      if (!state.comment[newsId]) {
        state.comment[newsId] = [];
      }
      state.comment[newsId].push(comment);
    },
  },
  getters: {
    allNews: (state) => state.News,
    allCategories: (state) => state.categories,
    allComment: (state) => (newsId) => {
      return state.comment[newsId] || [];
    },
  },
  actions: {
    async getCommentByNews({ commit }, id) {
      try {
        const response = await axios.get("/api/Comments/news/" + id);
        console.log("API Response:", response.data); // Kiểm tra dữ liệu trả về từ API

        if (response.data.success) {
          commit("getComment", response.data.comment); // Lưu dữ liệu vào Vuex
        }
      } catch (error) {
        console.error("Không thể lấy bình luận", error);
      }
    },
    async addComment({ commit }, { newsId, content, author }) {
      try {
        const response = await axios.post("/api/Comments", {
          content,
          author,
          newsId,
          createdAt: new Date().toISOString(),
        });
        commit("addComment", { newsId, comment: response.data });
      } catch (error) {
        console.error("Không thể thêm bình luận", error);
      }
    },
    async getCategories({ commit }) {
      try {
        const res = await axios.get("/api/Category");
        commit("setCategories", res.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    },
    async addCategory({ commit }, category) {
      try {
        const res = await axios.post("/api/Category", category);
        commit("addCategory", res.data);
        return { success: true };
      } catch (error) {
        console.error("Lỗi khi thêm danh mục:", error);
        return { success: false };
      }
    },
    async updateCategory({ commit }, category) {
      try {
        const res = await axios.patch(`/api/Category/${category.id}`, category);
        commit("updateCategory", res.data);
      } catch (error) {
        console.error("Lỗi khi cập nhật danh mục:", error);
      }
    },
    async deleteCategory({ commit }, id) {
      try {
        await axios.delete(`/api/Category/${id}`);
        commit("setDeleteCategory", id);
      } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
      }
    },
    async getNews({ commit }) {
      try {
        const res = await axios.get("/api/News");
        commit("setNews", res.data);
      } catch (error) {
        console.error("Lỗi khi lấy tin tức:", error);
      }
    },

    async addNews({ commit }, formData) {
      try {
        const res = await axios.post("/api/News", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Đặt header là multipart/form-data
          },
        });

        if (res.data) {
          commit("addNews", res.data);
          return {
            success: true,
            data: res.data,
          };
        }

        return {
          success: false,
          message: "Thêm tin tức thất bại",
        };
      } catch (error) {
        console.log(
          "Lỗi:",
          error.response ? error.response.data : error.message
        );
        throw error;
      }
    },
    async updateNews({ commit }, News) {
      try {
        const res = await axios.patch(`/api/News/${News.id}`, News);
        commit("updateNews", res.data);
      } catch (error) {
        console.error("Lỗi khi cập nhật tin tức:", error);
      }
    },

    async deleteNews({ commit }, id) {
      try {
        await axios.delete(`/api/News/${id}`);
        commit("setDeleteNews", id);
      } catch (error) {
        console.error("Lỗi khi xóa tin tức:", error);
      }
    },
  },
};
