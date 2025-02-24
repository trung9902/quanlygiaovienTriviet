<template>
  <a-modal
    :visible="visible"
    title="Danh sách lớp học"
    @cancel="handleCancel"
    :footer="null"
    width="800px"
    :maskClosable="true"
    class="list-class-modal"
  >
    <div class="class-list-box">
      <div class="class-list">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên lớp học</th>
              <th>Giáo viên chủ nhiệm</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cls, index) in classesWithTeachers" :key="cls.id">
              <td>{{ index + 1 }}</td>
              <td>{{ cls.name }}</td>
              <td>{{ cls.teacherName }}</td>
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
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    classes: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters(["allTeachers"]),
    classesWithTeachers() {
      return this.classes.map((cls) => {
        const teacher = this.allTeachers.find(
          (t) => t.lopChuNhiemId === cls.id
        );
        return {
          ...cls,
          teacherName: teacher ? teacher.hoTen : "Chưa có GVCN",
        };
      });
    },
  },
  methods: {
    ...mapActions(["getTeacher"]),
    handleCancel() {
      this.$emit("cancel");
    },
  },
  mounted() {
    this.getTeacher();
  },
};
</script>
<style lang="scss">
.list-class-modal {
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
  .class-list-box {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
  }
}
.class-list {
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
