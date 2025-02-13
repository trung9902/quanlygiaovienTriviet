<template>
  <div v-if="isVisible" class="modal-backdrop">
    <div class="modal-box">
      <div class="modal-header">
        <h5>{{ modalTitle }}</h5>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="title">Tiêu đề</label>
            <input
              type="text"
              id="title"
              v-model="newsForm.title"
              placeholder="Nhập tiêu đề"
              required
            />
          </div>

          <div class="form-group">
            <label for="content">Nội dung</label>
            <textarea
              id="content"
              v-model="newsForm.content"
              rows="5"
              placeholder="Nhập nội dung"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label for="thumbnail">Ảnh đại diện</label>
            <input
              type="file"
              id="thumbnail"
              @change="handleFileUpload"
              accept="image/*"
            />
            <img
              v-if="thumbnailPreview"
              :src="thumbnailPreview"
              class="thumbnail-preview"
            />
          </div>
          <div class="form-group">
            <label for="document">Tài liệu đính kèm</label>
            <input
              type="file"
              id="document"
              @change="handleDocUpload"
              accept=".doc,.docx,.pdf"
            />
            <div v-if="newsForm.DocumentPath" class="document-preview">
              <i class="el-icon-document"></i>
              <span>{{ newsForm.tenTaiLieu }}</span>
              <button class="remove-btn" @click="clearDocInput">✕</button>
            </div>
          </div>
          <div class="form-group">
            <label for="categoryId">Danh mục</label>
            <select id="categoryId" v-model="newsForm.categoryId" required>
              <option value="">Chọn danh mục</option>
              <option
                v-for="category in allCategories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="newsForm.status" />
              Hiển thị
            </label>
          </div>

          <div class="modal-footer">
            <button type="submit" class="btn btn-primary">
              {{ modalButtonText }}
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="$emit('close')"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  props: {
    isVisible: { type: Boolean, required: true },
    modalTitle: { type: String, required: true },
    modalButtonText: { type: String, required: true },
  },
  data() {
    return {
      newsForm: {
        title: "",
        content: "",
        author: "Admin", // Mặc định là "Admin"
        publishedDate: new Date().toISOString(),
        status: true,
        thumbnail: null, // Sử dụng null thay vì chuỗi rỗng
        slug: "",
        categoryId: null,
        DocumentPath: null,
        tenTaiLieu: "",
        documentPreview: null, // Đường dẫn xem trước tài liệu
      },
      thumbnailPreview: null, // Đường dẫn xem trước ảnh
    };
  },
  methods: {
    // Xử lý khi người dùng chọn file ảnh
    handleFileUpload(event) {
      const file = event.target.files[0]; // Lấy file đầu tiên từ input
      if (file) {
        this.newsForm.thumbnail = file; // Lưu file vào newsForm.thumbnail

        // Tạo URL tạm thời để xem trước ảnh
        const reader = new FileReader();
        reader.onload = (e) => {
          this.thumbnailPreview = e.target.result; // Cập nhật đường dẫn ảnh xem trước
        };
        reader.readAsDataURL(file); // Đọc file dưới dạng base64
      }
    },
    handleDocUpload(event) {
      const file = event.target.files[0]; // Lấy file được chọn
      if (!file) return;

      // Kiểm tra định dạng file
      const loaiFileDuocChapNhan = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!loaiFileDuocChapNhan.includes(file.type)) {
        this.$message.error("Chỉ chấp nhận file PDF hoặc Word");
        return;
      }

      // Lưu file vào form
      this.newsForm.DocumentPath = file;
      this.newsForm.tenTaiLieu = file.name; // Lưu tên file để hiển thị

      // Tạo preview nếu là file PDF
      if (file.type === "application/pdf") {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.documentPreview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    // Hàm xóa tài liệu
    clearDocInput() {
      this.newsForm.DocumentPath = null;
      this.newsForm.tenTaiLieu = "";
      this.documentPreview = null;
    },

    // Xử lý khi form được submit
    async submitForm() {
      if (!this.newsForm.title) {
        alert("Vui lòng nhập tiêu đề");
        return;
      }

      if (!this.newsForm.content) {
        alert("Vui lòng nhập nội dung");
        return;
      }

      try {
        // Tạo đối tượng FormData
        const formData = new FormData();

        // Thêm các trường dữ liệu vào FormData
        formData.append("Title", this.newsForm.title);
        formData.append("Content", this.newsForm.content);
        formData.append("Author", this.newsForm.author);
        formData.append("PublishedDate", this.newsForm.publishedDate);
        formData.append("Status", this.newsForm.status);
        formData.append("CategoryId", this.newsForm.categoryId);
        formData.append("document", this.newsForm.DocumentPath);

        // Thêm file ảnh vào FormData (nếu có)

        formData.append("image", this.newsForm.thumbnail);

        console.log([...formData]);
        // Gửi yêu cầu POST với FormData
        const result = await this.$store.dispatch("addNews", formData);

        if (result.success) {
          alert("Tạo tin tức thành công");
          this.$emit("close");
          window.location.reload(); // Tải lại trang để cập nhật dữ liệu
        }
      } catch (error) {
        console.error("Lỗi:", error);
        alert("Tạo tin tức thất bại");
      }
    },

    // Tạo slug từ tiêu đề
    generateSlug(title) {
      return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    },

    // Xóa ảnh xem trước
    clearFileInput() {
      this.thumbnailPreview = null;
      this.newsForm.thumbnail = null;
    },
  },
  computed: {
    ...mapGetters(["allCategories"]), // Lấy danh sách danh mục từ Vuex
  },
  async mounted() {
    // Fetch danh sách danh mục khi component được mount
    await this.$store.dispatch("getCategories");
  },
};
</script>
<style lang="scss" scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  overflow: auto;
}

.modal-box {
  background: white;
  border-radius: 20px;
  width: 650px;
  padding: 35px;
  margin-top: 10vh;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.form-group {
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    text-align: start;
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;

    &:focus {
      outline: none;
      border-color: #4caf50;
    }
  }
}

.thumbnail-preview {
  max-width: 200px;
  margin-top: 10px;
  border-radius: 4px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;

  input[type="checkbox"] {
    width: auto;
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;

  .btn {
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;

    &.btn-primary {
      background: #4caf50;
      color: white;
      border: none;
    }

    &.btn-secondary {
      background: white;
      border: 1px solid #ddd;
    }
  }
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ddd;

  h5 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 5px;
    color: #666;
    transition: color 0.2s;

    &:hover {
      color: #000;
    }
  }
}
.document-preview {
  display: flex;
  align-items: center;
  margin-top: 10px;
  padding: 8px;
  background: #f5f7fa;
  border-radius: 4px;

  i {
    font-size: 20px;
    margin-right: 8px;
    color: #409eff;
  }

  .remove-btn {
    margin-left: auto;
    border: none;
    background: none;
    color: #f56c6c;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
