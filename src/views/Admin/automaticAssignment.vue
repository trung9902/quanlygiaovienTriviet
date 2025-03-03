<template>
  <div class="assignment-container">
    <navbar />
    <div class="assignment-box">
      <div class="card-container">
        <div class="card">
          <h2><i class="fas fa-book"></i> Quản lý môn học</h2>
          <div class="input-group">
            <button @click="showCreateSubjectModal = true" class="btn-primary">
              <i class="fas fa-plus"></i> Thêm môn học
            </button>
            <button @click="showSubjectListModal = true" class="btn-info">
              <i class="fas fa-list"></i> Xem danh sách
            </button>
          </div>
        </div>
        <!-- Thêm modal danh sách môn học -->
        <listSubject
          v-if="showSubjectListModal"
          :visible="showSubjectListModal"
          :subjects="subjects"
          @cancel="handleSubjectListCancel"
        />

        <div class="card">
          <h2><i class="fas fa-school"></i> Thêm Lớp Học</h2>
          <div class="input-group">
            <button @click="showCreateClassModal = true" class="btn-primary">
              <i class="fas fa-plus"></i> Thêm
            </button>
            <button @click="showClassListModal = true" class="btn-info">
              <i class="fas fa-list"></i> Xem danh sách
            </button>
          </div>
        </div>
        <listClass
          v-if="showClassListModal"
          :visible="showClassListModal"
          :classes="classes"
          @cancel="handleClassListCancel"
        />
        <div class="card">
          <h2><i class="fas fa-magic"></i> Phân Công Tự Động</h2>
          <button @click="autoAssign" class="btn-auto">
            <i class="fas fa-random"></i> Phân Công Tự Động
          </button>
        </div>
      </div>
      <!-- Add this before the table -->
      <div class="filters">
        <div class="filter-group">
          <label>Lớp:</label>
          <select v-model="filters.classId">
            <option value="">Tất cả</option>
            <option v-for="cls in classes" :key="cls.id" :value="cls.id">
              {{ cls.name }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>Giáo viên:</label>
          <select v-model="filters.teacherId">
            <option value="">Tất cả</option>
            <option
              v-for="teacher in teachers"
              :key="teacher.maGiaoVien"
              :value="teacher.maGiaoVien"
            >
              {{ teacher.hoTen }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>Môn học:</label>
          <select v-model="filters.subjectId">
            <option value="">Tất cả</option>
            <option
              v-for="subject in subjects"
              :key="subject.id"
              :value="subject.id"
            >
              {{ subject.name }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>Thứ:</label>
          <select v-model="filters.dayOfWeek">
            <option value="">Tất cả</option>
            <option v-for="day in daysOfWeek" :key="day" :value="day">
              Thứ {{ day }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>Buổi:</label>
          <select v-model="filters.timeSlot">
            <option value="">Tất cả</option>
            <option value="Buổi sáng">Buổi sáng</option>
            <option value="Buổi chiều">Buổi chiều</option>
          </select>
        </div>

        <button class="btn-reset" @click="resetFilters">
          <i class="fas fa-sync-alt"></i> Đặt lại bộ lọc
        </button>
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
                <th>Môn Học</th>
                <th>Phòng Học</th>
              </tr>
            </thead>
            <!-- <tbody>
              <tr v-for="(item, index) in allschedule" :key="index">
                <td>
                  <i class="fas fa-user"></i>
                  {{
                    teachers.find((t) => t.maGiaoVien === item.teacherId)
                      ?.hoTen || "N/A"
                  }}
                </td>
                <td>
                  <i class="fas fa-chalkboard"></i>
                  {{
                    classes.find((c) => c.id === item.classId)?.name || "N/A"
                  }}
                </td>
                <td>
                  <i class="fas fa-clock"></i>
                  thứ {{ item.dayOfWeek }} - Tiết {{ item.period }} ({{
                    item.timeSlot
                  }})
                </td>
                <td>
                  <i class="fas fa-book"></i>
                  {{ getSubjectName(item.subjectId) }}
                </td>
                <td>
                  <i class="fas fa-door-open"></i>
                  {{ item.roomNumber }}
                </td>
              </tr>
            </tbody> -->
            <tbody>
              <tr v-for="(item, index) in filteredSchedule" :key="index">
                <td>
                  <i class="fas fa-user"></i>
                  {{
                    teachers.find((t) => t.maGiaoVien === item.TeacherId)
                      ?.hoTen || "chưa có giáo viên"
                  }}
                </td>
                <td>
                  <i class="fas fa-chalkboard"></i>
                  {{
                    classes.find((c) => c.id === item.ClassId)?.name ||
                    "chưa có lớp học"
                  }}
                </td>
                <td>
                  <i class="fas fa-clock"></i>
                  thứ {{ item.DayOfWeek }} - Tiết {{ item.Period }} ({{
                    item.TimeSlot
                  }})
                </td>
                <td>
                  <i class="fas fa-book"></i>
                  {{ getSubjectName(item.SubjectId) }}
                </td>
                <td>
                  <i class="fas fa-door-open"></i>
                  {{ item.RoomNumber }}
                </td>
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
import { mapGetters, mapActions } from "vuex";
import navbar from "@/components/navbar.vue";
import modalCreateSubject from "@/components/modalAutomaticSubject/modalCreateSubject.vue";
import modalCreateClass from "@/components/modalAutomaticSubject/modalCreateClass.vue";
import listSubject from "@/components/autoassignModal/listSubject.vue";
import listClass from "@/components/autoassignModal/listClass.vue";
// import { get } from "jquery";

export default {
  components: {
    navbar,
    modalCreateSubject,
    modalCreateClass,
    listSubject,
    listClass,
  },
  data() {
    return {
      showCreateSubjectModal: false,
      showCreateClassModal: false,
      showSubjectListModal: false,
      showClassListModal: false,
      schedule: [],
      // tiết sáng: 1-4, tiết chiều: 5-7
      morningPeriods: [1, 2, 3, 4],
      afternoonPeriods: [5, 6, 7],
      daysOfWeek: ["2", "3", "4", "5", "6", "7"],
      filters: {
        classId: "",
        teacherId: "",
        subjectId: "",
        dayOfWeek: "",
        timeSlot: "",
      },
    };
  },
  async created() {
    await this.fetchData();
  },
  computed: {
    ...mapGetters({
      classes: "allClass",
      teachers: "allTeachers",
      subjects: "allSubject",
      allschedule: "allSchedule",
    }),
    filteredSchedule() {
      return this.allschedule.filter((item) => {
        const matchClass =
          !this.filters.classId || item.ClassId === this.filters.classId;
        const matchTeacher =
          !this.filters.teacherId || item.TeacherId === this.filters.teacherId;
        const matchSubject =
          !this.filters.subjectId ||
          item.SubjectId === parseInt(this.filters.subjectId);
        const matchDay =
          !this.filters.dayOfWeek || item.DayOfWeek === this.filters.dayOfWeek;
        const matchTimeSlot =
          !this.filters.timeSlot || item.TimeSlot === this.filters.timeSlot;

        return (
          matchClass &&
          matchTeacher &&
          matchSubject &&
          matchDay &&
          matchTimeSlot
        );
      });
    },
  },
  methods: {
    ...mapActions({
      fetchClasses: "getClass",
      fetchTeachers: "getTeacher",
      fetchSubjects: "getSubject",
      getSchedule: "getSchedule",
      saveSchedule: "saveSchedule",
    }),
    getSubjectName(subjectId) {
      const subject = this.subjects.find((s) => s.id === parseInt(subjectId));
      return subject ? subject.name : "N/A";
    },
    async fetchData() {
      try {
        await Promise.all([
          this.fetchClasses(),
          this.fetchTeachers(),
          this.fetchSubjects(),
        ]);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    },

    // Hàm tạo lịch cập nhật theo ràng buộc:
    // - Các môn nhiều tiết (Toán, Văn, Anh, Lý, Hóa) được xếp liền nhau và tối đa 2 tiết/ngày.
    // - Các môn ít tiết chỉ được xếp 1 tiết/ngày và không liền nhau.
    // - Số tiết được xếp trong tuần phải đảm bảo bằng số soTiet của subject.
    createSchedule(classes, teachers, subjects) {
      const schedule = [];
      const currentDate = new Date().toISOString();
      const highSubjects = ["Toán", "Văn", "Anh", "Lý", "Hóa"];
      const allPeriods = [...this.morningPeriods, ...this.afternoonPeriods];

      // Tạo map lưu trữ lịch dạy của giáo viên
      const teacherSchedule = new Map(); // key: teacherId-day-period, value: true

      const isTeacherAvailable = (teacherId, day, period) => {
        const key = `${teacherId}-${day}-${period}`;
        return !teacherSchedule.has(key);
      };
      // Hàm đánh dấu giáo viên bận trong tiết học
      const markTeacherBusy = (teacherId, day, period) => {
        const key = `${teacherId}-${day}-${period}`;
        teacherSchedule.set(key, true);
      };

      // Hàm trộn ngẫu nhiên mảng
      const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };

      // Sắp xếp các lớp ngẫu nhiên để không ưu tiên lớp nào
      const shuffledClasses = shuffleArray([...classes]);

      shuffledClasses.forEach((cls) => {
        const classSubjects = cls.listSubject || [];
        let subjectLessons = {};

        // Khởi tạo số tiết cần dạy cho mỗi môn
        classSubjects.forEach((subjectName) => {
          const subject = subjects.find((s) => s.name === subjectName);
          if (subject) {
            subjectLessons[subject.id] = subject.soTiet;
          }
        });

        this.daysOfWeek.forEach((day) => {
          // Khởi tạo số tiết học của mỗi môn trong ngày
          let dailyCount = {};
          let lastSubjectId = null;
          let availablePeriods = [...allPeriods];

          // Xử lý tiết cố định
          if (day === "2") {
            schedule.push({
              classId: cls.id,
              teacherId: this.getTeacherForSubject(null, cls),
              subjectId: 24, // Chào cờ
              dayOfWeek: day,
              period: 1,
              timeSlot: "Buổi sáng",
              semester: 1,
              schoolYear: "2024-2025",
              roomNumber: `Phong ${cls.name}`,
              createdAt: currentDate,
              updatedAt: currentDate,
            });
            // Bỏ tiết 1 khỏi danh sách tiết học còn trống
            availablePeriods = availablePeriods.filter((p) => p !== 1);
          }

          if (day === "7") {
            schedule.push({
              classId: cls.id,
              teacherId: this.getTeacherForSubject(null, cls),
              subjectId: 25, // Sinh hoạt lớp
              dayOfWeek: day,
              period: 4,
              timeSlot: "Buổi sáng",
              semester: 1,
              schoolYear: "2024-2025",
              roomNumber: `Phong ${cls.name}`,
              createdAt: currentDate,
              updatedAt: currentDate,
            });
            availablePeriods = availablePeriods.filter((p) => p !== 4);
          }

          // Xếp các tiết học bình thường
          const randomizedPeriods = shuffleArray(availablePeriods);

          randomizedPeriods.forEach((period) => {
            if (day === "7" && period > 4) return; // Bỏ qua tiết chiều thứ 7
            if (day === "2" && period === 1) return; // Bỏ qua tiết 1 thứ 2
            // Xác định buổi học
            const timeSlot = period <= 4 ? "Buổi sáng" : "Buổi chiều";
            //

            // Lọc các môn có thể xếp
            const availableSubjects = shuffleArray(classSubjects).filter(
              (subjectName) => {
                const subject = subjects.find((s) => s.name === subjectName);
                if (!subject || subjectLessons[subject.id] <= 0) return false;

                const countToday = dailyCount[subject.id] || 0;
                const teacher = this.getTeacherForSubject(subject.id, cls);

                // Kiểm tra xem giáo viên có rảnh không
                if (!teacher || !isTeacherAvailable(teacher, day, period))
                  return false;

                // Kiểm tra xem môn học có thể xếp vào tiết này không
                if (highSubjects.includes(subjectName)) {
                  return (
                    countToday < 2 &&
                    (!countToday || lastSubjectId === subject.id)
                  );
                } else {
                  return countToday === 0 && lastSubjectId !== subject.id;
                }
              }
            );

            if (availableSubjects.length > 0) {
              const chosenSubjectName = availableSubjects[0];
              const chosenSubject = subjects.find(
                (s) => s.name === chosenSubjectName
              );

              if (chosenSubject) {
                const teacherId = this.getTeacherForSubject(
                  chosenSubject.id,
                  cls
                );

                // Đánh dấu giáo viên bận trong tiết này
                markTeacherBusy(teacherId, day, period);
                // Cập nhật lịch học
                dailyCount[chosenSubject.id] =
                  (dailyCount[chosenSubject.id] || 0) + 1;
                subjectLessons[chosenSubject.id]--;
                lastSubjectId = chosenSubject.id;

                schedule.push({
                  classId: cls.id,
                  teacherId,
                  subjectId: chosenSubject.id,
                  dayOfWeek: day,
                  period,
                  timeSlot,
                  semester: 1,
                  schoolYear: "2024-2025",
                  roomNumber: `Phong ${cls.name}`,
                  createdAt: currentDate,
                  updatedAt: currentDate,
                });
              }
            }
          });
        });
      });

      return schedule;
    },

    // Lấy giáo viên dạy môn: ưu tiên GV chủ nhiệm nếu dạy, nếu không tìm GV khác có dạy môn đó
    getTeacherForSubject(subjectId, cls) {
      if (!subjectId) return null;
      const subjectObj = this.subjects.find(
        (s) => s.id === parseInt(subjectId)
      );
      if (!subjectObj) return null;
      const subjectName = subjectObj.name;
      // Kiểm tra GV chủ nhiệm của lớp
      const gvcn = this.teachers.find((t) => t.lopChuNhiemId === cls.id);
      if (
        gvcn &&
        Array.isArray(gvcn.subject) &&
        gvcn.subject.includes(subjectName)
      ) {
        return gvcn.maGiaoVien;
      }
      // Nếu GV chủ nhiệm không dạy môn đó, tìm GV khác có dạy
      const teacher = this.teachers.find(
        (t) => Array.isArray(t.subject) && t.subject.includes(subjectName)
      );
      return teacher ? teacher.maGiaoVien : null;
    },

    handleSubjectOk() {
      this.showCreateSubjectModal = false;
      this.fetchData();
    },

    handleSubjectCancel() {
      this.showCreateSubjectModal = false;
    },

    handleClassOk() {
      this.showCreateClassModal = false;
      this.fetchData();
    },

    handleClassCancel() {
      this.showCreateClassModal = false;
    },

    async autoAssign() {
      try {
        const newSchedule = this.createSchedule(
          this.classes,
          this.teachers,
          this.subjects
        );
        await this.saveSchedule(newSchedule);
        this.schedule = newSchedule;
      } catch (error) {
        console.error("Lỗi khi phân công tự động:", error);
      }
    },
    resetFilters() {
      this.filters = {
        classId: "",
        teacherId: "",
        subjectId: "",
        dayOfWeek: "",
        timeSlot: "",
      };
    },
    handleSubjectListCancel() {
      this.showSubjectListModal = false;
    },
    handleClassListCancel() {
      this.showClassListModal = false;
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
  margin-top: 10px;

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
    height: 40vh;
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
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .filter-group {
    display: flex;
    align-items: center;
    gap: 8px;

    label {
      font-weight: 600;
      color: #2c3e50;
      min-width: 80px;
    }

    select {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: white;
      min-width: 150px;

      &:focus {
        outline: none;
        border-color: #3498db;
      }
    }
  }

  .btn-reset {
    padding: 8px 16px;
    background-color: #95a5a6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #7f8c8d;
    }

    i {
      font-size: 14px;
    }
  }
}
.btn-info {
  padding: 12px 24px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(52, 152, 219, 0.2);

  i {
    font-size: 14px;
    transition: transform 0.3s ease;
  }

  &:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);

    i {
      transform: rotate(180deg);
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(52, 152, 219, 0.2);
  }
}

// Update input-group to make buttons equal width
.input-group {
  display: flex;
  gap: 10px;

  button {
    flex: 1;
    justify-content: center;
  }
}
</style>
