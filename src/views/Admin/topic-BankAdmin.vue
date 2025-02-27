<template>
  <div class="topic-bank-admin">
    <navbar />
    <div class="topic-container_box">
      <div class="topic-container">
        <h1>Ngân hàng đề</h1>
        <button class="btn btn-create" @click="openModal">Thêm đề</button>
        <table class="table-topic">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên đề</th>
              <th>Môn học</th>
              <th>Lớp</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="topic in paginatedItems" :key="topic.id">
              <td>{{ topic.id }}</td>
              <td>{{ topic.title }}</td>
              <td>{{ topic.subject }}</td>
              <td>{{ topic.classsub }}</td>
              <td>{{ formatDate(topic.createdAt) }}</td>
              <td class="action-box">
                <button class="btn btn-delete" @click="deleteTopic(topic.id)">
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Nút phân trang -->
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

        <!-- Modal Component -->
        <ModalCreateExam ref="createExamModal" />
        <ModalEditExam
          v-if="showModalEdit"
          :isOpen="showModalEdit"
          :examData="editingTopic"
          @close="closeModal"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import Navbar from "@/components/navbar.vue";
import ModalCreateExam from "@/components/modalExam/modalCreateExam.vue";
import ModalEditExam from "@/components/modalExam/modalEditExam.vue";

export default {
  data() {
    return {
      editedTopic: {},
      isModalVisible: false, // Trạng thái modal
      currentPage: 1, // Trang hiện tại
      itemsPerPage: 5, // Số lượng item trên mỗi trang
      showModal: false,
      showModalCreate: false,
      showModalEdit: false, // Trạng thái modal chỉnh sửa
      topicForm: {
        name: "",
        subject: "",
        grade: "",
        createdAt: "",
      },
      editingTopic: null, // Chứa thông tin đề đang sửa
    };
  },
  components: {
    Navbar,
    ModalCreateExam,
    ModalEditExam,
  },
  computed: {
    ...mapGetters(["allExames"]), // Dữ liệu đề từ Vuex
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.allExames.slice(start, end); // Cắt danh sách theo số trang
    },
    totalPages() {
      return Math.ceil(this.allExames.length / this.itemsPerPage); // Tổng số trang
    },
    pageNumbers() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1); // Tạo danh sách số trang
    },
  },
  methods: {
    ...mapActions(["deleteExame"]),
    topics() {
      return this.$store.getters.allTopics; // Lấy danh sách đề từ Vuex
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page; // Cập nhật trang hiện tại
      }
    },
    openModal() {
      this.$refs.createExamModal.isOpen = true;
    },
    openEditModal(topic) {
      console.log(topic);

      this.editingTopic = { ...topic }; // Sao chép dữ liệu của đề vào editingTopic
      this.showModalEdit = true;
    },
    closeModal() {
      this.showModal = false;
      this.showModalCreate = false;
      this.showModalEdit = false;
    },
    editTopic(topic) {
      console.log("Sửa đề với ID:", topic.id);
      console.log(topic);

      if (!topic.id) {
        console.error("ID đề không hợp lệ.");
        alert("ID đề không hợp lệ.");
        return;
      }
      this.editedTopic = { ...topic }; // Sao chép dữ liệu của đề vào editedTopic
      this.modalTitle = "Sửa đề";
      this.modalButtonText = "Sửa";
      this.showModal = true;
    },
    async deleteTopic(topicId) {
      if (confirm("Bạn có chắc chắn muốn xóa đề này không?")) {
        try {
          const result = await this.deleteExame(topicId);
          if (result.success) {
            alert("Xóa đề thành công!");
            // Cập nhật lại danh sách sau khi xóa
            await this.$store.dispatch("getExam");
          } else {
            alert("Có lỗi xảy ra khi xóa đề!");
          }
        } catch (error) {
          console.error("Lỗi khi xóa đề:", error);
          alert("Có lỗi xảy ra khi xóa đề!");
        }
      }
    },
    async handleSubmitForm(topicData) {
      console.log("Dữ liệu đề:", topicData);

      try {
        const result = await this.$store.dispatch("updateTopic", {
          id: topicData.id,
          topicData, // Dữ liệu đề
        });

        if (result.success) {
          this.$store.dispatch("getTopics");
          alert("Cập nhật thành công.");
        } else {
          alert(result.message || "Cập nhật thất bại.");
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
        alert("Có lỗi xảy ra khi cập nhật đề.");
      }

      this.closeModal();
    },
    formatDate(date) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(date).toLocaleDateString("vi-VN", options);
    },
  },
  mounted() {
    this.$store.dispatch("getExam"); // Gọi action getTopics để lấy dữ liệu
    console.log(this.allTopics); // Log dữ liệu allTopics ra console
  },
};
</script>
<style scoped lang="scss">
.topic-container_box {
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
}

.btn:hover {
  transform: scale(1.08);
  filter: brightness(1.1);
}

.table-topic {
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

.topic-bank-admin {
  display: flex;
  background-color: #ffffff;
  min-height: 100vh;
}

.topic-container {
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
