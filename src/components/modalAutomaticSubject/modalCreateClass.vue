<template>
  <div class="modal-overlay" v-if="visible" @click.self="handleCancel">
    <div class="modal-container">
      <div class="modal-header">
        <h2>Thêm Lớp học</h2>
        <button class="close-button" @click="handleCancel">&times;</button>
      </div>

      <div class="modal-body">
        <a-form :model="formState" :rules="rules" ref="formRef">
          <div class="form-group">
            <label for="className">Tên lớp học</label>
            <input
              type="text"
              id="className"
              v-model="formState.name"
              placeholder="Nhập tên Lớp học"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label for="level">Khối lớp</label>
            <select id="level" v-model="formState.level" class="form-input">
              <option value="">Chọn khối lớp</option>
              <option value="10">Khối 10</option>
              <option value="11">Khối 11</option>
              <option value="12">Khối 12</option>
            </select>
          </div>
          <div class="form-group">
            <label for="type">Loại lớp</label>
            <select id="type" v-model="formState.type" class="form-input">
              <option value="">Chọn loại lớp</option>
              <option v-for="type in typeOptions" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>
        </a-form>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="handleCancel">Hủy</button>
        <button class="btn btn-primary" @click="handleOk" :disabled="loading">
          {{ loading ? "Đang xử lý..." : "Thêm lớp học" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "ModalCreateClass",
  props: {
    visible: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      formState: {
        name: "",
        level: "",
        type: "",
      },
      typeOptions: [
        "Ban TN",
        "Ban KHXH",
        "Ban XH",
        "Ban TN (Khối A)",
        "Ban TN (Khối A1)",
      ],
      rules: {
        name: [
          {
            required: true,
            message: "Vui lòng nhập tên lớp học",
            trigger: "blur",
          },
        ],
        level: [
          {
            required: true,
            message: "Vui lòng chọn khối lớp",
            trigger: "change",
          },
        ],
        type: [
          {
            required: true,
            message: "Vui lòng chọn loại lớp",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    ...mapActions(["addClass"]),
    async handleOk() {
      try {
        const result = await this.addClass({
          name: this.formState.name,
          level: this.formState.level,
          type: this.formState.type,
        });
        if (result.success) {
          alert("Tạo lớp thành công");
          this.$emit("close");
          window.location.reload();
        }
      } catch (error) {
        alert("Tạo lớp học thất bại");
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.form-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 5px;
}

.modal-footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background-color: #1890ff;
  color: white;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: rgba(0, 0, 0, 0.65);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
