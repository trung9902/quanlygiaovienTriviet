<template>
  <div class="Topic-Bank" style="background-color: #223771">
    <menuTopUser />
    <div class="main-topic">
      <navbarUser />
      <div class="content">
        <h1>Ngân hàng đề</h1>
        <div class="TopicBank-Header">
          <div class="filters">
            <div class="topicBank-select">
              <div class="form-group">
                <select
                  class="form-input"
                  v-model="selectedClass"
                  @change="updateClassSub"
                >
                  <option value="">Chọn lớp</option>
                  <option
                    v-for="classs in classes"
                    :key="classs.id"
                    :value="classs.name"
                  >
                    {{ classs.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <select
                  class="form-input"
                  v-model="selectedSubject"
                  @change="updateSubjectSub"
                >
                  <option value="">Chọn môn học</option>
                  <option
                    v-for="subject in allSubject"
                    :key="subject.id"
                    :value="subject.id"
                  >
                    {{ subject.name }}
                  </option>
                </select>
              </div>
            </div>
            <!-- Add this in the filters div, after the topicBank-select div -->
            <div class="header-actions-box">
              <div class="search-box">
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Tìm kiếm đề thi..."
                  class="search-input"
                />
                <i class="fas fa-search search-icon"></i>
              </div>
              <router-link to="/topicBankUser">
                <button class="my-topic-bank-button">
                  Ngân hàng đề của tôi
                </button>
              </router-link>
            </div>
          </div>
        </div>
        <div class="TopicBank-Container">
          <div v-if="filteredExams.length === 0" class="no-results">
            Không tìm thấy đề thi phù hợp với điều kiện lọc
          </div>
          <div v-for="exam in filteredExams" :key="exam.id" class="card">
            <div class="card-header">
              <i class="fas fa-file-alt"></i>
              <span>{{ exam.title }}</span>
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
    </div>
  </div>
</template>

<script>
import navbarUser from "@/components/USER/navbarUser.vue";
import menuTopUser from "@/components/USER/menuTopUser.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "BankInterface",
  data() {
    return {
      searchQuery: "",
      baseURL: "https://localhost:7139",
      selectedClass: "", // Thêm vào đây
      selectedSubject: "", // Thêm vào đây
      // subjects: [
      //   { id: 1, name: "Vật lí" },
      //   { id: 2, name: "Hóa học" },
      //   { id: 3, name: "Sinh học" },
      //   { id: 4, name: "Toán học" },
      // ],
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
  },
  computed: {
    ...mapGetters(["allExames", "allClass", "allSubject"]),
    filteredExams() {
      let filtered = [...this.allExames];
      console.log("Original exams:", this.allExames);

      // Log để debug
      console.log("Original exams:", this.allClass);
      console.log("Selected class:", this.allSubject);
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
    ...mapActions(["getExam", "downloadFile", "getClass", "getSubject"]),
    updateClassSub() {
      console.log("Selected class:", this.selectedClass);
      // Có thể thêm logic xử lý khác ở đây nếu cần
    },

    updateSubjectSub() {
      console.log("Selected subject:", this.selectedSubject);
      // Có thể thêm logic xử lý khác ở đây nếu cần
    },
    formatDate(date) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(date).toLocaleDateString("vi-VN", options);
    },

    // Thêm method reset filters
    resetFilters() {
      this.selectedClass = "";
      this.selectedSubject = "";
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
  },
  mounted() {
    this.getExam();
    this.getClass();
    this.getSubject();
  },
};
</script>

<style scoped lang="scss">
.Topic-Bank {
  height: 100%;
  width: 100vw;
}
.header-actions-box {
  display: flex;
  gap: 10px;
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
  width: 100vw;
  margin-top: 20px;
  padding: 20px 20px;
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
  width: 25vw;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);

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
.form-input {
  width: 200px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
}

.topicBank-select {
  display: flex;
  gap: 20px;

  .form-group {
    flex: 1;
  }
}
.filters {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 20px;
  gap: 12vw;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 300px;

  .search-input {
    width: 100%;
    padding: 8px 35px 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    background-color: white;

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
  }

  .search-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
    pointer-events: none;
  }
}

.topicBank-select {
  display: flex;

  .form-group {
    flex: 1;
  }
}
</style>
