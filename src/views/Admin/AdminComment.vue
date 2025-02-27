<template>
  <div class="admin-comments">
    <navbar />
    <div class="comments-container_box">
      <div class="comments-container">
        <h1>Quản lý bình luận</h1>
        <table class="table-comments">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nội dung</th>
              <th>Tác giả</th>
              <th>Ngày tạo</th>
              <th>ID Tin tức</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="comment in paginatedItems" :key="comment.id">
              <td>{{ comment.id }}</td>
              <td>{{ comment.content }}</td>
              <td>{{ comment.author }}</td>
              <td>{{ formatDate(comment.createdAt) }}</td>
              <td>{{ comment.newsId }}</td>
              <td class="action-box">
                <button
                  class="btn btn-delete"
                  @click="deleteComment(comment.id)"
                >
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Navbar from "@/components/navbar.vue";
import { Store } from "vuex";

export default {
  data() {
    return {
      editedComment: {},
      isModalVisible: false, // Trạng thái modal
      currentPage: 1, // Trang hiện tại
      itemsPerPage: 5, // Số lượng item trên mỗi trang
      showModal: false,
      showModalCreate: false,
      commentForm: {
        content: "",
        author: "",
        newsId: null,
      },
      editingComment: null, // Chứa thông tin bình luận đang sửa
    };
  },
  components: {
    Navbar,
    // modalEditComment,
    // modalCreateComment,
  },
  computed: {
    ...mapGetters(["allCommentAdmin"]), // Dữ liệu bình luận từ Vuex
    paginatedItems() {
      if (!this.allCommentAdmin || !this.allCommentAdmin.comments) {
        return [];
      }
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      const paginated = [];
      for (
        let i = start;
        i < end && i < this.allCommentAdmin.comments.length;
        i++
      ) {
        paginated.push(this.allCommentAdmin.comments[i]);
      }
      return paginated; // Trả về danh sách đã phân trang
    },
    totalPages() {
      if (!this.allCommentAdmin || !this.allCommentAdmin.comments) {
        return 0;
      }
      return Math.ceil(
        this.allCommentAdmin.comments.length / this.itemsPerPage
      ); // Tổng số trang
    },
    pageNumbers() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1); // Tạo danh sách số trang
    },
  },
  methods: {
    ...mapActions(["getCommentAdmin", "deleteCommentAdmin"]),
    comments() {
      return this.$store.getters.allCommentAdmin; // Lấy danh sách bình luận từ Vuex
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page; // Cập nhật trang hiện tại
      }
    },
    openModal() {
      this.commentForm.content = "";
      this.commentForm.author = "";
      this.commentForm.newsId = null;
      this.modalTitle = "Thêm bình luận";
      this.modalButtonText = "Thêm";
      this.editingComment = null;
      this.showModalCreate = true;
    },
    closeModal() {
      this.showModal = false;
      this.showModalCreate = false;
    },
    editComment(comment) {
      console.log("Sửa bình luận với ID:", comment.id);
      console.log(comment);

      if (!comment.id) {
        console.error("ID bình luận không hợp lệ.");
        alert("ID bình luận không hợp lệ.");
        return;
      }
      this.editedComment = { ...comment }; // Sao chép dữ liệu của bình luận vào editedComment
      this.modalTitle = "Sửa bình luận";
      this.modalButtonText = "Sửa";
      this.showModal = true;
    },
    async deleteComment(commentId) {
      if (confirm("Bạn có chắc chắn muốn xóa bình luận này không?")) {
        try {
          const result = await this.deleteCommentAdmin(commentId);
          if (result.success) {
            alert("Xóa đề thành công!");
            Store.dispatch("getCommentAdmin");
            // Cập nhật lại danh sách sau khi xóa
          } else {
            alert("Có lỗi xảy ra khi xóa bình luận!");
          }
        } catch (error) {
          console.error("Lỗi khi xóa bình luận:", error);
          alert("Có lỗi xảy ra khi xóa bình luận!");
        }
      }
    },
    async handleSubmitForm(commentData) {
      console.log("Dữ liệu bình luận:", commentData);

      try {
        const result = await this.$store.dispatch("updateComment", {
          id: commentData.id,
          commentData, // Dữ liệu bình luận
        });

        if (result.success) {
          this.$store.dispatch("getComments");
          alert("Cập nhật thành công.");
        } else {
          alert(result.message || "Cập nhật thất bại.");
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
        alert("Có lỗi xảy ra khi cập nhật bình luận.");
      }

      this.closeModal();
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("vi-VN");
    },
  },
  mounted() {
    this.getCommentAdmin(); // Lấy dữ liệu bình luận từ Vuex
    console.log("allCommentAdmin on mounted:", this.allCommentAdmin); // Log dữ liệu allCommentAdmin khi mounted
  },
};
</script>

<style scoped lang="scss">
.comments-container_box {
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

.btn-edit {
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
  width: 100%;
}

.btn:hover {
  transform: scale(1.08);
  filter: brightness(1.1);
}

.table-comments {
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

.admin-comments {
  display: flex;
  background-color: #ffffff;
  min-height: 100vh;
}

.comments-container {
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
