<!-- src/views/AdminUsers.vue -->
<template>
  <div class="admin-users">
    <navbar />
    <div class="users-container_box">
      <div class="Users-container">
        <h1>Quản lý Tin tức & Hoạt động</h1>
        <button class="btn btn-create" @click="openModal">Thêm tin tức</button>
        <table class="table-Users">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Tác giả</th>
              <th>Ngày đăng</th>
              <th>Trạng thái</th>
              <th>Danh mục</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="news in paginatedItems" :key="news.id">
              <td>{{ news.id }}</td>
              <td>{{ news.title }}</td>
              <td>{{ news.author }}</td>
              <td>{{ new Date(news.publishedDate).toLocaleDateString() }}</td>
              <td>{{ news.status ? "Hoạt động" : "Ẩn" }}</td>
              <td>{{ news.categoryId }}</td>
              <td class="action-box">
                <button class="btn btn-Edit" @click="editNews(news)">
                  Sửa
                </button>
                <button class="btn btn-delete" @click="deleteNews(news.id)">
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Modal Component -->
        <modalEditNews
          :isVisible="showModal"
          :modalTitle="modalTitle"
          :modalButtonText="modalButtonText"
          :news="editedNews"
          @close="closeModal"
          @submit="handleSubmitForm"
        />
        <modalCreateNews
          :isVisible="showModalCreate"
          :modalTitle="modalTitle"
          :modalButtonText="modalButtonText"
          @close="closeModal"
        />
        <div class="pagination">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
          >
            <i class="fa-solid fa-angle-left"></i>
          </button>
          <button
            v-for="page in pageNumbers"
            :key="page"
            @click="changePage(page)"
            :class="{ active: currentPage === page }"
          >
            {{ page }}
          </button>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
          >
            <i class="fa-solid fa-angle-right"></i>
          </button>
        </div>
      </div>
      <!-- Keep pagination section unchanged -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import navbar from "@/components/navbar.vue";
import modalCreateNews from "@/components/modalNews/modalNewCreate.vue";
import modalEditNews from "@/components/modalNews/modalNewEdit.vue";
export default {
  data() {
    return {
      editedNews: {},
      currentPage: 1,
      itemsPerPage: 5,
      showModal: false,
      showModalCreate: false,
      newsForm: {
        title: "",
        content: "",
        author: "",
        publishedDate: new Date(),
        status: true,
        thumbnail: "",
        slug: "",
        categoryId: null,
      },
      editingNews: null,
    };
  },
  components: {
    navbar,
    modalCreateNews,
    modalEditNews,
  },
  computed: {
    ...mapGetters(["allNews"]), // Make sure to update Vuex getter name
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.allNews.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.allNews.length / this.itemsPerPage);
    },
    pageNumbers() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    },
  },
  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page; // Cập nhật trang hiện tại
      }
    },
    openModal() {
      this.newsForm.title = "";
      this.newsForm.content = "";
      this.newsForm.author = "";
      this.newsForm.publishedDate = new Date();
      this.newsForm.status = true;
      this.newsForm.thumbnail = "";
      this.newsForm.slug = "";
      this.newsForm.categoryId = null;
      this.modalTitle = "Thêm tin tức";
      this.modalButtonText = "Thêm";
      this.showModalCreate = true;
    },
    closeModal() {
      this.showModal = false;
      this.showModalCreate = false;
    },
    editNews(news) {
      if (!news.id) {
        console.error("ID tin tức không hợp lệ.");
        return;
      }
      this.editedNews = { ...news };
      this.modalTitle = "Sửa tin tức";
      this.modalButtonText = "Cập nhật";
      this.showModal = true;
    },
    deleteNews(newsId) {
      this.$store.dispatch("deleteNews", newsId);
    },
    async handleSubmitForm(newsData) {
      try {
        const result = await this.$store.dispatch("updateNews", {
          id: newsData.id,
          newsData,
        });
        if (result.success) {
          this.$store.dispatch("getNews");
          alert("Cập nhật thành công.");
        } else {
          alert(result.message || "Cập nhật thất bại.");
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
        alert("Có lỗi xảy ra khi cập nhật tin tức.");
      }
      this.closeModal();
    },
  },
  mounted() {
    this.$store.dispatch("getNews");
  },
};
</script>
<style scoped lang="scss">
.users-container_box {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  padding-top: 20px;
  background-color: #f9fafc;
  border-radius: 8px;
  width: 100vw;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.action-box {
  display: flex;
  gap: 10px;
}

.btn-Edit {
  background-color: #28a745;
  color: white;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-create {
  background-color: #007bff;
  color: white;
}

.btn {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: scale(1.08);
  filter: brightness(1.1);
}

.table-Users {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

th,
td {
  padding: 12px 16px;
  text-align: center;
}

th {
  background-color: #007bff;
  color: #ffffff;
  text-transform: uppercase;
  font-weight: 600;
}

td {
  background-color: #ffffff;
  color: #333333;
}

td:nth-child(even) {
  background-color: #f8f9fa;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  gap: 10px;
}

.pagination button {
  background-color: #f8f9fa;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  font-size: 14px;
  font-weight: 500;
  color: #007bff;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.pagination button.active {
  background-color: #007bff;
  color: white;
}

.pagination button:hover:not(.active) {
  background-color: #e2e6ea;
  transform: scale(1.1);
}

.pagination button:disabled {
  background-color: #d6d8db;
  cursor: not-allowed;
  opacity: 0.7;
}

.admin-users {
  display: flex;
  background-color: #ffffff;
  min-height: 100vh;
}

.Users-container {
  width: 90%;
  max-width: 1200px;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #333333;
}
</style>
