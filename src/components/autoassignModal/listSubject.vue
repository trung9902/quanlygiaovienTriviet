<template>
  <a-modal
    :visible="visible"
    title="Danh sách môn học"
    @cancel="handleCancel"
    :footer="null"
    width="800px"
    :maskClosable="true"
    class="list-subject-modal"
  >
    <div class="subject-list-box">
      <div class="subject-list">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên môn học</th>
              <th>Số tiết/tuần</th>
              <th>Loại môn</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(subject, index) in subjects" :key="subject.id">
              <td>{{ index + 1 }}</td>
              <td>{{ subject.name }}</td>
              <td>{{ subject.soTiet }}</td>
              <td>
                <span :class="{ 'high-subject': isHighSubject(subject.name) }">
                  {{ isHighSubject(subject.name) ? "Môn chính" : "Môn phụ" }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button class="btn-close" @click="handleCancel">
          <i class="fas fa-times"></i> Đóng
        </button>
      </div>
    </div>
  </a-modal>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    subjects: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleCancel() {
      this.$emit("cancel");
    },
    isHighSubject(subjectName) {
      const highSubjects = ["Toán", "Văn", "Anh", "Lý", "Hóa"];
      return highSubjects.includes(subjectName);
    },
  },
};
</script>
<style lang="scss" scoped>
.list-subject-modal {
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
  .subject-list-box {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
  }
}
.subject-list {
  max-height: 500px;
  overflow-y: auto;
  margin-bottom: 20px;

  table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;

    th,
    td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    th {
      background-color: #f8f9fa;
      font-weight: 600;
      color: #2c3e50;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    tr:hover {
      background-color: #f5f5f5;
    }

    td {
      color: #444;
    }
  }
}

.high-subject {
  background-color: #e1f5fe;
  color: #0288d1;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn-close {
  padding: 8px 16px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background-color: #c0392b;
    transform: translateY(-1px);
  }

  i {
    font-size: 14px;
  }
}

:deep(.ant-modal-content) {
  border-radius: 8px;
}

:deep(.ant-modal-header) {
  border-radius: 8px 8px 0 0;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
  padding: 16px 24px;

  .ant-modal-title {
    font-size: 18px;
    color: #2c3e50;
    font-weight: 600;
  }
}

:deep(.ant-modal-close) {
  color: #666;

  &:hover {
    color: #333;
  }
}

:deep(.ant-modal-body) {
  padding: 24px;
}
</style>
