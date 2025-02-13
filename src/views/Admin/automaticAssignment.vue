<template>
  <div class="assignment-container">
    <navbar />
    <div class="assignment-box">
      <div class="header">
        <h1>Phân Công Lịch Giảng Dạy</h1>
      </div>

      <div class="card-container">
        <div class="card">
          <h2><i class="fas fa-user-plus"></i> Thêm môn học mới</h2>
          <div class="input-group">
            <button @click="showCreateSubjectModal = true" class="btn-primary">
              <i class="fas fa-plus"></i> Thêm
            </button>
          </div>
        </div>

        <div class="card">
          <h2><i class="fas fa-school"></i> Thêm Lớp Học</h2>
          <div class="input-group">
            <button @click="showCreateClassModal = true" class="btn-primary">
              <i class="fas fa-plus"></i> Thêm
            </button>
          </div>
        </div>

        <div class="card">
          <h2><i class="fas fa-magic"></i> Phân Công Tự Động</h2>
          <button @click="autoAssign" class="btn-auto">
            <i class="fas fa-random"></i> Phân Công Tự Động
          </button>
        </div>
      </div>

      <div class="schedule-card">
        <h2><i class="fas fa-calendar-alt"></i> Lịch Giảng Dạy Đã Phân Công</h2>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Tên Giáo Viên</th>
                <th>Tên Lớp Học</th>
                <th>Thời Gian</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in schedule" :key="index">
                <td><i class="fas fa-user"></i> {{ item.teacher }}</td>
                <td><i class="fas fa-chalkboard"></i> {{ item.class }}</td>
                <td><i class="fas fa-clock"></i> {{ item.time }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <modal-create-subject
      :visible="showCreateSubjectModal"
      @ok="handleSubjectOk"
      @cancel="handleSubjectCancel"
    />
    <!-- Modal Tạo Lớp Học -->
    <modal-create-class
      :visible="showCreateClassModal"
      @ok="handleClassOk"
      @cancel="handleClassCancel"
    />
  </div>
</template>

<script>
import navbar from "@/components/navbar.vue";
import modalCreateSubject from "@/components/modalAutomaticSubject/modalCreateSubject.vue";
import modalCreateClass from "@/components/modalAutomaticSubject/modalCreateClass.vue";
export default {
  components: {
    navbar,
    modalCreateSubject,
    modalCreateClass,
  },
  data() {
    return {
      showCreateSubjectModal: false,
      showCreateClassModal: false,
      schedule: [
        {
          teacher: "Nguyễn Văn A",
          class: "Lớp 10A1",
          time: "Thứ 2, 7:30 - 9:30",
        },
        {
          teacher: "Trần Thị B",
          class: "Lớp 10A2",
          time: "Thứ 3, 7:30 - 9:30",
        },
        {
          teacher: "Lê Văn C",
          class: "Lớp 10A3",
          time: "Thứ 4, 7:30 - 9:30",
        },
        {
          teacher: "Phạm Thị D",
          class: "Lớp 10A4",
          time: "Thứ 5, 7:30 - 9:30",
        },
        {
          teacher: "Nguyễn Văn E",
          class: "Lớp 10A5",
          time: "Thứ 6, 7:30 - 9:30",
        },
      ],
    };
  },
  methods: {
    // Sửa hoặc bỏ alert cũ
    addSubject() {
      this.showCreateSubjectModal = true;
    },
    // Nhận dữ liệu form từ modal
    handleSubjectOk(newSubjectData) {
      console.log("Đã thêm môn học:", newSubjectData);
      // Tắt modal
      this.showCreateSubjectModal = false;
    },
    handleClassOk(data) {
      console.log("Đã thêm lớp học:", data);
      this.showCreateClassModal = false;
    },
    handleSubjectCancel() {
      this.showCreateSubjectModal = false;
    },
    handleClassCancel() {
      this.showCreateClassModal = false;
    },
    addClass() {
      alert("Thêm lớp học mới");
    },
    autoAssign() {
      alert("Phân công tự động");
    },
  },
};
</script>

<style lang="scss" scoped>
.assignment-container {
  display: flex;
}

.assignment-box {
  width: 100%;
  margin: 0 30px;

  .header {
    text-align: center;
    margin-bottom: 40px;

    h1 {
      color: #2c3e50;
      font-size: 2.5em;
      margin: 0;
      padding: 20px 0;
      border-bottom: 3px solid #3498db;
    }
  }
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h2 {
    color: #2c3e50;
    margin-bottom: 20px;
    font-size: 1.5em;
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

.input-group {
  display: flex;
  gap: 10px;

  input {
    flex: 1;
    padding: 3px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 1em;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: #3498db;
      outline: none;
    }
  }
}

.btn-primary,
.btn-auto {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    filter: brightness(110%);
    transform: translateY(-2px);
  }
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-auto {
  background-color: #2ecc71;
  color: white;
  width: 100%;
  justify-content: center;
}

.schedule-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  .table-responsive {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;

    th,
    td {
      padding: 15px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }

    th {
      background-color: #f8f9fa;
      color: #2c3e50;
      font-weight: bold;
    }

    tr:hover {
      background-color: #f8f9fa;
    }
  }
}
</style>
