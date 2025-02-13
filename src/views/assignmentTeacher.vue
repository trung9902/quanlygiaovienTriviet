<template>
  <div class="container">
    <div class="sidebar">
      <h1>Phân Công Giảng Dạy</h1>

      <!-- Thêm Giáo Viên -->
      <div class="form-section">
        <h2>Thêm Giáo Viên</h2>
        <form @submit.prevent="addTeacher">
          <input
            v-model="teacherName"
            type="text"
            placeholder="Tên giáo viên"
            required
          />
          <select v-model="teacherSubject" required>
            <option value="">Chọn môn học</option>
            <option v-for="subjectObj in allSubject" :key="subjectObj.id">
              {{ subjectObj.name }}
            </option>
          </select>
          <button type="submit">Thêm Giáo Viên</button>
        </form>
      </div>

      <!-- Thêm Lớp Học -->
      <div class="form-section">
        <h2>Thêm Lớp Học</h2>
        <form @submit.prevent="addClass">
          <input
            v-model="className"
            type="text"
            placeholder="Tên lớp"
            required
          />
          <select v-model="classLevel" required>
            <option value="">Chọn khối</option>
            <option>Khối 10</option>
            <option>Khối 11</option>
            <option>Khối 12</option>
          </select>
          <select v-model="classType" required>
            <option value="">Chọn ban</option>
            <option>Khoa học tự nhiên</option>
            <option>Khoa học xã hội</option>
          </select>
          <button type="submit">Thêm Lớp</button>
        </form>
      </div>

      <!-- Thêm Môn Học -->
      <div class="form-section">
        <h2>Thêm Môn Học</h2>
        <form @submit.prevent="addSubject">
          <input
            v-model="subjectName"
            type="text"
            placeholder="Tên môn học"
            required
          />
          <input
            v-model="subjectSoTiet"
            type="number"
            placeholder="Số tiết"
            required
          />
          <select v-model="subjectType" required>
            <option value="">Chọn loại môn học</option>
            <option value="Bắt buộc">Bắt buộc</option>
            <option value="Khoa học tự nhiên">Khoa học Tự nhiên</option>
            <option value="Khoa học xã hội">Khoa học Xã hội</option>
          </select>
          <button type="submit">Thêm Môn Học</button>
        </form>
      </div>

      <!-- Tự Động Phân Công và Làm Mới -->
      <div class="action-section">
        <button @click="autoAssign">Phân Công Tự Động</button>
        <button @click="resetForm">Làm Mới</button>
      </div>
    </div>

    <div class="main-content">
      <div class="list-section">
        <div class="teacher-list">
          <h2>Danh Sách Giáo Viên</h2>
          <div class="teacher-list_item">
            <div
              class="teacher-card"
              v-for="teacher in allteachers"
              :key="teacher.id"
            >
              <div class="teacher-name">{{ teacher.hoTen }}</div>
              <div class="teacher-subject">{{ teacher.subject }}</div>
              <button class="view-schedule-button" @click="openModal(teacher)">
                Xem chi tiết lịch dạy
              </button>
            </div>

            <!-- Modal -->
            <div v-if="showModal" class="modal-overlay">
              <div class="modal-content">
                <h3>Chi tiết lịch phân công giảng dạy</h3>
                <p><strong>Giáo viên:</strong> {{ selectedTeacher.hoTen }}</p>
                <p>
                  <strong>Môn học chính:</strong> {{ selectedTeacher.subject }}
                </p>

                <!-- Lịch phân công -->
                <table
                  v-if="filteredSchedule.length > 0"
                  class="schedule-table"
                >
                  <thead>
                    <tr>
                      <th>Ngày</th>
                      <th>Tiết</th>
                      <th>Lớp</th>
                      <th>Môn học</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in filteredSchedule" :key="index">
                      <td>{{ item.day }}</td>
                      <td>{{ item.period }}</td>
                      <td>{{ item.class }}</td>
                      <td>{{ item.subject }}</td>
                    </tr>
                  </tbody>
                </table>

                <p v-else>Không có lịch dạy nào được phân công.</p>

                <button class="close-modal-button" @click="closeModal">
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="class-list">
          <h2>Danh Sách Lớp</h2>
          <div class="class-container">
            <div
              v-for="classObj in allClass"
              :key="classObj.id"
              class="class-card"
            >
              <div class="class-info">
                <h3 class="class-name">{{ classObj.name }}</h3>
                <p class="class-level">
                  Cấp độ: <span>{{ classObj.level }}</span>
                </p>
                <p class="class-type">
                  Loại: <span>{{ classObj.type }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="subject-list">
          <h2>Danh Sách Môn</h2>
          <div class="subject-container">
            <div
              v-for="subject in allSubject"
              :key="subject.name"
              class="subject-card"
            >
              <div class="subject-info">
                <h3 class="subject-name">{{ subject.name }}</h3>
                <p class="subject-hours">
                  Số tiết: <span>{{ subject.soTiet }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="schedule-section">
        <h2>Thời Khóa Biểu</h2>
        <div class="filter-scheduleTable">
          <select v-model="classFilter">
            <option value="">Chọn lớp</option>
            <option
              v-for="assignment in allClass"
              :key="assignment.id"
              :value="assignment.name"
            >
              {{ assignment.name }}
            </option>
          </select>

          <select v-model="teacherFilter">
            <option value="">Chọn giáo viên</option>
            <option
              v-for="assignment in allteachers"
              :key="assignment.id"
              :value="assignment.hoTen"
            >
              {{ assignment.hoTen }}
            </option>
          </select>
        </div>
        <table id="scheduleTable">
          <thead>
            <tr>
              <th>Thứ</th>
              <th v-for="period in 5" :key="period">Tiết {{ period }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(day, dayIndex) in days" :key="dayIndex">
              <td>{{ day }}</td>
              <td v-for="period in 5" :key="period">
                <div
                  v-for="assignment in getAssignments(day, period)"
                  :key="assignment.teacher"
                  class="hoverDiv"
                  style="border: 1px solid #ccc; padding: 5px"
                >
                  {{ assignment.class }}<br />{{ assignment.subject }}<br />{{
                    assignment.teacher
                  }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      days: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"],
      classFilter: "",
      teacherFilter: "",
      showModal: false,
      selectedTeacher: {},
      filteredSchedule: [],
      teacherName: "",
      teacherSubject: "",
      className: "",
      classLevel: "",
      classType: "",
      subjectName: "",
      subjectSoTiet: "",
      subjectType: "",
      allteachers: [], // List of teachers after processing
      allClass: [], // List of classes after processing
      allSubject: [], // List of subjects after processing
      currentSchedule: {}, // Current schedule state
      classes: [
        {
          name: "10N1",
          optionalSubjects: ["Lý", "Hóa", "Sinh", "Tin"],
          mandatorySubjects: [
            "Toán",
            "Ngữ văn",
            "Tiếng Anh",
            "Lịch sử",
            "GD địa phương",
            "Hoạt động trải nghiệm",
            "Thể chất",
            "GD QP",
          ],
        },
        {
          name: "10N2",
          optionalSubjects: ["Địa", "GD KTPL", "Tin", "Hóa"],
          mandatorySubjects: [
            "Toán",
            "Ngữ văn",
            "Tiếng Anh",
            "Lịch sử",
            "GD địa phương",
            "Hoạt động trải nghiệm",
            "Thể chất",
            "GD QP",
          ],
        },
        {
          name: "10N3",
          optionalSubjects: ["Lý", "Hóa", "Sinh", "Tin"],
          mandatorySubjects: [
            "Toán",
            "Ngữ văn",
            "Tiếng Anh",
            "Lịch sử",
            "GD địa phương",
            "Hoạt động trải nghiệm",
            "Thể chất",
            "GD QP",
          ],
        },
        {
          name: "10N4",
          optionalSubjects: ["Lý", "Hóa", "Sinh", "Tin"],
          mandatorySubjects: [
            "Toán",
            "Ngữ văn",
            "Tiếng Anh",
            "Lịch sử",
            "GD địa phương",
            "Hoạt động trải nghiệm",
            "Thể chất",
            "GD QP",
          ],
        },
        {
          name: "10N5",
          optionalSubjects: ["Lý", "Hóa", "Sinh", "Tin"],
          mandatorySubjects: [
            "Toán",
            "Ngữ văn",
            "Tiếng Anh",
            "Lịch sử",
            "GD địa phương",
            "Hoạt động trải nghiệm",
            "Thể chất",
            "GD QP",
          ],
        },
        {
          name: "10N6",
          optionalSubjects: ["Địa", "GD KTPL", "Tin", "Hóa"],
          mandatorySubjects: [
            "Toán",
            "Ngữ văn",
            "Tiếng Anh",
            "Lịch sử",
            "GD địa phương",
            "Hoạt động trải nghiệm",
            "Thể chất",
            "GD QP",
          ],
        },
        {
          name: "10N7",
          optionalSubjects: ["Địa", "GD KTPL", "Tin", "Hóa"],
          mandatorySubjects: [
            "Toán",
            "Ngữ văn",
            "Tiếng Anh",
            "Lịch sử",
            "GD địa phương",
            "Hoạt động trải nghiệm",
            "Thể chất",
            "GD QP",
          ],
        },
        {
          name: "11N1",
          optionalSubjects: ["Lý", "Hóa", "Sinh", "Tin"],
          mandatorySubjects: [
            "Toán",
            "Ngữ văn",
            "Tiếng Anh",
            "Lịch sử",
            "GD địa phương",
            "Hoạt động trải nghiệm",
            "Thể chất",
            "GD QP",
          ],
        },
        {
          name: "11N2",
          optionalSubjects: ["Địa", "GD KTPL", "Tin", "Hóa"],
          mandatorySubjects: [
            "Toán",
            "Ngữ văn",
            "Tiếng Anh",
            "Lịch sử",
            "GD địa phương",
            "Hoạt động trải nghiệm",
            "Thể chất",
            "GD QP",
          ],
        },
        {
          name: "11N3",
          optionalSubjects: ["Lý", "Hóa", "Sinh", "Tin"],
          mandatorySubjects: [
            "Toán",
            "Ngữ văn",
            "Tiếng Anh",
            "Lịch sử",
            "GD địa phương",
            "Hoạt động trải nghiệm",
            "Thể chất",
            "GD QP",
          ],
        },
        {
          name: "11N4",
          optionalSubjects: ["Lý", "Hóa", "Sinh", "Tin"],
          mandatorySubjects: [
            "Toán",
            "Ngữ văn",
            "Tiếng Anh",
            "Lịch sử",
            "GD địa phương",
            "Hoạt động trải nghiệm",
            "Thể chất",
            "GD QP",
          ],
        },
        {
          name: "11N5",
          optionalSubjects: ["Lý", "Hóa", "Sinh", "Tin"],
          mandatorySubjects: [
            "Toán",
            "Ngữ văn",
            "Tiếng Anh",
            "Lịch sử",
            "GD địa phương",
            "Hoạt động trải nghiệm",
            "Thể chất",
            "GD QP",
          ],
        },
        {
          name: "11N6",
          optionalSubjects: ["Địa", "GD KTPL", "Tin", "Hóa"],
          mandatorySubjects: [
            "Toán",
            "Ngữ văn",
            "Tiếng Anh",
            "Lịch sử",
            "GD địa phương",
            "Hoạt động trải nghiệm",
            "Thể chất",
            "GD QP",
          ],
        },
        {
          name: "11N7",
          optionalSubjects: ["Địa", "GD KTPL", "Tin", "Hóa"],
          mandatorySubjects: [
            "Toán",
            "Ngữ văn",
            "Tiếng Anh",
            "Lịch sử",
            "GD địa phương",
            "Hoạt động trải nghiệm",
            "Thể chất",
            "GD QP",
          ],
        },
        {
          name: "12N1",
          optionalSubjects: ["Ban TN (Trộn các khối)"],
          mandatorySubjects: [
            "Toán",
            "Lý",
            "Hóa",
            "Sinh",
            "Tin",
            "Ngữ văn",
            "Lịch sử",
            "Địa lý",
            "Tiếng Anh",
            "GDCD",
            "Công nghệ",
            "Thể dục",
            "QP-AN",
          ],
        },
        {
          name: "12N2",
          optionalSubjects: ["Ban XH"],
          mandatorySubjects: [
            "Toán",
            "Ngữ văn",
            "Tiếng Anh",
            "Lịch sử",
            "GD địa phương",
            "Hoạt động trải nghiệm",
            "Thể chất",
            "GD QP",
          ],
        },
        {
          name: "12N3",
          optionalSubjects: ["Ban TN (Khối A)"],
          mandatorySubjects: [
            "Toán",
            "Ngữ văn",
            "Tiếng Anh",
            "Lịch sử",
            "GD địa phương",
            "Hoạt động trải nghiệm",
            "Thể chất",
            "GD QP",
          ],
        },
        {
          name: "12N4",
          optionalSubjects: ["Ban TN (Khối A1)"],
          mandatorySubjects: [
            "Toán",
            "Ngữ văn",
            "Tiếng Anh",
            "Lịch sử",
            "GD địa phương",
            "Hoạt động trải nghiệm",
            "Thể chất",
            "GD QP",
          ],
        },
        {
          name: "12N5",
          optionalSubjects: ["Ban XH"],
          mandatorySubjects: [
            "Toán",
            "Ngữ văn",
            "Tiếng Anh",
            "Lịch sử",
            "GD địa phương",
            "Hoạt động trải nghiệm",
            "Thể chất",
            "GD QP",
          ],
        },
        {
          name: "12N6",
          optionalSubjects: ["Ban XH"],
          mandatorySubjects: [
            "Toán",
            "Ngữ văn",
            "Tiếng Anh",
            "Lịch sử",
            "GD địa phương",
            "Hoạt động trải nghiệm",
            "Thể chất",
            "GD QP",
          ],
        },
      ],
      teachers: [
        {
          name: "Trần Quốc Doanh",
          subject: "Toán",
          degree: "Đại học",
          type: "Cơ hữu",
        },
        {
          name: "Đào Minh Thủy",
          subject: "Toán",
          degree: "Đại học",
          type: "Cơ hữu",
        },
        {
          name: "Đào Thị Liên",
          subject: "Toán",
          degree: "Thạc sĩ",
          type: "Cơ hữu",
        },
        {
          name: "Nguyễn Đức Thảo",
          subject: "Toán",
          degree: "Thạc sĩ",
          type: "Cơ hữu",
        },
        {
          name: "Nguyễn Cao Cường",
          subject: "Toán",
          degree: "Thạc sĩ",
          type: "Cơ hữu",
        },
        {
          name: "Dương Thị Vân Anh",
          subject: "Toán",
          degree: "Đại học",
          type: "Cơ hữu",
        },
        {
          name: "Lưu Văn Minh",
          subject: "Toán",
          degree: "Đại học",
          type: "Cơ hữu",
        },
        {
          name: "Nguyễn Thu Hương",
          subject: "Toán",
          degree: "Đại học",
          type: "Cơ hữu",
        },
        {
          name: "Hoàng Thị Hiền",
          subject: "Toán",
          degree: "Thạc sĩ",
          type: "Cơ hữu",
        },
        {
          name: "Khuất Thị Ngọc Thu",
          subject: "Văn",
          degree: "Thạc sĩ",
          type: "Cơ hữu",
        },
        {
          name: "Trần Thị Lan",
          subject: "Văn",
          degree: "Đại học",
          type: "Thỉnh giảng",
        },
        {
          name: "Đào Thị Thu Hiền",
          subject: "Văn",
          degree: "Thạc sĩ",
          type: "Thỉnh giảng",
        },
        {
          name: "Nguyễn Thị Nhật Lệ",
          subject: "Văn",
          degree: "Đại học",
          type: "Cơ hữu",
        },
        {
          name: "Trần Thùy",
          subject: "Văn",
          degree: "Thạc sĩ",
          type: "Thỉnh giảng",
        },
        {
          name: "Vương Thị Thầu",
          subject: "Văn",
          degree: "Đại học",
          type: "Cơ hữu",
        },
        {
          name: "Vũ Thị Anh Tuấn",
          subject: "Văn",
          degree: "Đại học",
          type: "Cơ hữu",
        },
        {
          name: "Hàn Thị Thu Hường",
          subject: "Văn",
          degree: "Đại học",
          type: "Cơ hữu",
        },
        {
          name: "Phan Thị Thanh Hồng",
          subject: "Lý",
          degree: "Tiến sĩ",
          type: "Thỉnh giảng",
        },
        {
          name: "Lê Khắc Quynh",
          subject: "Lý",
          degree: "Tiến sĩ",
          type: "Thỉnh giảng",
        },
        {
          name: "Lê Thị Nga",
          subject: "Lý",
          degree: "Đại học",
          type: "Cơ hữu",
        },
        {
          name: "Đào Khánh Linh",
          subject: "Lý",
          degree: "Đại học",
          type: "Cơ hữu",
        },
        {
          name: "Nguyễn Thị Minh Trang",
          subject: "Lý",
          degree: "Đại học",
          type: "Cơ hữu",
        },
        {
          name: "Bùi Thị Nhương",
          subject: "Hóa",
          degree: "Thạc sĩ",
          type: "Cơ hữu",
        },
        {
          name: "Dương Quang Huấn",
          subject: "Hóa",
          degree: "Tiến sĩ",
          type: "Thỉnh giảng",
        },
        {
          name: "Nguyễn Văn Hiến",
          subject: "Hóa",
          degree: "Thạc sĩ",
          type: "Cơ hữu",
        },
        {
          name: "Đinh Thị Châm",
          subject: "Hóa",
          degree: "Thạc sĩ",
          type: "Cơ hữu",
        },
        {
          name: "Nguyễn Thị Tâm",
          subject: "Hóa",
          degree: "Đại học",
          type: "Cơ hữu",
        },
        {
          name: "Phạm Thị Huyền",
          subject: "Hóa",
          degree: "Thạc sĩ",
          type: "Cơ hữu",
        },
        {
          name: "Nguyễn Minh Phương",
          subject: "Anh",
          degree: "Đại học",
          type: "Cơ hữu",
        },
        {
          name: "Vũ Thị Bích Ngọc",
          subject: "Anh",
          degree: "Đại học",
          type: "Thỉnh giảng",
        },
        {
          name: "Quách Thị Tuyết Thanh",
          subject: "Anh",
          degree: "Thạc sĩ",
          type: "Cơ hữu",
        },
        {
          name: "Nguyễn Thanh Huyền",
          subject: "Anh",
          degree: "Thạc sĩ",
          type: "Cơ hữu",
        },
        {
          name: "Hoàng Thị Bé",
          subject: "Anh",
          degree: "Đại học",
          type: "Thỉnh giảng",
        },
        {
          name: "Bùi Thị Huyền Trang",
          subject: "Anh",
          degree: "Đại học",
          type: "Thỉnh giảng",
        },
        {
          name: "Nguyễn Thị Thu Hoài",
          subject: "Anh",
          degree: "Thạc sĩ",
          type: "Thỉnh giảng",
        },
        {
          name: "Trịnh Thanh Hương",
          subject: "Anh",
          degree: "Đại học",
          type: "Cơ hữu",
        },
        {
          name: "Đặng Thị Thu Hà",
          subject: "Anh",
          degree: "Đại học",
          type: "Cơ hữu",
        },
        {
          name: "Phạm Thị Thanh Hà",
          subject: "Sinh",
          degree: "Thạc sĩ",
          type: "Thỉnh giảng",
        },
        {
          name: "Trần Thị Hải Yến",
          subject: "Sinh",
          degree: "Thạc sĩ",
          type: "Cơ hữu",
        },
        {
          name: "Nguyễn Thị Lan Anh",
          subject: "Sử",
          degree: "Thạc sĩ",
          type: "Thỉnh giảng",
        },
        {
          name: "Nguyễn Thị Thu Quyên",
          subject: "Sử",
          degree: "Đại học",
          type: "Cơ hữu",
        },
        {
          name: "Đoàn Thị Hoàng Anh",
          subject: "Sử",
          degree: "Đại học",
          type: "Cơ hữu",
        },
        {
          name: "Bùi Minh Tuấn",
          subject: "Địa",
          degree: "Đại học",
          type: "Cơ hữu",
        },
        {
          name: "Bùi Thị Trung",
          subject: "Địa",
          degree: "Đại học",
          type: "Thỉnh giảng",
        },
        {
          name: "Kim Thị Lan Anh",
          subject: "Địa",
          degree: "Đại học",
          type: "Cơ hữu",
        },
        {
          name: "Bùi Hữu Tiến",
          subject: "Tin",
          degree: "Thạc sĩ",
          type: "Thỉnh giảng",
        },
        {
          name: "Lê Thị Minh",
          subject: "Tin",
          degree: "Thạc sĩ",
          type: "Thỉnh giảng",
        },
        {
          name: "Chu Thanh Lam",
          subject: "Tin",
          degree: "Đại học",
          type: "Cơ hữu",
        },
        {
          name: "Chu Thị Hiên",
          subject: "CD",
          degree: "Đại học",
          type: "Cơ hữu",
        },
        {
          name: "Vũ Thị Bích Phương",
          subject: "CD",
          degree: "Đại học",
          type: "Cơ hữu",
        },
        {
          name: "Nguyễn Thị Hải Uyên",
          subject: "TD",
          degree: "Đại học",
          type: "Cơ hữu",
        },
        {
          name: "Nguyễn Văn Tiến",
          subject: "TD",
          degree: "Đại học",
          type: "Thỉnh giảng",
        },
        {
          name: "Cà Thị Hà",
          subject: "QP-AN",
          degree: "Đại học",
          type: "Cơ hữu",
        },
      ],
    };
  },
  methods: {
    addTeacher() {
      // Add teacher implementation
      console.log("Adding teacher:", this.teacherName, this.teacherSubject);
    },
    addClass() {
      // Add class implementation
      console.log(
        "Adding class:",
        this.className,
        this.classLevel,
        this.classType
      );
    },
    addSubject() {
      // Add subject implementation
      console.log("Adding subject:", this.subjectName, this.subjectSoTiet);
    },
    resetForm() {
      // Reset form implementation
      this.teacherName = "";
      this.teacherSubject = "";
      this.className = "";
      this.classLevel = "";
      this.classType = "";
      this.subjectName = "";
      this.subjectSoTiet = "";
      this.subjectType = "";
    },
    openModal(teacher) {
      this.selectedTeacher = teacher;
      this.showModal = true;
      // Get teacher schedule
      this.filteredSchedule = []; // Replace with actual schedule lookup
    },
    closeModal() {
      this.showModal = false;
    },

    autoAssign() {},
  },
};
</script>
<style scoped lang="scss">
$primary-color: #4caf50;
$secondary-color: #f2f2f2;
$text-color: #333;
$border-radius: 5px;

.container {
  display: flex;
  font-family: Arial, sans-serif;
  background-color: $secondary-color;
  padding: 20px;

  .sidebar {
    width: 300px;
    background-color: white;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border-radius: $border-radius;

    h1 {
      text-align: center;
      color: $primary-color;
    }

    .form-section {
      margin-bottom: 20px;

      h2 {
        color: $primary-color;
        margin-bottom: 10px;
      }

      input,
      select {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: $border-radius;
        font-size: 16px;

        &:focus {
          border-color: $primary-color;
          outline: none;
        }
      }

      button {
        width: 100%;
        padding: 10px;
        background-color: $primary-color;
        color: white;
        border: none;
        border-radius: $border-radius;
        cursor: pointer;
        font-size: 16px;

        &:hover {
          background-color: darken($primary-color, 10%);
        }
      }
    }

    .action-section {
      display: flex;
      justify-content: space-between;

      button {
        flex: 1;
        margin-right: 10px;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }

  .main-content {
    flex: 1;
    padding: 20px;

    .list-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;

      .teacher-list,
      .class-list {
        flex: 1;
        margin-right: 20px;

        &:last-child {
          margin-right: 0;
        }

        h2 {
          color: $primary-color;
          margin-bottom: 10px;
        }

        .teacher-list_item {
          margin-bottom: 10px;

          .teacher-card {
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: $border-radius;
            margin-bottom: 5px;
            background-color: #f9f9f9;

            .teacher-name {
              font-weight: bold;
            }

            .view-schedule-button {
              margin-top: 5px;
              background-color: $primary-color;
              color: white;
              border: none;
              border-radius: $border-radius;
              padding: 5px;
              cursor: pointer;

              &:hover {
                background-color: darken($primary-color, 10%);
              }
            }
          }
        }
      }
    }

    .schedule-section {
      h2 {
        color: $primary-color;
        margin-bottom: 10px;
      }

      .filter-scheduleTable {
        margin-bottom: 10px;

        select {
          margin-right: 10px;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: $border-radius;
        }
      }

      #scheduleTable {
        width: 100%;
        border-collapse: collapse;

        th,
        td {
          border: 1px solid #ccc;
          padding: 10px;
          text-align: center;

          &:nth-child(1) {
            background-color: $primary-color;
            color: white;
          }
        }

        .hoverDiv {
          cursor: pointer;
          transition: background-color 0.3s;

          &:hover {
            background-color: lighten($primary-color, 40%);
          }
        }
      }
    }

    .teacher-list {
      h2 {
        color: $primary-color;
        margin-bottom: 20px;
        text-align: center;
      }

      .teacher-list_item {
        display: flex;
        flex-direction: column;
        gap: 10px;
        height: 64vh;
        overflow-y: scroll;
        .teacher-card {
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: $border-radius;
          padding: 15px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          }

          .teacher-name {
            font-size: 18px;
            font-weight: bold;
            color: $text-color;
          }

          .teacher-subject {
            font-size: 16px;
            color: #666;
            margin-bottom: 10px;
          }

          .view-schedule-button {
            background-color: $primary-color;
            color: white;
            border: none;
            border-radius: $border-radius;
            padding: 8px 12px;
            cursor: pointer;
            transition: background-color 0.3s;

            &:hover {
              background-color: darken($primary-color, 10%);
            }
          }
        }
      }

      // Modal Styles
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;

        .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: $border-radius;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          width: 400px;

          h3 {
            color: $primary-color;
            margin-bottom: 15px;
            text-align: center;
          }

          p {
            margin: 10px 0;
            font-size: 16px;
            color: $text-color;

            strong {
              color: $primary-color;
            }
          }

          .schedule-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;

            th,
            td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: center;

              &:first-child {
                background-color: $primary-color;
                color: white;
              }
            }

            th {
              background-color: $primary-color;
              color: white;
            }

            td {
              background-color: #f9f9f9;
            }
          }

          .close-modal-button {
            background-color: $primary-color;
            color: white;
            border: none;
            border-radius: $border-radius;
            padding: 8px 12px;
            cursor: pointer;
            width: 100%;
            transition: background-color 0.3s;

            &:hover {
              background-color: darken($primary-color, 10%);
            }
          }
        }
      }
    }
    .class-list {
      h2 {
        text-align: center;
        color: $primary-color;
        margin-bottom: 20px;
        font-size: 24px;
        font-weight: bold;
        border-bottom: 2px solid $primary-color;
        padding-bottom: 10px;
      }

      .class-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px; // Khoảng cách giữa các thẻ lớp
        height: 52vh;
        overflow-y: scroll;
        .class-card {
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: $border-radius;
          padding: 20px;
          width: 250px; // Độ rộng cố định cho mỗi thẻ lớp
          transition: background-color 0.3s, transform 0.2s;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

          &:hover {
            background-color: lighten($primary-color, 40%);
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          }

          .class-info {
            margin-bottom: 15px;

            .class-name {
              font-weight: bold;
              font-size: 18px;
              color: $text-color;
            }

            .class-level,
            .class-type {
              color: #666;
              font-size: 14px;

              span {
                font-weight: bold;
              }
            }
          }
        }
      }
    }
    .subject-list {
      h2 {
        text-align: center;
        color: $primary-color;
        margin-bottom: 20px;
        font-size: 24px;
        font-weight: bold;
        border-bottom: 2px solid $primary-color;
        padding-bottom: 10px;
      }

      .subject-container {
        display: flex;
        gap: 10px;
        flex-direction: column;
        height: 42vh;
        overflow-y: scroll;
        .subject-card {
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: $border-radius;
          padding: 20px;
          width: 250px; // Độ rộng cố định cho mỗi thẻ môn
          transition: background-color 0.3s, transform 0.2s;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

          &:hover {
            background-color: lighten($primary-color, 40%);
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          }

          .subject-info {
            margin-bottom: 15px;

            .subject-name {
              font-weight: bold;
              font-size: 18px;
              color: $text-color;
            }

            .subject-hours {
              color: #666;
              font-size: 14px;

              span {
                font-weight: bold;
              }
            }
          }
        }
      }
    }
  }
}
</style>
