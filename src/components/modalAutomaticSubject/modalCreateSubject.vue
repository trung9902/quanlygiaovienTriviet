<template>
  <div class="modal-overlay" v-if="visible" @click.self="handleCancel">
    <div class="modal-container">
      <div class="modal-header">
        <h2>Thêm môn học mới</h2>
        <button class="close-button" @click="handleCancel">&times;</button>
      </div>

      <div class="modal-body">
        <a-form :model="formState" :rules="rules" ref="formRef">
          <div class="form-group">
            <label for="subjectName">Tên môn học</label>
            <input
              type="text"
              id="subjectName"
              v-model="formState.name"
              placeholder="Nhập tên môn học"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>Loại môn học</label>
            <div class="checkbox-group">
              <label
                v-for="type in typeOptions"
                :key="type"
                class="checkbox-label"
              >
                <input
                  type="checkbox"
                  :value="type"
                  v-model="formState.types"
                />
                {{ type }}
              </label>
            </div>
          </div>
        </a-form>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="handleCancel">Hủy</button>
        <button class="btn btn-primary" @click="handleOk" :disabled="loading">
          {{ loading ? "Đang xử lý..." : "Thêm môn học" }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "ModalCreateSubject",
  props: {
    visible: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      formState: {
        name: "",
        types: [], // Chứa danh sách các loại môn học được chọn
      },
      typeOptions: [
        "Bắt buộc 10-11",
        "Bắt buộc 12",
        "Ban TN",
        "Ban TN (Khối A)",
        "Ban TN (Khối A1)",
        "Ban KHXH",
        "Ban XH",
      ],
      rules: {
        name: [
          {
            required: true,
            message: "Vui lòng nhập tên môn học",
            trigger: "blur",
          },
        ],
        types: [
          {
            required: true,
            message: "Vui lòng chọn ít nhất một loại môn học",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    ...mapActions(["addSubject"]),
    async handleOk() {
      try {
        const result = await this.addSubject({
          name: this.formState.name,
          types: this.formState.types,
        });
        if (result.success) {
          alert("Thêm môn học thành công");
          this.$emit("close");
          window.location.reload();
        }
      } catch (error) {
        alert("Thêm môn học thất bại");
      }
    },
    handleCancel() {
      this.$emit("cancel");
    },
  },
};
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  text-align: left;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
  font-size: 1rem;
  cursor: pointer;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
