<!-- src/views/AdminCategories.vue -->
<template>
  <div class="admin-categories">
    <navbar />
    <div class="categories-container_box">
      <div class="Categories-container">
        <h1>Quản lý danh mục</h1>
        <button class="btn btn-create" @click="openModal">Thêm danh mục</button>
        <table class="table-Categories">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên danh mục</th>

              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in paginatedItems" :key="category.id">
              <td>{{ category.id }}</td>
              <td>{{ category.name }}</td>

              <td>{{ category.description }}</td>
              <td class="action-box">
                <button class="btn btn-Edit" @click="editCategory(category)">
                  Sửa
                </button>
                <button
                  class="btn btn-delete"
                  @click="deleteCategory(category.id)"
                >
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Modal Component -->
        <modalEditCategory
          :isVisible="showModal"
          :modalTitle="modalTitle"
          :modalButtonText="modalButtonText"
          :category="editedCategory"
          @close="closeModal"
          @submit="handleSubmitForm"
        />
        <modalCreateCategory
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
import modalEditCategory from "@/components/modalEditCategory.vue";
import modalCreateCategory from "@/components/modalCreateCategory.vue";

export default {
  data() {
    return {
      editedCategory: {},
      currentPage: 1,
      itemsPerPage: 5,
      showModal: false,
      showModalCreate: false,
      categoryForm: {
        name: "",
        description: "",
      },
      editingCategory: null,
    };
  },
  components: {
    Navbar,
    modalCreateCategory,
    modalEditCategory,
  },
  computed: {
    ...mapGetters(["allCategories"]),
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.allCategories.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.allCategories.length / this.itemsPerPage);
    },
    pageNumbers() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    },
  },
  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    openModal() {
      this.categoryForm.name = "";
      this.categoryForm.slug = "";
      this.categoryForm.description = "";
      this.modalTitle = "Thêm danh mục";
      this.modalButtonText = "Thêm";
      this.editingCategory = null;
      this.showModalCreate = true;
    },
    closeModal() {
      this.showModal = false;
      this.showModalCreate = false;
    },
    editCategory(category) {
      if (!category.id) {
        alert("ID danh mục không hợp lệ.");
        return;
      }
      this.editedCategory = { ...category };
      this.modalTitle = "Sửa danh mục";
      this.modalButtonText = "Sửa";
      this.showModal = true;
    },
    deleteCategory(categoryId) {
      this.$store.dispatch("deleteCategory", categoryId);
    },
    async handleSubmitForm(categoryData) {
      try {
        const result = await this.$store.dispatch("updateCategory", {
          id: categoryData.id,
          categoryData,
        });

        if (result.success) {
          this.$store.dispatch("getCategories");
          alert("Cập nhật thành công.");
        } else {
          alert(result.message || "Cập nhật thất bại.");
        }
      } catch (error) {
        alert("Có lỗi xảy ra khi cập nhật danh mục.");
      }
      this.closeModal();
    },
  },
  mounted() {
    this.$store.dispatch("getCategories");
  },
};
</script>

<style scoped lang="scss">
.categories-container_box {
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

.table-Categories {
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

.admin-categories {
  display: flex;
  background-color: #ffffff;
  min-height: 100vh;
}

.Categories-container {
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
