<template>
  <div class="Topic-Bank" style="background-color: #223771">
    <menuTopUser />
    <div class="main-topic">
      <navbarUser />
      <div class="content">
        <h1>Ngân hàng đề của tôi</h1>
        <div class="TopicBank-Header">
          <div class="filters">
            <div class="topicBank-select">
              <select class="filter" v-model="selectedSubject">
                <option value="">---chọn môn học---</option>
                <option
                  v-for="subject in allSubject"
                  :key="subject.id"
                  :value="subject.id"
                >
                  {{ subject.name }}
                </option>
              </select>
              <select class="filter" v-model="selectedClass">
                <option value="">---chọn lớp---</option>
                <option
                  v-for="classs in classes"
                  :key="classs.id"
                  :value="classs.name"
                >
                  {{ classs.name }}
                </option>
              </select>
            </div>
            <div class="topic-btn_box">
              <button class="btn btn-create" @click="openModal">Thêm đề</button>
              <router-link to="/topicBank">
                <button class="btn btn-create">Quay lại</button>
              </router-link>
            </div>
            <!-- <router-link to="/createExam">
              <button class="my-topic-bank-button">Ngân hàng đề của tôi</button>
            </router-link> -->
          </div>
        </div>
        <div class="TopicBank-Container">
          <div v-for="exam in filteredExams" :key="exam.id" class="card">
            <!-- <div class="delete-button" v-if="isCurrentUserExam(exam)">
              <i
                class="fas fa-trash-alt"
                @click="deleteTopic(exam.id)"
                title="Xóa đề này"
              ></i>
            </div> -->
            <div class="card-header-box">
              <div class="card-header">
                <i class="fas fa-file-alt"></i>
                <span>{{ exam.title }}</span>
              </div>
              <div class="delete-button" v-if="isCurrentUserExam(exam)">
                <i
                  class="fas fa-trash-alt"
                  @click="deleteTopic(exam.id)"
                  title="Xóa đề này"
                ></i>
              </div>
            </div>
            <div class="card-meta">
              <i class="far fa-calendar-alt"></i> Đã tạo lúc
              {{ formatDate(exam.createdAt) }}
            </div>
            <div class="card-footer">
              <span><i class="fas fa-user"></i> {{ exam.createdByName }}</span>
              <div class="actions_topic">
                <i
                  class="fas fa-download"
                  @click="handleDownloadFile(exam.id)"
                ></i>
                <i class="fas fa-share-alt"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalCreateExam ref="createExamModal" />
    </div>
  </div>
</template>
<script>
import ModalCreateExam from "@/components/modalExam/modalCreateExam.vue";
import navbarUser from "@/components/USER/navbarUser.vue";
import menuTopUser from "@/components/USER/menuTopUser.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "BankInterface",
  data() {
    return {
      searchQuery: "",
      showModalCreate: false,
      baseURL: "https://localhost:7139", // Thêm baseURL vào data
      selectedClass: "", // Thêm vào đây
      selectedSubject: "", // Thêm vào đây
      classes: [
        { id: 1, name: "Lớp 12" },
        { id: 2, name: "Lớp 11" },
        { id: 3, name: "Lớp 10" },
      ],
    };
  },
  components: {
    navbarUser,
    menuTopUser,
    ModalCreateExam,
  },
  computed: {
    ...mapGetters(["allExamesUser", "allSubject"]),
    debugExams() {
      console.log("Component received exams:", this.allExamesUser);
      return this.allExamesUser;
    },
    filteredExams() {
      let filtered = [...this.allExamesUser];
      console.log("Original exams:", this.allExamesUser);
      // Search filter
      if (this.searchQuery.trim()) {
        const searchLower = this.searchQuery.toLowerCase().trim();
        filtered = filtered.filter((exam) =>
          exam.title.toLowerCase().includes(searchLower)
        );
      }
      if (this.selectedClass) {
        filtered = filtered.filter((exam) => {
          const match = exam.classsub === this.selectedClass;
          console.log(`Exam ${exam.id} class match:`, match);
          return match;
        });
      }

      if (this.selectedSubject) {
        filtered = filtered.filter((exam) => {
          const match = exam.subject === parseInt(this.selectedSubject);
          console.log(`Exam ${exam.id} subject match:`, match);
          return match;
        });
      }

      console.log("Filtered results:", filtered);
      return filtered;
    },
  },
  methods: {
    ...mapActions(["getExam", "downloadFile", "deleteExame", "getSubject"]),
    formatDate(date) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(date).toLocaleDateString("vi-VN", options);
    },
    openModal() {
      this.$refs.createExamModal.isOpen = true;
    },
    async handleDownloadFile(id) {
      try {
        const result = await this.downloadFile(id);
        if (!result.success) {
          alert("Có lỗi xảy ra khi tải xuống tệp.");
        }
      } catch (error) {
        console.error("Lỗi:", error);
        alert("Có lỗi xảy ra khi tải xuống tệp.");
      }
    },
    async deleteTopic(topicId) {
      if (confirm("Bạn có chắc chắn muốn xóa đề này không?")) {
        try {
          const result = await this.deleteExame(topicId);
          if (result.success) {
            alert("Xóa đề thành công!");
            // Cập nhật lại danh sách sau khi xóa
            await this.$store.dispatch("getExam");
          } else {
            alert("Có lỗi xảy ra khi xóa đề!");
          }
        } catch (error) {
          console.error("Lỗi khi xóa đề:", error);
          alert("Có lỗi xảy ra khi xóa đề!");
        }
      }
    },
    isCurrentUserExam(exam) {
      const currentUser = this.$store.getters.getUserID;
      return exam.createdBy === currentUser;
    },
  },
  mounted() {
    this.getExam();
    this.getSubject();
  },
};
</script>

<style scoped lang="scss">
.topic-btn_box {
  display: flex;
  gap: 10px;
}
.header-actions-box {
  display: flex;
  gap: 10px;
}
.Topic-Bank {
  height: 100%;
}
.container {
  display: flex;
}
.sidebar {
  width: 200px;
  background-color: #f4f4f4;
}
.sidebar-item {
  padding: 15px;
  display: flex;
  align-items: center;
  i {
    margin-right: 10px;
  }
}
.main-topic {
  display: flex;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-actions {
  display: flex;
  align-items: center;
}
.content {
  margin-top: 20px;
  padding: 20px 20px;
}
.filters {
  display: flex;
  gap: 35vw;
}
select.filter {
  padding: 10px;
  border: none;
  border-radius: 6px;
}
.topicBank-select {
  display: flex;
  gap: 10px;
}
.table {
  margin-top: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  th {
    background-color: #f2f2f2;
  }
}
.TopicBank-Container {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  gap: 20px;
  padding: 10px;
}
.card {
  background-color: #e3f2fd;
  border-radius: 10px;
  padding: 15px;
  width: 23vw;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);

  .card-header-box {
    display: flex;
    justify-content: space-between;
  }
  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: bold;
    font-size: 16px;

    i {
      font-size: 20px;
      color: #2196f3;
    }
  }

  .card-meta {
    font-size: 12px;
    color: gray;
    margin-top: 11px;
    text-align: justify;
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    background: white;
    padding: 8px;
    border-radius: 5px;

    i {
      cursor: pointer;
      font-size: 16px;
      color: #555;

      &:hover {
        color: #000;
      }
    }
  }

  .actions_topic {
    gap: 10px;
    display: flex;
  }
}
.content {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 85vh;
  background: linear-gradient(to right, var(--light-gray), var(--light-blue));
  overflow-y: scroll;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  border: 1px solid #000;
}
.my-topic-bank-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
  }
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
</style>
