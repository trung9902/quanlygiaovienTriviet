<!-- src/views/AdminUsers.vue -->
<template>
  <div class="admin-users">
    <navbar />
    <div class="users-container_box">
      <div class="Users-container">
        <h1>Giáo viên</h1>
        <table class="table-Users">
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ Tên</th>
              <th>Giới Tính</th>
              <th>Ngày Sinh</th>
              <th>SĐT</th>
              <th>Email</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(teacher, index) in paginatedItems"
              :key="teacher.maGiaoVien"
            >
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ teacher.hoTen }}</td>
              <td>
                {{
                  teacher.gioiTinh === 1
                    ? "Nam"
                    : teacher.gioiTinh === 0
                    ? "Nữ"
                    : "Không xác định"
                }}
              </td>
              <td>{{ teacher.ngaySinh || "Chưa cập nhật" }}</td>
              <td>{{ teacher.sdt || "Chưa cập nhật" }}</td>
              <td>{{ teacher.email || "Chưa cập nhật" }}</td>
              <td>{{ teacher.trangThai || "Chưa cập nhật" }}</td>
              <td class="action-box">
                <button class="btn btn-Edit" @click="editUser(teacher)">
                  Sửa
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Nút phân trang -->

        <!-- Modal Component -->
        <ModalEdit
          :isVisible="showModal"
          :modalTitle="modalTitle"
          :modalButtonText="modalButtonText"
          :userForm="userForm"
          @close="closeModal"
          @submit="handleSubmitForm"
        />
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
import { mapGetters, mapActions } from "vuex";
import Navbar from "@/components/navbar.vue";
import ModalEdit from "@/components/modalEditUser.vue";

export default {
  data() {
    return {
      currentPage: 1, // Trang hiện tại
      itemsPerPage: 3, // Số lượng item trên mỗi trang
      showModal: false,
      userForm: {
        username: "",
        email: "",
      },
      modalTitle: "Thêm người dùng", // Tiêu đề modal
      modalButtonText: "Thêm", // Nút modal
      editingUser: null, // Chứa thông tin người dùng đang sửa
    };
  },
  components: {
    Navbar,
    ModalEdit,
  },
  computed: {
    ...mapGetters(["allTeachers"]), // Dữ liệu người dùng từ Vuex
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.allTeachers.slice(start, end); // Cắt danh sách theo số trang
    },
    totalPages() {
      return Math.ceil(this.allTeachers.length / this.itemsPerPage); // Tổng số trang
    },
    pageNumbers() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1); // Tạo danh sách số trang
    },
  },
  methods: {
    ...mapActions(["getTeacher"]), // Lấy dữ liệu người dùng từ Vuex
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page; // Cập nhật trang hiện tại
      }
    },
    openModal() {
      this.userForm.username = "";
      this.userForm.email = "";
      this.modalTitle = "Thêm người dùng";
      this.modalButtonText = "Thêm";
      this.editingUser = null;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    editUser(user) {
      this.userForm.username = user.username;
      this.userForm.email = user.email;
      this.modalTitle = "Sửa người dùng";
      this.modalButtonText = "Sửa";
      this.editingUser = user;
      this.showModal = true;
    },
    deleteUser(userId) {
      console.log("Xóa tài khoản với ID:", userId);
    },
    handleSubmitForm(userForm) {
      if (this.editingUser) {
        console.log("Cập nhật người dùng:", userForm);
      } else {
        console.log("Thêm người dùng:", userForm);
      }
      this.closeModal(); // Đóng modal sau khi hoàn thành
    },
  },
  mounted() {
    this.getTeacher(); // Lấy dữ liệu người dùng từ Vuex
  },
};
</script>
<style scoped lang="scss">
.users-container_box {
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  padding-top: 20px;
  background-color: #f9fafc;
  border-radius: 8px;
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
