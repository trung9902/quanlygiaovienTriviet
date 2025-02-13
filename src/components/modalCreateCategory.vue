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
            <label for="name">Tên danh mục</label>
            <input
              type="text"
              id="name"
              v-model="categoryForm.name"
              placeholder="Nhập tên danh mục"
              required
            />
          </div>
          <div class="form-group">
            <label for="description">Mô tả</label>
            <textarea
              id="description"
              v-model="categoryForm.description"
              rows="3"
              placeholder="Nhập mô tả danh mục"
            ></textarea>
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
export default {
  props: {
    isVisible: { type: Boolean, required: true },
    modalTitle: { type: String, required: true },
    modalButtonText: { type: String, required: true },
  },
  data() {
    return {
      categoryForm: {
        name: "",
        description: "",
        slug: "",
      },
    };
  },
  methods: {
    async submitForm() {
      if (!this.categoryForm.name) {
        alert("Vui lòng nhập tên danh mục");
        return;
      }

      // Auto-generate slug if empty
      if (!this.categoryForm.slug) {
        this.categoryForm.slug = this.generateSlug(this.categoryForm.name);
      }

      try {
        const result = await this.$store.dispatch("addCategory", {
          name: this.categoryForm.name,
          slug: this.categoryForm.slug,
          description: this.categoryForm.description,
        });

        if (result.success) {
          alert("Tạo danh mục thành công");
          this.$emit("close");
          window.location.reload();
        }
      } catch (error) {
        alert("Tạo danh mục thất bại");
      }
    },
    generateSlug(name) {
      return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    },
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
  background: rgba(0, 0, 0, 0.7); // Tăng độ mờ của backdrop
  backdrop-filter: blur(6px); // Tăng hiệu ứng blur
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  .modal-box {
    background: white;
    border-radius: 20px; // Tăng border radius
    width: 600px; // Tăng chiều rộng một chút
    padding: 35px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    transform: translateY(0);
    animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #eef2f7;
      padding-bottom: 20px;

      h5 {
        font-size: 1.6rem;
        font-weight: 700;
        margin: 0;
        color: #1a1a1a;
        background: linear-gradient(45deg, #2c3e50, #3498db);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .close-btn {
        background: #f8f9fa;
        border: none;
        border-radius: 12px;
        width: 38px;
        height: 38px;
        font-size: 20px;
        color: #666;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: #ff6b6b;
          color: white;
          transform: rotate(90deg) scale(1.1);
        }
      }
    }

    .form-group {
      margin-bottom: 28px;

      label {
        display: block;
        margin-bottom: 12px;
        font-weight: 600;
        color: #2c3e50;
        font-size: 1rem;
        letter-spacing: 0.3px;
        text-align: left;
      }

      input,
      textarea {
        width: 100%;
        padding: 14px 18px;
        border: 2px solid #e8e8e8;
        border-radius: 12px;
        font-size: 16px;
        transition: all 0.3s ease;
        background: #f8f9fa;

        &:focus {
          outline: none;
          border-color: #3498db;
          background: white;
          box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.15);
        }

        &::placeholder {
          color: #aab2bd;
          font-size: 0.95rem;
        }
      }

      textarea {
        resize: none;
        min-height: 140px;
      }
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      margin-top: 35px;

      .btn {
        padding: 14px 28px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;

        &.btn-primary {
          background: linear-gradient(145deg, #3498db, #2980b9);
          color: white;
          border: none;
          box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);

          &:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 8px 25px rgba(52, 152, 219, 0.4);
            background: linear-gradient(145deg, #3498db, #2475a7);
          }

          &:active {
            transform: translateY(0);
          }
        }

        &.btn-secondary {
          background: white;
          color: #2c3e50;
          border: 2px solid #e8e8e8;

          &:hover {
            background: #f8f9fa;
            border-color: #d1d1d1;
            transform: translateY(-2px);
          }
        }
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
