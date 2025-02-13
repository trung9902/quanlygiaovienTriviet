<!-- src/views/AdminUsers.vue -->
<template>
  <div class="admin-users">
    <navbar />
    <div class="users-container_box">
      <div class="Users-container">
        <h1>Quản lý tài khoản</h1>
        <button class="btn btn-create" @click="openModal">Thêm</button>
        <table class="table-Users">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên người dùng</th>
              <th>Email</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in paginatedItems" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td class="action-box">
                <button class="btn btn-Edit" @click="editUser(user)">
                  Sửa
                </button>
                <button class="btn btn-delete" @click="deleteUser(user.id)">
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Nút phân trang -->

        <!-- Modal Component -->
        <modalEditUser
          :isVisible="showModal"
          :modalTitle="modalTitle"
          :modalButtonText="modalButtonText"
          :user="editedUser"
          @close="closeModal"
          @submit="handleSubmitForm"
        />
        <modalCreateUser
          :isVisible="showModalCreate"
          :modalTitle="modalTitle"
          :modalButtonText="modalButtonText"
          @close="closeModal"
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
import { mapGetters } from "vuex";
import Navbar from "@/components/navbar.vue";
import modalEditUser from "@/components/modalEditUser.vue";
import modalCreateUser from "@/components/modalCreateUser.vue";

export default {
  data() {
    return {
      editedUser: {},
      isModalVisible: false, // Trạng thái modal
      currentPage: 1, // Trang hiện tại
      itemsPerPage: 5, // Số lượng item trên mỗi trang
      showModal: false,
      showModalCreate: false,
      userForm: {
        username: "",
        email: "",
      },
      editingUser: null, // Chứa thông tin người dùng đang sửa
    };
  },
  components: {
    Navbar,
    modalEditUser,
    modalCreateUser,
  },
  computed: {
    ...mapGetters(["allUsers"]), // Dữ liệu người dùng từ Vuex
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.allUsers.slice(start, end); // Cắt danh sách theo số trang
    },
    totalPages() {
      return Math.ceil(this.allUsers.length / this.itemsPerPage); // Tổng số trang
    },
    pageNumbers() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1); // Tạo danh sách số trang
    },
  },
  methods: {
    users() {
      return this.$store.getters.allUsers; // Lấy danh sách người dùng từ Vuex
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page; // Cập nhật trang hiện tại
      }
    },
    openModal() {
      this.userForm.username = "";
      this.userForm.email = "";
      this.modalTitle = "thêm người dùng";
      this.modalButtonText = "thêm";
      this.editingUser = null;
      this.showModalCreate = true;
    },
    closeModal() {
      this.showModal = false;
      this.showModalCreate = false;
    },
    editUser(user) {
      console.log("Sửa tài khoản với ID:", user.id);
      console.log(user);

      if (!user.id) {
        console.error("ID người dùng không hợp lệ.");
        alert("ID người dùng không hợp lệ.");
        return;
      }
      // console.log(user.id);
      this.editedUser = { ...user }; // Sao chép dữ liệu của người dùng vào editedUser
      this.modalTitle = "sửa người dùng";
      this.modalButtonText = "sửa";
      this.showModal = true;
    },
    deleteUser(userId) {
      this.$store.dispatch("deleteUser", userId);
    },
    async handleSubmitForm(userData) {
      console.log("Dữ liệu người dùng:", userData);

      try {
        const result = await this.$store.dispatch("updateUser", {
          id: userData.id,
          userData, // Dữ liệu người dùng
        });

        if (result.success) {
          this.$store.dispatch("getUsers");
          alert("Cập nhật thành công.");
        } else {
          alert(result.message || "Cập nhật thất bại.");
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
        alert("Có lỗi xảy ra khi cập nhật người dùng.");
      }

      this.closeModal();
    },
  },
  mounted() {
    this.$store.dispatch("getUsers"); // Gọi action getUsers để lấy dữ liệu
    console.log(this.allUsers); // Log dữ liệu allUsers ra console
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
